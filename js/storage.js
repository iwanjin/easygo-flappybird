/**
 * Storage Module
 * LocalStorage를 이용한 최고점 저장/관리 모듈
 *
 * 담당: 팀C
 * 공개 API: Storage.saveBestScore(), Storage.getBestScore(), Storage.isMuted()
 */

const Storage = (() => {
  const PREFIX = 'memoCats_';

  /**
   * Private: 실제 key 생성
   * @param {string} name - 저장소 항목명
   * @returns {string} 전체 key (PREFIX 포함)
   */
  function getKey(name) {
    return PREFIX + name;
  }

  /**
   * 공개 API: 최고점 저장 (신기록일 때만 저장)
   * @param {string} difficulty - 'easy' | 'medium' | 'hard'
   * @param {number} score - 점수
   * @returns {boolean} 신기록 여부
   */
  function saveBestScore(difficulty, score) {
    const current = this.getBestScore(difficulty);
    if (score > current) {
      localStorage.setItem(getKey(`best_${difficulty}`), String(score));
      return true;  // 신기록 달성!
    }
    return false;
  }

  /**
   * 공개 API: 최고점 조회
   * @param {string} difficulty - 'easy' | 'medium' | 'hard'
   * @returns {number} 저장된 최고점 (없으면 0)
   */
  function getBestScore(difficulty) {
    const stored = localStorage.getItem(getKey(`best_${difficulty}`));
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * 공개 API: 음소거 상태 확인
   * @returns {boolean} 음소거 여부
   */
  function isMuted() {
    return localStorage.getItem(getKey('muted')) === 'true';
  }

  /**
   * 공개 API: 음소거 상태 설정
   * @param {boolean} muted - 음소거 여부
   */
  function setMuted(muted) {
    localStorage.setItem(getKey('muted'), String(muted));
  }

  return {
    saveBestScore,
    getBestScore,
    isMuted,
    setMuted
  };
})();
