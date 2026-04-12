# 플래피버드 개발 프로젝트 - 완전한 인수인계 문서

> 이 문서는 새로운 개발자가 플래피버드 프로젝트를 처음 접할 때 **전체 배경**, **설계 결정 근거**, **재사용할 코드**, **피해야 할 함정**을 이해할 수 있도록 작성되었습니다.

---

## 📚 문서 읽기 가이드

**처음 읽는 개발자라면 이 순서로 읽으세요:**

1. **이 문서** (01-handover.md) ← 전체 배경 및 설계 철학 이해
2. **00-overview.md** ← 구체적인 개발 계획 및 타임라인
3. **코드 시작 전** → 냥냥 메모리 코드 읽기 (js/, css/ 폴더)
4. **개발 시작** → 물리 계산 검증용 스프레드시트 다운로드

---

## 1️⃣ 프로젝트 배경

### 왜 이 프로젝트인가?

이미 완성된 게임: **냥냥 메모리 (Memo Cats)** - 초등학생 대상 카드 매칭 게임
- GitHub Pages에서 라이브 배포 중: https://iwanjin.github.io/easygo-catmemories/
- 검증된 UX 패턴과 코드 아키텍처 확보
- 초등학생 (7~13세) 대상 설계 검증 완료

**다음 게임 선택 기준:**
- 초등학생에게 인기 있음
- 개발 난이도 적절 (1~2일)
- 냥냥 메모리와 코드 패턴 공유 가능
- **선택됨: 플래피버드** ✅

**플래피버드 선택 근거:**
```
인기도: 95/100 (원작 2013년, 현재까지 구현 계속)
개발난이도: ⭐⭐ (중간 - 물리엔진 필요)
초등학생 중독성: 98/100 (한 판 2분, 끝없는 도전욕)
코드 재사용도: 85/100 (Storage, Sound, UI 패턴 공유)
```

---

## 2️⃣ 냥냥 메모리 코드 구조 분석

### 현재 폴더 위치
```
C:\Users\iw\Desktop\web_game\.claude\worktrees\cosmic-wobbling-walrus/
```

### 폴더 구조
```
├── index.html                    # HTML 구조 (화면 3개 정의)
├── css/
│   └── style.css                 # 디자인 토큰 + 애니메이션
├── js/
│   ├── game.js                   # 게임 로직 (상태 머신)
│   ├── cards.js                  # 카드 생성/셔플
│   ├── ui.js                     # 화면 전환 + 이벤트 바인딩
│   ├── sound.js                  # 사운드 시스템
│   ├── storage.js                # LocalStorage 래퍼
│   ├── difficulty.js             # 난이도 설정값
│   └── confetti.js               # 파티클 이펙트
├── assets/sounds/                # MP3 파일들
├── plan/                         # 이 폴더
│   ├── 00-overview.md           # 전체 개발 계획
│   └── 01-handover.md           # 이 파일
└── README.md                     # 게임 설명 및 배포 가이드
```

### 핵심 설계 패턴 3가지

#### 패턴 1: IIFE 모듈 (모든 JS 파일)
```javascript
const ModuleName = (() => {
  // private 변수
  let state = {};
  
  // private 함수
  function internalFunc() {}
  
  // public API
  return {
    publicMethod1() { /* ... */ },
    publicMethod2() { /* ... */ }
  };
})();

// 사용
ModuleName.publicMethod1();
```

**왜 이 패턴인가?**
- 전역 네임스페이스 오염 없음 (Game, Sound, Storage 등 이름 충돌 방지)
- private/public 명확히 구분
- 모바일 게임처럼 가벼운 구조 (프레임워크 불필요)

**플래피버드에서도 동일 사용:**
- Physics, Bird, Pipes, Renderer, Game 각각을 IIFE 모듈로 구현

---

#### 패턴 2: CustomEvent 기반 이벤트 버스
```javascript
// game.js에서 발행
document.dispatchEvent(new CustomEvent('card:matched', {
  detail: { cardIds: [3, 7] }
}));

// sound.js에서 구독
document.addEventListener('card:matched', (e) => {
  Sound.play('match');
});
```

**왜 이 패턴인가?**
- 모듈 간 직접 의존성 없음 (느슨한 결합)
- 한 이벤트 여러 리스너 가능 (확장성)
- 순환 의존 불가능 (아키텍처 깔끔)

**플래피버드 이벤트:**
```javascript
'bird:jumped'      // Bird가 점프했을 때
'pipe:passed'      // 파이프 통과할 때
'bird:died'        // 충돌했을 때
'game:over'        // 게임 종료할 때
```

---

#### 패턴 3: HTML 구조 + CSS 클래스로 화면 전환
```html
<!-- index.html -->
<div id="app">
  <section id="start-screen" class="screen">...</section>
  <section id="game-screen" class="screen hidden">...</section>
  <section id="end-screen" class="screen hidden">...</section>
</div>
```

