# 🅱️ Team B - UI/렌더링팀 (얼굴 역할)

> **담당**: HTML 구조, CSS 스타일, 화면 전환, 사용자 인터랙션  
> **파일**: `index.html`, `css/style.css`, `js/ui.js`  
> **목표**: Day 1 16:00까지 기본 UI + 화면 전환 완성

---

## 📋 Team B의 책임

```
🎨 UI 디자인
   ├─ 3개 화면 HTML 구조
   ├─ 초등학생 친화 색상/폰트
   └─ 반응형 레이아웃 (모바일 최적화)

🖱️ 사용자 인터랙션
   ├─ 버튼 클릭 이벤트
   ├─ 캐릭터/난이도 선택
   └─ 화면 전환 애니메이션

📱 반응형
   ├─ 초소형 (280px)
   ├─ 모바일 (375px)
   ├─ 태블릿 (800px)
   └─ 데스크톱 (1200px)

🎬 화면 전환
   ├─ 시작 화면 ↔ 게임 화면
   ├─ 게임 화면 ↔ 게임오버 화면
   └─ 부드러운 애니메이션
```

---

## 🔧 Phase 1: HTML/CSS 작성 (09:30 ~ 12:00)

### 목표
- index.html에 3개 화면 구조
- style.css에 기본 스타일 + 반응형
- UI.js에 화면 전환 함수

### 파일: `index.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#F5F0E8">
  
  <title>플래피버드 🐦</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🐦</text></svg>">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="app">
    
    <!-- ===== 화면 1: 시작 화면 ===== -->
    <section id="start-screen" class="screen active">
      <div class="screen-content">
        <h1 class="game-title">🐦 플래피버드</h1>
        <p class="subtitle">파이프를 피해 높이 날아올라!</p>
        
        <!-- 캐릭터 선택 -->
        <div class="select-group">
          <p class="select-label">캐릭터 선택:</p>
          <div class="character-select" id="characterSelect">
            <button class="char-btn" data-char="0" data-selected>🐦</button>
            <button class="char-btn" data-char="1">🐱</button>
            <button class="char-btn" data-char="2">🐶</button>
          </div>
        </div>
        
        <!-- 난이도 선택 -->
        <div class="select-group">
          <p class="select-label">난이도 선택:</p>
          <div class="difficulty-select" id="difficultySelect">
            <button class="diff-btn" data-difficulty="easy">🟢 쉬움</button>
            <button class="diff-btn" data-difficulty="medium" data-selected>🟡 보통</button>
            <button class="diff-btn" data-difficulty="hard">🔴 어려움</button>
          </div>
        </div>
        
        <!-- 시작 버튼 -->
        <button id="start-btn" class="btn btn-primary btn-large">
          게임 시작! 🚀
        </button>
        
        <!-- 최고 기록 표시 -->
        <div class="best-score-banner">
          <p class="best-score-label">최고 기록</p>
          <p id="best-score-start" class="best-score-value">0점</p>
        </div>
        
        <!-- 게임 설명 (선택) -->
        <p class="hint-text">⬆️ 클릭이나 스페이스바를 눌러 새를 위로 올리세요!</p>
      </div>
    </section>

    <!-- ===== 화면 2: 게임 화면 ===== -->
    <section id="game-screen" class="screen">
      <div class="game-header">
        <div class="score-info">
          <span class="score-label">점수</span>
          <span id="score" class="score-value">0</span>
        </div>
        <button id="pause-btn" class="btn btn-mini" title="일시 정지">⏸</button>
      </div>
      
      <canvas id="gameCanvas" width="320" height="480"></canvas>
      
      <div class="game-footer">
        <button id="restart-btn" class="btn btn-secondary">다시하기</button>
      </div>
    </section>

    <!-- ===== 화면 3: 게임오버 화면 ===== -->
    <section id="gameover-screen" class="screen">
      <div class="screen-content">
        <h2 class="gameover-title">🎮 게임 종료!</h2>
        
        <!-- 격려 메시지 -->
        <p id="encouragement-msg" class="encouragement">화이팅! 🎉</p>
        
        <!-- 점수 표시 -->
        <div class="score-display">
          <p class="score-label-large">최종 점수</p>
          <p id="final-score" class="score-value-large">0</p>
        </div>
        
        <!-- 최고 기록 (신기록일 때 강조) -->
        <div class="best-score-display">
          <p class="best-label">최고 기록</p>
          <p id="best-score-gameover" class="best-value">0</p>
          <p id="new-record-badge" class="new-record hidden">🏆 신기록!</p>
        </div>
        
        <!-- TOP3 점수 (선택) -->
        <div id="top3-section" class="top3-section">
          <p class="top3-label">TOP 3</p>
          <ol id="top3-list" class="top3-list">
            <li class="top3-item">-</li>
            <li class="top3-item">-</li>
            <li class="top3-item">-</li>
          </ol>
        </div>
        
        <!-- 버튼들 -->
        <div class="gameover-buttons">
          <button id="play-again-btn" class="btn btn-primary">한 번 더! 🔄</button>
          <button id="home-btn" class="btn btn-secondary">홈으로</button>
        </div>
        
        <!-- 팁 -->
        <p class="hint-text small">더 높은 점수를 도전해보세요!</p>
      </div>
    </section>

  </div>

  <!-- 스크립트 (순서 중요!) -->
  <script src="js/storage.js"></script>    <!-- ✅ 추가 (sound.js보다 반드시 먼저) -->
  <script src="js/sound.js"></script>      <!-- ✅ 추가 -->
  <script src="js/renderer.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/game.js"></script>
  <script src="js/confetti.js"></script>   <!-- ✅ 추가 -->
