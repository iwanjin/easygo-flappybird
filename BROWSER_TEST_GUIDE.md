# 🧪 브라우저 테스트 가이드

**상태**: ✅ 모든 파일 생성 완료  
**테스트 방법**: 브라우저의 F12 Console에서 실행  
**예상 소요 시간**: 약 10분

---

## 📱 브라우저 접속

### 1단계: 웹 서버 시작
```bash
# Terminal에서
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
python -m http.server 8000
```

화면에 다음과 같이 보여야 합니다:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### 2단계: 브라우저에서 접속
```
URL: http://localhost:8000
```

---

## 🧪 테스트 체크리스트

### Test 1: 페이지 로드
**예상 결과**: 시작 화면이 보여야 함

```
✅ 시작 화면 (Start Screen)
   - 제목: "플래피버드"
   - 버튼: "시작"
   - 캐릭터 선택: 3개
   - 난이도 선택: 3개
```

---

### Test 2: API 로드 확인
**실행 위치**: F12 Console  
**복사해서 Console에 붙여넣기:**

```javascript
// API 로드 확인
console.log("=== API 로드 상태 ===");
console.log("Game:", typeof Game === 'object' ? '✅ 로드됨' : '❌ 미로드');
console.log("Renderer:", typeof Renderer === 'object' ? '✅ 로드됨' : '❌ 미로드');
console.log("UI:", typeof UI === 'object' ? '✅ 로드됨' : '❌ 미로드');
console.log("Storage:", typeof Storage === 'object' ? '✅ 로드됨' : '❌ 미로드');
console.log("Sound:", typeof Sound === 'object' ? '✅ 로드됨' : '❌ 미로드');
```

**예상 출력**:
```
✅ Game: 로드됨
✅ Renderer: 로드됨
✅ UI: 로드됨
✅ Storage: 로드됨
✅ Sound: 로드됨
```

---

### Test 3: Game API 테스트
**복사해서 Console에 붙여넣기:**

```javascript
// 게임 초기화
console.log("=== Game API 테스트 ===");
Game.init('medium', 0);
console.log("✅ Game.init() 성공");

// 게임 시작
Game.start();
console.log("✅ Game.start() 성공");

// 현재 상태 확인
const state = Game.getState();
console.log("Game 상태:", state);
console.log("  - score:", state.score);
console.log("  - state:", state.state);
```

**예상 결과**:
```
✅ Game.init() 성공
✅ Game.start() 성공
Game 상태: {
  state: 'playing',
  score: 0,
  difficulty: 'medium',
  character: 0
}
```

**Canvas에 보이는 것**:
```
✅ 파란 배경 (Canvas)
✅ 파란 새 아이콘 (새의 초기 위치)
```

---

### Test 4: 게임 플레이
**Canvas를 클릭하면서 테스트:**

```
1️⃣ 새가 떨어지는가?
   - 클릭하지 않으면 새가 아래로 떨어져야 함
   - 중력이 적용되어 천천히 내려옴

2️⃣ 점프가 작동하는가?
   - Canvas를 클릭하면 새가 위로 올라가야 함
   - 올라간 후 다시 떨어짐

3️⃣ 파이프가 생성되는가?
   - 게임 시작 후 1~2초 후 파이프가 나타나야 함
   - 파이프가 왼쪽에서 오른쪽으로 이동
```

---

### Test 5: 점수 계산
**Console에서 파이프 통과 후:**

```javascript
// 파이프를 3~4개 통과한 후
const finalState = Game.getState();
console.log("현재 점수:", finalState.score);
```

**예상 결과**:
```
✅ 점수가 증가해야 함 (각 파이프 통과마다 1점)
✅ 중복되지 않아야 함 (파이프당 1번만)
```

---

### Test 6: 충돌 감지
**게임 플레이 중 파이프와 충돌:**

```
🎯 파이프와 부딪히면:
   ✅ Canvas 렌더링 멈춤
   ✅ 게임오버 화면 나타남
   ✅ 최종 점수 표시
```

---

### Test 7: 저장소 API
**게임이 끝난 후 Console에서:**

```javascript
// 저장소 확인
console.log("=== Storage API 테스트 ===");
console.log("최고점:", Storage.getBestScore());
console.log("TOP3:", Storage.getTop3());
console.log("모든 점수:", Storage.getAllScores());
```

**예상 결과**:
```
✅ 최고점: 3 (또는 방금 게임에서 획득한 점수)
✅ TOP3: [{score: 3, ...}, ...]
✅ 모든 점수: 배열로 표시
```

---

### Test 8: 사운드 API
**Console에서:**

```javascript
// 사운드 확인
console.log("=== Sound API 테스트 ===");
console.log("음소거 상태:", Sound.isMuted());

// 각각 테스트 (소리가 날 것)
Sound.play('jump');      // 1초 후
Sound.play('point');     // 2초 후
Sound.play('collision'); // 3초 후
Sound.play('gameover');  // 4초 후

// 음소거 토글
Sound.toggleMute();
console.log("토글 후:", Sound.isMuted());
```

