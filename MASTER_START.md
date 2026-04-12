# 🎛️ 마스터 터미널 - 3팀 순차 시작 가이드

## 🖥️ 4개 터미널 배치

```
┌────────────────────┬────────────────────┐
│   터미널 1         │   터미널 2         │
│   MASTER           │   Team A           │
│  (웹 서버 + 모니) │  (게임 로직)       │
├────────────────────┼────────────────────┤
│   터미널 3         │   터미널 4         │
│   Team B           │   Team C           │
│  (UI/렌더링)      │  (고급기능/배포)  │
└────────────────────┴────────────────────┘
```

---

## 🎯 마스터 터미널 (터미널 1) - 명령어

### 00:00 - 웹 서버 시작
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
python -m http.server 8000
```

**화면에 보여야 할 메시지:**
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

## 🅰️ Team A 터미널 (터미널 2) - 명령어 (00:05 시작)

**5초 경과 후:**

```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
bash team_a_start.sh
```

**스크립트가 할 일:**
1. 현재 위치 확인
2. js/ 디렉토리 확인
3. plan/01-team-a-logic.md 읽고 game.js 코드 복사해서 js/game.js 생성
4. plan/01-team-a-logic.md 읽고 renderer.js 코드 복사해서 js/renderer.js 생성
5. 파일 생성 완료 대기 → 마스터에 보고

---

## 🅱️ Team B 터미널 (터미널 3) - 명령어 (00:10 시작)

**10초 경과 후 (Team A 시작 5초 후):**

```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
bash team_b_start.sh
```

**스크립트가 할 일:**
1. 현재 위치 확인
2. css/ 폴더 생성
3. plan/02-team-b-ui.md 읽고 index.html 코드 복사 (⚠️ script 순서 포함!)
4. plan/02-team-b-ui.md 읽고 style.css 코드 복사해서 css/style.css 생성
5. plan/02-team-b-ui.md 읽고 ui.js 코드 복사해서 js/ui.js 생성
6. 파일 생성 완료 대기 → 마스터에 보고

---

## 🅲 Team C 터미널 (터미널 4) - 명령어 (00:15 시작)

**15초 경과 후 (Team A 시작 10초 후):**

```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
bash team_c_start.sh
```

**스크립트가 할 일:**
1. 현재 위치 확인
2. assets/sounds/ 폴더 생성
3. plan/03-team-c-features.md 읽고 storage.js 코드 복사해서 js/storage.js 생성
4. plan/03-team-c-features.md 읽고 sound.js 코드 복사해서 js/sound.js 생성
5. 파일 생성 완료 대기 → 마스터에 보고

---

## 📊 타임라인

```
[00:00] MASTER: python -m http.server 8000 시작
        ↓
[00:05] TEAM A: bash team_a_start.sh 실행
        "game.js, renderer.js 생성 대기 중..."
        ↓
[00:10] TEAM B: bash team_b_start.sh 실행
        "index.html, style.css, ui.js 생성 대기 중..."
        ↓
[00:15] TEAM C: bash team_c_start.sh 실행
        "storage.js, sound.js 생성 대기 중..."
        ↓
[~03:00] TEAM A: ✅ game.js + renderer.js 완성
        ↓
[~03:30] TEAM B: ✅ index.html + style.css + ui.js 완성
        ↓
[~04:00] TEAM C: ✅ storage.js + sound.js 완성
        ↓
[04:00+] MASTER: 모니터링 시작 (1분 체크)
```

---

## ✅ 마스터 모니터링 - 1분마다 체크

### 1분 체크 (전체 명령)

```bash
#!/bin/bash
echo "=== 📊 [$(date '+%H:%M:%S')] 1분 체크 ==="
echo ""

# 1. 파일 생성 확인
echo "📁 생성된 파일:"
ls -1 js/game.js js/renderer.js js/storage.js js/sound.js 2>/dev/null | wc -l
echo "  (4개 완료: game.js, renderer.js, storage.js, sound.js)"
echo ""

# 2. HTML/CSS 확인
echo "🌐 HTML/CSS:"
test -f index.html && echo "  ✅ index.html" || echo "  ❌ index.html"
test -f css/style.css && echo "  ✅ style.css" || echo "  ❌ style.css"
echo ""

# 3. UI 파일 확인
echo "🎨 UI:"
test -f js/ui.js && echo "  ✅ ui.js" || echo "  ❌ ui.js"
echo ""

# 4. 서버 상태
echo "🌐 서버:"
curl -s http://localhost:8000 > /dev/null && echo "  ✅ 정상" || echo "  ❌ 오류"
echo ""

