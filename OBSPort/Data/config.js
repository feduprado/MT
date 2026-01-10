


window.CONFIG = {
  

  wsUrl: "ws://127.0.0.1:4455",

  

  defaultScene: "Formação + Esquema Tático",

  

  groups: {
    cards: "02. Cards jogadores",
    overlays: "01. Cartões",
  },

  

  slotPrefix: "Slot_",
  slotCount: 11,

  

  cardSuffix: "__card",

  

  cardsAssets: {
    yellow: "Assets/Cartões/amarelo.png",
    red: "Assets/Cartões/vermelho.png",
    swapField: "Assets/Cartões/swap cardplayer.png"
  },
  assets: {
    swap: "Assets/Cartões/swap cardplayer.png",
  },

  

  mc: {
    groupSlots: "02. MC Cards jogadores",
    groupCards: "01. MC Cartões",
    groupReserves: "03. MC Reservas",
    groupFx: "00. MC FX",
    slotPrefix: "MC_Slot_",
    slotCount: 11,
    reservePrefix: "MC_Res_",
    reserveCount: 12,
    swapSuffix: "__swap",
	ballFile: "Assets/Cartões/ball.png",
	ballFileRes: "Assets/Cartões/ball_res.png",
    cardYellowFile: "Assets/Cartões/amarelo.png",
    cardRedFile: "Assets/Cartões/vermelho.png",
    reserveCardYellowFile: "Assets/Cartões/amarelo_res.png",
    reserveCardRedFile: "Assets/Cartões/vermelho_res.png",
    swapDelayMs: 160,
  },

  

  guest: {
    enabled: true,

    

    sceneName: "Cena Convidado",
    sourceName: "GC_LowerThird",

    

    htmlPath: "Browser/guest_lowerthird.html",

    

    browserW: 1920,
    browserH: 250,

    

    bgColor: "#E4E2DF",
    textColor: "#1F1F1F",
    fontFamily: "Nunito, Arial, sans-serif",
    fontSizePx: 56,
    fontWeight: 800,
    padX: 48,
    padY: 24,
    radiusPx: 28,

    

    anchor: "bottom_center",          

    bottomMarginPx: 80,               

    safeMaxWidthPct: 0.92,            

    maxLines: 1,                      

    ellipsis: true                    

  },

  

  toast: {
    enabled: true,
    inputName: "MC_Toast",
    htmlPath: "Browser/mc_toast.html",
    w: 508,
    h: 64,
    padX: 56,
    ttlGoalMs: 2000,
    ttlGoalAnnulledMs: 2200,
    ttlYellowMs: 2200,
    ttlRedMs: 2600,
    ttlSubMs: 3200,
  },

  

  reservesPath: "Assets/Reservas",
};
