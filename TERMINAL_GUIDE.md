# 🖥️ 4개 터미널 실행 가이드

4개 터미널을 다음과 같이 배치하세요:

```
┌─────────────────┬─────────────────┐
│   마스터        │   Team A        │
│  (모니터링)     │  (게임 로직)    │
├─────────────────┼─────────────────┤
│   Team B        │   Team C        │
│  (UI/렌더링)    │  (고급기능)     │
└─────────────────┴─────────────────┘
```

---

## 🖥️ 터미널 1: 마스터 (좌상단)

### 첫 실행
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
python -m http.server 8000
```

화면에 표시되어야 함:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

### 모니터링 (게임 시작 후)
```bash
# 다른 터미널을 모니터링하며, 문제 발생 시 대응
# F12 Console에서 테스트:
#   typeof Game === 'object'
#   typeof Storage === 'object'
#   typeof Sound === 'object'
```

---

## 🅰️ 터미널 2: Team A (우상단)

### Step 1: 디렉토리 이동
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
```

### Step 2: game.js 생성
```bash
# plan/01-team-a-logic.md에서 game.js 코드를 읽고 복사
cat plan/01-team-a-logic.md | grep -A 500 "### game.js 전체 코드" | head -800 > js/game.js

# 또는 직접 에디터에서 코드 복사
# plan/01-team-a-logic.md를 열고 "### game.js 전체 코드" 섹션의 코드 전체를 복사
# 그다음 js/game.js에 붙여넣기
```

### Step 3: renderer.js 생성
```bash
# plan/01-team-a-logic.md에서 renderer.js 코드를 읽고 복사
# plan/01-team-a-logic.md를 열고 "### renderer.js 전체 코드" 섹션의 코드 전체를 복사
# 그다음 js/renderer.js에 붙여넣기
```

### Step 4: 파일 생성 확인
```bash
ls -lh js/game.js js/renderer.js
```

예상 출력:
```
-rw-r--r--  1 user  group  12K  Apr 12 10:00 js/game.js
-rw-r--r--  1 user  group   4K  Apr 12 10:00 js/renderer.js
```

### Step 5: 완료 확인
```bash
# 브라우저 F12 Console에서 (마스터 터미널에서 확인)
# 복붙 가능:
echo "
// F12 Console 테스트:
typeof Game === 'object'
typeof Renderer === 'object'
Game.init('medium', 0)
Game.start()
"
```

완료 시 터미널에 표시:
```
✅ Team A Phase 1 완료
- game.js 생성 (1200줄)
- renderer.js 생성 (300줄)
- Canvas에 파란 배경 렌더링 확인
```

---

## 🅱️ 터미널 3: Team B (좌하단)

### Step 1: 디렉토리 이동
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
```

### Step 2: 폴더 생성
```bash
mkdir -p css
ls -la
```

### Step 3: index.html 생성
```bash
# plan/02-team-b-ui.md에서 전체 HTML 코드를 복사
# "### index.html 전체 코드" 섹션의 코드를 복사해서 index.html에 붙여넣기
# (또는 다음 명령으로 부분적으로 생성 후 수동 완성)

cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>플래피버드</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- plan/02-team-b-ui.md에서 HTML 코드 복사 -->
    <div id="app"></div>
    
    <!-- ⚠️ 매우 중요: script 순서! -->
    <script src="js/storage.js"></script>
    <script src="js/sound.js"></script>
    <script src="js/renderer.js"></script>
    <script src="js/ui.js"></script>
    <script src="js/game.js"></script>
    <script src="js/confetti.js"></script>
</body>
</html>
EOF

echo "✅ index.html 생성됨 (스크립트 순서 확인 필수!)"
```

### Step 4: style.css 생성
```bash
# plan/02-team-b-ui.md에서 CSS 코드를 복사
# "### style.css 전체 코드" 섹션의 코드를 복사해서 css/style.css에 붙여넣기

cat > css/style.css << 'EOF'
/* plan/02-team-b-ui.md에서 CSS 코드 복사 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
}

/* 나머지는 plan/02-team-b-ui.md에서 복사 */
EOF

echo "✅ css/style.css 생성됨"
```

### Step 5: 파일 생성 확인
```bash
ls -lh index.html css/style.css
```

### Step 6: 완료 확인
```bash
# 브라우저에서 http://localhost:8000 열어보기
echo "
✅ Team B Phase 1 완료
- index.html 생성 (스크립트 순서 포함!)
- css/style.css 생성
- 브라우저에서 시작 화면 확인
"
```

---

## 🅲 터미널 4: Team C (우하단)

### Step 1: 디렉토리 이동
```bash
cd C:\Users\iw\Desktop\test5_flappy_bird\.claude\worktrees\ticklish-launching-flask
```

### Step 2: 폴더 생성
```bash
mkdir -p assets/sounds
ls -la js/
```

### Step 3: storage.js 생성
```bash
# plan/03-team-c-features.md에서 storage.js 코드를 복사
# "### storage.js 전체 코드" 섹션의 코드를 복사해서 js/storage.js에 붙여넣기

