const Game = (() => {
  // ============ Private 상태 ============
  const STATE = {
    IDLE: 'idle',           // 시작 화면
    PLAYING: 'playing',     // 게임 진행 중
    GAMEOVER: 'gameover'    // 게임 종료
  };

  let state = STATE.IDLE;
  let score = 0;
  let bestScore = 0;  // ✅ localStorage 직접 접근 제거 (Storage API 위임)
  let difficulty = 'medium';
  let character = 0;

  // 물리 파라미터
  let config = {};

  // 게임 객체들
  let bird = {
    x: 60,
    y: 240,
    width: 32,
    height: 32,
    velocity: 0
  };

  let pipes = [];
  let lastPipeX = 0;

  let gameLoopId = null;
  let lastFrameTime = 0;

  // ============ Private 함수 ============

  /**
   * 게임 루프 (requestAnimationFrame)
   * delta time을 사용하여 프레임률 독립적 계산
   */
  function gameLoop(timestamp) {
    // 첫 프레임 초기화
    if (lastFrameTime === 0) {
      lastFrameTime = timestamp;
      gameLoopId = requestAnimationFrame(gameLoop);
      return;
    }

    const delta = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (state === STATE.PLAYING) {
      // 1. 물리 업데이트
      updatePhysics(delta);

      // 2. 파이프 업데이트
      updatePipes(delta);

      // 3. 충돌 감지
      if (checkCollision()) {
        state = STATE.GAMEOVER;
        console.log('[Game] 충돌 감지! bird.y =', bird.y, 'score =', score);

        // ✅ Storage에 점수 저장 (신기록 판정도 함)
        Storage.saveBestScore(score);

        // ✅ game:over 이벤트 발행 (bestScore 제거 - UI가 Storage.getBestScore() 직접 호출)
        document.dispatchEvent(new CustomEvent('game:over', {
          detail: { score, character }
        }));
        return;
      }

      // 4. 점수 계산
      updateScore();

      // 5. 렌더링
      Renderer.render({
        bird,
        pipes,
        score,
        difficulty
      });

      // ✅ game:playing 이벤트 발행 (규약 준수)
      document.dispatchEvent(new CustomEvent('game:playing', {
        detail: { score }
      }));

      // 계속 루프
      gameLoopId = requestAnimationFrame(gameLoop);
    }
  }

  /**
   * 중력 + 점프 물리 계산
   */
  function updatePhysics(delta) {
    const gravity = config.gravity || 0.22;
    const maxFall = config.maxFallSpeed || 9;

    // ✅ delta를 초 단위로 정규화 (ms → sec)
    const deltaInSeconds = Math.max(delta, 16) / 1000;  // 최소 16ms

    // 중력 적용 (속도 업데이트)
    bird.velocity += gravity * deltaInSeconds;

    // 최대 낙하속도 제한
    if (bird.velocity > maxFall) {
      bird.velocity = maxFall;
    }

    // 위치 업데이트 (거리 = 속도 * 시간)
    bird.y += bird.velocity * deltaInSeconds;

    // 회전각 계산 (시각 피드백)
    bird.rotation = Math.min(90, bird.velocity * 15);
  }

  /**
   * 파이프 생성 및 이동
   */
  function updatePipes(delta) {
    const pipeSpeed = config.pipeSpeed || 2;
    const pipeSpacing = config.pipeSpacing || 220;
    const gapSize = config.gapSize || 130;
    const canvas = document.getElementById('gameCanvas');
    const canvasHeight = canvas ? canvas.height : 600;  // ✅ 실제 canvas 높이

    // ✅ delta를 초 단위로 정규화
    const deltaInSeconds = Math.max(delta, 16) / 1000;

    // 기존 파이프 이동 (✅ deltaInSeconds 사용)
    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed * deltaInSeconds;
    });

    // 화면 밖 파이프 제거
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // 새 파이프 생성
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 320 - pipeSpacing) {
      const canvas = document.getElementById('gameCanvas');
      const canvasHeight = canvas ? canvas.height : 600;  // ✅ 실제 canvas 높이
      const minGapY = 50;
      const maxGapY = canvasHeight - gapSize - 50;
      const gapY = minGapY + Math.random() * (maxGapY - minGapY);

      pipes.push({
        x: 320,
        width: 52,
        topHeight: gapY,
        bottomY: gapY + gapSize,
        passed: false  // ⚠️ 점수 중복 방지
      });
    }
  }

  /**
   * AABB 충돌 감지
   * 새 vs 파이프, 새 vs 화면경계
   */
  function checkCollision() {
    const margin = 2;  // 관대한 히트박스
    const canvas = document.getElementById('gameCanvas');
    const canvasHeight = canvas ? canvas.height : 600;  // ✅ 실제 canvas 높이 사용

    const birdBox = {
      left: bird.x + margin,
      right: bird.x + bird.width - margin,
      top: bird.y + margin,
      bottom: bird.y + bird.height - margin
    };

    // 화면 경계 충돌
    if (birdBox.top <= 0 || birdBox.bottom >= canvasHeight) {
      return true;
    }

    // 파이프 충돌
    for (let pipe of pipes) {
      // 위 파이프
      if (birdBox.right > pipe.x &&
          birdBox.left < pipe.x + pipe.width &&
          birdBox.top < pipe.topHeight) {
        return true;
      }

      // 아래 파이프
      if (birdBox.right > pipe.x &&
          birdBox.left < pipe.x + pipe.width &&
          birdBox.bottom > pipe.bottomY) {
        return true;
      }
    }

    return false;
  }

  /**
   * 점수 계산 (파이프 통과)
   */
  function updateScore() {
    for (let pipe of pipes) {
      // 새의 중심이 파이프 우측을 지났을 때만 카운트
      if (!pipe.passed && bird.x + bird.width / 2 > pipe.x + pipe.width) {
        pipe.passed = true;
        score++;

        // 이벤트 발행 (UI 업데이트)
        document.dispatchEvent(new CustomEvent('pipe:passed', {
          detail: { score }
        }));
        // ✅ sound:play 제거 (sound.js는 pipe:passed 수신)
      }
    }
  }

  // ============ Public API ============

  return {
    /**
     * 게임 초기화
     */
    init(selectedDifficulty, selectedCharacter) {
      difficulty = selectedDifficulty || 'medium';
      character = selectedCharacter || 0;

      // 난이도 설정값 가져오기
      config = {
        gravity: 0.22,
        jumpVelocity: -5.0,
        maxFallSpeed: 9,
        pipeSpeed: 2.0,
        gapSize: 130,
        pipeSpacing: 220
      };

      // 난이도별 조정
      if (difficulty === 'easy') {
        config.gravity = 0.18;
        config.jumpVelocity = -5.5;
        config.maxFallSpeed = 8;
        config.pipeSpeed = 1.5;
        config.gapSize = 160;
        config.pipeSpacing = 260;
      } else if (difficulty === 'hard') {
        config.gravity = 0.25;
        config.jumpVelocity = -4.6;
        config.maxFallSpeed = 10;
        config.pipeSpeed = 2.5;
        config.gapSize = 100;
        config.pipeSpacing = 200;
      }

      // 게임 상태 초기화
      state = STATE.IDLE;
      score = 0;
      // ✅ canvas height 600의 중간 정도 위치 (약 225px)
      bird.y = 225;
      bird.velocity = 0;
      bird.rotation = 0;
      pipes = [];
      lastFrameTime = 0;

      // Renderer 초기화
      Renderer.init();

      // UI 업데이트
      document.dispatchEvent(new CustomEvent('game:init', {
        detail: { difficulty, character }
      }));
    },

    /**
     * 게임 시작 (IDLE → PLAYING)
     */
    start() {
      if (state !== STATE.IDLE) {
        console.warn('[Game] 게임이 이미 시작되었습니다. state =', state);
        return;
      }

      console.log('[Game] 게임 시작! config =', config);
      state = STATE.PLAYING;
      lastFrameTime = 0;

      // 첫 점프
      bird.velocity = config.jumpVelocity;
      document.dispatchEvent(new CustomEvent('bird:jumped'));
      // ✅ sound:play 제거 (이중 발행 방지, sound.js는 bird:jumped 수신)

      // 게임 루프 시작
      gameLoopId = requestAnimationFrame(gameLoop);
      console.log('[Game] requestAnimationFrame 시작');
    },

    /**
     * 점프 (클릭 시)
     */
    jump() {
      if (state === STATE.PLAYING) {
        bird.velocity = config.jumpVelocity;
        document.dispatchEvent(new CustomEvent('bird:jumped'));
        // ✅ sound:play 제거 (이중 발행 방지)
      }
    },

    /**
     * 게임 종료 후 리셋
     */
    reset() {
      cancelAnimationFrame(gameLoopId);
      state = STATE.IDLE;
      lastFrameTime = 0;
      score = 0;
      bird.velocity = 0;
      pipes = [];
    },

    /**
     * 현재 게임 상태 반환
     */
    getState() {
      return {
        state,
        score,
        bestScore,
        difficulty,
        character
      };
    },

    // ✅ updateBestScore() 제거 (Storage API에서 관리)
  };
})();

// ===== Phase 2: 모바일 최적화 =====
(() => {
  /**
   * 클릭/터치 이벤트 리스너
   * PC: 클릭
   * 모바일: 터치 (클릭도 동작함)
   */
  function setupInputListeners() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;

    // 마우스 클릭
    gameCanvas.addEventListener('click', () => {
      Game.jump();
    });

    // 터치 이벤트 (모바일)
    gameCanvas.addEventListener('touchstart', (e) => {
      e.preventDefault();  // 스크롤 방지
      Game.jump();
    }, { passive: false });

    // 키보드 스페이스 바
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        Game.jump();
      }
    });

    console.log('[Game] 입력 이벤트 리스너 설정 완료 (click, touch, spacebar)');
  }

  // DOMContentLoaded 후 설정
  document.addEventListener('DOMContentLoaded', () => {
    setupInputListeners();
  });

  // 또는 즉시 설정 (DOM 준비 시간이 충분한 경우)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupInputListeners);
  } else {
    setupInputListeners();
  }
})();
