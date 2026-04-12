# 🅰️ Team A - 게임 로직팀 (두뇌 역할)

> **담당**: 게임 상태 관리, 물리 엔진, 충돌 감지, 점수 계산  
> **파일**: `js/game.js`, `js/renderer.js` (일부)  
> **목표**: Day 1 16:00까지 기본 플레이 완성

---

## 📋 Team A의 책임

```
🎮 게임 상태 머신
   ├─ 시작 (IDLE)
   ├─ 진행 중 (PLAYING)
   └─ 게임오버 (GAMEOVER)

⚙️ 물리 엔진
   ├─ 중력 계산
   ├─ 점프 속도
   └─ 낙하 속도 제한

💥 충돌 감지
   ├─ 새 vs 파이프 충돌
   ├─ 새 vs 화면경계 충돌
   └─ 관대한 히트박스 (+2px 여유)

📊 점수 계산
   ├─ 파이프 통과 감지
   ├─ 점수 증가
   └─ 최고 기록 비교

🎨 렌더링 제어
   ├─ Canvas 초기화
   ├─ 게임 루프 시작/종료
   └─ 프레임레이트 독립성
```

---

## 🔧 Phase 1: 기본 구조 (09:30 ~ 12:00)

### 목표
- game.js에 상태머신 틀 작성
- renderer.js에 Canvas 초기화
- 게임 루프 시작 가능 상태

### 파일: `js/game.js`

```javascript
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
        document.dispatchEvent(new CustomEvent('game:over', {
          detail: { score, bestScore, character }
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

    // 중력 적용
    bird.velocity += gravity;

    // 최대 낙하속도 제한
    if (bird.velocity > maxFall) {
      bird.velocity = maxFall;
    }

    // 위치 업데이트
    bird.y += bird.velocity;

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
    const canvasHeight = 480;

    // 기존 파이프 이동
    pipes.forEach(pipe => {
      pipe.x -= pipeSpeed * (delta / 1000);
    });

    // 화면 밖 파이프 제거
    pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

    // 새 파이프 생성
    if (pipes.length === 0 || pipes[pipes.length - 1].x < 320 - pipeSpacing) {
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
    const canvasHeight = 480;

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
      bird.y = 240;
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
      if (state !== STATE.IDLE) return;

      state = STATE.PLAYING;
      lastFrameTime = 0;

      // 첫 점프
      bird.velocity = config.jumpVelocity;
      document.dispatchEvent(new CustomEvent('bird:jumped'));
      // ✅ sound:play 제거 (이중 발행 방지, sound.js는 bird:jumped 수신)

      // 게임 루프 시작
      gameLoopId = requestAnimationFrame(gameLoop);
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
```

### 파일: `js/renderer.js` (A팀 일부)

```javascript
const Renderer = (() => {
  let canvas = null;
  let ctx = null;

  return {
    /**
     * Canvas 초기화
     */
    init() {
      canvas = document.getElementById('gameCanvas');
      if (!canvas) {
        console.error('Canvas element not found!');
        return;
      }

      ctx = canvas.getContext('2d');
      
      // Canvas 크기 설정
      canvas.width = 320;
      canvas.height = 480;

      // 배경 초기화
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * 게임 렌더링
     */
    render(gameData) {
      const { bird, pipes, score, difficulty } = gameData;

      // 배경 (낮/밤 모드는 C팀이 처리)
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 파이프 그리기
      ctx.fillStyle = '#2D5016';
      pipes.forEach(pipe => {
        // 위 파이프
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // 아래 파이프
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 480 - pipe.bottomY);
      });

      // 새 그리기 (이모지)
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      if (bird.rotation) {
        ctx.rotate(bird.rotation * Math.PI / 180);
      }
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const characters = ['🐦', '🐱', '🐶'];
      ctx.fillText(characters[0], 0, 0);  // 일단 새만 사용
      ctx.restore();

      // 점수 (UI에서 처리하므로 여기서는 디버깅용만)
      // ctx.fillStyle = 'white';
      // ctx.font = 'bold 32px Arial';
      // ctx.fillText(score, 20, 50);
    }
  };
})();
```

---

## 🔧 Phase 2: 게임 로직 완성 (13:00 ~ 16:00)

