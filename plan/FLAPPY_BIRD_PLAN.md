# 🐦 플래피버드 개발 계획 (Fresh Start)

> **목표**: 초등학생 대상 플래피버드 웹게임  
> **개발 기간**: 1~2일  
> **아키텍처**: 순수 Vanilla JS (프레임워크 없음)  
> **배포**: GitHub Pages

---

## 📋 프로젝트 구조

```
flappy-bird/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── game.js         # 메인 게임 로직
│   ├── renderer.js     # Canvas 렌더링
│   └── ui.js           # 화면 전환
├── assets/
│   ├── sounds/         # 효과음 (선택)
│   └── fonts/          # (필요시)
├── plan/               # 이 폴더
└── README.md
```

---

## 🎯 핵심 기능

### 필수 기능
- [ ] 게임 시작/진행/게임오버 3개 화면
- [ ] 새 조종 (클릭/터치/스페이스바)
- [ ] 파이프 생성 및 충돌 감지
- [ ] 점수 표시
- [ ] 최고 기록 저장/표시
- [ ] 반응형 (모바일 최적화)

### 선택 기능 (우선순위)
- [ ] 캐릭터 선택 (🐦 🐱 🐶)
- [ ] 난이도 선택 (쉬움/보통/어려움)
- [ ] 사운드 (점프/통과/충돌/배경음)
- [ ] 낮/밤 모드 전환
- [ ] 격려 메시지 (초등학생 친화)
- [ ] TOP3 점수 표시

---

## 🏗️ 기술 상세

### 1. HTML 구조 (3개 화면)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>플래피버드 🐦</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    
    <!-- 시작 화면 -->
    <section id="start-screen" class="screen active">
      <h1>🐦 플래피버드</h1>
      <p class="subtitle">파이프를 피해 높이 날아올라!</p>
      
      <!-- 캐릭터 선택 (선택) -->
      <div class="character-select" id="characterSelect">
        <p>캐릭터 선택:</p>
        <button class="char-btn" data-char="0">🐦</button>
        <button class="char-btn" data-char="1">🐱</button>
        <button class="char-btn" data-char="2">🐶</button>
      </div>
      
      <!-- 난이도 선택 (선택) -->
      <div class="difficulty-select" id="difficultySelect">
        <p>난이도 선택:</p>
        <button class="diff-btn" data-difficulty="easy">🟢 쉬움</button>
        <button class="diff-btn" data-difficulty="medium" data-selected>🟡 보통</button>
        <button class="diff-btn" data-difficulty="hard">🔴 어려움</button>
      </div>
      
      <button id="start-btn" class="primary-btn">게임 시작!</button>
      
      <!-- 최고 기록 표시 -->
      <div class="best-score-info">
        <p id="best-score-text">최고 기록: 0점</p>
      </div>
    </section>

    <!-- 게임 화면 -->
    <section id="game-screen" class="screen">
      <div class="game-header">
        <div class="score-display">
          <span>점수:</span>
          <span id="score">0</span>
        </div>
      </div>
      
      <canvas id="gameCanvas" width="320" height="480"></canvas>
      
      <button id="restart-btn" class="secondary-btn">다시하기</button>
    </section>

    <!-- 게임오버 화면 -->
    <section id="gameover-screen" class="screen">
      <h2>🎮 게임 종료!</h2>
      <p id="gameover-message">화이팅!</p>
      
      <div class="score-display-large">
        <p>최종 점수</p>
        <p id="final-score" class="big-number">0</p>
      </div>
      
      <div class="best-score-display">
        <p>최고 기록</p>
        <p id="best-score-display" class="big-number">0</p>
      </div>
      
      <!-- TOP3 (선택) -->
      <div id="top3" class="top3-list">
        <p>TOP 3:</p>
        <ol id="top3-list"></ol>
      </div>
      
      <button id="play-again-btn" class="primary-btn">한 번 더!</button>
      <button id="home-btn" class="secondary-btn">홈으로</button>
    </section>

  </div>

  <script src="js/renderer.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/game.js"></script>
</body>
</html>
```

---

### 2. CSS - 반응형 + 초등학생 친화

```css
/* 색상 토큰 (냥냥메모리 스타일) */
:root {
  --primary: #D8889F;      /* 핑크 */
  --secondary: #F5A9C1;    /* 연핑크 */
  --background: #F5F0E8;   /* 베이지 */
  --success: #9BBE8F;      /* 초록 */
  --text: #333333;         /* 어두운회색 */
  --sky-day: #87CEEB;      /* 하늘색 (낮) */
  --sky-night: #1a1a2e;    /* 짙은파랑 (밤) */
}

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Comic Sans MS', 'Malgun Gothic', sans-serif;
  background-color: var(--background);
  color: var(--text);
}