```css
/* style.css */
.hidden {
  display: none !important;
}
```

```javascript
// ui.js
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`${name}-screen`).classList.remove('hidden');
}
```

**왜 이 패턴인가?**
- DOM 조작 최소화 (성능)
- CSS 토글만으로 화면 전환 (간단)
- 각 화면이 독립적 HTML 섹션 (유지보수 쉬움)

---

### 코드 레벨 상세 분석

#### storage.js 분석 (재사용도 100%)
```javascript
const Storage = (() => {
  const PREFIX = 'memoCats_';
  
  // private - 실제 key 생성
  function getKey(name) {
    return PREFIX + name;
  }
  
  // public API
  return {
    saveBestScore(difficulty, score) {
      const current = this.getBestScore(difficulty);
      if (score > current) {
        localStorage.setItem(getKey(`best_${difficulty}`), String(score));
        return true;  // 신기록 여부
      }
      return false;
    },
    
    getBestScore(difficulty) {
      const stored = localStorage.getItem(getKey(`best_${difficulty}`));
      return stored ? parseInt(stored, 10) : 0;
    },
    
    isMuted() {
      return localStorage.getItem(getKey('muted')) === 'true';
    }
  };
})();
```

**플래피버드에서 복사해서 사용할 때:**
1. PREFIX를 `'flappyBird_'`로 변경
2. `saveBestScore(score)` 파라미터에서 `difficulty` 제거 (난이도별 저장 불필요)
3. `getTop3Scores()` 메서드 추가 (신규 기능)

```javascript
// 수정된 버전
getTop3Scores() {
  const scores = [
    parseInt(localStorage.getItem(getKey('score_1')), 10) || 0,
    parseInt(localStorage.getItem(getKey('score_2')), 10) || 0,
    parseInt(localStorage.getItem(getKey('score_3')), 10) || 0
  ].sort((a, b) => b - a);
  return scores;
}
```

---

#### sound.js 분석 (재사용도 95%)
```javascript
const Sound = (() => {
  let muted = localStorage.getItem('memoCats_muted') === 'true';
  const sounds = {};
  
  const soundFiles = {
    flip:     'assets/sounds/flip.mp3',
    match:    'assets/sounds/match.mp3',
    mismatch: 'assets/sounds/mismatch.mp3',
    win:      'assets/sounds/win.mp3'
  };
  
  return {
    init() {
      for (const [type, filePath] of Object.entries(soundFiles)) {
        sounds[type] = new Audio(filePath);
        sounds[type].preload = 'auto';
      }
    },
    
    play(type) {
      if (muted || !sounds[type]) return;
      try {
        sounds[type].currentTime = 0;  // 재생 위치 초기화
        sounds[type].play().catch(() => {});  // autoplay 오류 무시
      } catch (e) {
        console.warn('Sound play failed', e);
      }
    }
  };
})();
```

**플래피버드에서 수정할 때:**
```javascript
const soundFiles = {
  wing:   'assets/sounds/wing.mp3',      // 점프
  point:  'assets/sounds/point.mp3',     // 통과
  hit:    'assets/sounds/hit.mp3',       // 충돌
  die:    'assets/sounds/die.mp3'        // 사망
};
```

---

#### ui.js 분석 (50% 재사용, 50% 수정 필요)

**재사용 가능 부분:**
```javascript
// 화면 전환 함수 (100% 동일)
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(`${name}-screen`).classList.remove('hidden');
}

// 메시지 배열 구조 (패턴 재사용)
const messages = {
  tips: ['팁1', '팁2', '팁3'],
  encouraging: ['잘하고 있어!', '멋진데', '대단해!'],
  success: ['완벽해!', '최고야!']
};

// 무작위 메시지 선택 (함수 재사용)
function getRandomMessage(category) {
  const list = messages[category] || messages.tips;
  return list[Math.floor(Math.random() * list.length)];
}
```

**수정 필요 부분:**
```javascript
// 냥냥메모리: 게임 중에 점수/시간 업데이트
// 플래피버드: 매 프레임 점수/콤보 업데이트 필요

// 냥냥메모리: 카드 클릭 이벤트
// 플래피버드: 게임 루프(requestAnimationFrame) + 클릭/터치/키보드 통합 필요
```

---

#### style.css 분석 (80% 재사용)

