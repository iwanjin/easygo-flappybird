/**
 * Theme Module
 * 게임 테마 관리 시스템
 *
 * 담당: Team B
 * 공개 API: Theme.init(), Theme.set(name), Theme.get(), Theme.getAll()
 *
 * 테마 종류: 'light' (밝음), 'dark' (어두움), 'ocean' (바다), 'fire' (불)
 */

const Theme = (() => {
  // ===== PRIVATE 변수 =====
  let currentTheme = 'light';

  // 테마 정의
  const themes = {
    light: {
      name: 'light',
      label: '☀️ 밝은 테마',
      colors: {
        bg: '#ffffff',
        text: '#000000',
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D'
      }
    },
    dark: {
      name: 'dark',
      label: '🌙 어두운 테마',
      colors: {
        bg: '#1a1a1a',
        text: '#ffffff',
        primary: '#FFD700',
        secondary: '#00CED1',
        accent: '#FF69B4'
      }
    },
    ocean: {
      name: 'ocean',
      label: '🌊 바다 테마',
      colors: {
        bg: '#0077BE',
        text: '#ffffff',
        primary: '#FFD60A',
        secondary: '#00B4D8',
        accent: '#90E0EF'
      }
    },
    fire: {
      name: 'fire',
      label: '🔥 불 테마',
      colors: {
        bg: '#2d1b1b',
        text: '#ffffff',
        primary: '#FF6B35',
        secondary: '#FF8C42',
        accent: '#FFB84D'
      }
    }
  };

  // ===== PRIVATE 함수 =====

  /**
   * CSS 변수로 테마 적용
   * @param {object} theme - 테마 객체
   */
  function applyTheme(theme) {
    const root = document.documentElement;
    const colors = theme.colors;

    root.style.setProperty('--bg-color', colors.bg);
    root.style.setProperty('--text-color', colors.text);
    root.style.setProperty('--primary-color', colors.primary);
    root.style.setProperty('--secondary-color', colors.secondary);
    root.style.setProperty('--accent-color', colors.accent);

    // body 배경색 설정
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
  }

  /**
   * localStorage에서 저장된 테마 로드
   * @returns {string} 저장된 테마명
   */
  function loadThemeFromStorage() {
    const stored = localStorage.getItem('flappyBird_theme');
    return stored || 'light';
  }

  /**
   * localStorage에 테마 저장
   * @param {string} themeName - 테마명
   */
  function saveThemeToStorage(themeName) {
    localStorage.setItem('flappyBird_theme', themeName);
  }

  // ===== PUBLIC API =====
  return {
    /**
     * 초기화 (저장된 테마 로드)
     */
    init() {
      currentTheme = loadThemeFromStorage();
      const theme = themes[currentTheme];
      if (theme) {
        applyTheme(theme);
      }
      console.log('[Theme] 초기화 완료:', currentTheme);
    },

    /**
     * 테마 설정
     * @param {string} themeName - 테마명 ('light', 'dark', 'ocean', 'fire')
     * @returns {boolean} 성공 여부
     */
    set(themeName) {
      if (!themes[themeName]) {
        console.warn('[Theme] 존재하지 않는 테마:', themeName);
        return false;
      }

      currentTheme = themeName;
      applyTheme(themes[themeName]);
      saveThemeToStorage(themeName);
      console.log('[Theme] 테마 변경:', themeName);
      return true;
    },

    /**
     * 현재 테마 조회
     * @returns {object} 현재 테마 정보
     */
    get() {
      return themes[currentTheme];
    },

    /**
     * 모든 테마 조회
     * @returns {array} 테마 배열
     */
    getAll() {
      return Object.values(themes);
    },

    /**
     * 다음 테마로 전환
     * @returns {string} 변경된 테마명
     */
    next() {
      const themeNames = Object.keys(themes);
      const currentIndex = themeNames.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themeNames.length;
      const nextTheme = themeNames[nextIndex];
      this.set(nextTheme);
      return nextTheme;
    }
  };
})();
