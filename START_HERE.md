# 🚀 플래피버드 병렬 개발 시작 가이드

> 크롬 데브툴스 MCP + 마스터 터미널 + 팀 A/B/C 구성 완료!

---

## ✅ 준비된 것들

### 📋 플랜 문서 (5개)
```
plan/
├── 00-work-methodology.md    ← 작업 방식 & 병렬 개발 구조
├── 01-team-a-logic.md        ← Team A 상세 플랜 + 코드
├── 02-team-b-ui.md           ← Team B 상세 플랜 + 코드
└── 03-team-c-features.md     ← Team C 상세 플랜 + 코드
```

### 🎛️ 마스터 + 팀 환경 (4개)
```
├── MASTER_TERMINAL.md        ← 🎛️ 마스터 제어실
├── TEAM_A_ENV.md            ← 🅰️ Team A 환경
├── TEAM_B_ENV.md            ← 🅱️ Team B 환경
└── TEAM_C_ENV.md            ← 🅲 Team C 환경
```

### 🔧 MCP 설정
```
.mcp.json                     ← Chrome DevTools + Web Server
```

---

## 🎯 빠른 시작 (3단계)

### 1️⃣ 마스터 터미널 시작
```bash
# 터미널 1: 웹 서버 시작
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
python -m http.server 8000

# 터미널 2: Chrome DevTools (선택)
# 또는 F12 누르기
```

### 2️⃣ 브라우저 확인
```
http://localhost:8000
# 또는 http://127.0.0.1:8000

# 시작 화면이 안 보이면? 
# → Team B가 index.html을 생성해야 함
```

### 3️⃣ 에이전트 투입
```
"세 팀 모두 개발 시작"

또는 개별적으로:
"Team A 개발 시작"
"Team B 개발 시작"
"Team C 개발 시작"
```

---

## 📊 팀별 역할 & 시간

### 🅰️ Team A - 게임 로직팀 (물리/충돌/점수)
```
파일: js/game.js, js/renderer.js
시간: Day 1 (약 2시간)
목표: 기본 게임 플레이 가능

Phase 1: game.js 상태머신 + renderer.js Canvas 초기화
Phase 2: 물리, 충돌, 점수 계산
```

**마스터 체크**:
```javascript
Game.init('medium', 0)
Game.start()
// Canvas에 파란색 배경 + 새 그리기 + 파이프
```

### 🅱️ Team B - UI/렌더링팀 (화면/스타일/상호작용)
```
파일: index.html, css/style.css, js/ui.js
시간: Day 1 (약 2시간)
목표: 3개 화면 + 반응형 + 상호작용

Phase 1: HTML 구조 + CSS 기본 레이아웃
Phase 2: ui.js 화면 전환 + 버튼 이벤트
```

**마스터 체크**:
```
브라우저 F12 → Responsive Design Mode (Ctrl+Shift+M)
375px: 버튼 크기 적당? 텍스트 읽기 쉬운가?
800px: 레이아웃 자연스러운가?
```

### 🅲 Team C - 고급기능/배포팀 (사운드/저장/배포)
```
파일: js/sound.js, js/storage.js, js/confetti.js, README.md
시간: Day 1-2 (약 3시간)
목표: 완전한 기능 + GitHub Pages 배포

Phase 1: storage.js + sound.js 생성
Phase 2: 이벤트 통합
Phase 3: confetti.js + README.md + 배포
```

**마스터 체크**:
```javascript
Storage.saveBestScore(42)
Storage.getBestScore()  // 42
Sound.play('jump')      // 음향 재생
```

---

## ⏱️ 개발 타임라인

### Day 1 (병렬 개발)
```
09:00-09:30 킥오프 회의 (모든 팀)
           └─ 플랜 리뷰 + 공유규약 확인

09:30-12:00 Phase 1 (3팀 동시)
  Team A: game.js 기본 틀
  Team B: index.html + style.css
  Team C: storage.js + sound.js

12:00-13:00 점심

13:00-16:00 Phase 2 (3팀 동시)
  Team A: 물리 + 충돌 + 점수
  Team B: ui.js + 상호작용
  Team C: 이벤트 통합

16:00-17:00 1차 통합 테스트 (마스터)
           └─ 기본 게임 플레이 가능 ✓
```

### Day 2 (고급기능 & 배포)
```
09:00-12:00 Phase 3 (3팀 + 마스터)
  Team A: 난이도별 파라미터 + 버그 수정
  Team B: 시각 효과 + 반응형 미세조정
  Team C: confetti.js + README.md

12:00-13:00 점심

13:00-14:30 최종 통합 + QA (마스터)
           └─ 모든 기능 테스트

14:30-15:00 배포 (Team C + 마스터)
           └─ GitHub Pages 라이브

15:00-      🎉 축하!
```

---

## 🎛️ 마스터 역할

### 모니터링
- 웹 서버 상태 확인
- 각 팀의 commit 추적
- Performance 모니터링 (FPS, 메모리)