**100% 재사용할 CSS:**
```css
/* 색상 토큰 */
:root {
  --color-primary:    #D8889F;    /* 주 색상: 핑크 */
  --color-secondary:  #F5A9C1;    /* 보조: 연핑크 */
  --color-background: #F5F0E8;    /* 배경: 베이지 */
  --color-success:    #9BBE8F;    /* 성공: 초록 */
  --color-text:       #333333;    /* 텍스트: 어두운회색 */
}

/* 폰트 */
body {
  font-family: 'Comic Sans MS', 'Malgun Gothic', sans-serif;
}

/* 반응형 패턴 */
#app {
  width: 100%;
  max-width: clamp(280px, 95vw, 800px);
  padding: clamp(10px, 3vw, 20px);
  font-size: clamp(24px, 8vw, 48px);
}

/* 미디어쿼리 패턴 */
@media (max-width: 374px) {
  /* 초소형 화면 대응 */
}
```

**수정 필요한 CSS:**
```css
/* 냥냥메모리: 카드 3D 뒤집기 */
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

/* 플래피버드: Canvas 레이아웃 추가 필요 */
canvas {
  display: block;
  margin: 20px auto;
  border: 2px solid var(--color-primary);
  background: linear-gradient(180deg, #87CEEB, #E0F6FF);
}
```

**낮/밤 모드 CSS 추가:**
```css
/* 낮 모드 (기본) */
:root[data-theme="day"] {
  --bg-gradient: linear-gradient(180deg, #87CEEB, #E0F6FF);
  --pipe-color: #2D5016;
}

/* 밤 모드 */
:root[data-theme="night"] {
  --bg-gradient: linear-gradient(180deg, #1a1a2e, #16213e);
  --pipe-color: #4a7c59;
}

canvas {
  background: var(--bg-gradient);
}
```

---

### difficulty.js 분석 (재사용도 80%)

```javascript
const Difficulty = (() => {
  const animalEmojis = ['🐱', '🐶', '🐰', '🐻', '🐼', '🦊', '🐸', '🐵', '🦁', '🐯', '🐨', '🐷'];
  
  const configs = {
    easy: {
      rows: 3,
      cols: 4,
      timeLimit: 120,
      emojis: animalEmojis.slice(0, 6)
    },
    medium: {
      rows: 4,
      cols: 4,
      timeLimit: 180,
      emojis: animalEmojis.slice(0, 8)
    },
    hard: {
      rows: 4,
      cols: 6,
      timeLimit: 240,
      emojis: animalEmojis.slice(0, 12)
    }
  };
  
  return {
    getConfig(level) {
      return { ...configs[level] };
    }
  };
})();
```

**플래피버드용 난이도 구조 (완전히 다름):**
```javascript
const Difficulty = (() => {
  const configs = {
    easy: {
      gravity: 0.18,
      jumpVelocity: -5.5,
      maxFallSpeed: 8,
      pipeSpeed: 1.5,
      gapSize: 160,
      pipeSpacing: 260
    },
    medium: {
      gravity: 0.22,
      jumpVelocity: -5.0,
      maxFallSpeed: 9,
      pipeSpeed: 2.0,
      gapSize: 130,
      pipeSpacing: 220
    },
    hard: {
      gravity: 0.25,
      jumpVelocity: -4.6,
      maxFallSpeed: 10,
      pipeSpeed: 2.5,
      gapSize: 100,
      pipeSpacing: 200
    }
  };
  
  return {
    getConfig(level) {
      return { ...configs[level] };
    }
  };
})();
```

---

#### confetti.js 분석 (재사용도 100%, 용도만 다름)

```javascript
const Confetti = (() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  function launch() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      vy: 2 + Math.random() * 3,
      vx: -2 + Math.random() * 4,
      size: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    
    function animate() {
      // 파티클 업데이트 + 드로우
      requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
  }
  
  return { launch };
})();
```

**냥냥메모리:** 게임 클리어 시 호출  
**플래피버드:** 신기록 달성 시 호출

---

### HTML 구조 분석 (일부 재사용)

**재사용할 부분:**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>플래피버드</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    <section id="start-screen" class="screen">
      <!-- 캐릭터 선택 -->
      <!-- 난이도 선택 -->
    </section>
    
    <section id="game-screen" class="screen hidden">
      <!-- Canvas 게임판 -->
      <!-- 점수 표시 -->
    </section>
    
    <section id="gameover-screen" class="screen hidden">
      <!-- 최종 점수 -->
      <!-- 최고 기록 -->
      <!-- TOP3 -->
    </section>
  </div>

  <script src="js/difficulty.js"></script>
  <script src="js/storage.js"></script>
  <script src="js/sound.js"></script>
  <script src="js/physics.js"></script>
  <script src="js/bird.js"></script>
  <script src="js/pipes.js"></script>
  <script src="js/renderer.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/confetti.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
