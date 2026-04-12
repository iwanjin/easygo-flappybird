/**
 * Sound Module
 * 플래피버드 게임 효과음 재생 시스템
 *
 * 담당: 팀C
 * 공개 API: Sound.init(), Sound.play(type), Sound.toggleMute(), Sound.isMuted(), Sound.setMuted()
 *
 * 커스텀 이벤트 수신:
 * - 'bird:jumped': 새가 점프할 때 → play('jump')
 * - 'pipe:passed': 파이프를 통과할 때 → play('point')
 * - 'game:over': 게임이 종료될 때 → play('gameover')
 */

const Sound = (() => {
  // Private 변수
  let muted = Storage.isMuted();  // Storage 모듈에서 가져오기
  const sounds = {};

  // 사운드 파일 매핑 (플래피버드용)
  const soundFiles = {
    jump:      'assets/sounds/jump.mp3',
    point:     'assets/sounds/point.mp3',
    collision: 'assets/sounds/collision.mp3',
    gameover:  'assets/sounds/gameover.mp3'
  };

  /**
   * Private: 사운드 재생 실행
   * @param {string} type - 'jump' | 'point' | 'collision' | 'gameover'
   */
  function playSound(type) {
    if (muted || !sounds[type]) return;

    try {
      sounds[type].currentTime = 0;  // 재생 위치 초기화
      sounds[type].play().catch(() => {});  // autoplay 오류 무시
    } catch (e) {
      console.warn('[Sound] 재생 실패:', type, e);
    }
  }

  /**
   * Private: 커스텀 이벤트 리스너 등록
   */
  function setupEventListeners() {
    document.addEventListener('bird:jumped', () => playSound('jump'));
    document.addEventListener('pipe:passed', () => playSound('point'));
    document.addEventListener('game:over', () => playSound('gameover'));
  }

  // ===== 공개 API =====
  return {
    /**
     * 초기화: 모든 사운드 파일 로드
     */
    init() {
      for (const [type, filePath] of Object.entries(soundFiles)) {
        sounds[type] = new Audio(filePath);
        sounds[type].preload = 'auto';
      }
      setupEventListeners();
      console.log('[Sound] 초기화 완료');
    },

    /**
     * 지정한 사운드 재생
     * @param {string} type - 'jump' | 'point' | 'collision' | 'gameover'
     */
    play(type) {
      playSound(type);
    },

    /**
     * 음소거 토글
     * @returns {boolean} 토글 후 음소거 상태
     */
    toggleMute() {
      muted = !muted;
      Storage.setMuted(muted);
      console.log('[Sound] 음소거:', muted);
      return muted;
    },

    /**
     * 현재 음소거 상태 조회
     * @returns {boolean}
     */
    isMuted() {
      return muted;
    },

    /**
     * 음소거 상태 설정
     * @param {boolean} shouldMute - 음소거 여부
     */
    setMuted(shouldMute) {
      muted = shouldMute;
      Storage.setMuted(muted);
      console.log('[Sound] 음소거 설정:', muted);
    }
  };
})();