</body>
</html>
```

### 파일: `css/style.css` (Phase 1)

```css
/* ============ 색상 토큰 ============ */
:root {
  --primary: #D8889F;           /* 핑크 (주색상) */
  --secondary: #F5A9C1;         /* 연핑크 (보조) */
  --background: #F5F0E8;        /* 베이지 (배경) */
  --success: #9BBE8F;           /* 초록 (성공) */
  --text: #333333;              /* 텍스트 */
  --text-light: #666666;        /* 연한 텍스트 */
  --border: #E8D8D0;            /* 테두리 */
  
  --sky-day: #87CEEB;           /* 낮 하늘 */
  --sky-night: #1a1a2e;         /* 밤 하늘 */
  --pipe-day: #2D5016;          /* 낮 파이프 */
  --pipe-night: #4a7c59;        /* 밤 파이프 */
}

/* ============ 리셋 ============ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: 'Comic Sans MS', 'Malgun Gothic', '-apple-system', sans-serif;
  background-color: var(--background);
  color: var(--text);
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* ============ 메인 컨테이너 ============ */
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
  gap: clamp(20px, 5vw, 40px);
}

/* ============ 화면 (screens) ============ */
.screen {
  width: 100%;
  display: none;
  flex-direction: column;
  align-items: center;
  animation: slideInUp 0.3s ease-out;
  animation-fill-mode: both;
}

.screen.active {
  display: flex;
}

.screen.hidden {
  display: none !important;
}

.screen-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(15px, 4vw, 30px);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 제목 ============ */
h1, h2 {
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
}

.game-title {
  font-size: clamp(36px, 12vw, 64px);
  color: var(--primary);
  margin-bottom: clamp(5px, 2vw, 10px);
}

.gameover-title {
  font-size: clamp(28px, 10vw, 48px);
  color: var(--primary);
}

.subtitle {
  font-size: clamp(14px, 4vw, 18px);
  color: var(--text-light);
  text-align: center;
  max-width: 350px;
}

/* ============ 버튼 기본 ============ */
button {
  border: none;
  border-radius: 12px;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease;
  outline: none;
}

button:active {
  transform: scale(0.95);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 버튼 크기 */
.btn-large {
  padding: clamp(14px, 3vw, 18px) clamp(28px, 8vw, 40px);
  font-size: clamp(16px, 4.5vw, 20px);
}

.btn-mini {
  padding: 8px 12px;
  font-size: 16px;
}

/* 버튼 색상 */
.btn {
  width: 100%;
  max-width: 320px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: #c7778f;
  box-shadow: 0 4px 12px rgba(216, 136, 159, 0.3);
}

.btn-secondary {
  background-color: var(--secondary);
  color: var(--text);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background-color: #f09aaa;
  box-shadow: 0 2px 8px rgba(216, 136, 159, 0.2);
}

/* ============ 선택 컴포넌트 ============ */
.select-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 2vw, 12px);
}