```

---

## 3️⃣ 플래피버드 레퍼런스 게임 분석

### 분석 대상 (오픈소스 2개)

| 게임 | GitHub | 분석 포인트 |
|:---|:---|:---|
| nebez/flappybird | github.com/nebez/floppybird | 원조에 가장 충실한 구현 |
| sourabhv/FlappyBird | github.com/sourabhv/FlappyBird | Phaser.js 기반, 고도화된 구현 |

### 공통 구현 패턴 정리

#### 1. 게임 루프 (requestAnimationFrame)

**원조 구현 (nebez):**
```javascript
function gameLoop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);   // 물리 계산
  render();        // 캔버스 드로잉

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

**핵심 개념:**
- `delta`: 이전 프레임과의 시간 차이 (밀리초)
- 용도: 프레임레이트 독립적 물리 계산
  - 60fps 모니터: delta ≈ 16.67ms
  - 120fps 모니터: delta ≈ 8.33ms
  - 둘 다 동일 속도로 움직여야 함

**수식:**
```javascript
// ❌ 틀린 방식 (프레임 의존)
bird.y += 2;  // 매 프레임 고정값

// ✅ 맞는 방식 (시간 의존)
bird.y += 2 * (delta / 1000);  // 초당 2px 낙하
```

---

#### 2. 물리 엔진 (중력 + 점프)

**역공학으로 도출된 수치 (두 구현 공통 근사):**

```javascript
// 기본 물리 상수
const gravity = 0.25;           // px/frame²
const jumpVelocity = -4.6;      // px/frame (음수 = 위로)
const maxFallSpeed = 10;        // px/frame

// 매 프레임 업데이트
bird.velocity += gravity;                    // 중력 적용
bird.velocity = Math.min(bird.velocity, maxFallSpeed);  // 최대 낙하속도 제한
bird.y += bird.velocity;        // 위치 업데이트

// 점프 (클릭 시)
function jump() {
  bird.velocity = jumpVelocity;  // 속도를 점프값으로 리셋
}
```

**시각화:**
```
시간→

점프 직후: velocity = -4.6
  frame 1: y -= 4.6, velocity = -4.6 + 0.25 = -4.35
  frame 2: y -= 4.35, velocity = -4.35 + 0.25 = -4.10
  ...
  frame 10: velocity → 0 (최고점)
  frame 11: velocity > 0 (낙하 시작)
  frame 20: velocity = maxFallSpeed = 10 (터미널 벨로시티)
```

---

#### 3. AABB 충돌 감지

**원리:**
```
새의 경계상자와 파이프의 경계상자가 겹치면 충돌
```

**코드:**
```javascript
function checkCollision(bird, pipe, canvasHeight) {
  // 새의 경계상자 (마진 2px로 관대하게)
  const birdBox = {
    left:   bird.x + 2,
    right:  bird.x + bird.width - 2,
    top:    bird.y + 2,
    bottom: bird.y + bird.height - 2
  };

  // 파이프 경계상자들
  // 위 파이프: (0, 0) ~ (width, topHeight)
  const topPipe = {
    left:   pipe.x,
    right:  pipe.x + pipe.width,
    top:    0,
    bottom: pipe.topHeight
  };
  
  // 아래 파이프: (0, bottomY) ~ (width, canvasHeight)
  const bottomPipe = {
    left:   pipe.x,
    right:  pipe.x + pipe.width,
    top:    pipe.bottomY,
    bottom: canvasHeight
  };

  // AABB 교집합 검사
  if (aabbIntersect(birdBox, topPipe) || aabbIntersect(birdBox, bottomPipe)) {
    return true;  // 충돌!
  }
  
  // 화면 경계 충돌
  if (bird.y <= 0 || bird.y + bird.height >= canvasHeight) {
    return true;
  }
  
  return false;
}

// AABB 교집합 함수
function aabbIntersect(box1, box2) {
  return !(box1.right < box2.left  ||
           box1.left > box2.right  ||
           box1.bottom < box2.top  ||
           box1.top > box2.bottom);
}
```

**초등학생 친화도 조절:**
```javascript
// 마진을 크게 하면 관대 (쉬움)
const margin = 4;  // 4px 여유
const birdBox = {
  left:   bird.x + margin,
  right:  bird.x + bird.width - margin,
  ...
};

// 권장: 2~4px
```

---

#### 4. 파이프 생성 로직

**원조 구현:**
```javascript
class Pipe {
  constructor(canvasHeight) {
    this.x = canvasWidth;
    this.width = 52;
    
    // 통로 높이 위치 랜덤 (상하 여백 확보)
    const minY = 50;
    const maxY = canvasHeight - 120 - 50;  // 120 = gapSize
    this.gapY = minY + Math.random() * (maxY - minY);
    
    this.topHeight = this.gapY;
    this.bottomY = this.gapY + 120;  // gapSize
    this.passed = false;  // 점수 카운트용 플래그
  }

  update() {
    this.x -= 2;  // 이동 속도
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}

// 메인 루프에서
let lastPipeX = canvasWidth;
if (lastPipe.x < canvasWidth - 200) {  // spacing
  pipes.push(new Pipe(canvasHeight));
}
```

