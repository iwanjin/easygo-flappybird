#!/bin/bash
# 🅱️ Team B UI/렌더링 개발 시작 스크립트

echo "🅱️  ============================================"
echo "   Team B: UI/렌더링 개발 (index.html + CSS + ui.js)"
echo "============================================"
echo ""

# Step 1: 현재 디렉토리 확인
echo "📍 현재 위치:"
pwd
echo ""

# Step 2: 폴더 생성
echo "📁 폴더 준비..."
mkdir -p css
ls -la | grep -E "^d.*css"
echo ""

# Step 3: index.html 생성 안내
echo "📖 다음 단계:"
echo "1. plan/02-team-b-ui.md를 열기"
echo "2. '### index.html 전체 코드' 섹션 찾기"
echo "3. <!DOCTYPE html>부터 </html>까지 전체 복사"
echo ""
echo "⚠️  중요: index.html에는 다음 script 태그 순서 포함:"
echo "   <script src='js/storage.js'></script>    <!-- 1번 -->"
echo "   <script src='js/sound.js'></script>      <!-- 2번 -->"
echo "   <script src='js/renderer.js'></script>   <!-- 3번 -->"
echo "   <script src='js/ui.js'></script>         <!-- 4번 -->"
echo "   <script src='js/game.js'></script>       <!-- 5번 -->"
echo "   <script src='js/confetti.js'></script>   <!-- 6번 -->"
echo ""
echo "4. index.html 파일 생성 후 붙여넣기"
echo ""

# 파일이 생성될 때까지 대기
max_wait=600  # 10분
elapsed=0
interval=5

echo "⏳ index.html 생성 대기 중..."
while [ ! -f "index.html" ] && [ $elapsed -lt $max_wait ]; do
    sleep $interval
    elapsed=$((elapsed + interval))
    echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
done

if [ -f "index.html" ]; then
    echo ""
    echo "✅ index.html 감지됨!"

    # Script 태그 순서 확인
    echo ""
    echo "📜 Script 태그 순서 확인:"
    grep -o 'src="js/[^"]*"' index.html | head -6 || echo "❌ script 태그 찾기 실패"
    echo ""

    # Step 4: style.css 생성 안내
    echo "📖 다음 단계:"
    echo "1. plan/02-team-b-ui.md 다시 열기"
    echo "2. '### style.css 전체 코드' 섹션 찾기"
    echo "3. 전체 CSS 코드 복사"
    echo "4. css/style.css 파일 생성 후 붙여넣기"
    echo ""

    # style.css 생성 대기
    echo "⏳ css/style.css 생성 대기 중..."
    elapsed=0
    while [ ! -f "css/style.css" ] && [ $elapsed -lt $max_wait ]; do
        sleep $interval
        elapsed=$((elapsed + interval))
        echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
    done

    if [ -f "css/style.css" ]; then
        echo ""
        echo "✅ css/style.css 감지됨!"
        echo ""

        # Step 5: ui.js 생성 안내
        echo "📖 다음 단계:"
        echo "1. plan/02-team-b-ui.md 다시 열기"
        echo "2. '### ui.js 전체 코드' 섹션 찾기"
        echo "3. const UI = (() => { ... })(); 부분을 전체 복사"
        echo "4. js/ui.js 파일 생성 후 붙여넣기"
        echo ""

        echo "⏳ js/ui.js 생성 대기 중..."
        elapsed=0
        while [ ! -f "js/ui.js" ] && [ $elapsed -lt $max_wait ]; do
            sleep $interval
            elapsed=$((elapsed + interval))
            echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
        done

        if [ -f "js/ui.js" ]; then
            echo ""
            echo "✅ js/ui.js 감지됨!"
            echo ""
            wc -l js/ui.js
            echo ""
            echo "🎉 Phase 1 완료!"
            echo ""
            echo "마스터 테스트 (브라우저에서):"
            echo "  http://localhost:8000 열기"
            echo "  → 시작 화면이 보여야 함"
            echo ""
            echo "모바일 반응형 테스트 (F12):"
            echo "  Ctrl+Shift+M"
            echo "  → 375px 크기에서도 정상이어야 함"
        else
            echo ""
            echo "❌ js/ui.js 생성 타임아웃 (10분)"
        fi
    else
        echo ""
        echo "❌ css/style.css 생성 타임아웃 (10분)"
    fi
else
    echo ""
    echo "❌ index.html 생성 타임아웃 (10분)"
fi

echo ""
echo "Team B 작업 완료!"