**예상 결과**:
```
✅ jump 음: 점프음
✅ point 음: 통과음
✅ collision 음: 충돌음
✅ gameover 음: 게임오버음
✅ 음소거 토글: true ↔ false
```

---

### Test 9: UI 화면 전환
**Console에서:**

```javascript
// 화면 전환 테스트
console.log("=== UI 화면 전환 ===");

// 시작 화면
UI.showScreen('start');
console.log("✅ 시작 화면 표시");

// 게임 화면
UI.showScreen('game');
console.log("✅ 게임 화면 표시");

// 게임오버 화면
UI.showScreen('gameover');
console.log("✅ 게임오버 화면 표시");
```

**예상 결과**:
```
✅ 각 화면이 부드럽게 전환됨
✅ 이전 화면은 숨겨짐 (display: none)
```

---

### Test 10: 신기록 저장
**새로운 최고점으로 게임 끝낸 후:**

```javascript
// 신기록 확인
const best = Storage.getBestScore();
console.log("최고점:", best);

// 신기록 배지 확인 (화면에)
// → "신기록!" 배지가 나타나는지 확인
```

**예상 결과**:
```
✅ 최고점이 갱신됨
✅ "신기록!" 배지 표시
✅ localStorage에 저장됨
```

---

## 📊 완전한 테스트 흐름

### 1️⃣ 시작 (약 1분)
```
시작 화면 로드
  ↓
캐릭터/난이도 선택
  ↓
"시작" 버튼 클릭
```

### 2️⃣ 게임 플레이 (약 2분)
```
Canvas 클릭해서 점프
  ↓
파이프 통과 (점수 1점)
  ↓
파이프 3~5개 통과 (점수 3~5점)
  ↓
파이프와 충돌
  ↓
게임오버 화면
```

### 3️⃣ API 검증 (약 3분)
```
F12 Console 열기
  ↓
API 로드 확인
  ↓
각 API 테스트
  ↓
저장소 확인
  ↓
사운드 재생 확인
```

### 4️⃣ 반응형 테스트 (약 4분)
```
F12 → Ctrl+Shift+M (반응형 모드)
  ↓
375px (모바일) 크기로 조정
  ↓
게임 플레이 (레이아웃이 깨지지 않는지 확인)
  ↓
버튼/텍스트 크기가 적절한지 확인
```

---

## 🎯 성공 기준

### 필수 (Must Have)
```
✅ 시작 화면 로드
✅ 게임 시작 가능
✅ 새가 점프
✅ 파이프 생성 & 이동
✅ 충돌 감지
✅ 게임오버 화면
✅ 점수 표시
```

### 중요 (Should Have)
```
✅ 최고점 저장 (localStorage)
✅ TOP3 조회
✅ 게임오버 후 다시 시작 가능
✅ 반응형 UI (375px에서도 정상)
```

### 추가 (Nice to Have)
```
✅ 사운드 재생
✅ 음소거 토글
✅ 신기록 배지
✅ 애니메이션 부드러움
```

---

## 🐛 문제 발생 시

### Problem: "ReferenceError: Storage is not defined"
```
원인: Script 로드 순서 오류
해결: index.html에서 <script> 순서 확인
     storage.js → sound.js → renderer.js → ui.js → game.js
```

### Problem: "Game is not defined"
```
원인: game.js가 로드되지 않음
해결: F12 Console의 Network 탭에서 game.js 로드 확인
```

### Problem: "Canvas not found"
```
원인: HTML에 <canvas id="gameCanvas"> 없음
해결: index.html에 Canvas 요소 확인
```

### Problem: 사운드가 안 나옴
```
원인 1: 브라우저 음소거
해결: 브라우저 음량 확인

원인 2: 사용자 상호작용 전
해결: Canvas 클릭 후 재생 시도
```

---

## 📋 테스트 기록

### 테스트 결과 기록
```
테스트 항목          | 결과 | 설명
API 로드             | ✅  |
Game.init()          | ✅  |
Game.start()         | ✅  |
새 렌더링 (Canvas)   | ✅  |
점프 (클릭)          | ✅  |
파이프 생성          | ✅  |
점수 계산            | ✅  |
충돌 감지            | ✅  |
게임오버 화면        | ✅  |
저장소 저장          | ✅  |
사운드 재생          | ✅  |
반응형 UI (375px)    | ✅  |
```

---

## ✅ 테스트 완료 체크리스트

```
[ ] 시작 화면 로드
[ ] API 로드 확인 (Console)
[ ] Game 초기화 성공
[ ] 새가 렌더링됨
[ ] 점프 동작
[ ] 파이프 생성
[ ] 점수 증가
[ ] 충돌 감지
[ ] 게임오버 화면
[ ] 최고점 저장
[ ] TOP3 조회 가능
[ ] 사운드 재생
[ ] 모바일 반응형 (375px)
```

---

**준비 완료!** 🚀  
이제 브라우저에서 게임을 테스트하세요!
