#!/bin/bash
# 🅲 Team C 고급기능/배포 개발 시작 스크립트

echo "🅲  ============================================"
echo "   Team C: 고급기능/배포 (storage.js + sound.js)"
echo "============================================"
echo ""

# Step 1: 현재 디렉토리 확인
echo "📍 현재 위치:"
pwd
echo ""

# Step 2: 폴더 생성
echo "📁 폴더 준비..."
mkdir -p assets/sounds
mkdir -p js
ls -la | grep -E "^d.*(assets|js)"
echo ""

# Step 3: storage.js 생성 안내
echo "📖 다음 단계:"
echo "1. plan/03-team-c-features.md를 열기"
echo "2. '### storage.js 전체 코드' 섹션 찾기"
echo "3. const Storage = (() => { ... })(); 부분을 전체 복사"
echo ""
echo "⚠️  중요: Storage API 함수"
echo "   - saveScore(score)       # 모든 점수 저장"
echo "   - saveBestScore(score)   # 신기록 판정 (saveScore 호출 후)"
echo "   - getBestScore()         # 최고점 반환"
echo "   - getTop3()              # TOP3 반환 (getTop3Scores 아님!)"
echo ""
echo "4. js/storage.js 파일 생성 후 붙여넣기"
echo ""

# 파일이 생성될 때까지 대기
max_wait=600  # 10분
elapsed=0
interval=5

echo "⏳ js/storage.js 생성 대기 중..."
while [ ! -f "js/storage.js" ] && [ $elapsed -lt $max_wait ]; do
    sleep $interval
    elapsed=$((elapsed + interval))
    echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
done

if [ -f "js/storage.js" ]; then
    echo ""
    echo "✅ js/storage.js 감지됨!"
    echo ""
    wc -l js/storage.js
    echo ""

    # Step 4: sound.js 생성 안내
    echo "📖 다음 단계:"
    echo "1. plan/03-team-c-features.md 다시 열기"
    echo "2. '### sound.js 전체 코드' 섹션 찾기"
    echo "3. const Sound = (() => { ... })(); 부분을 전체 복사"
    echo ""
    echo "⚠️  중요: Sound API 함수"
    echo "   - play(type)      # 'jump'|'point'|'collision'|'gameover'"
    echo "   - toggleMute()    # 음소거 토글"
    echo "   - isMuted()       # 음소거 상태 확인"
    echo "   - setMuted(bool)  # 음소거 설정"
    echo ""
    echo "⚠️  중요: Sound 이벤트 수신"
    echo "   - bird:jumped"
    echo "   - pipe:passed"
    echo "   - game:over"
    echo ""
    echo "4. js/sound.js 파일 생성 후 붙여넣기"
    echo ""

    # sound.js 생성 대기
    echo "⏳ js/sound.js 생성 대기 중..."
    elapsed=0
    while [ ! -f "js/sound.js" ] && [ $elapsed -lt $max_wait ]; do
        sleep $interval
        elapsed=$((elapsed + interval))
        echo -ne "\r⏳ 대기 중... (${elapsed}초 경과)"
    done

    if [ -f "js/sound.js" ]; then
        echo ""
        echo "✅ js/sound.js 감지됨!"
        echo ""
        wc -l js/sound.js
        echo ""
        echo "🎉 Phase 1 완료!"
        echo ""
        echo "마스터 테스트 (F12 Console에서):"
        echo "  typeof Storage === 'object'   # true?"
        echo "  Storage.getBestScore()        # 숫자 반환?"
        echo "  typeof Sound === 'object'     # true?"
        echo "  Sound.isMuted()               # false?"
        echo ""
        echo "마지막 확인:"
        echo "  localStorage 정상 작동?"
        echo "  Web Audio API 초기화?"
    else
        echo ""
        echo "❌ js/sound.js 생성 타임아웃 (10분)"
    fi
else
    echo ""
    echo "❌ js/storage.js 생성 타임아웃 (10분)"
fi

echo ""
echo "Team C 작업 완료!"
