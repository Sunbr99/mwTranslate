
// === Android Native Bridge Helper ===
const NativeAndroid = {
  toast: function(msg) {
    if (window.Android && window.Android.showToast) {
      window.Android.showToast(msg);
    } else {
      console.log('[Native Toast]: ' + msg);
      alert(msg);
    }
  },
  vibrate: function(ms = 100) {
    if (window.Android && window.Android.vibrate) {
      window.Android.vibrate(ms);
    } else if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  },
  share: function(text, title = 'แชร์') {
    if (window.Android && window.Android.shareText) {
      window.Android.shareText(text, title);
    } else if (navigator.share) {
      navigator.share({ title, text }).catch(() => {});
    }
  }
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const startOverlay = document.getElementById('start-overlay');
const startBtn = document.getElementById('start-btn');

function resize() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
resize();
window.addEventListener('resize', resize);

let bird = { x: 50, y: 150, radius: 14, velocity: 0, gravity: 0.35, jump: -6.5 };
let pipes = [];
let frame = 0;
let score = 0;
let bestScore = parseInt(localStorage.getItem('flappy_best') || '0', 10);
bestScoreEl.innerText = bestScore;
let isPlaying = false;
let animationId = null;

function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  scoreEl.innerText = '0';
}

function jump() {
  if (!isPlaying) return;
  bird.velocity = bird.jump;
  if (navigator.vibrate) navigator.vibrate(15);
}

window.addEventListener('touchstart', (e) => {
  if (isPlaying) { e.preventDefault(); jump(); }
}, { passive: false });

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && isPlaying) jump();
});

startBtn.addEventListener('click', () => {
  startOverlay.style.display = 'none';
  resetGame();
  isPlaying = true;
  loop();
});

function gameOver() {
  isPlaying = false;
  cancelAnimationFrame(animationId);
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('flappy_best', bestScore);
    bestScoreEl.innerText = bestScore;
  }
  startOverlay.querySelector('h1').innerText = '💥 เกมจบแล้ว!';
  startOverlay.querySelector('p').innerText = 'คะแนนของคุณ: ' + score + ' แต้ม';
  startBtn.innerText = 'เล่นอีกครั้ง';
  startOverlay.style.display = 'flex';
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

function loop() {
  if (!isPlaying) return;
  frame++;
  
  // Background
  ctx.fillStyle = '#70c5ce';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Update bird
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  
  // Draw bird
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Beak & eye
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(bird.x + 8, bird.y + 2, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(bird.x + 4, bird.y - 4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(bird.x + 5, bird.y - 4, 2, 0, Math.PI * 2);
  ctx.fill();

  // Pipe spawn
  if (frame % 90 === 0) {
    const gap = 130;
    const minHeight = 40;
    const maxHeight = canvas.height - gap - minHeight - 60;
    const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
    pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap, passed: false });
  }

  // Update & draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    let p = pipes[i];
    p.x -= 2.5;

    ctx.fillStyle = '#22c55e';
    ctx.fillRect(p.x, 0, 48, p.top);
    ctx.fillRect(p.x, p.bottom, 48, canvas.height - p.bottom);
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 2;
    ctx.strokeRect(p.x, 0, 48, p.top);
    ctx.strokeRect(p.x, p.bottom, 48, canvas.height - p.bottom);

    // Collision
    if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + 48) {
      if (bird.y - bird.radius < p.top || bird.y + bird.radius > p.bottom) {
        gameOver();
        return;
      }
    }

    if (!p.passed && p.x + 48 < bird.x) {
      p.passed = true;
      score++;
      scoreEl.innerText = score;
    }

    if (p.x + 48 < 0) {
      pipes.splice(i, 1);
    }
  }

  // Ground collision
  if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
    gameOver();
    return;
  }

  animationId = requestAnimationFrame(loop);
}

// Mobile Bottom Navigation Tab Switcher
function switchNavTab(event, tabId) {
  event.preventDefault();
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if (window.Android && window.Android.showToast) {
    window.Android.showToast('สลับไปยังแท็บ ' + tabId);
  }
}