.select-label {
  font-size: clamp(14px, 4vw, 16px);
  font-weight: bold;
  color: var(--text);
}

.character-select,
.difficulty-select {
  display: flex;
  gap: clamp(8px, 3vw, 16px);
  justify-content: center;
  flex-wrap: wrap;
}

.char-btn,
.diff-btn {
  width: clamp(50px, 15vw, 70px);
  height: clamp(50px, 15vw, 70px);
  padding: 0;
  font-size: clamp(24px, 8vw, 36px);
  background-color: white;
  border: 3px solid transparent;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.char-btn[data-selected],
.diff-btn[data-selected] {
  border-color: var(--primary);
  background-color: var(--secondary);
  box-shadow: 0 4px 12px rgba(216, 136, 159, 0.2);
}

.char-btn:hover,
.diff-btn:hover {
  border-color: var(--primary);
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(216, 136, 159, 0.25);
}

.char-btn:active,
.diff-btn:active {
  transform: scale(0.95);
}

/* ============ 점수 표시 ============ */
.score-banner {
  text-align: center;
  padding: clamp(12px, 3vw, 16px);
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  border: 2px solid var(--border);
}

.best-score-banner {
  text-align: center;
  padding: clamp(12px, 3vw, 16px);
  background-color: rgba(155, 190, 143, 0.15);
  border-radius: 12px;
  border: 2px solid var(--success);
  margin-top: clamp(10px, 2vw, 20px);
}

.best-score-label {
  font-size: clamp(12px, 3vw, 14px);
  color: var(--success);
  font-weight: bold;
  margin-bottom: 4px;
}

.best-score-value {
  font-size: clamp(24px, 7vw, 32px);
  color: var(--success);
  font-weight: bold;
}

/* ============ 게임 화면 ============ */
.game-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(10px, 2vw, 15px) 0;
  gap: 10px;
}

.score-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score-label {
  font-size: clamp(12px, 3vw, 14px);
  color: var(--text-light);
  font-weight: bold;
}

.score-value {
  font-size: clamp(28px, 8vw, 40px);
  color: var(--primary);
  font-weight: bold;
  font-family: 'Arial', monospace;
}

/* Canvas */
canvas {
  display: block;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 320 / 480;
  border: 4px solid var(--primary);
  border-radius: 8px;
  background-color: var(--sky-day);
  image-rendering: crisp-edges;
  margin: clamp(10px, 3vw, 20px) 0;
}

