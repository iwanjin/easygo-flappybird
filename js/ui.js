const UI = (() => {
  // ===== PRIVATE 변수 =====
  let selectedDifficulty = 'medium';
  const screenNames = ['start', 'game', 'gameover'];
  let settingsOpen = false;
  let settingsPanel = null;

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

        // A팀의 Game API 호출
        if (typeof Game !== 'undefined' && Game.init && Game.start) {
          Game.init(selectedDifficulty, 0);  // 난이도, 캐릭터
          Game.start();
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

  // ===== 팝업 효과 =====

  /**
   * +1 점수 플로팅 팝업 표시
   * Canvas 위에 점수 획득 시 떠오르는 텍스트
   */
  function showScorePopup(score) {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = '+1';

    // Canvas 중앙 상단에 표시
    popup.style.left = (rect.left + rect.width / 2 - 15) + 'px';
    popup.style.top = (rect.top + rect.height * 0.3) + 'px';

    document.body.appendChild(popup);

    // 애니메이션 후 제거
    setTimeout(() => popup.remove(), 800);
  }

  /**
   * 신기록 축하 팝업 표시
   * @param {number} score - 신기록 점수
   */
  function showNewRecordPopup(score) {
    const popup = document.createElement('div');
    popup.className = 'new-record-popup';
    popup.innerHTML = `
      <div class="record-label">NEW RECORD!</div>
      <span class="record-score">${score}</span>
      <div class="record-stars">&#11088;&#11088;&#11088;</div>
    `;

    document.body.appendChild(popup);

    // 2.5초 후 페이드아웃 + 제거
    setTimeout(() => {
      popup.classList.add('new-record-fadeout');
      setTimeout(() => popup.remove(), 400);
    }, 2500);
  }

  /**
   * 점수 카운트업 애니메이션
   * @param {HTMLElement} element - 점수를 표시할 span
   * @param {number} target - 목표 점수
   */
  function animateScoreCount(element, target) {
    if (target === 0) {
      element.textContent = '0';
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      element.textContent = String(current);
    }, 40);
  }

  // ===== 배지 =====

  /**
   * 배지 표시 (Phase 2)
   * @param {string} emoji - 배지 이모지
   * @param {string} title - 배지 제목
   */
  function showBadge(emoji, title) {
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'achievement-badge';
    badgeContainer.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 8px;">${emoji}</div>
      <div style="font-size: 14px; font-weight: bold;">${title}</div>
    `;

    document.body.appendChild(badgeContainer);

    // 3초 후 제거 (CSS 애니메이션)
    setTimeout(() => {
      badgeContainer.style.opacity = '0';
      badgeContainer.style.transition = 'opacity 0.3s ease';
      setTimeout(() => badgeContainer.remove(), 300);
    }, 2700);
  }

  /**
   * 달성한 배지 목록 조회 (Phase 2)
   * @param {number} score - 현재 점수
   * @returns {array} 배지 배열 [{ emoji, title }, ...]
   */
  function getAchievedBadges(score) {
    const badges = [];

    if (score > 0) {
      badges.push({ emoji: '\u{1F947}', title: '첫 도전' });
    }
    if (score >= 10) {
      badges.push({ emoji: '\u{1F3AF}', title: '10점 달성' });
    }
    if (score >= 50) {
      badges.push({ emoji: '\u{1F3C5}', title: '50점 달성' });
    }
    if (score >= 100) {
      badges.push({ emoji: '\u{1F451}', title: '100점 달성' });
    }

    return badges;
  }

  // ===== 설정 패널 =====

  /**
   * 설정 버튼 생성 및 바인딩
   */
  function setupSettingsButton() {
    const btn = document.getElementById('settings-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (settingsOpen) {
        closeSettingsPanel();
      } else {
        openSettingsPanel();
      }
    });

    // 패널 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (settingsOpen && settingsPanel && !settingsPanel.contains(e.target) && e.target.id !== 'settings-btn') {
        closeSettingsPanel();
      }
    });
  }

  /**
   * 설정 패널 열기
   */
  function openSettingsPanel() {
    if (settingsPanel) settingsPanel.remove();

    settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';

    // 사운드 ON/OFF 상태
    const isMuted = (typeof Sound !== 'undefined') ? Sound.isMuted() : false;

    // 현재 테마
    const currentTheme = (typeof Theme !== 'undefined' && Theme.get) ? Theme.get().name : 'light';

    // 테마 목록
    const allThemes = (typeof Theme !== 'undefined' && Theme.getAll) ? Theme.getAll() : [];

    settingsPanel.innerHTML = `
      <h4>Settings</h4>
      <div class="settings-row">
        <label>Sound</label>
        <button class="toggle-switch ${!isMuted ? 'active' : ''}" id="sound-toggle"></button>
      </div>
      <div class="settings-row" style="flex-direction: column; align-items: flex-start;">
        <label style="margin-bottom: 6px;">Theme</label>
        <div class="theme-grid">
          ${allThemes.map(t => `
            <button class="theme-option ${t.name === currentTheme ? 'active' : ''}" data-theme="${t.name}">
              ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.body.appendChild(settingsPanel);
    settingsOpen = true;

    // 사운드 토글 이벤트
    const soundToggle = settingsPanel.querySelector('#sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (typeof Sound !== 'undefined' && Sound.toggleMute) {
          const nowMuted = Sound.toggleMute();
          soundToggle.classList.toggle('active', !nowMuted);
        }
      });
    }

    // 테마 선택 이벤트
    const themeButtons = settingsPanel.querySelectorAll('.theme-option');
    themeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const themeName = btn.dataset.theme;
        if (typeof Theme !== 'undefined' && Theme.set) {
          Theme.set(themeName);
          // active 클래스 갱신
          themeButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  /**
   * 설정 패널 닫기
   */
  function closeSettingsPanel() {
    if (settingsPanel) {
      settingsPanel.classList.add('closing');
      setTimeout(() => {
        if (settingsPanel) {
          settingsPanel.remove();
          settingsPanel = null;
        }
      }, 200);
    }
    settingsOpen = false;
  }

  // ===== 게임오버 화면 =====

  /**
   * 게임 오버 화면 표시
   * A팀의 'game:over' 이벤트에서 호출
   * @param {object} result - { score, character }
   */
  function showGameOverScreen(result) {
    const finalScore = result.score || 0;

    // 최종 점수 (카운트업 애니메이션)
    const finalScoreSpan = document.querySelector('#final-score span');
    if (finalScoreSpan) {
      animateScoreCount(finalScoreSpan, finalScore);
    }

    // 최고 기록 - Storage API에서 직접 조회
    const bestScoreSpan = document.querySelector('#best-score span');
    if (bestScoreSpan && typeof Storage !== 'undefined') {
      const bestScore = Storage.getBestScore();
      bestScoreSpan.textContent = String(bestScore || 0);
    }

    // TOP 3 점수 - Storage API에서 직접 조회
    const topScoresList = document.getElementById('top-scores-list');
    if (topScoresList && typeof Storage !== 'undefined') {
      const top3 = Storage.getTop3();
      topScoresList.innerHTML = '';
      top3.forEach(item => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'score-value';
        span.textContent = String(item.score || 0);
        li.appendChild(span);
        topScoresList.appendChild(li);
      });

      // 부족한 항목 채우기 (3개 미만일 경우)
      while (topScoresList.children.length < 3) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.className = 'score-value';
        span.textContent = '-';
        li.appendChild(span);
        topScoresList.appendChild(li);
      }
    }

    // 배지 표시
    const badges = getAchievedBadges(finalScore);
    badges.forEach((badge, index) => {
      setTimeout(() => {
        showBadge(badge.emoji, badge.title);
      }, 800 + index * 600);  // 게임오버 팝업 후 약간 딜레이
    });

    // 통계 표시
    if (typeof Storage !== 'undefined') {
      const avgScoreSpan = document.getElementById('avg-score');
      const playCountSpan = document.getElementById('play-count');
      const totalScoreSpan = document.getElementById('total-score');

      if (avgScoreSpan) {
        avgScoreSpan.textContent = String(Storage.getAverageScore());
      }
      if (playCountSpan) {
        playCountSpan.textContent = String(Storage.getPlayCount());
      }
      if (totalScoreSpan) {
        totalScoreSpan.textContent = String(Storage.getTotalScore());
      }
    }

    // 게임 오버 화면 표시 (팝업 애니메이션은 CSS에서 처리)
    showScreen('gameover');
  }

  /**
   * 게임 이벤트 구독
   * A팀이 발행하는 이벤트들을 수신
   */
  function subscribeGameEvents() {
    // 파이프 통과 시 점수 업데이트 + 팝업
    document.addEventListener('pipe:passed', (e) => {
      updateScore(e.detail.score);
      showScorePopup(e.detail.score);
    });

    // 게임 오버 이벤트
    document.addEventListener('game:over', (e) => {
      showGameOverScreen(e.detail);
    });

    // 신기록 달성 이벤트
    document.addEventListener('record:new', (e) => {
      setTimeout(() => {
        showNewRecordPopup(e.detail.score);
      }, 600);  // 게임오버 팝업 직후
    });

    // 게임 일시정지 이벤트
    document.addEventListener('game:paused', () => {
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
      setupSettingsButton();
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
  // Theme 모듈 초기화 (Phase 2) - 가장 먼저 실행
  if (typeof Theme !== 'undefined' && Theme.init) {
    Theme.init();
  }

  // Sound 모듈 초기화
  if (typeof Sound !== 'undefined' && Sound.init) {
    Sound.init();
  }

  UI.init();

  // Confetti 모듈 초기화 (Phase 2)
  if (typeof Confetti !== 'undefined' && Confetti.init) {
    Confetti.init();
  }
});
