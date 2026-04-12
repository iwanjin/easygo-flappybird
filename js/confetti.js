/**
 * Confetti Module
 * 신기록 달성 시 축하 애니메이션
 *
 * 담당: Team C
 * 공개 API: Confetti.init(), Confetti.celebrate(score), Confetti.destroy()
 *
 * 커스텀 이벤트 구독:
 * - 'record:new': 신기록 달성 시 → celebrate(score)
 */

const Confetti = (() => {
  // ===== PRIVATE 변수 =====
  let particles = [];
  let animationFrameId = null;
  let isAnimating = false;

  // 난이도별 색상
  const colorsByDifficulty = {
    easy: ['#FFD700', '#FFA500', '#FF6B6B'],      // 금색, 주황색, 빨강색
    medium: ['#4ECDC4', '#44A08D', '#095D92'],    // 청록색, 초록색, 파랑색
    hard: ['#FF1493', '#FF6347', '#FF4500']       // 핫핑크, 토마토, 주황빨강
  };

  // ===== PRIVATE 함수 =====

  /**
   * 파티클 생성
   * @param {number} x - X 좌표
   * @param {number} y - Y 좌표
   * @param {array} colors - 사용할 색상 배열
   */
  function createParticle(x, y, colors) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 8,      // 속도 X (-4 ~ 4)
      vy: Math.random() * -10 - 5,         // 속도 Y (위로) (-15 ~ -5)
      gravity: 0.2,
      life: 1,                             // 수명 (0 ~ 1)
      color: color,
      size: Math.random() * 6 + 4          // 크기 (4 ~ 10)
    };
  }

  /**
   * 파티클 업데이트 및 렌더링 (requestAnimationFrame)
   */
  function animate() {
    // Canvas 준비
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
      isAnimating = false;
      return;
    }

    const ctx = canvas.getContext('2d');

    // 투명한 배경 그리기 (이전 프레임 지우기)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 파티클 업데이트 및 렌더링
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // 물리 업데이트
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.015;  // 서서히 사라짐

      // 렌더링
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 수명 만료 시 제거
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    // 모든 파티클이 사라질 때까지 계속
    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      isAnimating = false;
      // Canvas 최종 정리
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 게임 렌더링 다시 활성화
      if (typeof Renderer !== 'undefined' && Renderer.render) {
        const state = Game.getState();
        Renderer.render({
          bird: { x: 60, y: 240, width: 32, height: 32, rotation: 0 },
          pipes: [],
          score: state.score,
          difficulty: state.difficulty
        });
      }
    }
  }

  /**
   * 난이도에 맞는 색상 가져오기
   * @param {string} difficulty - 난이도 ('easy', 'medium', 'hard')
   * @returns {array} 색상 배열
   */
  function getColorsForDifficulty(difficulty) {
    return colorsByDifficulty[difficulty] || colorsByDifficulty.medium;
  }

  /**
   * 커스텀 이벤트 리스너 등록
   */
  function setupEventListeners() {
    document.addEventListener('record:new', (e) => {
      const state = Game.getState();
      celebrate(e.detail.score, state.difficulty);
    });
  }

  // ===== PUBLIC API =====
  return {
    /**
     * 초기화
     */
    init() {
      particles = [];
      setupEventListeners();
      console.log('[Confetti] 초기화 완료');
    },

    /**
     * 축하 애니메이션 발동
     * @param {number} score - 달성한 점수
     * @param {string} difficulty - 난이도 ('easy', 'medium', 'hard')
     */
    celebrate(score, difficulty = 'medium') {
      // 이미 애니메이션 진행 중이면 스킵
      if (isAnimating) {
        return;
      }

      isAnimating = true;
      const canvas = document.getElementById('gameCanvas');
      if (!canvas) return;

      const colors = getColorsForDifficulty(difficulty);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 100개의 파티클 생성
      for (let i = 0; i < 100; i++) {
        particles.push(createParticle(centerX, centerY, colors));
      }

      // 애니메이션 시작
      animationFrameId = requestAnimationFrame(animate);

      console.log('[Confetti] 축하 애니메이션 시작:', score);
    },

    /**
     * 정리 (애니메이션 중단)
     */
    destroy() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      particles = [];
      isAnimating = false;
      console.log('[Confetti] 정리 완료');
    }
  };
})();
