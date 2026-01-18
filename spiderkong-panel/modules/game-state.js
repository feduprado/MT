function createPlayer() {
  return {
    number: '',
    name: '',
    goals: 0,
    yellowCards: 0,
    redCard: false,
    substitutedOut: false,
    swapIconSide: 'left',
    cardIconSide: 'left'
  };
}

function createTeam() {
  return {
    name: '',
    sigla: '',
    coach: '',
    logo: '',
    players: Array.from({ length: 11 }, () => createPlayer())
  };
}

export function createInitialGameState() {
  return {
    version: '0.3.0',
    meta: {
      skin: '',
      sceneName: ''
    },
    teams: {
      home: createTeam(),
      away: createTeam()
    },
    score: {
      home: 0,
      away: 0,
      aggregateHome: 0,
      aggregateAway: 0,
      penaltiesHome: 0,
      penaltiesAway: 0
    },
    timer: {
      running: false,
      elapsedMs: 0,
      period: '1T',
      startedAtEpochMs: null
    },
    history: []
  };
}

export const GameState = createInitialGameState();