### 테스트
```bash
# 브라우저 콘솔
Game.getState()
Storage.export()
Sound.isMuted()
```

### 조율
- 팀 간 의존성 해결
- 공유규약 준수 확인
- 막히는 부분 즉시 지원

### 배포
- GitHub Pages 설정
- 최종 테스트
- 라이브 URL 관리

---

## 🚀 지금 바로 시작하는 방법

### Option 1: 3팀 모두 동시 (병렬)
```
사용자: "3팀 모두 개발 시작해줘"

↓

나: 3개 Agent 동시 생성
├─ Agent A (Team A 담당)
├─ Agent B (Team B 담당) ← 병렬 실행
└─ Agent C (Team C 담당) ← 병렬 실행

↓

모든 팀이 동시에 개발 시작
```

### Option 2: 한 팀씩 (순차)
```
사용자: "Team A부터 시작"

↓

나: Agent A 생성

↓

Team A 개발 완료 후

↓

"Team B 시작"
```

### Option 3: 특정 팀만
```
사용자: "Team B 개발만 해줘"

↓

나: Agent B만 생성

↓

Team B 작업 진행
```

---

## 📁 최종 프로젝트 구조 (완성 후)

```
test5_flappy_bird/
├── index.html                ← 🅱️ B팀
├── README.md                 ← 🅲 C팀
├── .mcp.json                 ← MCP 설정
│
├── css/
│   └── style.css             ← 🅱️ B팀
│
├── js/
│   ├── game.js               ← 🅰️ A팀 (메인)
│   ├── renderer.js           ← 🅰️ A팀
│   ├── ui.js                 ← 🅱️ B팀
│   ├── sound.js              ← 🅲 C팀
│   ├── storage.js            ← 🅲 C팀
│   └── confetti.js           ← 🅲 C팀
│
├── assets/
│   └── sounds/               ← 🅲 C팀
│       ├── jump.mp3
│       ├── point.mp3
│       ├── collision.mp3
│       └── gameover.mp3
│
└── plan/                      ← 개발 문서
    ├── 00-work-methodology.md
    ├── 01-team-a-logic.md
    ├── 02-team-b-ui.md
    ├── 03-team-c-features.md
    ├── MASTER_TERMINAL.md
    ├── TEAM_A_ENV.md
    ├── TEAM_B_ENV.md
    ├── TEAM_C_ENV.md
    └── START_HERE.md (이 파일)
```

---

## 🎯 성공 기준

### Day 1 목표
```
✅ 기본 게임 플레이 가능
   - 새 조종 (점프)
   - 파이프 충돌
   - 점수 표시
   - 반응형 디자인
```

### Day 2 목표
```
✅ 완전한 플래피버드 게임
   - 모든 고급기능
   - GitHub Pages 라이브
   - 모바일 완벽 지원
   - 모든 브라우저 호환
```

---

## 🔗 각 팀의 상세 가이드

| 팀 | 가이드 파일 | 플랜 파일 |
|:---|:---|:---|
| **A** (로직) | [TEAM_A_ENV.md](./TEAM_A_ENV.md) | [01-team-a-logic.md](./plan/01-team-a-logic.md) |
| **B** (UI) | [TEAM_B_ENV.md](./TEAM_B_ENV.md) | [02-team-b-ui.md](./plan/02-team-b-ui.md) |
| **C** (기능) | [TEAM_C_ENV.md](./TEAM_C_ENV.md) | [03-team-c-features.md](./plan/03-team-c-features.md) |

---

## 📞 문제 발생 시

### Q: 웹 서버가 안 됨
```bash
# 포트 8000 사용 중인지 확인
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# 다른 포트 사용
python -m http.server 8001
```

### Q: Canvas가 안 보임
```javascript
// F12 Console
document.getElementById('gameCanvas')
// 없으면 Team B가 index.html 생성 필요
```

### Q: 게임이 안 시작됨
```javascript
// F12 Console
Game.init('medium', 0)
Game.start()
// 에러 메시지 확인
```

### Q: 점수가 저장 안 됨
```javascript
typeof localStorage  // "object" 여야 함
// "undefined"이면 브라우저 설정 확인
```

---

## ✨ 준비 완료!

모든 것이 준비되었습니다.

**지금 바로 이 명령어를 실행하세요:**

```
"3팀 모두 개발 시작해줘"

또는

"Team A 개발 시작"
```

---

## 🎬 최종 체크리스트

- [ ] `.mcp.json` 파일 확인
- [ ] `MASTER_TERMINAL.md` 읽음
- [ ] 웹 서버 실행 가능
- [ ] Chrome DevTools F12 단축키 알고 있음
- [ ] 3개 팀 플랜 파일 위치 알고 있음
- [ ] 에이전트 투입 준비 완료

✅ 모두 확인했으면 개발 시작! 🚀🎉

---

**Happy Coding! Let's build Flappy Bird! 🐦✨**
