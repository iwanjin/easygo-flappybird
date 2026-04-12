# 🅱️ Team B 환경 설정 & 개발 가이드

**역할**: UI/렌더링팀 (화면, 스타일, 상호작용)  
**담당 파일**: `index.html`, `css/style.css`, `js/ui.js`  
**개발 기간**: Day 1 (약 2시간)

---

## 🎯 Team B의 최종 목표

```
✅ 3개 화면 HTML 구조 완성
✅ 반응형 CSS (280px~1200px)
✅ 초등학생 친화 디자인
✅ 버튼 클릭 이벤트 연결
✅ 화면 전환 애니메이션
✅ 캐릭터/난이도 선택
✅ 점수 실시간 업데이트
```

---

## 📝 구현 체크리스트

### Phase 1 (09:30 ~ 12:00)

#### index.html
```
✅ 3개 화면 섹션
  ✅ id="start-screen" (시작 화면)
  ✅ id="game-screen" (게임 화면)
  ✅ id="gameover-screen" (게임오버)
  
✅ 캐릭터 선택 버튼 3개
✅ 난이도 선택 버튼 3개
✅ Canvas 요소 (id="gameCanvas")
✅ 점수 표시 (id="score")
✅ 최고 기록 표시
  ✅ #best-score-start (시작 화면)
  ✅ #best-score-gameover (게임오버 화면)
✅ TOP3 목록
✅ 스크립트 태그 (순서 중요!)
```

#### style.css
```
✅ 색상 토큰 (:root)
✅ 반응형 폰트 (clamp 사용)
✅ 버튼 스타일
✅ 화면 전환 애니메이션
✅ 미디어 쿼리 (3개 이상)
✅ 초등학생 친화 색상
```

### Phase 2 (13:00 ~ 16:00)

#### ui.js
```
✅ UI.init() - 초기화
✅ UI.updateScore(score) - 점수 업데이트
✅ UI.showScreen(name) - 화면 전환
✅ 버튼 클릭 이벤트
  ✅ 시작 버튼
  ✅ 다시하기 버튼
  ✅ 한번 더 버튼
  ✅ 홈 버튼
  
✅ 캐릭터/난이도 선택 처리
✅ 격려 메시지 표시
✅ A팀 이벤트 수신
```

---

## 🔧 구현 단계별 가이드

### Step 1: 파일 구조 확인
```bash
# 프로젝트 구조
ls -la
# css/style.css (생성 필요)
# js/ui.js (생성 필요)
# index.html (생성 필요)
```

### Step 2: index.html 생성
```html
<!DOCTYPE html>
<!-- 02-team-b-ui.md에서 전체 코드 복사 -->
```

### Step 3: css/style.css 생성
```css
/* 02-team-b-ui.md에서 전체 코드 복사 */
```

### Step 4: js/ui.js 생성
```javascript
const UI = (() => {
  // 02-team-b-ui.md에서 전체 코드 복사
})();
```

### Step 5: 스크립트 태그 확인 (중요!)

⚠️ A팀과 함께 index.html의 스크립트 태그 섹션을 다음 순서로 추가:

```html
<!-- ⚠️ 순서 필수! storage.js가 가장 먼저! -->
<script src="js/storage.js"></script>    <!-- C팀: storage.js 먼저 -->
<script src="js/sound.js"></script>      <!-- C팀: sound.js가 Storage 필요 -->
<script src="js/renderer.js"></script>   <!-- A팀 -->
<script src="js/ui.js"></script>         <!-- B팀 (여기서 작성) -->
<script src="js/game.js"></script>       <!-- A팀 -->
<script src="js/confetti.js"></script>   <!-- C팀 -->
```

### Step 6: 테스트
```bash
# 마스터 터미널에서
python -m http.server 8000

# 브라우저: http://localhost:8000
# 시작 화면이 보여야 함
```

---

## 🚀 에이전트를 위한 명령어

### 초기화
```
"Team B 개발 시작.
02-team-b-ui.md의 HTML, CSS, JS 코드를
index.html, css/style.css, js/ui.js에 생성해줘.
마스터에서 바로 게임 시작 화면이 보여야 함."
```

### Phase 1 검증
```
"index.html과 style.css가 완성되었는지 확인.
마스터에서 브라우저로 http://localhost:8000 열었을 때
시작 화면이 나타나고,
스마트폰 크기(375px)에서도 정상인지 확인."
```

