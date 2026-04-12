/**
 * Storage Module
 * LocalStorage를 이용한 점수 저장/관리 모듈
 *
 * 담당: 팀C
 * 공개 API: Storage.saveScore(), Storage.saveBestScore(), Storage.getBestScore(),
 *          Storage.getTop3(), Storage.isMuted(), Storage.setMuted()
 */

const Storage = (() => {
  const PREFIX = 'flappyBird_';
  const SCORES_LIMIT = 10;  // 최대 저장 점수 개수

  /**
   * Private: 실제 key 생성
   * @param {string} name - 저장소 항목명
   * @returns {string} 전체 key (PREFIX 포함)
   */
  function getKey(name) {
    return PREFIX + name;
  }

  /**
   * Private: 점수 배열 가져오기
   * @returns {Array} 저장된 점수 배열
   */
  function getScoresArray() {
    const stored = localStorage.getItem(getKey('scores'));
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Private: 점수 배열 저장하기
   * @param {Array} scores - 저장할 점수 배열
   */
  function setScoresArray(scores) {
    localStorage.setItem(getKey('scores'), JSON.stringify(scores));
  }

  /**
   * 공개 API: 모든 점수 저장 (항상 호출)
   * @param {number} score - 점수
   * @returns {void}
   */
  function saveScore(score) {
    const scores = getScoresArray();
    scores.push({
      score: score,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('ko-KR')
    });
    // 내림차순 정렬
    scores.sort((a, b) => b.score - a.score);
    // 상위 10개만 유지
    scores.splice(SCORES_LIMIT);
    setScoresArray(scores);
  }

  /**
   * 공개 API: 최고점 저장 (신기록 판정)
   * @param {number} score - 점수
   * @returns {boolean} 신기록 여부
   */
  function saveBestScore(score) {
    // 1단계: 모든 점수 저장 (항상)
    saveScore(score);

    // 2단계: 최고점 확인 및 업데이트
    const current = getBestScore();
    if (score > current) {
      localStorage.setItem(getKey('best'), String(score));
      // 신기록 이벤트 발행
      document.dispatchEvent(new CustomEvent('record:new', {
        detail: { score }
      }));
      return true;
    }
    return false;
  }

  /**
   * 공개 API: 최고점 조회
   * @returns {number} 저장된 최고점 (없으면 0)
   */
  function getBestScore() {
    const stored = localStorage.getItem(getKey('best'));
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * 공개 API: TOP3 조회
   * @returns {Array} 상위 3개 점수 (객체 배열)
   */
  function getTop3() {
    const scores = getScoresArray();
    return scores.slice(0, 3);
  }

  /**
   * 공개 API: 모든 점수 조회
   * @returns {Array} 저장된 모든 점수
   */
  function getAllScores() {
    return getScoresArray();
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

  /**
   * 공개 API: 데이터 내보내기 (디버그 용)
   * @returns {Object} 모든 저장 데이터
   */
  function export() {
    return {
      bestScore: getBestScore(),
      scores: getAllScores(),
      top3: getTop3(),
      muted: isMuted()
    };
  }

  return {
    saveScore,
    saveBestScore,
    getBestScore,
    getTop3,
    getAllScores,
    isMuted,
    setMuted,
    export
  };
})();