.game-footer {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* ============ 게임오버 화면 ============ */
.encouragement {
  font-size: clamp(18px, 5vw, 24px);
  color: var(--success);
  font-weight: bold;
  text-align: center;
  min-height: 30px;
}

.score-display {
  text-align: center;
  padding: clamp(20px, 4vw, 30px);
  background: linear-gradient(135deg, rgba(216, 136, 159, 0.1), rgba(155, 190, 143, 0.1));
  border-radius: 16px;
  border: 2px solid var(--border);
  width: 100%;
  max-width: 320px;
}

.score-label-large {
  font-size: clamp(14px, 4vw, 16px);
  color: var(--text-light);
  font-weight: bold;
  margin-bottom: 8px;
}

.score-value-large {
  font-size: clamp(48px, 14vw, 72px);
  color: var(--primary);
  font-weight: bold;
  font-family: 'Arial', monospace;
  line-height: 1.2;
}

.best-score-display {
  text-align: center;
  padding: clamp(16px, 3vw, 20px);
  background-color: rgba(155, 190, 143, 0.15);
  border-radius: 12px;
  border: 2px dashed var(--success);
  width: 100%;
  max-width: 320px;
  position: relative;
}

.best-label {
  font-size: clamp(12px, 3vw, 14px);
  color: var(--success);
  font-weight: bold;
  margin-bottom: 4px;
}

.best-value {
  font-size: clamp(32px, 10vw, 48px);
  color: var(--success);
  font-weight: bold;
  font-family: 'Arial', monospace;
}

.new-record {
  font-size: clamp(14px, 4vw, 18px);
  color: #FFD700;
  font-weight: bold;
  animation: bounce 0.6s ease;
  margin-top: 8px;
}

.new-record.hidden {
  display: none;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* ============ TOP3 목록 ============ */
.top3-section {
  width: 100%;
  max-width: 320px;
  text-align: center;
}

.top3-label {
  font-size: clamp(14px, 4vw, 16px);
  color: var(--text);
  font-weight: bold;
  margin-bottom: 8px;
}

.top3-list {
  list-style: decimal;
  list-style-position: inside;
  padding: clamp(12px, 3vw, 16px);
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.top3-item {
  padding: 6px 0;
  font-size: clamp(14px, 3.5vw, 16px);
  color: var(--text);
  font-weight: 500;
}

/* ============ 게임오버 버튼 그룹 ============ */
.gameover-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 15px);
  margin-top: clamp(15px, 3vw, 25px);
}

.gameover-buttons button {
  width: 100%;
}

/* ============ 힌트 텍스트 ============ */
.hint-text {
  font-size: clamp(12px, 3vw, 14px);
  color: var(--text-light);
  text-align: center;
  margin-top: clamp(10px, 2vw, 15px);
  max-width: 350px;
  line-height: 1.4;
}

.hint-text.small {
  font-size: clamp(11px, 2.5vw, 12px);
  margin-top: 5px;
}

/* ============ 미디어 쿼리 ============ */

/* 초소형 화면 (280px-374px) */
@media (max-width: 374px) {
  #app {
    padding: 10px;
    gap: 15px;
  }

  .game-title {
    font-size: 32px;
  }

  .btn-large {
    padding: 12px 20px;
    font-size: 14px;
  }

  canvas {
    border: 2px solid var(--primary);
  }

  .score-value-large {
    font-size: 42px;
  }
}

/* 가로 모드 (높이 제한) */
@media (max-height: 500px) {
  #app {
    gap: 10px;
  }

  .game-title {
    margin-bottom: 5px;
  }

  canvas {
    margin: 8px 0;
  }

  .gameover-buttons {
    gap: 8px;
  }
}

