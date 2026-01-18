/* ═══════════════════════════════════════════════════════════════════════════
   SPIDERKONG - OBS WEBSOCKET CLIENT MODULE
   Wrapper para comunicacao com OBS Studio via WebSocket 5.x
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Cliente WebSocket para OBS Studio
 * Baseado no protocolo obs-websocket 5.x
 */
const OBSClient = (() => {
  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADO INTERNO
  // ═══════════════════════════════════════════════════════════════════════════

  let ws = null;
  let messageId = 0;
  let pendingRequests = new Map();
  let eventListeners = new Map();

  // Estado da conexao
  const state = {
    connected: false,
    connecting: false,
    identified: false,
    obsVersion: null,
    wsVersion: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 10
  };

  // Configuracoes
  let config = {
    url: 'ws://localhost:4455',
    password: '',
    reconnect: true,
    reconnectDelays: [1000, 2000, 5000, 10000, 30000]
  };

  // Callbacks
  let onConnected = null;
  let onDisconnected = null;
  let onError = null;
  let onReconnecting = null;

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILIDADES DE AUTENTICACAO
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Gera o hash de autenticacao usando SHA-256
   * @param {string} password - Senha
   * @param {string} salt - Salt do servidor
   * @param {string} challenge - Challenge do servidor
   * @returns {Promise<string>} Hash Base64
   */
  const generateAuth = async (password, salt, challenge) => {
    const encoder = new TextEncoder();

    // Primeiro hash: password + salt
    const secret1 = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(password + salt)
    );
    const secret1Base64 = btoa(String.fromCharCode(...new Uint8Array(secret1)));

    // Segundo hash: secret1Base64 + challenge
    const secret2 = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(secret1Base64 + challenge)
    );
    const authResponse = btoa(String.fromCharCode(...new Uint8Array(secret2)));

    return authResponse;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // GERENCIAMENTO DE MENSAGENS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Envia uma mensagem pelo WebSocket
   * @param {Object} message - Mensagem a enviar
   */
  const sendMessage = (message) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket nao esta conectado');
    }
    ws.send(JSON.stringify(message));
  };

  /**
   * Processa mensagens recebidas do OBS
   * @param {Object} message - Mensagem recebida
   */
  const handleMessage = async (message) => {
    const { op, d } = message;

    switch (op) {
      case 0: // Hello
        await handleHello(d);
        break;

      case 2: // Identified
        handleIdentified(d);
        break;

      case 5: // Event
        handleEvent(d);
        break;

      case 7: // RequestResponse
        handleRequestResponse(d);
        break;

      case 9: // RequestBatchResponse
        handleRequestBatchResponse(d);
        break;

      default:
        console.log('OBS: Mensagem desconhecida op=' + op, d);
    }
  };

  /**
   * Trata mensagem Hello (op=0) - Inicio da conexao
   * @param {Object} data - Dados da mensagem
   */
  const handleHello = async (data) => {
    const { obsWebSocketVersion, rpcVersion, authentication } = data;

    state.wsVersion = obsWebSocketVersion;
    console.log('OBS WebSocket v' + obsWebSocketVersion + ' (RPC v' + rpcVersion + ')');

    // Preparar resposta Identify
    const identify = {
      op: 1, // Identify
      d: {
        rpcVersion: 1,
        eventSubscriptions: 33 // General + Scenes + Inputs
      }
    };

    // Se requer autenticacao
    if (authentication && config.password) {
      const auth = await generateAuth(
        config.password,
        authentication.salt,
        authentication.challenge
      );
      identify.d.authentication = auth;
    }

    sendMessage(identify);
  };

  /**
   * Trata mensagem Identified (op=2) - Autenticacao bem sucedida
   * @param {Object} data - Dados da mensagem
   */
  const handleIdentified = (data) => {
    state.identified = true;
    state.connected = true;
    state.connecting = false;
    state.reconnectAttempts = 0;

    console.log('OBS: Conectado e identificado');

    if (onConnected) {
      onConnected();
    }
  };

  /**
   * Trata eventos do OBS (op=5)
   * @param {Object} data - Dados do evento
   */
  const handleEvent = (data) => {
    const { eventType, eventData } = data;

    // Notificar listeners registrados
    const listeners = eventListeners.get(eventType) || [];
    listeners.forEach(callback => {
      try {
        callback(eventData);
      } catch (err) {
        console.error('Erro no listener do evento ' + eventType + ':', err);
      }
    });

    // Log de eventos importantes
    if (eventType === 'CurrentProgramSceneChanged') {
      console.log('OBS: Cena mudou para', eventData.sceneName);
    }
  };

  /**
   * Trata resposta de request (op=7)
   * @param {Object} data - Dados da resposta
   */
  const handleRequestResponse = (data) => {
    const { requestId, requestStatus, responseData } = data;

    const pending = pendingRequests.get(requestId);
    if (pending) {
      pendingRequests.delete(requestId);

      if (requestStatus.result) {
        pending.resolve(responseData || {});
      } else {
        pending.reject(new Error(requestStatus.comment || 'Request failed'));
      }
    }
  };

  /**
   * Trata resposta de batch request (op=9)
   * @param {Object} data - Dados da resposta
   */
  const handleRequestBatchResponse = (data) => {
    const { requestId, results } = data;

    const pending = pendingRequests.get(requestId);
    if (pending) {
      pendingRequests.delete(requestId);
      pending.resolve(results);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // API PUBLICA
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Conecta ao OBS WebSocket
   * @param {Object} options - Opcoes de conexao
   * @returns {Promise} Promise que resolve quando conectado
   */
  const connect = (options = {}) => {
    return new Promise((resolve, reject) => {
      if (state.connected || state.connecting) {
        resolve();
        return;
      }

      // Atualizar config
      if (options.url) config.url = options.url;
      if (options.password !== undefined) config.password = options.password;

      state.connecting = true;

      try {
        ws = new WebSocket(config.url);
      } catch (err) {
        state.connecting = false;
        reject(err);
        return;
      }

      // Timeout de conexao
      const timeout = setTimeout(() => {
        if (state.connecting) {
          ws.close();
          state.connecting = false;
          reject(new Error('Timeout de conexao'));
        }
      }, 10000);

      ws.onopen = () => {
        console.log('OBS: WebSocket aberto, aguardando Hello...');
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);
          await handleMessage(message);

          // Resolver quando identificado
          if (state.identified && state.connecting === false) {
            clearTimeout(timeout);
            resolve();
          }
        } catch (err) {
          console.error('OBS: Erro ao processar mensagem:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('OBS: Erro no WebSocket:', error);
        if (onError) onError(error);
      };

      ws.onclose = (event) => {
        clearTimeout(timeout);
        const wasConnected = state.connected;

        state.connected = false;
        state.connecting = false;
        state.identified = false;

        console.log('OBS: Conexao fechada (code=' + event.code + ')');

        // Rejeitar requests pendentes
        pendingRequests.forEach((pending, id) => {
          pending.reject(new Error('Conexao fechada'));
        });
        pendingRequests.clear();

        if (onDisconnected) {
          onDisconnected();
        }

        // Tentar reconectar se estava conectado e reconnect esta habilitado
        if (wasConnected && config.reconnect) {
          scheduleReconnect();
        } else if (state.connecting) {
          reject(new Error('Conexao fechada'));
        }
      };
    });
  };

  /**
   * Desconecta do OBS WebSocket
   */
  const disconnect = () => {
    config.reconnect = false;
    if (ws) {
      ws.close();
      ws = null;
    }
    state.connected = false;
    state.connecting = false;
    state.identified = false;
  };

  /**
   * Agenda uma tentativa de reconexao
   */
  const scheduleReconnect = () => {
    if (state.reconnectAttempts >= state.maxReconnectAttempts) {
      console.log('OBS: Maximo de tentativas de reconexao atingido');
      return;
    }

    const delay = config.reconnectDelays[
      Math.min(state.reconnectAttempts, config.reconnectDelays.length - 1)
    ];

    state.reconnectAttempts++;

    console.log('OBS: Reconectando em ' + (delay / 1000) + 's (tentativa ' + state.reconnectAttempts + ')');

    if (onReconnecting) {
      onReconnecting(state.reconnectAttempts);
    }

    setTimeout(async () => {
      try {
        config.reconnect = true;
        await connect();
      } catch (err) {
        console.error('OBS: Falha ao reconectar:', err);
        scheduleReconnect();
      }
    }, delay);
  };

  /**
   * Executa um request no OBS
   * @param {string} requestType - Tipo do request
   * @param {Object} requestData - Dados do request
   * @returns {Promise<Object>} Resposta do OBS
   */
  const call = (requestType, requestData = {}) => {
    return new Promise((resolve, reject) => {
      if (!state.connected || !state.identified) {
        reject(new Error('Nao conectado ao OBS'));
        return;
      }

      const requestId = String(++messageId);

      pendingRequests.set(requestId, { resolve, reject });

      // Timeout para o request
      setTimeout(() => {
        if (pendingRequests.has(requestId)) {
          pendingRequests.delete(requestId);
          reject(new Error('Timeout do request: ' + requestType));
        }
      }, 30000);

      sendMessage({
        op: 6, // Request
        d: {
          requestType,
          requestId,
          requestData
        }
      });
    });
  };

  /**
   * Executa multiplos requests em batch
   * @param {Array} requests - Array de { requestType, requestData }
   * @returns {Promise<Array>} Array de respostas
   */
  const callBatch = (requests) => {
    return new Promise((resolve, reject) => {
      if (!state.connected || !state.identified) {
        reject(new Error('Nao conectado ao OBS'));
        return;
      }

      const requestId = String(++messageId);

      pendingRequests.set(requestId, { resolve, reject });

      const formattedRequests = requests.map((req, index) => ({
        requestType: req.requestType,
        requestId: requestId + '_' + index,
        requestData: req.requestData || {}
      }));

      sendMessage({
        op: 8, // RequestBatch
        d: {
          requestId,
          haltOnFailure: false,
          executionType: 0, // SerialRealtime
          requests: formattedRequests
        }
      });
    });
  };

  /**
   * Registra um listener para eventos do OBS
   * @param {string} eventType - Tipo do evento
   * @param {Function} callback - Funcao callback
   */
  const on = (eventType, callback) => {
    if (!eventListeners.has(eventType)) {
      eventListeners.set(eventType, []);
    }
    eventListeners.get(eventType).push(callback);
  };

  /**
   * Remove um listener de eventos
   * @param {string} eventType - Tipo do evento
   * @param {Function} callback - Funcao callback
   */
  const off = (eventType, callback) => {
    const listeners = eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  };

  /**
   * Define callbacks de conexao
   * @param {Object} callbacks - Objeto com callbacks
   */
  const setCallbacks = (callbacks) => {
    if (callbacks.onConnected) onConnected = callbacks.onConnected;
    if (callbacks.onDisconnected) onDisconnected = callbacks.onDisconnected;
    if (callbacks.onError) onError = callbacks.onError;
    if (callbacks.onReconnecting) onReconnecting = callbacks.onReconnecting;
  };

  /**
   * Retorna o estado atual da conexao
   * @returns {Object} Estado da conexao
   */
  const getState = () => ({
    connected: state.connected,
    connecting: state.connecting,
    identified: state.identified,
    wsVersion: state.wsVersion
  });

  /**
   * Verifica se esta conectado
   * @returns {boolean}
   */
  const isConnected = () => state.connected && state.identified;

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPERS PARA REQUESTS COMUNS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Obtem a lista de cenas
   * @returns {Promise<Array>} Lista de cenas
   */
  const getSceneList = async () => {
    const response = await call('GetSceneList');
    return response.scenes || [];
  };

  /**
   * Obtem a cena atual
   * @returns {Promise<string>} Nome da cena atual
   */
  const getCurrentScene = async () => {
    const response = await call('GetCurrentProgramScene');
    return response.currentProgramSceneName;
  };

  /**
   * Muda para uma cena
   * @param {string} sceneName - Nome da cena
   */
  const setCurrentScene = async (sceneName) => {
    await call('SetCurrentProgramScene', { sceneName });
  };

  /**
   * Obtem itens de uma cena
   * @param {string} sceneName - Nome da cena
   * @returns {Promise<Array>} Lista de itens
   */
  const getSceneItemList = async (sceneName) => {
    const response = await call('GetSceneItemList', { sceneName });
    return response.sceneItems || [];
  };

  /**
   * Obtem o ID de um item na cena
   * @param {string} sceneName - Nome da cena
   * @param {string} sourceName - Nome do source
   * @returns {Promise<number>} ID do item
   */
  const getSceneItemId = async (sceneName, sourceName) => {
    const response = await call('GetSceneItemId', { sceneName, sourceName });
    return response.sceneItemId;
  };

  /**
   * Define visibilidade de um item
   * @param {string} sceneName - Nome da cena
   * @param {number} sceneItemId - ID do item
   * @param {boolean} enabled - Visivel ou nao
   */
  const setSceneItemEnabled = async (sceneName, sceneItemId, enabled) => {
    await call('SetSceneItemEnabled', {
      sceneName,
      sceneItemId,
      sceneItemEnabled: enabled
    });
  };

  /**
   * Define configuracoes de um input (texto, etc)
   * @param {string} inputName - Nome do input
   * @param {Object} inputSettings - Configuracoes
   * @param {boolean} overlay - Mesclar com existentes
   */
  const setInputSettings = async (inputName, inputSettings, overlay = true) => {
    await call('SetInputSettings', {
      inputName,
      inputSettings,
      overlay
    });
  };

  /**
   * Obtem configuracoes de um input
   * @param {string} inputName - Nome do input
   * @returns {Promise<Object>} Configuracoes do input
   */
  const getInputSettings = async (inputName) => {
    const response = await call('GetInputSettings', { inputName });
    return response.inputSettings;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RETORNO DO MODULO
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    connect,
    disconnect,
    call,
    callBatch,
    on,
    off,
    setCallbacks,
    getState,
    isConnected,
    // Helpers
    getSceneList,
    getCurrentScene,
    setCurrentScene,
    getSceneItemList,
    getSceneItemId,
    setSceneItemEnabled,
    setInputSettings,
    getInputSettings
  };
})();

// Export global
window.OBSClient = OBSClient;
