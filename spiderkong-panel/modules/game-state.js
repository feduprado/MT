function createPlayer({ slot, number, name, isSubstitute = false } = {}) {
  return {
    id: crypto.randomUUID(),
    slot,
    number,
    name: name || '',
    goals: 0,
    yellowCards: 0,
    redCard: false,
    substitutedOut: false,
    isSubstitute,
    swapIconSide: 'default',
    cardIconSide: 'default'
  };
}

function createTeam() {
  const slots = Array.from({ length: 11 }, (_, index) =>
    createPlayer({ slot: index + 1, number: index + 1 })
  );
  return {
    name: '',
    sigla: '',
    coach: '',
    logo: '',
    slots,
    out: [],
    substitutionSlots: Array.from({ length: 11 }, () => false)
  };
}

function createPenaltyArray() {
  return Array.from({ length: 5 }, () => null);
}

export function createInitialGameState() {
  return {
    version: '0.5.0',
    meta: {
      skin: '',
      sceneName: 'Match Center'
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
    penalties: {
      active: false,
      home: createPenaltyArray(),
      away: createPenaltyArray()
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