/* 태블릿 (800px+) */
@media (min-width: 801px) {
  canvas {
    max-width: 400px;
  }

  .btn {
    max-width: 350px;
  }
}
```

---

## 🔧 Phase 2: UI 상호작용 (13:00 ~ 16:00)

### 파일: `js/ui.js`

```javascript
const UI = (() => {
  // ============ Private 상태 ============
  let selectedCharacter = 0;
  let selectedDifficulty = 'medium';
  let currentScreen = 'start';

  // ============ Private 함수 ============

  /**
   * 화면 전환
   */
  function switchScreen(screenName) {
    if (currentScreen === screenName) return;

    // 모든 화면 숨기기
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // 새 화면 표시
    const newScreen = document.getElementById(`${screenName}-screen`);
    if (newScreen) {
      newScreen.classList.add('active');
      currentScreen = screenName;
    }
  }

  /**
   * 캐릭터 버튼 업데이트 (선택 상태)
   */
  function updateCharacterButtons(selected) {
    document.querySelectorAll('.char-btn').forEach(btn => {
      const char = parseInt(btn.dataset.char);
      if (char === selected) {
        btn.setAttribute('data-selected', '');
      } else {
        btn.removeAttribute('data-selected');
      }
    });
  }

  /**
   * 난이도 버튼 업데이트 (선택 상태)
   */
  function updateDifficultyButtons(selected) {
    document.querySelectorAll('.diff-btn').forEach(btn => {
      const diff = btn.dataset.difficulty;
      if (diff === selected) {
        btn.setAttribute('data-selected', '');
      } else {
        btn.removeAttribute('data-selected');
      }
    });
  }

  /**
   * 격려 메시지 선택
   */
  function getEncouragingMessage(score) {
    const messages = {
      great: ['완벽해! 🌟', '대단해! 💫', '최고야! ✨', '멋진데! 🎯'],
      good: ['좋아! 👍', '잘하고 있어! 💪', '계속해! 🔥'],
      close: ['거의 다 왔어! 📈', '한 번 더 해봐! 🎮'],
      tryagain: ['화이팅! 💪', '다시 도전! 🚀', '또 해봐! ⚡']
    };

    let category = 'tryagain';
    if (score > 50) category = 'great';
    else if (score > 20) category = 'good';
    else if (score > 0) category = 'close';

    const list = messages[category];
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * 이벤트 리스너 등록 (초기화 시 한 번만)
   */
  function attachEventListeners() {
    // ===== 시작 화면 =====

    // 캐릭터 선택
    document.querySelectorAll('.char-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedCharacter = parseInt(e.target.dataset.char);
        updateCharacterButtons(selectedCharacter);
      });
    });

    // 난이도 선택
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedDifficulty = e.target.dataset.difficulty;
        updateDifficultyButtons(selectedDifficulty);
      });
    });

    // 게임 시작 버튼
    document.getElementById('start-btn')?.addEventListener('click', () => {
      Game.init(selectedDifficulty, selectedCharacter);
      switchScreen('game');
      Game.start();
    });

    // ===== 게임 화면 =====

    // 다시하기 버튼
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      switchScreen('start');
      Game.reset();
    });

    // 일시정지 버튼 (선택)
    // document.getElementById('pause-btn')?.addEventListener('click', () => {
    //   Game.pause();
    // });

    // ===== 게임오버 화면 =====

    // 한 번 더 버튼  ✅ 호출 순서 통일
    document.getElementById('play-again-btn')?.addEventListener('click', () => {
      Game.init(selectedDifficulty, selectedCharacter);
      UI.showScreen('game');
      Game.start();
    });

    // 홈으로 버튼
    document.getElementById('home-btn')?.addEventListener('click', () => {
      switchScreen('start');
      Game.reset();
    });

    // ===== 게임 이벤트 리스너 =====

    // 게임에서 발행한 이벤트 수신
    document.addEventListener('pipe:passed', (e) => {
      UI.updateScore(e.detail.score);
    });

    document.addEventListener('game:over', (e) => {
      handleGameOver(e.detail);
    });
  }

  /**
   * 게임 종료 처리
   */
  function handleGameOver(detail) {
    const { score, character } = detail;

    // ✅ Storage API로 최고 기록 저장 (game.js 제거)
    const isNewRecord = Storage.saveBestScore(score);

    // 격려 메시지 표시
    const message = getEncouragingMessage(score);
    document.getElementById('encouragement-msg').textContent = message;

    // 점수 표시  ✅ bestScore는 Storage에서 직접 조회
    document.getElementById('final-score').textContent = score;
    document.getElementById('best-score-gameover').textContent = Storage.getBestScore();

    // 신기록 배지
    const badge = document.getElementById('new-record-badge');
    if (isNewRecord && score > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    // TOP3 업데이트 (C팀이 처리하지만 여기서 표시)
    updateTop3Display();

    // 화면 전환
    switchScreen('gameover');
  }

  /**
   * TOP3 목록 업데이트
   */
  function updateTop3Display() {
    // C팀의 Storage.getTop3() 함수가 있으면 사용
    // 지금은 단순히 최고점만 표시
    const bestScore = localStorage.getItem('flappyBird_best') || '0';
    const top3List = document.getElementById('top3-list');
    
    if (top3List) {
      top3List.innerHTML = `
        <li class="top3-item">${bestScore}</li>
        <li class="top3-item">-</li>
        <li class="top3-item">-</li>
      `;
    }
  }

  // ============ Public API ============

  return {
    /**
     * UI 초기화 (게임 시작 전)
     */
    init() {
      // 최고 기록 표시
      const bestScore = localStorage.getItem('flappyBird_best') || '0';
      document.getElementById('best-score-start').textContent = `${bestScore}점`;

      // 이벤트 리스너 등록
      attachEventListeners();

      // 시작 화면 표시
      switchScreen('start');
    },

    /**
     * 점수 업데이트
     */
    updateScore(score) {
      const scoreElement = document.getElementById('score');
      if (scoreElement) {
        scoreElement.textContent = score;
      }
    },

    /**
     * 최고 기록 업데이트 (시작 화면)  ✅ 이름 통일
     */
    updateBestScore(score) {
      const bestElement = document.getElementById('best-score-start');
      if (bestElement) {
        bestElement.textContent = `${score}점`;
      }
    },

    /**
     * 화면 전환 (다른 팀이 호출 가능)
     */
    showScreen(screenName) {
      switchScreen(screenName);
    },

    /**
     * 메시지 표시 (테스트용)
     */
    showMessage(text) {
      const msg = document.getElementById('encouragement-msg');
      if (msg) {
        msg.textContent = text;
      }
    }
  };
})();

