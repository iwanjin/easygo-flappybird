#!/bin/bash
# 🅰️ Team A 게임 로직 개발 시작 스크립트

echo "🅰️  ============================================"
echo "   Team A: 게임 로직 개발 (game.js + renderer.js)"
echo "============================================"
echo ""

# Step 1: 현재 디렉토리 확인
echo "📍 현재 위치:"
pwd
echo ""

# Step 2: js 디렉토리 확인
echo "📁 js 디렉토리 확인..."
ls -la js/ 2>/dev/null || echo "❌ js/ 디렉토리 없음"
echo ""

# Step 3: plan 파일 읽기 안내
echo "📖 다음 단계:"
echo "1. plan/01-team-a-logic.md를 열기"
echo "2. '### game.js 전체 코드' 섹션 찾기"
echo "3. const Game = (() => { ... })(); 부분을 전체 복사"
echo "4. js/game.js 파일 생성 후 붙여넣기"
echo ""

# Step 4: game.js 생성 여부 대기
echo "⏳ game.js 생성 대기 중..."
echo "   (plan/01-team-a-logic.md 읽고 코드를 js/game.js에 붙여넣으세요)"
echo ""

# 파일이 생성될 때까지 대기
max_wait=600  # 10분
elapsed=0
interval=5

while [ ! -f "js/game.js" ] && [ $elapsed -lt $max_wait ]; do
    sleep $interval
    elapsed=$((elapsed + interval))
    echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
done

if [ -f "js/game.js" ]; then
    echo ""
    echo "✅ game.js 감지됨!"
    echo ""
    wc -l js/game.js
    echo ""

    # Step 5: renderer.js 생성 안내
    echo "📖 다음 단계:"
    echo "1. plan/01-team-a-logic.md 다시 열기"
    echo "2. '### renderer.js 전체 코드' 섹션 찾기"
    echo "3. const Renderer = (() => { ... })(); 부분을 전체 복사"
    echo "4. js/renderer.js 파일 생성 후 붙여넣기"
    echo ""

    # renderer.js 생성 대기
    echo "⏳ renderer.js 생성 대기 중..."
    elapsed=0
    while [ ! -f "js/renderer.js" ] && [ $elapsed -lt $max_wait ]; do
        sleep $interval
        elapsed=$((elapsed + interval))
        echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
    done

    if [ -f "js/renderer.js" ]; then
        echo ""
        echo "✅ renderer.js 감지됨!"
        echo ""
        wc -l js/renderer.js
        echo ""
        echo "🎉 Phase 1 완료!"
        echo ""
        echo "마스터 테스트 (F12 Console에서):"
        echo "  typeof Game === 'object'      # true?"
        echo "  typeof Renderer === 'object'  # true?"
        echo "  Game.init('medium', 0)        # 에러 없음?"
        echo "  Game.start()                  # 에러 없음?"
        echo ""
        echo "Canvas에 파란 배경이 보여야 합니다!"
    else
        echo ""
        echo "❌ renderer.js 생성 타임아웃 (10분)"
    fi
else
    echo ""
    echo "❌ game.js 생성 타임아웃 (10분)"
fi

echo ""
echo "Team A 작업 완료!"
