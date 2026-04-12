# 🎛️ 마스터 터미널 - 병렬 개발 제어 센터

> 3개 팀의 개발을 실시간으로 모니터링하고 제어하는 중앙 제어실입니다.

---

## 🚀 마스터 터미널 시작

### Step 1: 웹 서버 시작
```bash
# 포트 8000에서 게임 서버 실행
python -m http.server 8000

# 또는 npm/node 사용
npx http-server -p 8000
```

**확인**: http://localhost:8000 접속 → 게임 시작 화면 보여야 함

---

## 🎮 실시간 모니터링

### Chrome DevTools 활용
```bash
# Chrome 개발자 도구 열기
# 1. Chrome에서 게임 페이지 열기
# 2. F12 누르기
# 3. Ctrl+Shift+J (콘솔) 또는 Performance 탭

# 또는 원격 디버깅
chrome://inspect
```

### 콘솔에서 게임 상태 확인
```javascript
// 현재 게임 상태 확인
console.log(Game.getState());

// 점수 직접 테스트
Game.init('medium', 0);
Game.start();

// 강제로 게임오버
document.dispatchEvent(new CustomEvent('game:over', {
  detail: { score: 100, bestScore: 100, character: 0 }
}));

// localStorage 확인
console.log(localStorage);
console.log(Storage.export());
```

---

## 📊 팀별 진행 상황 체크리스트

### 🅰️ Team A - 게임 로직팀

#### Phase 1 (09:30~12:00)
- [ ] `js/game.js` 작성 시작
- [ ] `js/renderer.js` Canvas 초기화
- [ ] Canvas에 정사각형 그리기 테스트

**마스터 체크**: 
```bash
# 콘솔에서 확인
> Game.init('medium', 0)
> Game.start()
# Canvas가 파란색으로 채워지면 OK ✓
```

#### Phase 2 (13:00~16:00)
- [ ] 물리 엔진 (중력, 점프) 동작
- [ ] 파이프 생성 및 이동
- [ ] 충돌 감지
- [ ] 점수 계산

**마스터 체크**:
```bash
# 게임 실행 후
> Game.getState()
# { state: 'playing', score: 5, ... } 반환 ✓
```

---

### 🅱️ Team B - UI/렌더링팀

#### Phase 1 (09:30~12:00)
- [ ] `index.html` 3개 화면 구조
- [ ] `css/style.css` 기본 레이아웃
- [ ] 반응형 테스트 (280px, 375px, 800px)

**마스터 체크**:
```bash
# 브라우저에서 확인
# F12 → Responsive Design Mode (Ctrl+Shift+M)
# 화면 해상도 변경: 280px, 375px, 800px 모두 정상인가?
# 텍스트 크기는 너무 작지 않은가?
```

#### Phase 2 (13:00~16:00)
- [ ] 버튼 클릭 이벤트
- [ ] 화면 전환 애니메이션
- [ ] 캐릭터/난이도 선택

**마스터 체크**:
```bash
# 게임 시작 버튼 클릭
> 게임 화면으로 전환되는가? ✓
# 다시하기 클릭
> 시작 화면으로 돌아가는가? ✓
```

---

### 🅲 Team C - 고급기능/배포팀

#### Phase 1 (09:30~12:00)
- [ ] `js/storage.js` localStorage 래퍼
- [ ] `js/sound.js` Audio 객체 생성

**마스터 체크**:
```bash
# 콘솔에서 확인
> Storage.saveBestScore(42)
> Storage.getBestScore()
# 42 반환 ✓

> localStorage.getItem('flappyBird_best')
# "42" 반환 ✓
```

#### Phase 2 (13:00~16:00)
- [ ] A팀 이벤트와 Sound 연결
- [ ] A팀 이벤트와 Storage 연결
- [ ] 점수 저장/로드 정상

**마스터 체크**:
```bash
# 게임 실행 후 파이프 통과
> 효과음 재생되는가? ✓
# 게임 종료
> localStorage에 점수 저장되는가? ✓
# 게임 새로 시작
> 최고 기록이 표시되는가? ✓
```

---

## 🔍 실시간 디버깅 명령어

### 게임 상태 확인
```javascript
// 전체 게임 상태
Game.getState()

// 새 위치
bird.y

// 파이프 상태
pipes.length

// 점수
score
```

### UI 상태 확인
```javascript
// 현재 화면
document.querySelector('.screen.active').id

// 버튼 상태
document.getElementById('start-btn').disabled

// 최고 기록
document.getElementById('best-score-start').textContent
```

### 저장소 상태 확인
```javascript
// 모든 저장 데이터
Storage.export()

// TOP3
Storage.getTop3Scores()

// 음소거 상태
Sound.isMuted()
```

### 이벤트 모니터링
```javascript
// 이벤트 수신 로깅
['bird:jumped', 'pipe:passed', 'game:over'].forEach(event => {
  document.addEventListener(event, (e) => {
    console.log('EVENT:', event, e.detail);
  });
});
```

---

## ⚡ Phase별 마스터 체크포인트

### Day 1 12:00 (Phase 1 통합)
```
❓ 3개 팀 현황?

Team A:
  - Canvas 초기화되었나? ✓ or ✗
  - game.js 기본 틀 완성? ✓ or ✗

Team B:
  - HTML 3개 화면 완성? ✓ or ✗
  - CSS 반응형 확인? ✓ or ✗

Team C:
  - storage.js 완성? ✓ or ✗
  - sound.js 초기화? ✓ or ✗

마스터 조치:
  [ ] 모든 팀이 OK면 → Phase 2 진행
  [ ] 누군가 지연중? → 지원 에이전트 투입
  [ ] 의존성 이슈? → 팀 간 공유규약 검토
```

