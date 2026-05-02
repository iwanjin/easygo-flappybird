/**
 * Sound Module
 * Web Audio API를 이용한 프로그래밍 방식 효과음 시스템
 * (외부 사운드 파일 불필요)
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
  let muted = false;
  let audioCtx = null;

  /**
   * Private: AudioContext 초기화 (사용자 인터랙션 후 호출)
   */
  function ensureContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Private: 점프 효과음 (짧은 상승음)
   */
  function playJump() {
    const ctx = ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  }

  /**
   * Private: 득점 효과음 (밝은 이중음)
   */
  function playPoint() {
    const ctx = ensureContext();

    // 첫 번째 음
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    gain1.gain.setValueAtTime(0.25, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.1);

    // 두 번째 음 (옥타브 위)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
    gain2.gain.setValueAtTime(0.01, ctx.currentTime);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.2);
  }

  /**
   * Private: 충돌 효과음 (둔탁한 노이즈)
   */
  function playCollision() {
    const ctx = ensureContext();
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    noise.start(ctx.currentTime);
  }

  /**
   * Private: 게임오버 효과음 (하강하는 슬픈 톤)
   */
  function playGameover() {
    const ctx = ensureContext();

    // 하강음
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);

    // 충돌 노이즈 동시 재생
    playCollision();
  }

  /**
   * Private: 타입별 사운드 재생
   */
  function playSound(type) {
    if (muted) return;

    try {
      switch (type) {
        case 'jump': playJump(); break;
        case 'point': playPoint(); break;
        case 'collision': playCollision(); break;
        case 'gameover': playGameover(); break;
      }
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
     * 초기화
     */
    init() {
      muted = Storage.isMuted();
      setupEventListeners();
      console.log('[Sound] 초기화 완료 (Web Audio API)');
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
