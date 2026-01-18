export const GameState = {
  version: '0.1.0',
  scene: '',
  skin: '',
  teams: {
    home: {
      name: '',
      sigla: '',
      coach: '',
      roster: []
    },
    away: {
      name: '',
      sigla: '',
      coach: '',
      roster: []
    }
  },
  score: {
    home: 0,
    away: 0,
    aggregateHome: 0,
    aggregateAway: 0
  },
  timer: {
    display: '00:00',
    running: false,
    period: '1T'
  },
  penalties: {
    home: 0,
    away: 0,
    visible: false
  },
  history: []
};

export function createInitialGameState() {
  return JSON.parse(JSON.stringify(GameState));
}