# 5. API 확인 (F12 Console에서 직접 복사해서 실행)
echo "🔍 API 확인 (F12 Console에서 실행):"
cat << 'EOF'
// 복사해서 F12 Console에 붙여넣으세요:
console.log("=== API 확인 ===");
console.log("Game:", typeof Game === 'object' ? '✅' : '❌');
console.log("Storage:", typeof Storage === 'object' ? '✅' : '❌');
console.log("Sound:", typeof Sound === 'object' ? '✅' : '❌');
console.log("UI:", typeof UI === 'object' ? '✅' : '❌');
console.log("Renderer:", typeof Renderer === 'object' ? '✅' : '❌');
EOF
echo ""
```

### 수동 체크 항목

각 시간마다 마스터가 확인해야 할 것:

**[00:05 - Team A 시작 5초 후]**
```
Team A 터미널 확인:
- "game.js 감지됨!" 메시지 나타났나?
```

**[00:10 - Team B 시작]**
```
Team B 터미널 확인:
- "index.html 감지됨!" 메시지 나타났나?
```

**[00:15 - Team C 시작]**
```
Team C 터미널 확인:
- "js/storage.js 감지됨!" 메시지 나타났나?
```

**[03:00 - 대략 팀 A 완료]**
```
Team A 터미널 확인:
- "🎉 Phase 1 완료!" 메시지 나타났나?
- js/game.js와 js/renderer.js 파일 크기는?
```

**[04:00+ - 모든 팀 완료]**
```
F12 Console에서 테스트:

// Game API 확인
typeof Game === 'object'
Game.init('medium', 0)
Game.start()

// Storage API 확인
typeof Storage === 'object'
Storage.getBestScore()
Storage.getTop3()

// Sound API 확인
typeof Sound === 'object'
Sound.isMuted()

// Canvas 렌더링 확인
// → Canvas에 파란 배경 + 새 아이콘이 보이는가?
```

---

## 🎯 성공 표시

### Team A 완료 ✅
```
터미널 2에서:
"🎉 Phase 1 완료!"
"Canvas에 파란 배경이 보여야 합니다!"
```

### Team B 완료 ✅
```
터미널 3에서:
"🎉 Phase 1 완료!"
"http://localhost:8000 열기"
"→ 시작 화면이 보여야 함"
```

### Team C 완료 ✅
```
터미널 4에서:
"🎉 Phase 1 완료!"
"Storage.getBestScore() 호출 가능"
"Sound.isMuted() 호출 가능"
```

---

## 🚨 문제 발생 시

### 문제 1: Team A의 game.js가 생성되지 않음 (5분 이상)
```
마스터 액션:
1. Team A 터미널 확인
2. plan/01-team-a-logic.md를 열었나?
3. "### game.js 전체 코드" 섹션을 찾았나?
4. 코드를 js/game.js에 붙여넣었나?
```

### 문제 2: Script 순서가 잘못됨
```
마스터 액션:
1. Team B 터미널 확인
2. index.html의 <script> 태그 순서:
   1번: storage.js
   2번: sound.js
   3번: renderer.js
   4번: ui.js
   5번: game.js
   6번: confetti.js
3. 순서가 틀리면 Team B에 수정 요청
```

### 문제 3: F12 Console에 빨간 에러
```
마스터 액션:
1. 에러 메시지 읽기
2. 어느 팀의 파일 문제인지 파악
3. 해당 팀에 보고 및 수정 지시
```

---

## 📞 마스터-팀 커뮤니케이션

```
마스터 → Team A:
"Team A, game.js와 renderer.js 생성 상태 어떻게 되나요?"

Team A → 마스터:
"현재 plan/01-team-a-logic.md를 읽고 있습니다. 
game.js 코드 복사 중..."

마스터 → Team A:
"좋습니다. 완료되면 바로 보고해주세요."

Team A → 마스터:
"✅ game.js 생성됨! 이제 renderer.js 만드는 중..."

...

Team A → 마스터:
"✅ Phase 1 완료! game.js + renderer.js 준비됨."
```

---

## 🎉 최종 체크리스트

### 마스터 완료 시 확인
```
✅ 웹 서버 실행 중 (python -m http.server 8000)
✅ Team A: game.js + renderer.js 생성 (각 팀 터미널에서 보임)
✅ Team B: index.html + style.css + ui.js 생성
✅ Team C: storage.js + sound.js 생성
✅ 브라우저: http://localhost:8000 접속 가능
✅ Canvas: 파란 배경 렌더링
✅ F12 Console: 에러 0개
✅ API: Game, Storage, Sound, UI 모두 로드됨
```

---

**준비 완료!** 🚀

이제 각 팀의 터미널에서 다음 명령을 실행하세요:

**마스터 터미널:**
```bash
python -m http.server 8000
```

**Team A 터미널 (5초 후):**
```bash
bash team_a_start.sh
```

**Team B 터미널 (10초 후):**
```bash
bash team_b_start.sh
```

**Team C 터미널 (15초 후):**
```bash
bash team_c_start.sh
```