### 목표
- 점프 + 파이프 충돌 완벽 동작
- 점수 정확한 계산
- 게임 루프 60fps 유지

### 체크리스트
- [ ] 물리 계산 정확성 확인
  - [ ] 점프 후 정상 낙하
  - [ ] 최대 낙하속도 도달
  - [ ] 회전각 부드러운 변화
  
- [ ] 파이프 생성 정상
  - [ ] 통로 높이 무작위 배치
  - [ ] 파이프 적절한 간격
  - [ ] 오래된 파이프 정리

- [ ] 충돌 감지 정확성
  - [ ] 여유 판정 (+2px)
  - [ ] 화면 경계 충돌
  - [ ] 중복 충돌 감지 없음

- [ ] 점수 계산 정확성
  - [ ] passed 플래그 작동
  - [ ] 중복 카운트 없음
  - [ ] 이벤트 정확히 발행

- [ ] 성능
  - [ ] Chrome DevTools에서 60fps 유지
  - [ ] 메모리 누수 없음 (장시간 플레이)

### 난이도별 파라미터 (검증 필요)

| 파라미터 | 쉬움 | 보통 | 어려움 |
|:---|:---:|:---:|:---:|
| gravity | 0.18 | 0.22 | 0.25 |
| jumpVelocity | -5.5 | -5.0 | -4.6 |
| maxFallSpeed | 8 | 9 | 10 |
| pipeSpeed | 1.5 | 2.0 | 2.5 |
| gapSize | 160 | 130 | 100 |
| pipeSpacing | 260 | 220 | 200 |

---

## 🤖 Sub-Agent 활용

### Phase 1 중반 (10:30 경)
```
Agent 작업: Canvas API 기초 학습
명령: "Canvas API 튜토리얼 조사. 
      fillRect, clearRect, translate, rotate 기초만. 
      코드는 작성하지 말고 개념만."
예상 결과: Canvas 렌더링 기초 이해
```

### Phase 2 중반 (14:00 경)
```
Agent 작업: 물리 엔진 검증
명령: "플래피버드 물리 엔진 검증.
      gravity=0.22, jumpVelocity=-5.0일 때
      최고점 높이와 낙하 시간 계산해줘."
예상 결과: 물리 파라미터 검증
```

---

## 📝 체크포인트 (Phase별)

### Phase 1 종료 (12:00)
```
✅ game.js 작성 완료
✅ renderer.js 초기화 부분 완료
✅ Canvas 그리기 가능
❌ 아직 충돌 감지 테스트 안 함 (OK)
```

### Phase 2 종료 (16:00)
```
✅ 점프 반응 정상
✅ 파이프 생성 정상
✅ 충돌 감지 정상
✅ 점수 계산 정상
✅ 게임 루프 60fps
✅ B팀과 이벤트 연결 테스트 (기본)
```

---

## ⚠️ 주의사항

### 1. Delta Time 사용 필수!
```javascript
// ❌ 틀림
bird.y += 2;  // 프레임률 의존

// ✅ 맞음
bird.y += velocity * (delta / 1000);
```

### 2. passed 플래그 필수!
```javascript
// ❌ 틀림
if (bird.x > pipe.x) score++;  // 매 프레임 증가

// ✅ 맞음
if (!pipe.passed && bird.x > pipe.x) {
  pipe.passed = true;
  score++;
}
```

### 3. 첫 프레임 처리
```javascript
// ❌ 틀림
let lastTime = 0;
const delta = timestamp - lastTime;  // 첫 프레임에 엄청 큼!

// ✅ 맞음
if (lastTime === 0) {
  lastTime = timestamp;
  return;  // 첫 프레임 스킵
}
```

### 4. requestAnimationFrame 정리
```javascript
// 게임 중지 시
cancelAnimationFrame(gameLoopId);
```

---

## 🎯 최종 결과물

Day 1 16:00까지 다음이 완성되어야 함:

```
✅ 게임 시작 가능
✅ 새 조종 가능 (점프)
✅ 파이프 무한 생성
✅ 충돌 감지 정상
✅ 점수 정확히 계산
✅ 60fps 유지
✅ 콘솔 에러 0개
```

이후 B팀과 C팀이 이 코드 위에 UI와 고급 기능을 덧대게 됩니다! 💪