### Day 1 16:00 (Phase 2 통합)
```
❓ 기본 게임 플레이 가능한가?

테스트 순서:
  1. 게임 시작 버튼 클릭
  2. Canvas에서 새가 떨어지는가? ✓
  3. 클릭하면 새가 위로 올라가는가? ✓
  4. 파이프가 나타나고 이동하는가? ✓
  5. 파이프에 충돌하면 게임오버 화면? ✓
  6. 점수가 증가하는가? ✓
  7. 점수가 localStorage에 저장되는가? ✓

모두 ✓ → Phase 3 진행
일부 ✗ → 팀별 버그 수정
```

### Day 2 12:00 (Phase 3 통합)
```
고급 기능 테스트:

  [ ] 캐릭터 선택 (3종) 정상?
  [ ] 난이도 선택 적용되는가?
  [ ] 신기록 달성 시 배지 표시?
  [ ] 컨페티 효과 작동?
  [ ] TOP3 점수 표시?
  [ ] 사운드 모든 4가지 재생?
  [ ] 음소거 기능 작동?

모두 ✓ → 배포 진행
```

### Day 2 15:00 (배포)
```
최종 배포 체크:

  [ ] GitHub Pages URL 라이브?
  [ ] 모든 파일 접근 가능?
  [ ] 게임 완벽 작동?
  [ ] README 내용 정확?
  [ ] 모바일 (iOS/Android) 테스트?
  [ ] Chrome/Safari/Edge 호환?
  [ ] 콘솔 에러 0개?

모두 ✓ → 🎉 완성!
```

---

## 🚨 문제 해결 (Emergency Commands)

### Canvas가 나타나지 않음
```javascript
// 확인 1: HTML에 canvas 있는가?
document.getElementById('gameCanvas')

// 확인 2: Renderer.init() 호출되었나?
Renderer.init()

// 확인 3: canvas의 width/height
document.getElementById('gameCanvas').width
// 320 이어야 함
```

### 버튼 클릭이 반응 없음
```javascript
// 이벤트 리스너 확인
document.getElementById('start-btn').onclick
// function이 나와야 함

// 또는 강제로 실행
Game.init('medium', 0)
Game.start()
```

### 점수가 저장되지 않음
```javascript
// localStorage 활성화 확인
typeof localStorage
// "object" 이어야 함

// 강제로 저장
localStorage.setItem('test', 'value')
localStorage.getItem('test')
// "value" 반환해야 함
```

### 사운드가 안 나옴
```javascript
// 음소거 확인
Sound.isMuted()
// false여야 함

// 음소거 해제
Sound.setMuted(false)

// 파일 경로 확인
new Audio('assets/sounds/jump.mp3').src
// 올바른 경로?
```

---

## 🎯 마스터 역할

### 모니터링
- 각 팀의 코드 commit 확인
- 각 팀의 파일 작업 현황 추적
- 성능 모니터링 (FPS, 메모리 등)

### 조율
- 팀 간 의존성 문제 해결
- 공유규약 준수 여부 확인
- 막히는 부분 즉시 지원

### 통합
- Phase별 코드 합치기
- 통합 테스트 진행
- 버그 분류 및 배정

### 배포
- GitHub Pages 설정
- 최종 테스트
- 라이브 URL 관리

---

## 📞 커뮤니케이션 채널

### 팀 간 질문
```
Q. Team B: "game:over 이벤트 detail은 뭐야?"
A. Team A: "공유규약 01-team-a-logic.md 보세요"

Q. Team C: "Storage.saveBestScore() 어떻게 써?"
A. Team C: "03-team-c-features.md 참고"
```

### 에러 리포트
```
❌ Team A: "Canvas에 파이프 그리기 안 함"
→ Renderer.draw() 호출 확인?
→ Renderer.init() 먼저 호출?
```

### 시간 연장/조정
```
⏰ Team B가 Phase 1을 14:00까지 해야 하는 경우
→ 마스터가 Team A/C에 나머지 작업 분배
→ 또는 보조 에이전트 투입
```

---

## 🎬 지금 바로 시작하기

### 1단계: 마스터 터미널 열기
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask

# 웹 서버 시작
python -m http.server 8000
```

### 2단계: 브라우저 열기
```
http://localhost:8000
# 또는
http://127.0.0.1:8000
```

### 3단계: Chrome DevTools 열기
```
F12 또는 Ctrl+Shift+I
→ Console 탭에서 명령어 실행 가능
```

### 4단계: 에이전트 투입
```
"Team A 개발 시작"
"Team B 개발 시작" (병렬)
"Team C 개발 시작" (병렬)
```

---

## 🎛️ 마스터 커맨드 요약

| 커맨드 | 용도 |
|:---|:---|
| `python -m http.server 8000` | 웹 서버 시작 |
| `F12` | Chrome DevTools 열기 |
| `Game.getState()` | 게임 상태 확인 |
| `Storage.export()` | 저장 데이터 확인 |
| `Sound.play('jump')` | 사운드 테스트 |
| `document.querySelector('.screen.active').id` | 현재 화면 확인 |

준비 완료! 개발을 시작하세요! 🚀
