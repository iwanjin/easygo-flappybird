# 🅰️ Team A 환경 설정 & 개발 가이드

**역할**: 게임 로직팀 (물리 엔진, 충돌, 점수)  
**담당 파일**: `js/game.js`, `js/renderer.js` (일부)  
**개발 기간**: Day 1 (약 2시간)

---

## 🎯 Team A의 최종 목표

```
✅ 게임 시작 가능
✅ 새 조종 가능 (점프)
✅ 파이프 무한 생성 & 이동
✅ 충돌 감지 정상
✅ 점수 정확히 계산
✅ 60fps 유지
✅ 콘솔 에러 0개
```

---

## 📝 구현 체크리스트

### Phase 1 (09:30 ~ 12:00)

#### game.js - 상태 머신
```javascript
// 필수 구현
✅ STATE { IDLE, PLAYING, GAMEOVER }
✅ gameLoop(timestamp) 함수
✅ lastFrameTime 초기화
✅ delta 계산
✅ Game.init(difficulty, character)
✅ Game.start()
✅ Game.jump()
✅ Game.reset()
✅ Game.getState()

// 필수 이벤트 발행
✅ bird:jumped - 점프할 때
✅ pipe:passed - 파이프 통과할 때
✅ game:playing - 매 프레임 (detail: { score })
✅ game:over - 충돌할 때 (detail: { score, character })
```

#### renderer.js - Canvas 초기화
```javascript
// 필수 구현
✅ Renderer.init()
  ✅ canvas 선택
  ✅ ctx = canvas.getContext('2d')
  ✅ canvas.width = 320
  ✅ canvas.height = 480
  
✅ Renderer.render(gameData)
  ✅ 배경 그리기
  ✅ 파이프 그리기
  ✅ 새 그리기
```

### Phase 2 (13:00 ~ 16:00)

#### game.js - 물리 & 충돌
```javascript
// 필수 구현
✅ updatePhysics(delta) - 중력, 점프, 낙하
✅ updatePipes(delta) - 파이프 생성, 이동
✅ checkCollision() - AABB 충돌 감지
✅ updateScore() - passed 플래그로 점수 계산

✅ 난이도별 파라미터 적용
  ✅ easy
  ✅ medium
  ✅ hard
```

---

## 🔧 구현 단계별 가이드

### Step 1: 프로젝트 구조 확인
```bash
# 현재 디렉토리 확인
pwd

# 필요한 파일 확인
ls -la js/
# game.js (생성 필요)
# renderer.js (생성 필요)
```

### Step 2: game.js 파일 생성
```javascript
const Game = (() => {
  // 01-team-a-logic.md에서 전체 코드 복사
  // ...
})();
```

### Step 3: renderer.js 파일 생성
```javascript
const Renderer = (() => {
  // 01-team-a-logic.md에서 전체 코드 복사
  // ...
})();
```

### Step 4: index.html에 스크립트 추가 (완전한 순서)
```html
<!-- ⚠️ 순서 중요! storage.js가 가장 먼저! -->
<script src="js/storage.js"></script>    <!-- C팀 작성 (필수!) -->
<script src="js/sound.js"></script>      <!-- C팀 작성 (필수!) -->
<script src="js/renderer.js"></script>   <!-- A팀 작성 -->
<script src="js/ui.js"></script>         <!-- B팀 작성 -->
<script src="js/game.js"></script>       <!-- A팀 작성 -->
<script src="js/confetti.js"></script>   <!-- C팀 작성 (필수!) -->
```

### Step 5: 테스트
```bash
# 마스터 터미널에서
python -m http.server 8000

# 브라우저: http://localhost:8000
# F12 Console에서
Game.init('medium', 0)
Game.start()
```

---

## 🚀 에이전트를 위한 명령어

### 초기화
```
"Team A 개발 시작. 
01-team-a-logic.md의 game.js와 renderer.js를 
js/ 폴더에 생성해줘. 
마스터 터미널에서 테스트 가능하도록."
```

### Phase 1 검증
```
"game.js와 renderer.js가 완성되었는지 확인해줘.
마스터에서 Game.init('medium', 0); Game.start();
를 실행했을 때 canvas에 파란 배경이 보이는지 확인."
```