### Phase 2 구현
```
"ui.js에 다음을 구현:
- UI.init() (초기화)
- UI.updateScore() (점수 업데이트)
- UI.showScreen() (화면 전환)
- 버튼 클릭 이벤트
- 캐릭터/난이도 선택

테스트: 시작 버튼 → 게임 화면, 다시하기 → 시작 화면"
```

### 최종 검증
```
"다음이 모두 작동하는지 확인:
- 시작/게임/게임오버 화면 전환
- 버튼 누르기 반응 빠른가?
- 모바일 크기(375px)에서 버튼 크기 적당한가?
- 초등학생이 쉽게 눌 수 있는가?"
```

---

## 📊 자체 테스트 명령어

### 브라우저 콘솔 테스트
```javascript
// 화면 전환 테스트
UI.showScreen('start')
UI.showScreen('game')
UI.showScreen('gameover')

// 현재 화면 확인
document.querySelector('.screen.active').id

// 점수 업데이트 테스트
UI.updateScore(42)
```

### 반응형 테스트
1. F12 열기
2. Ctrl+Shift+M (Responsive Design Mode)
3. 해상도 변경:
   - 280px (가장 작은 휴대폰)
   - 375px (iPhone SE)
   - 800px (태블릿)
   - 1200px (데스크톱)

모든 해상도에서:
- 텍스트 읽기 쉬운가?
- 버튼 누르기 쉬운가?
- 레이아웃 깨짐 없는가?

---

## ⚠️ 주의사항 (함정)

### 1️⃣ CSS clamp() 사용 필수
```css
/* ❌ 틀림 */
font-size: 20px;  /* 고정 크기 */

/* ✅ 맞음 */
font-size: clamp(16px, 4vw, 24px);
/* 최소 16px, 뷰포트 4%, 최대 24px */
```

### 2️⃣ 화면 전환 클래스명 통일
```html
<!-- 모든 화면이 동일한 구조 -->
<section class="screen active">...</section>
<section class="screen">...</section>

<!-- CSS -->
.screen { display: none; }
.screen.active { display: flex; }
```

### 3️⃣ 이벤트 리스너 중복 방지
```javascript
// ❌ 틀림 (여러 번 등록)
Game.start = function() {
  document.addEventListener('click', handleClick);
}

// ✅ 맞음 (한 번만)
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', handleClick);
});
```

### 4️⃣ Button data-* 속성 사용
```html
<!-- 식별자로 사용 -->
<button class="diff-btn" data-difficulty="easy">쉬움</button>
<button class="diff-btn" data-difficulty="medium">보통</button>

<!-- JavaScript에서 -->
btn.dataset.difficulty  // "easy"
```

### 5️⃣ Canvas width/height HTML 속성
```html
<!-- ✅ 맞음 -->
<canvas id="gameCanvas" width="320" height="480"></canvas>

<!-- ❌ CSS만으로는 안 됨 -->
<!-- <canvas style="width: 320px; height: 480px;"></canvas> -->
```

---

## 📞 질문 & 해결

### 문제: 버튼이 너무 작음
```css
/* 최소 크기 확보 */
button {
  padding: clamp(12px, 3vw, 18px);  /* 최소 12px */
  font-size: clamp(14px, 4vw, 20px);
}

/* 전체 너비 사용 */
.btn {
  width: 100%;
  max-width: 320px;
}
```

### 문제: 텍스트가 겹침
```css
/* 줄 높이 확보 */
h1 {
  line-height: 1.2;
  margin-bottom: 10px;
}

/* 또는 요소 간 gap */
.screen-content {
  gap: clamp(15px, 4vw, 30px);
}
```

### 문제: 화면 전환이 끊김
```css
/* 애니메이션 추가 */
.screen {
  animation: slideInUp 0.3s ease-out;
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
```

---

## 🎯 완성 기준

### Phase 1 완료 체크
```
✅ index.html 완성 (3개 화면)
✅ css/style.css 완성 (기본 레이아웃)
✅ 반응형 테스트 (3개 크기)
✅ Canvas 정렬 정상
```

### Phase 2 완료 체크
```
✅ ui.js 완성 (화면 전환)
✅ 버튼 클릭 반응 정상
✅ 캐릭터 선택 정상
✅ 난이도 선택 정상
✅ A팀 이벤트 수신 (pipe:passed 등)
✅ 점수 실시간 업데이트
✅ 모바일 375px에서 완벽
```

---

## 🔗 참고 자료

- **02-team-b-ui.md**: 전체 코드
- **00-work-methodology.md**: 공유 규약
- **MASTER_TERMINAL.md**: 마스터 모니터링
- **MDN Responsive Design**: https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

---

준비 완료! UI 개발을 시작하세요! 🎨