**수치 설명:**
```javascript
gapSize: 120         // 통로 높이 (픽셀)
pipeWidth: 52        // 파이프 가로 크기
spacing: 200         // 파이프 간 거리
minTopHeight: 50     // 화면 상단 최소 여백
speed: 2             // px/frame
```

---

#### 5. 점수 카운트 (passed 플래그)

```javascript
function updateScore(bird, pipes) {
  pipes.forEach(pipe => {
    // 새의 중심이 파이프 우측을 지났을 때만 카운트
    if (!pipe.passed && 
        bird.x + bird.width / 2 > pipe.x + pipe.width) {
      pipe.passed = true;
      score++;
      document.getElementById('score').textContent = score;
      Sound.play('point');
    }
  });
}
```

**중요:** `passed` 플래그가 없으면 매 프레임 점수가 증가함!

---

#### 6. 게임 상태 머신

```javascript
const STATE = {
  IDLE:    0,     // 시작 화면 (클릭 대기)
  PLAYING: 1,     // 게임 진행 중
  DEAD:    2      // 충돌 후 (재시작 대기)
};

let state = STATE.IDLE;

function handleInput() {
  switch(state) {
    case STATE.IDLE:
      startGame();
      state = STATE.PLAYING;
      bird.jump();
      break;

    case STATE.PLAYING:
      bird.jump();
      break;

    case STATE.DEAD:
      // 500ms 쿨타임 후 재시작 허용
      if (Date.now() - deathTime > 500) {
        resetGame();
        state = STATE.IDLE;
      }
      break;
  }
}

document.addEventListener('click', handleInput);
```

---

#### 7. 난이도 점진적 상승 (원작 특징)

```javascript
function getDifficultyByScore(score) {
  let config = {
    pipeSpeed: 2,
    gapSize: 120
  };
  
  // 5점마다 속도 +0.2
  config.pipeSpeed = 2 + Math.floor(score / 5) * 0.2;
  
  // 10점마다 통로 -5px
  config.gapSize = Math.max(100, 120 - Math.floor(score / 10) * 5);
  
  return config;
}

// 매 프레임 업데이트
const difficulty = getDifficultyByScore(score);
// pipe.speed와 newGapSize에 적용
```

---

### 인기 팬메이드에서 본 개선 패턴

| 기능 | 구현 방식 | 초등학생 효과 |
|:---|:---|:---|
| **캐릭터 선택** | 3~5가지 이모지 선택 가능 | 맞춤형 게임 느낌 |
| **낮/밤 모드** | 점수마다 배경 전환 | 게임 진행도 시각화 |
| **콤보 시스템** | 연속 통과 시 배수 증가 | 도전 욕구 증대 |
| **파워업** | 무적/슬로우/자동점수 | 좌절감 해소 |
| **효과음** | 4~5가지 소리 조합 | 즉시 피드백 |
| **TOP3 표시** | 신기록 3개 표시 | 반복 플레이 동기 |

---

## 4️⃣ 플래피버드 신규 개발 모듈 설계

### physics.js (신규 작성)

```javascript
const Physics = (() => {
  return {
    // 난이도별 설정값 가져오기
    getConfig(difficulty) {
      return Difficulty.getConfig(difficulty);
    },

    // 새 물리 업데이트
    update(bird, gravity, delta) {
      bird.velocity += gravity;
      bird.y += bird.velocity * delta;
    },

    // 충돌 감지
    checkCollision(bird, pipes, canvasHeight) {
      const birdBox = {
        left:   bird.x + 2,
        right:  bird.x + bird.width - 2,
        top:    bird.y + 2,
        bottom: bird.y + bird.height - 2
      };

      for (let pipe of pipes) {
        // 위 파이프 충돌
        if (birdBox.right > pipe.x && 
            birdBox.left < pipe.x + pipe.width &&
            birdBox.top < pipe.topHeight) {
          return true;
        }

        // 아래 파이프 충돌
        if (birdBox.right > pipe.x && 
            birdBox.left < pipe.x + pipe.width &&
            birdBox.bottom > pipe.bottomY) {
          return true;
        }
      }

      // 화면 경계 충돌
      if (bird.y <= 0 || bird.y + bird.height >= canvasHeight) {
        return true;
      }

      return false;
    }
  };
})();
```

---

### bird.js (신규 작성)

