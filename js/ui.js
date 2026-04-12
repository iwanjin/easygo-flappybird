const UI = (() => {
  // ===== PRIVATE 변수 =====
  let selectedDifficulty = 'medium';
  const screenNames = ['start', 'game', 'gameover'];

  // ===== PRIVATE 함수 =====

  /**
   * 화면을 전환하는 함수
   * @param {string} screenName - 'start', 'game', 'gameover'
   */
  function showScreen(screenName) {
    // 모든 screen 숨기기
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.add('hidden');
    });

    // 해당 screen 보이기
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
      targetScreen.classList.remove('hidden');
    }
  }

  /**
   * 난이도 선택 이벤트 바인딩
   */
  function bindDifficultyButtons() {
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    difficultyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 이전 선택 제거
        difficultyBtns.forEach(b => b.classList.remove('active'));

        // 현재 선택 표시
        btn.classList.add('active');

        // 난이도 저장
        selectedDifficulty = btn.dataset.difficulty;
        console.log('선택된 난이도:', selectedDifficulty);
      });
    });
  }

  /**
   * 게임 시작 버튼 바인딩
   */
  function bindStartButton() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        console.log('게임 시작:', selectedDifficulty);

        // A팀의 Game.start() 호출
        if (typeof Game !== 'undefined' && Game.start) {
          Game.start(selectedDifficulty);
          showScreen('game');
        } else {
          console.error('Game 모듈을 찾을 수 없습니다');
        }
      });
    }
  }

  /**
   * 일시정지 버튼 바인딩
   */
  function bindPauseButton() {
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (typeof Game !== 'undefined' && Game.pause) {
          Game.pause();
        }
      });
    }
  }

  /**
   * 재시작 버튼 바인딩
   */
  function bindRestartButton() {
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        console.log('게임 재시작');

        // A팀의 Game.reset() 호출
        if (typeof Game !== 'undefined' && Game.reset) {
          Game.reset();
          showScreen('start');
        }
      });
    }
  }

  /**
   * 점수 업데이트 (게임 중)
   * A팀의 'game:scoreUpdated' 이벤트에서 호출
   * @param {number} score - 현재 점수
   */
  function updateScore(score) {
    const scoreSpan = document.querySelector('#score span');
    if (scoreSpan) {
      scoreSpan.textContent = String(score);
    }
  }

  /**
   * 게임 오버 화면 표시
   * A팀의 'game:over' 이벤트에서 호출
   * @param {object} result - { score, bestScore, top3Scores }
   */
  function showGameOverScreen(result) {
    // 최종 점수
    const finalScoreSpan = document.querySelector('#final-score span');
    if (finalScoreSpan) {
      finalScoreSpan.textContent = String(result.score || 0);
    }

    // 최고 기록
    const bestScoreSpan = document.querySelector('#best-score span');
    if (bestScoreSpan) {
      bestScoreSpan.textContent = String(result.bestScore || 0);
    }

    // TOP 3 점수
    const topScoresList = document.getElementById('top-scores-list');
    if (topScoresList && result.top3Scores) {
      topScoresList.innerHTML = '';
      result.top3Scores.forEach(score => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'score-value';
        span.textContent = String(score);
        li.appendChild(span);
        topScoresList.appendChild(li);
      });
    }

    // 게임 오버 화면 표시
    showScreen('gameover');
  }

  /**
   * 게임 이벤트 구독
   * A팀이 발행하는 이벤트들을 수신
   */
  function subscribeGameEvents() {
    // 점수 업데이트 이벤트
    document.addEventListener('game:scoreUpdated', (e) => {
      updateScore(e.detail.score);
    });

    // 게임 오버 이벤트
    document.addEventListener('game:over', (e) => {
      showGameOverScreen(e.detail);
    });

    // 게임 일시정지 이벤트 (선택사항)
    document.addEventListener('game:paused', (e) => {
      console.log('게임이 일시정지되었습니다');
    });
  }

  // ===== PUBLIC API =====
  return {
    /**
     * UI 모듈 초기화
     * 모든 이벤트 리스너 등록
     */
    init() {
      console.log('UI 모듈 초기화 중...');

      bindDifficultyButtons();
      bindStartButton();
      bindPauseButton();
      bindRestartButton();
      subscribeGameEvents();

      // 초기 화면: 시작 화면
      showScreen('start');

      console.log('UI 모듈 초기화 완료');
    },

    /**
     * 게임 화면으로 전환
     */
    showGameScreen() {
      showScreen('game');
    },

    /**
     * 게임 오버 화면으로 전환
     * @param {object} result - { score, bestScore, top3Scores }
     */
    showGameOverScreen(result) {
      showGameOverScreen(result);
    },

    /**
     * 점수 업데이트 (외부에서 호출 가능)
     * @param {number} value - 새 점수
     */
    updateScore(value) {
      updateScore(value);
    },

    /**
     * 현재 선택된 난이도 반환
     */
    getSelectedDifficulty() {
      return selectedDifficulty;
    }
  };
})();

// ===== 게임 시작 시 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