// 페이지 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
```

---

## 🤖 Sub-Agent 활용

### Phase 1 중반 (10:30 경)
```
Agent 작업: CSS 반응형 기법 조사
명령: "clamp() 함수와 vw/vh 단위로 
      반응형 웹 구현 방법. 모바일~데스크톱 
      대응 좋은 사례 찾아줘."
예상 결과: CSS 반응형 기법 최적화
```

### Phase 2 중반 (14:00 경)
```
Agent 작업: 초등학생 UX 최적화
명령: "초등학생 대상 웹게임 UI/UX 
      best practice. 큰 버튼, 명확한 피드백, 
      격려 메시지 등의 사례."
예상 결과: UX 개선 아이디어
```

---

## 🔧 주의사항

### 1. Canvas width/height 설정
```javascript
// ✅ HTML에 명시
<canvas id="gameCanvas" width="320" height="480"></canvas>

// CSS에만 설정하면 스케일링됨
// width: 320px;  ← 이건 표시 크기만 변경
```

### 2. 이벤트 리스너 중복 방지
```javascript
// ❌ 틀림 (start 버튼 누를 때마다 새로 등록)
Game.start = function() {
  document.addEventListener('click', handleClick);
};

// ✅ 맞음 (초기화 시 한 번만)
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleClick);
});
```

### 3. 게임 이벤트 수신
```javascript
// A팀이 발행
document.dispatchEvent(new CustomEvent('pipe:passed', {
  detail: { score: 10 }
}));

// B팀이 수신
document.addEventListener('pipe:passed', (e) => {
  UI.updateScore(e.detail.score);
});
```

---

## 📱 반응형 테스트 체크리스트

- [ ] 280px (가장 작은 휴대폰)
  - [ ] 버튼 누르기 쉬운가?
  - [ ] 텍스트 읽기 쉬운가?
  - [ ] Canvas 비율 유지?

- [ ] 375px (iPhone SE)
  - [ ] 모든 요소 보이는가?
  - [ ] 레이아웃 깨짐 없는가?

- [ ] 768px (태블릿)
  - [ ] 여백 적절한가?
  - [ ] Canvas 크기 적절한가?

- [ ] 가로 모드
  - [ ] 높이가 제한될 때 어떻게 되는가?
  - [ ] 콘텐츠 모두 보이는가?

---

## 📝 체크포인트 (Phase별)

### Phase 1 종료 (12:00)
```
✅ index.html 완성
✅ style.css 기본 스타일 완성
✅ 3개 화면 레이아웃 확인
❌ 아직 JavaScript 상호작용 안 함 (OK)
```

### Phase 2 종료 (16:00)
```
✅ ui.js 완성
✅ 버튼 클릭 반응
✅ 화면 전환 동작
✅ 캐릭터/난이도 선택 작동
✅ 점수 실시간 업데이트
✅ A팀 이벤트 수신 테스트
✅ 반응형 모든 해상도 테스트
```

---

## 🎨 최종 UI 요구사항

Day 1 16:00까지:

```
✅ 시작 화면 (캐릭터/난이도 선택 포함)
✅ 게임 화면 (점수 표시, Canvas)
✅ 게임오버 화면 (점수, 최고 기록, TOP3)
✅ 부드러운 화면 전환
✅ 초등학생 친화 색상/폰트
✅ 모바일 완벽 지원
✅ 격려 메시지
```

Team A와 함께 Phase 3 통합 테스트 때 만나요! 💪