/* 반응형 컨테이너 */
#app {
  width: 100%;
  max-width: clamp(280px, 95vw, 800px);
  margin: 0 auto;
  padding: clamp(10px, 3vw, 20px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* 화면 (screen) */
.screen {
  width: 100%;
  display: none;
  flex-direction: column;
  align-items: center;
  gap: clamp(15px, 5vw, 30px);
  animation: fadeIn 0.3s ease-in;
}

.screen.active {
  display: flex;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 제목 */
h1 {
  font-size: clamp(32px, 10vw, 56px);
  color: var(--primary);
  text-align: center;
  margin-bottom: 10px;
}

h2 {
  font-size: clamp(28px, 8vw, 48px);
  color: var(--primary);
}

.subtitle {
  font-size: clamp(16px, 5vw, 20px);
  color: var(--text);
  text-align: center;
}

/* 버튼 기본 스타일 */
button {
  border: none;
  border-radius: 12px;
  font-size: clamp(16px, 4vw, 20px);
  font-family: inherit;
  font-weight: bold;
  padding: clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

button:active {
  transform: scale(0.95);
}

/* 주 버튼 */
.primary-btn {
  background-color: var(--primary);
  color: white;
  width: 100%;
  max-width: 300px;
}

.primary-btn:hover {
  background-color: #c7778f;
}

/* 보조 버튼 */
.secondary-btn {
  background-color: var(--secondary);
  color: var(--text);
  width: 100%;
  max-width: 300px;
}

.secondary-btn:hover {
  background-color: #f09aaa;
}

/* 캐릭터 선택 */
.character-select, .difficulty-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.character-select p, .difficulty-select p {
  font-size: clamp(16px, 4vw, 18px);
  font-weight: bold;
}

.char-btn, .diff-btn {
  width: 60px;
  height: 60px;
  padding: 0;
  font-size: 32px;
  border: 3px solid transparent;
  background-color: white;
  margin: 0 8px;
  display: inline-block;
  border-radius: 12px;
  transition: all 0.2s;
}

.char-btn[data-selected], .diff-btn[data-selected] {
  border-color: var(--primary);
  background-color: var(--secondary);
}

.char-btn:hover, .diff-btn:hover {
  border-color: var(--primary);
  transform: scale(1.05);
}

/* Canvas 게임판 */
canvas {
  display: block;
  border: 4px solid var(--primary);
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 320 / 480;
  background: var(--sky-day);
  margin: clamp(15px, 5vw, 30px) 0;
}

/* 게임 헤더 */
.game-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(10px, 3vw, 20px);
}

.score-display {
  font-size: clamp(20px, 6vw, 28px);
  font-weight: bold;
  color: var(--primary);
}

.score-display span:last-child {
  font-size: clamp(24px, 8vw, 36px);
  margin-left: 10px;
}

/* 큰 점수 표시 */
.score-display-large {
  text-align: center;
}

.score-display-large p:first-child {
  font-size: clamp(18px, 5vw, 24px);
  margin-bottom: 10px;
}

.big-number {
  font-size: clamp(40px, 12vw, 64px) !important;
  color: var(--primary);
  font-weight: bold;
  line-height: 1.2;
}

/* TOP3 목록 */
.top3-list {
  width: 100%;
  max-width: 300px;
  text-align: center;
  margin: 20px 0;
}

.top3-list ol {
  list-style: none;
  font-size: clamp(16px, 4vw, 20px);
  padding: 10px 0;
}

.top3-list li {
  padding: 8px;
  margin: 4px 0;
  background: white;
  border-radius: 8px;
}

/* 최고 기록 */
.best-score-info, .best-score-display {
  font-size: clamp(16px, 4vw, 20px);
  color: var(--success);
  font-weight: bold;
}

/* 미디어 쿼리 (초소형 화면) */
@media (max-width: 374px) {
  #app {
    padding: 10px;
  }
  
  button {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  canvas {
    border: 2px solid var(--primary);
  }
}

/* 갤럭시 버즈 크기 대응 */
@media (max-height: 400px) {
  .screen {
    gap: 10px;
  }
  
  button {
    padding: 8px 12px;
    font-size: 14px;
  }
}
```

---

### 3. 게임 로직 (game.js)

**핵심 물리 수식:**
```javascript
// 중력 계산
bird.velocity += gravity;
bird.y += bird.velocity;

// 점프
bird.velocity = jumpVelocity;  // 음수값으로 순간 위로 이동

// AABB 충돌
function isColliding(bird, pipe) {
  return !(bird.right < pipe.left ||
           bird.left > pipe.right ||
           bird.bottom < pipe.top ||
           bird.top > pipe.bottom);
}
```

**상태 머신:**
```
START → (클릭) → PLAYING → (충돌) → GAMEOVER → (클릭) → START
```

**난이도별 파라미터:**
| 난이도 | 중력 | 점프력 | 파이프 속도 | 통로크기 |
|:---:|:---:|:---:|:---:|:---:|
| 쉬움 | 0.18 | -5.5 | 1.5 | 160px |
| 보통 | 0.22 | -5.0 | 2.0 | 130px |
| 어려움 | 0.25 | -4.6 | 2.5 | 100px |

---

## 📱 초등학생 친화 UX

### 1. 친근한 언어
- "게임 종료!" → "화이팅!" (격려)
- "한 번 더!" (반복 유도)
- "파이프를 피해 높이 날아올라!" (명확한 목표)

### 2. 큰 폰트 + 명확한 색상
- 기본 폰트: Comic Sans MS (장난스러운 느낌)
- 색상: 핑크/초록 (밝고 따뜻함)
- 버튼: 크고 누르기 쉬운 크기

### 3. 즉시 피드백
- 버튼 누름 효과 (scale 0.95)
- 점수 실시간 업데이트
- 최고 기록 표시

### 4. 격려 메시지 시스템
```javascript
const messages = {
  good: ['좋아!', '잘하고 있어!', '멋진데!'],
  great: ['완벽해!', '대단해!', '최고야!'],
  close: ['거의 다 왔어!', '한 번 더 해봐!'],
  gameover: ['화이팅!', '다시 도전!', '한 번 더!']
};

// 점수에 따라 랜덤 메시지 선택
function getEncouragingMessage(score) {
  if (score > 50) return random(messages.great);
  if (score > 20) return random(messages.good);
  return random(messages.gameover);
}
```

---

## 🚀 개발 순서 (Day 1)

### Phase 1: 기본 구조 (2시간)
- [ ] index.html 작성 (3개 화면)
- [ ] style.css 작성 (반응형)
- [ ] renderer.js (Canvas 초기화)
- [ ] ui.js (화면 전환)

### Phase 2: 게임 로직 (2시간)
- [ ] game.js (상태 머신)
- [ ] 물리 계산 (중력 + 점프)
- [ ] 파이프 생성/충돌
- [ ] 점수 계산

### Phase 3: 고급 기능 (1시간)
- [ ] 캐릭터/난이도 선택
- [ ] 최고 기록 저장 (localStorage)
- [ ] 사운드 (선택)

### Phase 4: 테스트 + 배포 (1시간)
- [ ] 모바일 테스트
- [ ] 충돌 감지 보정
- [ ] GitHub Pages 배포

---

## 🧪 테스트 체크리스트

### 플레이 테스트
- [ ] 점프 반응성 (즉시 반응하는가?)
- [ ] 파이프 충돌 감지 (관대한가? 너무 엄격한가?)
- [ ] 점수 카운트 (중복 없는가?)

### 모바일 테스트
- [ ] 터치 반응 (클릭 vs 터치)
- [ ] 캔버스 크기 (화면에 맞는가?)
- [ ] 버튼 누르기 쉬운가?

### 브라우저 호환성
- [ ] Chrome ✅
- [ ] Safari ✅
- [ ] Edge ✅
- [ ] Firefox ✅

---

## 📦 GitHub Pages 배포

1. **레포 확인**
   ```bash
   git remote -v
   ```

2. **gh-pages 브랜치 생성**
   ```bash
   git checkout -b gh-pages
   git push -u origin gh-pages
   ```

3. **Settings → Pages → Deploy from branch gh-pages**

4. **URL: `https://iwanjin.github.io/test5-flappy-bird/`**

---

## 📝 다음 단계

1. index.html 작성
2. style.css 작성
3. renderer.js 작성
4. ui.js 작성
5. game.js 작성
6. 테스트 및 배포

준비가 되셨나요? 어디부터 시작하시겠어요?