### Phase 2 구현
```
"updatePhysics, updatePipes, checkCollision 함수를
구현해줘. 
테스트: 게임을 시작했을 때 새가 떨어지고,
클릭하면 올라가고, 파이프가 나타나야 함."
```

### 최종 검증
```
"console에서 다음이 모두 작동하는지 확인:
- Game.getState() 반환값 확인
- 60fps 유지 (Performance 탭)
- 점수 계산 정확
- 콘솔 에러 없음"
```

---

## 📊 자체 테스트 명령어

### 콘솔에서 실시간 테스트
```javascript
// 게임 초기화
Game.init('medium', 0)

// 게임 시작
Game.start()

// 강제로 점프
Game.jump()

// 현재 상태 확인
console.log(Game.getState())

// 충돌 테스트 (게임오버) - ⚠️ bestScore 제거됨 (B팀이 Storage에서 직접 조회)
document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score: 10, character: 0 }
}))
```

### Chrome DevTools Performance 탭
1. F12 열기
2. Performance 탭
3. 빨간 원 클릭하여 녹화 시작
4. 게임 플레이
5. 중지
6. FPS 그래프 확인 (60fps가 목표)

---

## ⚠️ 주의사항 (함정)

### 1️⃣ Delta Time 반드시 사용!
```javascript
// ❌ 틀림
bird.y += 2;  // FPS 의존

// ✅ 맞음
bird.y += velocity * (delta / 1000);
```

### 2️⃣ passed 플래그 필수!
```javascript
// ❌ 틀림
if (bird.x > pipe.x) score++;

// ✅ 맞음
if (!pipe.passed && bird.x > pipe.x) {
  pipe.passed = true;
  score++;
}
```

### 3️⃣ 첫 프레임 처리
```javascript
// ❌ 틀림
const delta = timestamp - lastTime;

// ✅ 맞음
if (lastTime === 0) {
  lastTime = timestamp;
  return;
}
const delta = timestamp - lastTime;
```

### 4️⃣ clearRect/fillRect 순서
```javascript
// ❌ 틀림 (이전 이미지가 남음)
ctx.fillRect(bird.x, bird.y, 32, 32);

// ✅ 맞음
ctx.fillRect(0, 0, canvas.width, canvas.height);  // 배경
ctx.fillRect(bird.x, bird.y, 32, 32);  // 새
```

### 5️⃣ requestAnimationFrame 정리
```javascript
// cancelAnimationFrame 필수
cancelAnimationFrame(gameLoopId);
```

---

## 📞 질문 & 해결

### 문제: Canvas가 나타나지 않음
```javascript
// 확인
document.getElementById('gameCanvas')
// HTMLCanvasElement를 반환해야 함

// 또는 HTML에 canvas가 없는 경우
// B팀의 index.html 확인
```

### 문제: 게임이 시작 안 됨
```javascript
// 1. Game.init() 호출했나?
Game.init('medium', 0)

// 2. Game.start() 호출했나?
Game.start()

// 3. 콘솔 에러 확인
// F12 → Console 탭
```

### 문제: FPS가 60 이하
```javascript
// 성능 프로파일링
// F12 → Performance → 녹화 → 분석

// 최적화 팁:
// - 불필요한 객체 생성 제거
// - 루프 최적화
// - 배열 filter() 캐싱
```

---

## 🎯 완성 기준

### Phase 1 완료 체크
```
✅ js/game.js 완성
✅ js/renderer.js 완성
✅ Canvas 초기화 동작
✅ Game.init() 호출 가능
✅ Game.start() 호출 가능
```

### Phase 2 완료 체크
```
✅ 새가 떨어짐 (중력)
✅ 클릭하면 올라감 (점프)
✅ 파이프 생성 & 이동
✅ 충돌 감지
✅ 점수 계산 (중복 없음)
✅ 60fps 유지
✅ 콘솔 에러 0개
```

---

## 🔗 참고 자료

- **01-team-a-logic.md**: 전체 코드
- **00-work-methodology.md**: 공유 규약
- **MASTER_TERMINAL.md**: 마스터 모니터링 명령어
- **MDN Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

---

준비 완료! 게임 로직 개발을 시작하세요! 💪
