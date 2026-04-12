/**
 * 플래피버드 - 공용 설정 (모든 모듈이 참조)
 * 팀A - Agent 0 (공용)
 */

const CONFIG = {
  // ===== 화면 & 캔버스 =====
  CANVAS_WIDTH: 320,
  CANVAS_HEIGHT: 480,

  // ===== 새 캐릭터 =====
  BIRD_WIDTH: 34,
  BIRD_HEIGHT: 24,
  BIRD_START_X: 50,
  BIRD_START_Y: 240,

  // ===== 물리 엔진 =====
  GRAVITY: 0.6,              // 중력 가속도
  BIRD_JUMP_VELOCITY: -8,    // 점프 시 속도
  MAX_FALLING_VELOCITY: 10,  // 최대 낙하 속도

  // ===== 파이프 =====
  PIPE_WIDTH: 80,
  PIPE_GAP: 120,             // 새가 통과할 수 있는 최소 높이
  PIPE_SPACING: 200,         // 파이프 간 수평 거리
  SCROLL_SPEED: 6,           // 파이프 이동 속도

  // ===== 난이도 =====
  DIFFICULTY: {
    easy: {
      rows: 3,
      cols: 4,
      pipeSpeed: 4,
      gravity: 0.5,
      timeLimit: 180
    },
    medium: {
      rows: 4,
      cols: 4,
      pipeSpeed: 6,
      gravity: 0.6,
      timeLimit: 120
    },
    hard: {
      rows: 6,
      cols: 4,
      pipeSpeed: 8,
      gravity: 0.7,
      timeLimit: 60
    }
  },

  // ===== 점수 =====
  POINTS: {
    PIPE_PASSED: 10,         // 파이프 통과 시 점수
    COLLISION: -5             // 충돌 시 감점
  }
};

// 내보내기 (Node.js 환경 지원)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
