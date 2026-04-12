const Renderer = (() => {
  let canvas = null;
  let ctx = null;

  return {
    /**
     * Canvas 초기화
     */
    init() {
      canvas = document.getElementById('gameCanvas');
      if (!canvas) {
        console.error('Canvas element not found!');
        return;
      }

      ctx = canvas.getContext('2d');

      // Canvas 크기 설정
      canvas.width = 320;
      canvas.height = 480;

      // 배경 초기화
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * 게임 렌더링
     */
    render(gameData) {
      const { bird, pipes, score, difficulty } = gameData;

      // 배경 (낮/밤 모드는 C팀이 처리)
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 파이프 그리기
      ctx.fillStyle = '#2D5016';
      pipes.forEach(pipe => {
        // 위 파이프
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // 아래 파이프
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, 480 - pipe.bottomY);
      });

      // 새 그리기 (이모지)
      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      if (bird.rotation) {
        ctx.rotate(bird.rotation * Math.PI / 180);
      }
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const characters = ['🐦', '🐱', '🐶'];
      ctx.fillText(characters[0], 0, 0);  // 일단 새만 사용
      ctx.restore();

      // 점수 (UI에서 처리하므로 여기서는 디버깅용만)
      // ctx.fillStyle = 'white';
      // ctx.font = 'bold 32px Arial';
      // ctx.fillText(score, 20, 50);
    }
  };
})();
