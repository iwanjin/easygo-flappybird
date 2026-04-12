/**
 * 플래피버드 - 물리 엔진
 * 팀A - Agent 1
 *
 * 책임:
 * - 중력 계산 및 속도 적용
 * - 충돌 판정
 * - 위치 업데이트
 *
 * Public API:
 * - applyGravity(velocity, gravity) → 새로운 속도 반환
 * - checkCollision(bird, pipes, ground) → 충돌 여부 boolean
 * - updatePosition(obj, velocity) → 새로운 위치 (x, y)
 * - getCollisionRect(obj) → {x, y, width, height}
 */

const Physics = (() => {
  /**
   * 중력을 적용하여 새로운 속도 계산
   * @param {number} velocity - 현재 속도
   * @param {number} gravity - 중력 가속도
   * @returns {number} 새로운 속도 (최대 낙하 속도 제한)
   */
  function applyGravity(velocity, gravity) {
    const newVelocity = velocity + gravity;
    return Math.min(newVelocity, CONFIG.MAX_FALLING_VELOCITY);
  }

  /**
   * 새와 파이프 간의 충돌 판정
   * @param {object} bird - 새 객체 {x, y, width, height}
   * @param {array} pipes - 파이프 배열 [{x, y, width, height, gap}, ...]
   * @param {object} ground - 땅 객체 {x, y, width, height}
   * @returns {boolean} 충돌 여부
   */
  function checkCollision(bird, pipes, ground) {
    const birdRect = getCollisionRect(bird);

    // 땅과의 충돌 확인
    if (birdRect.y + birdRect.height >= ground.y) {
      return true;
    }

    // 천장과의 충돌 확인 (y < 0)
    if (birdRect.y < 0) {
      return true;
    }

    // 파이프와의 충돌 확인
    if (pipes && pipes.length > 0) {
      for (let pipe of pipes) {
        // 파이프의 상단 부분과 충돌
        if (
          birdRect.x < pipe.x + pipe.width &&
          birdRect.x + birdRect.width > pipe.x &&
          birdRect.y < pipe.gapStart
        ) {
          return true;
        }

        // 파이프의 하단 부분과 충돌
        if (
          birdRect.x < pipe.x + pipe.width &&
          birdRect.x + birdRect.width > pipe.x &&
          birdRect.y + birdRect.height > pipe.gapEnd
        ) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * 객체의 위치를 속도만큼 업데이트
   * @param {object} obj - 업데이트할 객체 {x, y}
   * @param {number} velocityY - Y축 속도
   * @returns {object} 새로운 위치 {x, y}
   */
  function updatePosition(obj, velocityY) {
    return {
      x: obj.x,
      y: obj.y + velocityY
    };
  }

  /**
   * 객체의 충돌 영역(AABB) 계산
   * @param {object} obj - 대상 객체 {x, y, width, height}
   * @returns {object} 충돌 영역 {x, y, width, height}
   */
  function getCollisionRect(obj) {
    return {
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height
    };
  }

  /**
   * 두 AABB(축 정렬 바운딩 박스) 간의 충돌 판정
   * @param {object} rect1 - 첫 번째 사각형
   * @param {object} rect2 - 두 번째 사각형
   * @returns {boolean} 충돌 여부
   */
  function isRectColliding(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  // ===== Public API =====
  return {
    applyGravity,
    checkCollision,
    updatePosition,
    getCollisionRect,
    isRectColliding
  };
})();
