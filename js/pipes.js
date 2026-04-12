/**
 * 플래피버드 - 파이프 관리 로직
 * 팀A - Agent 3
 *
 * 책임:
 * - 파이프 생성 및 배치
 * - 파이프 스크롤 (이동)
 * - 새와의 충돌 판정
 * - 파이프 통과 판정 (점수 획득)
 * - 파이프 풀 관리 (재사용)
 *
 * Public API:
 * - init(difficulty) - 파이프 초기화
 * - update(scrollSpeed) - 파이프 이동
 * - checkBirdCollision(bird) - 충돌 판정
 * - checkPassedPipe(bird) - 통과 판정
 * - getCollisionRects() - 모든 파이프 영역 반환
 * - getPipes() - 현재 파이프 배열
 * - reset() - 새 게임용 리셋
 */

const Pipes = (() => {
  // ===== Private State =====
  let pipes = [];
  let lastPipeX = 0;
  let passedPipeIds = new Set();  // 이미 통과한 파이프 ID
  let nextPipeId = 0;
  let scrollSpeed = CONFIG.SCROLL_SPEED;
  let difficulty = 'medium';

  /**
   * 난수를 생성하여 파이프의 위치 결정
   * @returns {number} 파이프의 상단 높이
   */
  function getRandomGapStart() {
    const minGapStart = 50;
    const maxGapStart = CONFIG.CANVAS_HEIGHT - CONFIG.PIPE_GAP - 50;
    return Math.random() * (maxGapStart - minGapStart) + minGapStart;
  }

  /**
   * 새로운 파이프 생성
   * @param {number} x - 파이프의 X 좌표
   * @returns {object} 파이프 객체
   */
  function createPipe(x) {
    const gapStart = getRandomGapStart();
    const gapEnd = gapStart + CONFIG.PIPE_GAP;

    return {
      id: nextPipeId++,
      x: x,
      y: 0,
      width: CONFIG.PIPE_WIDTH,
      height: CONFIG.CANVAS_HEIGHT,
      gapStart: gapStart,
      gapEnd: gapEnd,
      scored: false  // 점수 획득 여부
    };
  }

  /**
   * 파이프 배열 초기화
   * 화면 밖에서 시작하여 화면으로 들어오는 파이프들 생성
   */
  function initializePipes() {
    pipes = [];
    passedPipeIds.clear();
    nextPipeId = 0;
    lastPipeX = CONFIG.CANVAS_WIDTH + 100;

    // 초기 파이프들 생성 (3~4개)
    let pipeCount = 4;
    for (let i = 0; i < pipeCount; i++) {
      const pipe = createPipe(lastPipeX + CONFIG.PIPE_SPACING * i);
      pipes.push(pipe);
    }

    console.log('[Pipes] 초기화 완료. 파이프 수:', pipes.length);
  }

  /**
   * 파이프 초기화 (난이도 적용)
   * @param {string} newDifficulty - 난이도 ('easy', 'medium', 'hard')
   */
  function init(newDifficulty = 'medium') {
    difficulty = newDifficulty || 'medium';
    const config = CONFIG.DIFFICULTY[difficulty];
    scrollSpeed = config.pipeSpeed;

    initializePipes();
  }

  /**
   * 매 프레임 파이프 업데이트
   * - 파이프 이동 (스크롤)
   * - 화면 밖의 파이프 제거
   * - 새 파이프 생성
   */
  function update(customScrollSpeed) {
    const speed = customScrollSpeed || scrollSpeed;

    // 1. 모든 파이프 이동
    for (let pipe of pipes) {
      pipe.x -= speed;
    }

    // 2. 화면 왼쪽 밖으로 나간 파이프 제거 및 새 파이프 추가
    pipes = pipes.filter(pipe => {
      if (pipe.x + pipe.width < 0) {
        return false;  // 제거
      }
      return true;
    });

    // 3. 새 파이프 추가 (필요시)
    if (pipes.length > 0) {
      const rightmostPipe = pipes[pipes.length - 1];
      if (rightmostPipe.x < CONFIG.CANVAS_WIDTH - CONFIG.PIPE_SPACING) {
        const newPipe = createPipe(rightmostPipe.x + CONFIG.PIPE_SPACING);
        pipes.push(newPipe);
      }
    }
  }

  /**
   * 새와 파이프의 충돌 판정
   * @param {object} bird - 새 객체 (Bird.getState() 반환값)
   * @returns {boolean} 충돌 여부
   */
  function checkBirdCollision(bird) {
    // Physics 모듈을 사용하여 충돌 검사
    const ground = {
      x: 0,
      y: CONFIG.CANVAS_HEIGHT,
      width: CONFIG.CANVAS_WIDTH,
      height: 0
    };

    return Physics.checkCollision(bird, pipes, ground);
  }

  /**
   * 파이프 통과 판정 및 점수 추가
   * - 새의 중심이 파이프를 통과했는지 판정
   * - 'pipe:passed' 이벤트 발행
   * @param {object} bird - 새 객체
   * @returns {boolean} 통과 여부
   */
  function checkPassedPipe(bird) {
    const birdCenterX = bird.x + bird.width / 2;

    for (let pipe of pipes) {
      const pipeCenterX = pipe.x + pipe.width / 2;

      // 새가 파이프의 중심을 지나갔는지 확인
      // (새의 중심이 파이프의 오른쪽 끝을 지나갔을 때)
      if (
        birdCenterX > pipe.x + pipe.width &&
        birdCenterX < pipe.x + pipe.width + scrollSpeed + 2 &&
        !passedPipeIds.has(pipe.id)
      ) {
        passedPipeIds.add(pipe.id);

        // 이벤트 발행: 파이프 통과
        document.dispatchEvent(
          new CustomEvent('pipe:passed', {
            detail: {
              pipeId: pipe.id,
              score: CONFIG.POINTS.PIPE_PASSED
            }
          })
        );

        console.log('[Pipes] 파이프 통과! ID:', pipe.id);
        return true;
      }
    }

    return false;
  }

  /**
   * 모든 파이프의 충돌 영역 반환
   * @returns {array} 파이프 객체 배열
   */
  function getCollisionRects() {
    return pipes.map(pipe => ({
      x: pipe.x,
      y: pipe.y,
      width: pipe.width,
      height: pipe.height,
      gapStart: pipe.gapStart,
      gapEnd: pipe.gapEnd
    }));
  }

  /**
   * 현재 파이프 배열 반환
   */
  function getPipes() {
    return pipes.map(pipe => ({ ...pipe }));
  }

  /**
   * 새 게임용 리셋
   */
  function reset() {
    initializePipes();
  }

  // ===== Public API =====
  return {
    init,
    update,
    checkBirdCollision,
    checkPassedPipe,
    getCollisionRects,
    getPipes,
    reset
  };
})();