echo "⏳ js/storage.js 생성 중..."
# (코드 붙여넣기)
echo "✅ js/storage.js 생성됨"
```

### Step 4: sound.js 생성
```bash
# plan/03-team-c-features.md에서 sound.js 코드를 복사
# "### sound.js 전체 코드" 섹션의 코드를 복사해서 js/sound.js에 붙여넣기

echo "⏳ js/sound.js 생성 중..."
# (코드 붙여넣기)
echo "✅ js/sound.js 생성됨"
```

### Step 5: 파일 생성 확인
```bash
ls -lh js/storage.js js/sound.js
```

예상 출력:
```
-rw-r--r--  1 user  group  3.5K  Apr 12 10:00 js/storage.js
-rw-r--r--  1 user  group  2.8K  Apr 12 10:00 js/sound.js
```

### Step 6: 완료 확인
```bash
# 브라우저 F12 Console에서 테스트:
echo "
// F12 Console 테스트:
typeof Storage === 'object'
Storage.getBestScore()
typeof Sound === 'object'
Sound.isMuted()
"

echo "
✅ Team C Phase 1 완료
- storage.js 생성 (API: saveBestScore, getBestScore, getTop3)
- sound.js 생성 (API: play, toggleMute, isMuted)
"
```

---

## 📊 마스터 모니터링 (터미널 1)

### 1분마다 실행할 체크:

```bash
# 체크 1: 파일 생성 여부
echo "=== 📁 파일 상태 ==="
ls -1 js/ | grep -E "^(game|renderer|storage|sound)" | wc -l
# 4개 파일이 모두 생성되어야 함

# 체크 2: 파일 크기
echo "=== 📊 파일 크기 ==="
ls -lh js/game.js js/renderer.js js/storage.js js/sound.js 2>/dev/null || echo "⏳ 파일 생성 대기 중..."

# 체크 3: index.html 존재 확인
echo "=== 🌐 HTML ==="
test -f index.html && echo "✅ index.html" || echo "❌ index.html 없음"
test -f css/style.css && echo "✅ style.css" || echo "❌ style.css 없음"

# 체크 4: script 태그 순서 확인
echo "=== 📜 Script 순서 ==="
grep -o 'src="js/[^"]*"' index.html 2>/dev/null | head -6

# 체크 5: 브라우저 F12 Console에서 직접 확인
echo "=== 🔍 API 로드 (F12 Console에서) ==="
echo "typeof Game === 'object'"
echo "typeof Storage === 'object'"
echo "typeof Sound === 'object'"
echo "typeof UI === 'object'"
```

---

## ✅ 각 팀의 완료 기준

### Team A Phase 1 완료
```
✅ js/game.js 존재 (1200줄 이상)
✅ js/renderer.js 존재 (300줄 이상)
✅ F12 Console: typeof Game === 'object' → true
✅ F12 Console: Game.init('medium', 0) → 에러 없음
✅ Canvas에 파란 배경 보임
```

### Team B Phase 1 완료
```
✅ index.html 존재
✅ css/style.css 존재
✅ index.html 내 script 순서 확인 (storage → sound → renderer → ui → game → confetti)
✅ 브라우저에서 http://localhost:8000 열면 시작 화면 보임
✅ 반응형 테스트 (F12에서 375px 모바일 크기로 확인)
```

### Team C Phase 1 완료
```
✅ js/storage.js 존재 (API: saveBestScore, getBestScore, getTop3, saveScore)
✅ js/sound.js 존재 (API: play, toggleMute, isMuted)
✅ F12 Console: typeof Storage === 'object' → true
✅ F12 Console: Storage.getBestScore() → 0 또는 숫자 반환
✅ F12 Console: typeof Sound === 'object' → true
```

---

## 🚀 실행 순서 (5초 간격)

```
[00:00] 마스터: python -m http.server 8000 시작

[00:05] Team A: 터미널에서
        - cd 디렉토리
        - plan/01-team-a-logic.md 읽고 game.js + renderer.js 생성

[00:10] Team B: 터미널에서
        - cd 디렉토리
        - plan/02-team-b-ui.md 읽고 index.html + style.css 생성

[00:15] Team C: 터미널에서
        - cd 디렉토리
        - plan/03-team-c-features.md 읽고 storage.js + sound.js 생성

[01:00] 마스터: 모니터링 체크 시작
```

---

각 팀이 터미널에서 작업하는 모습이 보일 것입니다! 🎯