```javascript
const Bird = (() => {
  let bird = {
    x: 50,
    y: 240,
    width: 32,
    height: 32,
    velocity: 0,
    rotation: 0,
    character: 0  // 0=새, 1=고양이, 2=강아지
  };

  const characters = ['🐦', '🐱', '🐶'];
  const jumpSounds = ['wing.mp3', 'wing.mp3', 'wing.mp3'];  // 추후 변경

  return {
    init(characterIndex) {
      bird.character = characterIndex;
      bird.x = 50;
      bird.y = 240;
      bird.velocity = 0;
      bird.rotation = 0;
    },

    jump() {
      const config = Difficulty.getConfig(/* 현재 난이도 */);
      bird.velocity = config.jumpVelocity;
      document.dispatchEvent(new CustomEvent('bird:jumped'));
    },

    update(delta, gravity) {
      Physics.update(bird, gravity, delta);
      
      // 속도에 따라 회전각 조정
      bird.rotation = Math.min(90, bird.velocity * 10);
    },

    draw(ctx) {
      ctx.save();
      ctx.translate(bird.x + bird.width/2, bird.y + bird.height/2);
      ctx.rotate(bird.rotation * Math.PI / 180);
      ctx.font = '32px Arial';
      ctx.fillText(characters[bird.character], -16, 16);
      ctx.restore();
    },

    reset() {
      bird.velocity = 0;
      bird.y = 240;
      bird.rotation = 0;
    },

    getPosition() {
      return { x: bird.x, y: bird.y };
    }
  };
})();
```

---

### pipes.js (신규 작성)

```javascript
const Pipes = (() => {
  let pipes = [];
  let lastPipeX = 0;

  return {
    init(config) {
      pipes = [];
      lastPipeX = 320;  // 캔버스 너비
    },

    update(delta, config) {
      // 파이프 이동
      pipes.forEach(pipe => {
        pipe.x -= config.pipeSpeed * delta;
      });

      // 화면 밖 파이프 제거
      pipes = pipes.filter(pipe => pipe.x + pipe.width > 0);

      // 새 파이프 생성
      if (pipes.length === 0 || 
          pipes[pipes.length - 1].x < 320 - config.pipeSpacing) {
        const minY = 50;
        const maxY = 480 - config.gapSize - 50;
        const gapY = minY + Math.random() * (maxY - minY);
        
        pipes.push({
          x: 320,
          width: 52,
          topHeight: gapY,
          bottomY: gapY + config.gapSize,
          passed: false
        });
      }
    },

    draw(ctx) {
      pipes.forEach(pipe => {
        // 위 파이프
        ctx.fillStyle = '#2D5016';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        
        // 아래 파이프
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 480 - pipe.bottomY);
      });
    },

    checkPassed(bird) {
      let passed = false;
      pipes.forEach(pipe => {
        if (!pipe.passed && 
            bird.x + bird.width / 2 > pipe.x + pipe.width) {
          pipe.passed = true;
          passed = true;
        }
      });
      return passed;
    },

    reset() {
      pipes = [];
    },

    getPipes() {
      return pipes;
    }
  };
})();
```

---

### renderer.js (신규 작성)

```javascript
const Renderer = (() => {
  let canvas, ctx;
  let theme = 'day';

  return {
    init() {
      canvas = document.getElementById('gameCanvas');
      ctx = canvas.getContext('2d');
      canvas.width = 320;
      canvas.height = 480;
    },

    setTheme(newTheme) {
      theme = newTheme;
    },

    render(bird, pipes, score, combo) {
      // 배경
      if (theme === 'day') {
        ctx.fillStyle = '#87CEEB';
      } else {
        ctx.fillStyle = '#1a1a2e';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 파이프 그리기
      Pipes.draw(ctx);

      // 새 그리기
      Bird.draw(ctx);

      // UI 오버레이 (점수, 콤보)
      ctx.fillStyle = 'white';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(score, 20, 50);
      
      if (combo > 1) {
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`콤보: ${combo}x`, 20, 80);
      }
    }
  };
})();
```

---

### game.js (신규 작성, 핵심 모듈)

