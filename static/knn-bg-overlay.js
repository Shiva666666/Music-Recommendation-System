// KNN Background Animation
// This script draws a creative, interactive KNN visualization on a canvas overlay.
// To be imported and used in your main script.

function animateKNNBackground() {
  const canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw random points (data)
  const points = [];
  const pointCount = 32;
  for (let i = 0; i < pointCount; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: Math.random() > 0.5 ? '#a855f7' : '#f472b6', // purple or pink
    });
  }

  // Draw points
  points.forEach(pt => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = pt.color;
    ctx.shadowColor = pt.color;
    ctx.shadowBlur = 16;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
  });

  // Draw target point (user or animated)
  const t = Date.now() / 1500;
  const target = {
    x: canvas.width / 2 + Math.sin(t) * canvas.width * 0.18,
    y: canvas.height / 2 + Math.cos(t) * canvas.height * 0.15,
  };
  ctx.save();
  ctx.beginPath();
  ctx.arc(target.x, target.y, 16, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 24;
  ctx.globalAlpha = 0.95;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#a855f7';
  ctx.stroke();
  ctx.restore();

  // Find k nearest neighbors
  points.sort((a, b) => {
    const da = (a.x - target.x) ** 2 + (a.y - target.y) ** 2;
    const db = (b.x - target.x) ** 2 + (b.y - target.y) ** 2;
    return da - db;
  });
  const k = 5;
  const neighbors = points.slice(0, k);

  // Draw lines from target to neighbors
  neighbors.forEach(pt => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = pt.color;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();
  });

  // Animate
  window.knnAnimId = requestAnimationFrame(animateKNNBackground);
}

function startKNNBackground() {
  let canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'knn-bg-overlay';
    canvas.className = 'fixed inset-0 pointer-events-none z-0';
    document.body.appendChild(canvas);
  }
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateKNNBackground();
}

function stopKNNBackground() {
  const canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (window.knnAnimId) cancelAnimationFrame(window.knnAnimId);
}
