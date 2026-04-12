/**
 * Sound Module
 * 게임 효과음 재생 시스템
 *
 * 담당: 팀C
 * 공개 API: Sound.init(), Sound.play(type), Sound.toggleMute()
 *
 * 커스텀 이벤트 수신:
 * - 'card:flipped': 카드 뒤집을 때 → play('flip')
 * - 'card:matched': 매칭 성공 시 → play('match')
 * - 'card:mismatched': 매칭 실패 시 → play('mismatch')
 * - 'game:won': 게임 클리어 시 → play('win')
 */

const Sound = (() => {
  // Private 변수
  let muted = Storage.isMuted();  // Storage 모듈에서 가져오기
  const sounds = {};

  // 사운드 파일 매핑
  const soundFiles = {
    flip:     'assets/sounds/flip.mp3',
    match:    'assets/sounds/match.mp3',
    mismatch: 'assets/sounds/mismatch.mp3',
    win:      'assets/sounds/win.mp3'
  };

  /**
   * Private: 사운드 재생 실행
   * @param {string} type - 'flip' | 'match' | 'mismatch' | 'win'
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
    document.addEventListener('card:flipped', () => playSound('flip'));
    document.addEventListener('card:matched', () => playSound('match'));
    document.addEventListener('card:mismatched', () => playSound('mismatch'));
    document.addEventListener('game:won', () => playSound('win'));
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
     * @param {string} type - 'flip' | 'match' | 'mismatch' | 'win'
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
    }
  };
})();