```javascript
const Game = (() => {
  const STATE = {
    IDLE:    'idle',
    PLAYING: 'playing',
    DEAD:    'dead'
  };

  let state = STATE.IDLE;
  let score = 0;
  let combo = 0;
  let difficulty = 'medium';
  let config = {};
  let rafId = null;
  let lastTime = 0;
  let deathTime = 0;

  function gameLoop(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    if (state === STATE.PLAYING) {
      // 물리 업데이트
      Bird.update(delta, config.gravity);

      // 파이프 업데이트
      Pipes.update(delta, config);

      // 충돌 감지
      if (Physics.checkCollision(Bird.getPosition(), Pipes.getPipes(), 480)) {
        state = STATE.DEAD;
        deathTime = Date.now();
        document.dispatchEvent(new CustomEvent('bird:died'));
        Sound.play('hit');
        return;
      }

      // 점수 카운트
      if (Pipes.checkPassed(Bird.getPosition())) {
        score += combo >= 3 ? Math.floor(1.5) : 1;
        combo++;
        document.dispatchEvent(new CustomEvent('pipe:passed', { 
          detail: { score, combo } 
        }));
        Sound.play('point');
      }

      // 렌더링
      const theme = Math.floor(score / 10) % 2 === 0 ? 'day' : 'night';
      Renderer.setTheme(theme);
      Renderer.render(Bird, Pipes, score, combo);

      rafId = requestAnimationFrame(gameLoop);
    }
  }

  return {
    init(selectedDifficulty) {
      difficulty = selectedDifficulty;
      config = Difficulty.getConfig(difficulty);
      state = STATE.IDLE;
      score = 0;
      combo = 0;
      lastTime = 0;
      
      Bird.init(0);  // 캐릭터 0번
      Pipes.init(config);
      Renderer.init();
    },

    start() {
      state = STATE.PLAYING;
      Bird.jump();
      rafId = requestAnimationFrame(gameLoop);
    },

    reset() {
      cancelAnimationFrame(rafId);
      Bird.reset();
      Pipes.reset();
      lastTime = 0;
      state = STATE.IDLE;
    },

    getState() {
      return { score, combo, state };
    },

    handleInput() {
      if (state === STATE.IDLE) {
        this.start();
      } else if (state === STATE.PLAYING) {
        Bird.jump();
      } else if (state === STATE.DEAD) {
        if (Date.now() - deathTime > 500) {
          this.reset();
          this.init(difficulty);
          UI.showScreen('game');
        }
      }
    }
  };
})();
```

---

## 5️⃣ 개발 시 피해야 할 함정

### 함정 1: delta 없이 고정값으로 물리 계산

```javascript
// ❌ 틀린 방식
bird.y += 2;  // 프레임률에 의존

// ✅ 맞는 방식
bird.y += velocity * (delta / 1000);
```

**영향:** 60fps와 120fps에서 게임 속도 2배 차이 발생

---

### 함정 2: passed 플래그 없이 점수 계산

```javascript
// ❌ 틀린 방식
if (bird.x > pipe.x) {
  score++;  // 매 프레임마다 증가!
}

// ✅ 맞는 방식
if (!pipe.passed && bird.x > pipe.x) {
  pipe.passed = true;
  score++;
}
```

**영향:** 점수가 폭증함

---

### 함정 3: 상태 머신 없이 게임 루프 중지 불가

```javascript
// ❌ 틀린 방식
function gameLoop() {
  if (dead) {
    // 어떻게 멈춤?
  }
  requestAnimationFrame(gameLoop);  // 무한 루프
}

// ✅ 맞는 방식
function gameLoop() {
  if (state === STATE.DEAD) return;  // 조기 종료
  
  // 게임 로직
  
  requestAnimationFrame(gameLoop);
}
```

**영향:** 게임 종료 후에도 물리 계산 계속 → 배터리 낭비

---

### 함정 4: 충돌 감지 주변 비교 순서

```javascript
// ❌ 순서 잘못됨
return !(left > right || right < left);  // 모순

// ✅ 올바른 순서
return !(box1.right < box2.left  ||
         box1.left > box2.right  ||
         box1.bottom < box2.top  ||
         box1.top > box2.bottom);
```

**영향:** 파이프가 새를 뚫고 지남

---

### 함정 5: Canvas 드로잉 전 clearRect 필수

```javascript
// ❌ clearRect 없음
ctx.fillRect(bird.x, bird.y, 32, 32);  // 궤적이 남음

// ✅ clearRect 있음
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.fillRect(bird.x, bird.y, 32, 32);
```

**영향:** 화면에 새의 궤적이 남음 (유령 이미지)

---

### 함정 6: 첫 requestAnimationFrame 호출 전 lastTime 초기화

```javascript
// ❌ 잘못됨
let lastTime = 0;
function gameLoop(timestamp) {
  const delta = timestamp - 0;  // 엄청 큰 값!
}

// ✅ 올바름
let lastTime = 0;
function gameLoop(timestamp) {
  if (lastTime === 0) lastTime = timestamp;
  const delta = timestamp - lastTime;
  lastTime = timestamp;
}
```

**영향:** 첫 프레임에서 새가 엄청 빨리 떨어짐

---

### 함정 7: 낮/밤 모드 전환 시점

```javascript
// ❌ 매 프레임마다 체크 (성능 저하)
if (Math.floor(score / 10) % 2 === 0) {
  document.documentElement.setAttribute('data-theme', 'day');
} else {
  document.documentElement.setAttribute('data-theme', 'night');
}

// ✅ 점수 변경 시만 체크
function updateScore(value) {
  const newTheme = Math.floor(value / 10) % 2 === 0 ? 'day' : 'night';
  if (newTheme !== currentTheme) {
    currentTheme = newTheme;
    Renderer.setTheme(newTheme);
  }
}
```

