/**
 * Difficulty Module
 * 난이도별 게임 설정값을 관리하는 모듈
 *
 * 담당: 팀C
 * 공개 API: Difficulty.getConfig(level)
 */

const Difficulty = (() => {
  // 동물 이모지 풀
  const animalEmojis = ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐸', '🐵', '🦁', '🐯', '🐨', '🐷'];

  // 난이도별 설정값
  const configs = {
    easy: {
      rows: 3,
      cols: 4,
      timeLimit: 120,
      emojis: animalEmojis.slice(0, 6)  // 6개 이모지 = 12장 카드 (6쌍)
    },
    medium: {
      rows: 4,
      cols: 4,
      timeLimit: 180,
      emojis: animalEmojis.slice(0, 8)  // 8개 이모지 = 16장 카드 (8쌍)
    },
    hard: {
      rows: 4,
      cols: 6,
      timeLimit: 240,
      emojis: animalEmojis.slice(0, 12) // 12개 이모지 = 24장 카드 (12쌍)
    }
  };

  /**
   * 공개 API: 난이도 설정값 조회
   * @param {string} level - 'easy' | 'medium' | 'hard'
   * @returns {object} { rows, cols, timeLimit, emojis[] }
   */
  return {
    getConfig(level) {
      return { ...configs[level] };
    }
  };
})();
