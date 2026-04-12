/**
 * 플래피버드 - 메인 게임 컨트롤러
 * 팀A - Agent 4
 *
 * 책임:
 * - 게임 상태 관리 (상태 머신)
 * - Bird + Pipes + Physics 통합
 * - 게임 루프 (requestAnimationFrame)
 * - 키보드 입력 처리
 * - 점수 계산
 * - 이벤트 발행
 *
 * Public API:
 * - start(difficulty) - 게임 시작
 * - update() - 매 프레임 업데이트
 * - handleKeyPress(key) - 키보드 입력
 * - getState() - 현재 게임 상태
 * - end() - 게임 종료
 * - reset() - 리셋
 */

const Game = (() => {
  // ===== Private State =====
  let gameState = {
    status: 'idle',      // 'idle', 'running', 'over'
    difficulty: 'medium',
    score: 0,
    moves: 0,
    startTime: 0,
    elapsedTime: 0,
    bestScore: 0,
    isGameOver: false
  };

  let gameLoop = null;  // requestAnimationFrame ID

  /**
   * 게임 상태 초기화 및 시작
   * @param {string} difficulty - 난이도 ('easy', 'medium', 'hard')
   */
  function start(difficulty = 'medium') {
    gameState.status = 'running';
    gameState.difficulty = difficulty;
    gameState.score = 0;
    gameState.moves = 0;
    gameState.startTime = Date.now();
    gameState.elapsedTime = 0;
    gameState.isGameOver = false;

    // Bird와 Pipes 초기화
    Bird.init();
    Pipes.init(difficulty);

    console.log('[Game] 게임 시작! 난이도:', difficulty);

    // 이벤트 발행: 게임 시작
    document.dispatchEvent(
      new CustomEvent('game:started', {
        detail: {
          difficulty: difficulty,
          timestamp: gameState.startTime
        }
      })
    );

    // 게임 루프 시작
    startGameLoop();
  }

  /**
   * 게임 루프 (requestAnimationFrame)
   * - 매 프레임 Bird/Pipes 업데이트
   * - 충돌 검사
   * - 점수 계산
   * - 화면 렌더링
   */
  function update() {
    if (gameState.status !== 'running') return;

    // 1. 경과 시간 계산
    gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);

    // 2. Bird 업데이트 (중력 적용)
    Bird.update();
    const birdState = Bird.getState();

    // 3. Pipes 업데이트 (스크롤)
    Pipes.update();
    const pipeRects = Pipes.getCollisionRects();

    // 4. 충돌 검사
    const ground = {
      x: 0,
      y: CONFIG.CANVAS_HEIGHT,
      width: CONFIG.CANVAS_WIDTH,
      height: 0
    };

    if (Physics.checkCollision(birdState, pipeRects, ground)) {
      end();
      return;
    }

    // 5. 파이프 통과 검사 (점수 획득)
    if (Pipes.checkPassedPipe(birdState)) {
      addScore(CONFIG.POINTS.PIPE_PASSED);
    }

    // 게임 루프 계속
    gameLoop = requestAnimationFrame(update);
  }

  /**
   * 게임 루프 시작
   */
  function startGameLoop() {
    gameLoop = requestAnimationFrame(update);
  }

  /**
   * 게임 루프 중지
   */
  function stopGameLoop() {
    if (gameLoop) {
      cancelAnimationFrame(gameLoop);
      gameLoop = null;
    }
  }

  /**
   * 점수 추가
   * @param {number} points - 추가할 점수
   */
  function addScore(points) {
    gameState.score = Math.max(0, gameState.score + points);
    gameState.moves++;

    // 이벤트 발행: 점수 변경
    document.dispatchEvent(
      new CustomEvent('score:updated', {
        detail: {
          score: gameState.score,
          moves: gameState.moves
        }
      })
    );

    console.log('[Game] 점수 업데이트:', gameState.score);
  }

  /**
   * 게임 종료 처리
   */
  function end() {
    if (gameState.isGameOver) return;

    gameState.status = 'over';
    gameState.isGameOver = true;

    stopGameLoop();

    console.log('[Game] 게임 종료! 최종 점수:', gameState.score);

    // 이벤트 발행: 게임 종료
    document.dispatchEvent(
      new CustomEvent('game:over', {
        detail: {
          score: gameState.score,
          moves: gameState.moves,
          time: gameState.elapsedTime,
          difficulty: gameState.difficulty
        }
      })
    );
  }

  /**
   * 키보드 입력 처리
   * @param {string} key - 입력된 키
   */
  function handleKeyPress(key) {
    if (gameState.status !== 'running') return;

    // Space 또는 Up Arrow로 점프
    if (key === ' ' || key === 'ArrowUp' || key === 'w' || key === 'W') {
      Bird.jump();
      gameState.moves++;
    }
  }

  /**
   * 마우스/터치 입력 처리 (모바일 지원)
   */
  function handleInput() {
    if (gameState.status !== 'running') return;
    Bird.jump();
    gameState.moves++;
  }

  /**
   * 현재 게임 상태 반환
   */
  function getState() {
    return {
      status: gameState.status,
      difficulty: gameState.difficulty,
      score: gameState.score,
      moves: gameState.moves,
      elapsedTime: gameState.elapsedTime,
      bestScore: gameState.bestScore,
      birdState: Bird.getState(),
      pipes: Pipes.getPipes()
    };
  }

  /**
   * 게임 리셋
   */
  function reset() {
    stopGameLoop();
    gameState.status = 'idle';
    gameState.score = 0;
    gameState.moves = 0;
    gameState.isGameOver = false;
    Bird.reset();
    Pipes.reset();
  }

  /**
   * 최고 점수 설정
   */
  function setBestScore(score) {
    gameState.bestScore = Math.max(gameState.bestScore, score);
  }

  // ===== 이벤트 리스너 등록 =====

  /**
   * 키보드 이벤트 리스너
   */
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      handleKeyPress(e.key);
    }
  });

  /**
   * 마우스 클릭 이벤트 (모바일 지원)
   */
  document.addEventListener('click', () => {
    handleInput();
  });

  /**
   * 터치 이벤트 (모바일 지원)
   */
  document.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleInput();
  });

  /**
   * Bird 이벤트 수신
   */
  document.addEventListener('bird:jumped', (e) => {
    console.log('[Game] bird:jumped 이벤트 수신:', e.detail);
    // UI 업데이트 (Sound 등은 C팀이 처리)
  });

  document.addEventListener('bird:died', (e) => {
    console.log('[Game] bird:died 이벤트 수신:', e.detail);
    // 게임 종료는 Game.update()에서 충돌 검사로 처리
  });

  /**
   * Pipes 이벤트 수신
   */
  document.addEventListener('pipe:passed', (e) => {
    console.log('[Game] pipe:passed 이벤트 수신:', e.detail);
    // 점수는 Game.update()에서 처리
  });

  // ===== Public API =====
  return {
    start,
    update,
    handleKeyPress,
    handleInput,
    getState,
    end,
    reset,
    setBestScore,
    addScore,
    getScore: () => gameState.score,
    getStatus: () => gameState.status,
    isRunning: () => gameState.status === 'running',
    isGameOver: () => gameState.isGameOver
  };
})();