**영향:** 불필요한 DOM 업데이트로 성능 저하

---

### 함정 8: 이벤트 리스너 중복 등록

```javascript
// ❌ 매번 등록
function startGame() {
  document.addEventListener('click', handleClick);  // 중복!
}

// ✅ 한 번만 등록
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleClick);
});
```

**영향:** 클릭 1회에 여러 번 반응

---

### 함정 9: 콤보 리셋 타이밍

```javascript
// ❌ 잘못된 리셋
if (collision) {
  combo = 0;
  score += 1;  // 콤보 0이 되고 나서도 점수 증가
}

// ✅ 올바른 리셋
if (collision) {
  combo = 0;
  score = 0;  // 또는 지정된 규칙에 따라
}
```

**영향:** 콤보 의도와 다른 게임플레이

---

### 함정 10: 사운드 autoplay 정책 무시

```javascript
// ❌ 무조건 재생 시도
Sound.play('wing');

// ✅ 첫 클릭 후 재생
document.addEventListener('click', () => {
  // 이 시점 이후로는 자동재생 가능
  Sound.play('wing');
});
```

**영향:** 모바일에서 사운드 안 나옴

---

## 6️⃣ 개발자를 위한 체크리스트

### 개발 전 (코드 작성 전)

- [ ] 냥냥 메모리 코드 읽기 (최소 1시간)
  - [ ] storage.js 이해
  - [ ] sound.js 이해
  - [ ] ui.js의 showScreen 패턴 이해
- [ ] 플래피버드 물리 수치 스프레드시트 다운로드
  - 링크: (만들어질 예정)
- [ ] Canvas API 기초 문서 읽기
  - clearRect, fillRect, save/restore, translate, rotate
- [ ] 테스트 계획 수립

### 개발 중 (Day 1 종료 시)

- [ ] 기본 플레이 가능 (점프 + 파이프 충돌)
- [ ] 60fps 유지 확인 (Chrome DevTools)
- [ ] 점수 카운트 정상
- [ ] 콘솔 에러 없음

### 개발 후 (배포 전)

- [ ] 모든 난이도 테스트
- [ ] 모바일 터치 테스트 (iOS + Android)
- [ ] 사운드 autoplay 테스트
- [ ] LocalStorage 저장 확인
- [ ] 반응형 테스트 (4개 브레이크포인트)
- [ ] 캐릭터 3종 이모지 확인
- [ ] 낮/밤 모드 전환 확인

---

## 7️⃣ 추가 리소스 및 참고자료

### Canvas 학습 자료
- MDN Web Docs: Canvas API
- 링크: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

### 물리 엔진 검증
```javascript
// 단위 확인용 스크립트
const gravity = 0.25;
const jumpVelocity = -4.6;
let velocity = jumpVelocity;

console.log('= 점프 궤적 (프레임 단위) =');
for (let i = 0; i < 20; i++) {
  velocity += gravity;
  console.log(`Frame ${i}: velocity = ${velocity.toFixed(2)}`);
}
// 예상: velocity가 0을 지나서 양수가 되고, maxFallSpeed에 수렴
```

### 콤보 시스템 로직 (선택)
```javascript
// 간단한 콤보: 연속 통과 시 배수
combo++;
score += combo >= 3 ? Math.floor(1 * 1.5) : 1;

// 복잡한 콤보: 연속 통과마다 증가
score += 1 * Math.pow(1.1, combo - 1);  // 지수 증가
```

---

## 8️⃣ 최종 체크: 개발 완료 기준

### 필수 기능
- [ ] 게임 시작/진행/종료 3개 화면
- [ ] 캐릭터 선택 (3종)
- [ ] 난이도 선택 (3단계)
- [ ] 점수 표시
- [ ] 최고 기록 저장 및 표시
- [ ] 충돌 감지 (관대한 히트박스)
- [ ] 사운드 (4개 효과음)
- [ ] 반응형 (mobile 최적화)

### 선택 기능 (우선순위)
- [ ] 콤보 시스템 (높음)
- [ ] 낮/밤 모드 전환 (중간)
- [ ] 격려 메시지 (중간)
- [ ] TOP3 점수 표시 (낮음)
- [ ] 컨페티 효과 신기록 시 (낮음)

### 성능/안정성
- [ ] 60fps 유지 (Dev Tools 확인)
- [ ] 콘솔 에러 0개
- [ ] 메모리 누수 없음 (장시간 플레이)
- [ ] 모바일 배터리 영향 최소화

---

이 문서를 다 읽었다면 플래피버드 개발 준비가 완료되었습니다.
질문이 있거나 막히는 부분이 있으면 즉시 문의해주세요!
