/**
 * 플래피버드 - 새 캐릭터 로직
 * 팀A - Agent 2
 *
 * 책임:
 * - 새의 상태 관리 (위치, 속도, 회전)
 * - 점프 로직
 * - 중력 적용
 * - 충돌 판정
 *
 * Public API:
 * - init() - 새 초기화
 * - jump() - 점프 (키보드 입력 처리)
 * - update() - 매 프레임 업데이트 (중력 적용)
 * - collidesWith(pipes, ground) - 충돌 여부 판정
 * - getState() - 현재 상태 반환
 * - reset() - 새 게임용 리셋
 */

const Bird = (() => {
  // ===== Private State =====
  let state = {
    x: CONFIG.BIRD_START_X,
    y: CONFIG.BIRD_START_Y,
    width: CONFIG.BIRD_WIDTH,
    height: CONFIG.BIRD_HEIGHT,
    velocity: 0,
    gravity: CONFIG.GRAVITY,
    rotation: 0,                 // 회전 각도 (시각 효과용)
    isAlive: true
  };

  /**
   * 새 초기화
   */
  function init() {
    state.x = CONFIG.BIRD_START_X;
    state.y = CONFIG.BIRD_START_Y;
    state.velocity = 0;
    state.rotation = 0;
    state.isAlive = true;

    console.log('[Bird] 초기화 완료:', state);
  }

  /**
   * 점프 처리
   * - 속도를 음수(위쪽)로 설정
   * - 회전 각도 조정 (위를 바라봄)
   * - 'bird:jumped' 이벤트 발행
   */
  function jump() {
    if (!state.isAlive) return;

    state.velocity = CONFIG.BIRD_JUMP_VELOCITY;
    state.rotation = -35;  // 위를 바라보는 각도

    // 이벤트 발행: 점프했음을 알림
    document.dispatchEvent(
      new CustomEvent('bird:jumped', {
        detail: {
          y: state.y,
          velocity: state.velocity
        }
      })
    );

    console.log('[Bird] 점프! 속도:', state.velocity);
  }

  /**
   * 매 프레임 업데이트
   * - 중력 적용
   * - 위치 업데이트
   * - 회전 각도 업데이트 (시각적 피드백)
   */
  function update() {
    if (!state.isAlive) return;

    // 1. 중력 적용 (Physics 모듈 사용)
    state.velocity = Physics.applyGravity(state.velocity, state.gravity);

    // 2. 위치 업데이트
    const newPos = Physics.updatePosition(state, state.velocity);
    state.x = newPos.x;
    state.y = newPos.y;

    // 3. 회전 각도 업데이트 (낙하할수록 더 아래를 봄)
    if (state.velocity > 0) {
      // 낙하 중: 회전을 아래 방향으로
      state.rotation = Math.min(state.rotation + 5, 90);
    }
  }

  /**
   * 파이프 및 땅과의 충돌 판정
   * @param {array} pipes - 파이프 배열
   * @param {object} ground - 땅 객체
   * @returns {boolean} 충돌 여부
   */
  function collidesWith(pipes, ground) {
    // Physics 모듈을 사용하여 충돌 판정
    const hasCollision = Physics.checkCollision(state, pipes, ground);

    if (hasCollision && state.isAlive) {
      state.isAlive = false;

      // 이벤트 발행: 충돌했음을 알림
      document.dispatchEvent(
        new CustomEvent('bird:died', {
          detail: {
            x: state.x,
            y: state.y,
            velocity: state.velocity
          }
        })
      );

      console.log('[Bird] 충돌! 게임 종료');
    }

    return hasCollision;
  }

  /**
   * 현재 새의 상태 반환
   */
  function getState() {
    return {
      x: state.x,
      y: state.y,
      width: state.width,
      height: state.height,
      velocity: state.velocity,
      rotation: state.rotation,
      isAlive: state.isAlive
    };
  }

  /**
   * 새 게임용 리셋
   */
  function reset() {
    init();
  }

  /**
   * 중력 설정 (난이도에 따라 변경 가능)
   */
  function setGravity(gravity) {
    state.gravity = gravity;
  }

  // ===== Public API =====
  return {
    init,
    jump,
    update,
    collidesWith,
    getState,
    reset,
    setGravity
  };
})();
