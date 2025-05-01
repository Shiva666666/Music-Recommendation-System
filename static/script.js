// Model-specific configurations

// --- Neural Network Animation Implementation ---
let neuralAnimationId = null;
function startNeuralNetworkAnimation(canvas) {
  stopNeuralNetworkAnimation(canvas);
  const ctx = canvas.getContext('2d');
  // Fullscreen
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Network structure (customized: fewer input/output neurons)
  const layers = [5, 8, 8, 8, 4]; // input, 3 hidden, output
  const neuronRadius = 12;
  const glowColor = 'rgba(220,38,38,0.25)';
  const glowBlur = 28;
  // Precompute neuron positions
  const w = canvas.width, h = canvas.height;
  const left = w * 0.14, right = w * 0.86, top = h * 0.12, bottom = h * 0.88;
  const layerX = i => left + (right-left) * i/(layers.length-1);
  // Custom vertical spacing for output layer
  const neuronY = (l, j) => {
    if (l === layers.length - 1) {
      // Output layer: pack neurons closer vertically (e.g. 60% of normal spacing, centered)
      const outCount = layers[l];
      const center = (top + bottom) / 2;
      const spacing = (bottom - top) * 0.6 / (outCount - 1);
      return center - ((outCount - 1) * spacing) / 2 + j * spacing;
    } else {
      return top + (bottom - top) * j / (layers[l] - 1);
    }
  };
  let neurons = [];
  for (let l=0; l<layers.length; l++) {
    let arr = [];
    for (let j=0; j<layers[l]; j++) {
      arr.push({x: layerX(l), y: neuronY(l,j)});
    }
    neurons.push(arr);
  }
  // Data pulses
  let pulses = [];
  function spawnPulse() {
    // Start at random input neuron, random output neuron
    const input = Math.floor(Math.random()*layers[0]);
    const output = Math.floor(Math.random()*layers[layers.length-1]);
    pulses.push({
      path: [0,input,3,output],
      t: 0
    });
  }
  // Animate
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Draw connections
    ctx.save();
    ctx.globalAlpha = 0.25;
    for (let l=0; l<layers.length-1; l++) {
      for (let i=0; i<layers[l]; i++) {
        for (let j=0; j<layers[l+1]; j++) {
          ctx.beginPath();
          ctx.moveTo(neurons[l][i].x, neurons[l][i].y);
          ctx.lineTo(neurons[l+1][j].x, neurons[l+1][j].y);
          ctx.strokeStyle = 'rgba(220,38,38,0.3)';
          ctx.lineWidth = 2;
          ctx.shadowColor = glowColor;
          ctx.shadowBlur = 8;
          ctx.stroke();
        }
      }
    }
    ctx.restore();
    // Draw neurons
    for (let l=0; l<layers.length; l++) {
      for (let j=0; j<layers[l]; j++) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(neurons[l][j].x, neurons[l][j].y, neuronRadius, 0, 2*Math.PI);
        ctx.fillStyle = glowColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = glowBlur;
        ctx.globalAlpha = 0.45;
        ctx.fill();
        ctx.restore();
        // Inner core
        ctx.save();
        ctx.beginPath();
        ctx.arc(neurons[l][j].x, neurons[l][j].y, neuronRadius*0.5, 0, 2*Math.PI);
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.28;
        ctx.fill();
        ctx.restore();
      }
    }
    // Animate pulses
    for (let pulse of pulses) {
      // Interpolate position along path
      let [l0,i0,l1,i1] = pulse.path;
      let n0 = neurons[l0][i0], n1 = neurons[l1][i1];
      let t = pulse.t;
      let x = n0.x + (n1.x-n0.x)*t;
      let y = n0.y + (n1.y-n0.y)*t;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, neuronRadius*0.5, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(220,38,38,0.85)'; // bright red
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.restore();
      // Progress (slow)
      pulse.t += 0.006 + Math.random()*0.003;
      if (pulse.t >= 1) {
        // Move to next layer or remove
        if (l1 < layers.length-1) {
          pulse.path = [l1,i1,l1+1,Math.floor(Math.random()*layers[l1+1])];
          pulse.t = 0;
        } else {
          pulse.t = 0;
          pulse.path = [0,Math.floor(Math.random()*layers[0]),3,Math.floor(Math.random()*layers[3])];
        }
      }
    }
    // Occasionally spawn new pulses
    if (pulses.length < 12 && Math.random()<0.15) spawnPulse();
    neuralAnimationId = requestAnimationFrame(animate);
  }
  canvas.style.display = 'block';
  animate();
}
function stopNeuralNetworkAnimation(canvas) {
  if (neuralAnimationId) cancelAnimationFrame(neuralAnimationId);
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    canvas.style.display = 'none';
  }
}
// --- END Neural Network Animation Implementation ---
const modelConfigs = {
  "deep-learning": {
      color: "rgba(220, 38, 38, 0.1)", // Blood red
      symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
          <!-- Neural Network Layers -->
          <g fill="rgba(220, 38, 38, 0.8)">
              <!-- Input Layer -->
              <circle cx="20" cy="20" r="4"/>
              <circle cx="20" cy="40" r="4"/>
              <circle cx="20" cy="60" r="4"/>
              <circle cx="20" cy="80" r="4"/>
              
              <!-- Hidden Layer 1 -->
              <circle cx="40" cy="30" r="4"/>
              <circle cx="40" cy="50" r="4"/>
              <circle cx="40" cy="70" r="4"/>
              
              <!-- Hidden Layer 2 -->
              <circle cx="60" cy="40" r="4"/>
              <circle cx="60" cy="60" r="4"/>
              
              <!-- Output Layer -->
              <circle cx="80" cy="50" r="4"/>
              
              <!-- Connections -->
              <path d="M20,20 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M20,40 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M20,60 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M20,80 L40,30 L40,50 L40,70" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M40,30 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M40,50 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M40,70 L60,40 L60,60" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M60,40 L80,50" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
              <path d="M60,60 L80,50" stroke="rgba(220, 38, 38, 0.3)" stroke-width="1"/>
          </g>
      </svg>`,
      name: "Deep Learning"
  },
  "svm": {
      color: "rgba(16, 185, 129, 0.1)", // Green
      symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
          <!-- SVM Hyperplane and Support Vectors -->
          <g fill="rgba(16, 185, 129, 0.8)">
              <!-- Hyperplane -->
              <line x1="20" y1="80" x2="80" y2="20" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2"/>
              <!-- Margin Lines -->
              <line x1="15" y1="85" x2="75" y2="25" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" stroke-dasharray="2"/>
              <line x1="25" y1="75" x2="85" y2="15" stroke="rgba(16, 185, 129, 0.3)" stroke-width="1" stroke-dasharray="2"/>
              <!-- Class 1 Points -->
              <circle cx="30" cy="30" r="3"/>
              <circle cx="40" cy="35" r="3"/>
              <circle cx="35" cy="40" r="3"/>
              <!-- Class 2 Points -->
              <circle cx="60" cy="60" r="3"/>
              <circle cx="65" cy="65" r="3"/>
              <circle cx="70" cy="70" r="3"/>
              <!-- Support Vectors -->
              <circle cx="45" cy="45" r="4" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2" fill="none"/>
              <circle cx="55" cy="55" r="4" stroke="rgba(16, 185, 129, 0.8)" stroke-width="2" fill="none"/>
          </g>
      </svg>`,
      name: "Support Vector Machine"
  },
  "random-forest": {
      color: "rgba(245, 158, 11, 0.1)", // Orange
      symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
          <!-- Random Forest Multiple Decision Trees -->
          <g fill="rgba(245, 158, 11, 0.8)">
              <!-- Tree 1 -->
              <path d="M20,80 L20,60 L10,50 M20,60 L30,50" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
              <circle cx="10" cy="50" r="3"/>
              <circle cx="30" cy="50" r="3"/>
              <!-- Tree 2 -->
              <path d="M50,80 L50,50 L40,40 M50,50 L60,40" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
              <circle cx="40" cy="40" r="3"/>
              <circle cx="60" cy="40" r="3"/>
              <!-- Tree 3 -->
              <path d="M80,80 L80,60 L70,50 M80,60 L90,50" stroke="rgba(245, 158, 11, 0.8)" stroke-width="2"/>
              <circle cx="70" cy="50" r="3"/>
              <circle cx="90" cy="50" r="3"/>
              <!-- Tree Tops -->
              <path d="M10,20 Q20,10 30,20 Q20,30 10,20" fill="rgba(245, 158, 11, 0.8)"/>
              <path d="M40,10 Q50,0 60,10 Q50,20 40,10" fill="rgba(245, 158, 11, 0.8)"/>
              <path d="M70,20 Q80,10 90,20 Q80,30 70,20" fill="rgba(245, 158, 11, 0.8)"/>
          </g>
      </svg>`,
      name: "Random Forest"
  },
  "knn": {
      color: "rgba(168, 85, 247, 0.1)", // Purple
      symbol: `<svg class="w-64 h-64" viewBox="0 0 100 100" fill="none">
          <!-- K-Nearest Neighbors Visualization -->
          <g fill="rgba(168, 85, 247, 0.8)">
              <!-- Target Point -->
              <circle cx="50" cy="50" r="4" stroke="rgba(168, 85, 247, 0.8)" stroke-width="2" fill="white"/>
              <!-- Distance Circles -->
              <circle cx="50" cy="50" r="20" stroke="rgba(168, 85, 247, 0.2)" stroke-width="1" fill="none"/>
              <circle cx="50" cy="50" r="30" stroke="rgba(168, 85, 247, 0.1)" stroke-width="1" fill="none"/>
              <!-- Nearest Points -->
              <circle cx="45" cy="40" r="3"/>
              <circle cx="60" cy="45" r="3"/>
              <circle cx="40" cy="55" r="3"/>
              <!-- Connection Lines -->
              <line x1="50" y1="50" x2="45" y2="40" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
              <line x1="50" y1="50" x2="60" y2="45" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
              <line x1="50" y1="50" x2="40" y2="55" stroke="rgba(168, 85, 247, 0.5)" stroke-width="1"/>
              <!-- Other Points -->
              <circle cx="20" cy="20" r="2"/>
              <circle cx="80" cy="80" r="2"/>
              <circle cx="75" cy="25" r="2"/>
              <circle cx="30" cy="70" r="2"/>
          </g>
      </svg>`,
      name: "K-Nearest Neighbors"
  }
};

// Create background overlay for deep learning effect
const overlay = document.createElement('div');
overlay.id = 'deeplearning-bg-overlay';
overlay.className = 'fixed inset-0 pointer-events-none z-0';
overlay.style.display = 'none';
document.body.appendChild(overlay);

// SVM background overlay
const svmOverlay = document.createElement('canvas');
svmOverlay.id = 'svm-bg-overlay';
svmOverlay.className = 'fixed inset-0 pointer-events-none z-0';
svmOverlay.style.display = 'none';
document.body.appendChild(svmOverlay);

// Random Forest background overlay
const rfOverlay = document.createElement('canvas');
rfOverlay.id = 'rf-bg-overlay';
rfOverlay.className = 'fixed inset-0 pointer-events-none z-0';
rfOverlay.style.display = 'none';
document.body.appendChild(rfOverlay);

// KNN background overlay
const knnOverlay = document.createElement('canvas');
knnOverlay.id = 'knn-bg-overlay';
knnOverlay.className = 'fixed inset-0 pointer-events-none z-0';
knnOverlay.style.display = 'none';
document.body.appendChild(knnOverlay);

// Quantum ML background overlay
const qmlOverlay = document.createElement('canvas');
qmlOverlay.id = 'qml-bg-overlay';
qmlOverlay.className = 'fixed inset-0 pointer-events-none z-0';
qmlOverlay.style.display = 'none';
document.body.appendChild(qmlOverlay);

// Quantum DL background overlay
const qdlOverlay = document.createElement('canvas');
qdlOverlay.id = 'qdl-bg-overlay';
qdlOverlay.className = 'fixed inset-0 pointer-events-none z-0';
qdlOverlay.style.display = 'none';
document.body.appendChild(qdlOverlay);

// Quantum DL background animation
let qdlAnimId = null;
function animateQDLBackground() {
  const canvas = document.getElementById('qdl-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- QDL Model Card Gradient Theme ---
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#2d1a28'); // QDL model card deep
  grad.addColorStop(1, '#d73d8e'); // QDL model card pink
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // --- Animated neural net nodes ---
  const layers = 5;
  const nodesPerLayer = [3, 5, 7, 5, 3];
  const nodeRadius = 13;
  for (let l = 0; l < layers; l++) {
    const y = canvas.height * (0.18 + 0.62 * (l / (layers-1)));
    for (let n = 0; n < nodesPerLayer[l]; n++) {
      const x = canvas.width * (0.18 + 0.64 * (n / (nodesPerLayer[l]-1)));
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
      ctx.globalAlpha = 0.91;
      ctx.fillStyle = 'rgba(215, 61, 142, 0.93)'; // QDL model card pink
      ctx.shadowColor = 'rgba(215, 61, 142, 0.55)';
      ctx.shadowBlur = 22;
      ctx.fill();
      // Quantum overlay: glowing ring
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius + 7 + 3*Math.sin(Date.now()*0.001+l+n), 0, 2*Math.PI);
      ctx.globalAlpha = 0.33 + 0.23*Math.abs(Math.sin(Date.now()*0.001+l+n));
      ctx.strokeStyle = 'rgba(215, 61, 142, 0.55)';
      ctx.lineWidth = 5;
      ctx.shadowColor = 'rgba(215, 61, 142, 0.19)';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Connections between nodes (animated waves) ---
  ctx.save();
  for (let l = 0; l < layers-1; l++) {
    const y1 = canvas.height * (0.18 + 0.62 * (l / (layers-1)));
    const y2 = canvas.height * (0.18 + 0.62 * ((l+1) / (layers-1)));
    for (let n1 = 0; n1 < nodesPerLayer[l]; n1++) {
      const x1 = canvas.width * (0.18 + 0.64 * (n1 / (nodesPerLayer[l]-1)));
      for (let n2 = 0; n2 < nodesPerLayer[l+1]; n2++) {
        const x2 = canvas.width * (0.18 + 0.64 * (n2 / (nodesPerLayer[l+1]-1)));
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        // Animated wave in the connection
        const midX = (x1 + x2) / 2 + 18*Math.sin(Date.now()*0.001 + l + n1 - n2);
        const midY = (y1 + y2) / 2 + 12*Math.cos(Date.now()*0.001 + n1 + n2);
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.globalAlpha = 0.27;
        ctx.strokeStyle = 'rgba(215, 61, 142, 0.43)';
        ctx.lineWidth = 2.8;
        ctx.shadowColor = 'rgba(215, 61, 142, 0.22)';
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
    }
  }
  ctx.restore();

  // --- Quantum particles overlay ---
  const qParticles = 18;
  for (let i = 0; i < qParticles; i++) {
    const angle = (Date.now() * 0.0007 + i) * (1.2 + 0.2 * (i % 3));
    const r = canvas.width * 0.15 + Math.sin(angle * 2.3) * 33 + i * 5;
    const x = canvas.width * 0.5 + Math.cos(angle) * r;
    const y = canvas.height * 0.5 + Math.sin(angle) * r * 0.45;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 10 + Math.sin(angle * 2) * 3, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.19 + 0.11 * Math.sin(angle * 3);
    ctx.fillStyle = 'rgba(215, 61, 142, 0.33)';
    ctx.shadowColor = 'rgba(215, 61, 142, 0.22)';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.restore();
  }

  qdlAnimId = requestAnimationFrame(animateQDLBackground);
}

function startQDLBackground() {
  const canvas = document.getElementById('qdl-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateQDLBackground();
}

function stopQDLBackground() {
  const canvas = document.getElementById('qdl-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (qdlAnimId) cancelAnimationFrame(qdlAnimId);
  qdlAnimId = null;
}


// Quantum ML background animation
let qmlAnimId = null;
function animateQMLBackground() {
  const canvas = document.getElementById('qml-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Nero DMC Theme: Deep blue/black background gradient ---
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#181921'); // Nero Black
  grad.addColorStop(1, '#223c6b'); // Vergil Blue
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // --- Swirling blue energy mist effect ---
  const mistParticles = 22;
  for (let i = 0; i < mistParticles; i++) {
    const angle = (Date.now() * 0.00018 + i) * (1.2 + 0.2 * (i % 3));
    const r = canvas.width * 0.22 + Math.sin(angle * 2.3) * 60 + i * 8;
    const x = canvas.width * 0.5 + Math.cos(angle) * r;
    const y = canvas.height * 0.5 + Math.sin(angle) * r * 0.45;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 38 + Math.sin(angle * 2) * 10, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.09 + 0.045 * Math.sin(angle * 3);
    ctx.fillStyle = 'rgba(34, 60, 107, 0.33)';
    ctx.shadowColor = 'rgba(100, 180, 255, 0.16)';
    ctx.shadowBlur = 32;
    ctx.fill();
    ctx.restore();
  }

  // --- Spark particles ---
  const sparkCount = 14;
  for (let i = 0; i < sparkCount; i++) {
    const t = Date.now() * 0.002 + i * 12;
    const x = canvas.width * (0.2 + 0.6 * Math.random());
    const y = canvas.height * (0.1 + 0.8 * Math.random());
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + Math.sin(t + i) * 7, y + Math.cos(t + i) * 7, 2 + Math.random() * 1.2, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.18 + 0.08 * Math.sin(t + i);
    ctx.fillStyle = '#b7bcc7'; // Silver
    ctx.shadowColor = '#b7bcc7';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }

  // --- Animated faint circuit pattern overlay ---
  ctx.save();
  ctx.globalAlpha = 0.13;
  ctx.strokeStyle = 'rgba(183, 28, 80, 0.11)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i++) {
    const offset = (Date.now() * 0.0008 + i * 0.2) % 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width * offset, canvas.height * 0.18 + i * 50);
    ctx.lineTo(canvas.width * (0.2 + offset), canvas.height * 0.22 + i * 50);
    ctx.lineTo(canvas.width * (0.25 + offset), canvas.height * 0.32 + i * 50);
    ctx.stroke();
  }
  ctx.restore();

  // --- Quantum Circuit / Qubit System ---
  // Draw quantum wires (HIGHER OPACITY & GLOW)
  const nQubits = 4;
  const wireSpacing = canvas.height / (nQubits + 1);
  ctx.save();
  ctx.strokeStyle = 'rgba(75, 123, 189, 0.63)'; // more visible blue
  ctx.shadowColor = 'rgba(100, 180, 255, 0.38)';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 2.8;
  for (let i = 1; i <= nQubits; i++) {
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.1, wireSpacing * i);
    ctx.lineTo(canvas.width * 0.9, wireSpacing * i);
    ctx.stroke();
  }
  ctx.restore();

  // Draw qubits (circles) and gates (boxes)
  for (let i = 1; i <= nQubits; i++) {
    // Qubit
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.12, wireSpacing * i, 18, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(183, 28, 80, 0.09)';
    ctx.shadowColor = 'rgba(183, 28, 80, 0.18)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(183, 28, 80, 0.23)';
    ctx.stroke();
    ctx.restore();
    // Label
    ctx.save();
    ctx.font = 'bold 18px Inter, Arial';
    ctx.fillStyle = 'rgba(75, 123, 189, 0.80)'; // more visible label
    ctx.shadowColor = 'rgba(100, 180, 255, 0.28)';
    ctx.shadowBlur = 7;
    ctx.fillText('Q'+(i-1), canvas.width * 0.12 - 10, wireSpacing * i + 6);
    ctx.restore();
    // Gates
    for (let g = 1; g <= 3; g++) {
      ctx.save();
      ctx.globalAlpha = 0.32 + 0.09 * g;
      ctx.fillStyle = g % 2 === 0 ? 'rgba(75, 123, 189, 0.38)' : 'rgba(183, 28, 80, 0.23)';
      ctx.strokeStyle = 'rgba(75, 123, 189, 0.37)';
      const gx = canvas.width * (0.22 + 0.18 * g);
      const gy = wireSpacing * i - 16;
      ctx.fillRect(gx, gy, 32, 32);
      ctx.strokeRect(gx, gy, 32, 32);
      ctx.restore();
    }
  }

  // --- Transition to Compute/CS Style: Animated bits and logic gates ---
  // Animate classical bits flowing right side (HIGHER OPACITY & GLOW)
  const bitCount = 12;
  // Persistent array of bits that changes every 1 second
  if (!window.qmlBits || !window.qmlBitsTime || Date.now() - window.qmlBitsTime > 1000) {
    window.qmlBits = Array.from({length: bitCount}, () => Math.random() < 0.5 ? 0 : 1);
    window.qmlBitsTime = Date.now();
  }
  const t = Date.now() * 0.002;
  for (let b = 0; b < bitCount; b++) {
    const bx = canvas.width * 0.65 + Math.sin(t + b) * 12;
    const by = canvas.height * (0.18 + 0.6 * (b / bitCount));
    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(75, 123, 189, 0.85)';
    ctx.shadowColor = 'rgba(100, 180, 255, 0.45)';
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.font = 'bold 18px Inter, Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.shadowColor = 'rgba(100, 180, 255, 0.45)';
    ctx.shadowBlur = 12;
    ctx.fillText(window.qmlBits[b], bx - 6, by + 7);
    ctx.restore();
  }

  // Animate logic gate symbol (e.g., AND) on the far right
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = 'rgba(75, 123, 189, 0.33)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.85, canvas.height * 0.4);
  ctx.lineTo(canvas.width * 0.85, canvas.height * 0.6);
  ctx.arc(canvas.width * 0.85, canvas.height * 0.5, 30, Math.PI/2, -Math.PI/2, true);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  qmlAnimId = requestAnimationFrame(animateQMLBackground);
}

function startQMLBackground() {
  const canvas = document.getElementById('qml-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateQMLBackground();
}

function stopQMLBackground() {
  const canvas = document.getElementById('qml-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (qmlAnimId) cancelAnimationFrame(qmlAnimId);
  qmlAnimId = null;
}


// Random Forest background animation
let rfAnimId = null;
function animateRandomForestBackground() {
  const canvas = document.getElementById('rf-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Color scheme: gold/yellow glows (same as model card)
  const branchColor = 'rgba(245, 158, 11, 0.18)';
  const nodeColor = 'rgba(245, 158, 11, 0.55)';
  const nodeGlow = 'rgba(245, 158, 11, 0.85)';

  // Draw multiple smaller trees
  const treeCount = 4;
  for (let t = 0; t < treeCount; t++) {
    // Randomize tree base position and angle
    const baseX = canvas.width * (0.2 + 0.2 * t + Math.random() * 0.06);
    const baseY = canvas.height * 0.92;
    const baseAngle = -Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    const baseLength = canvas.height * (0.16 + Math.random() * 0.04); // DECREASED tree height
    drawTree(ctx, baseX, baseY, baseAngle, baseLength, 0, t);
  }

  function drawTree(ctx, x, y, angle, length, depth, treeIdx) {
    if (depth > 5 || length < 10) return; // DECREASED minimum branch length
    // Node
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 5 - depth * 0.6, 0, 2 * Math.PI); // DECREASED node radius
    ctx.fillStyle = nodeColor;
    ctx.shadowColor = nodeGlow;
    ctx.shadowBlur = 24 - depth * 3;
    ctx.globalAlpha = 0.8; // Fixed alpha, no phasing
    ctx.fill();
    ctx.restore();
    // Branches
    const branchCount = (depth < 2) ? 3 : (Math.random() > 0.3 ? 2 : 3);
    for (let i = 0; i < branchCount; i++) {
      const theta = angle + (i - (branchCount-1)/2) * (Math.PI/6 + Math.random()*0.12);
      const len = length * (0.62 + Math.random()*0.08);
      const endX = x + Math.cos(theta) * len;
      const endY = y + Math.sin(theta) * len;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      // Use bezier for smooth, organic look
      const ctrlX = x + Math.cos(theta - 0.2) * len * 0.3;
      const ctrlY = y + Math.sin(theta - 0.2) * len * 0.3;
      ctx.bezierCurveTo(ctrlX, ctrlY, x + Math.cos(theta) * len * 0.7, y + Math.sin(theta) * len * 0.7, endX, endY);
      ctx.strokeStyle = branchColor;
      ctx.lineWidth = 4 - depth * 0.6;
      ctx.shadowColor = nodeGlow;
      ctx.shadowBlur = 18 - depth * 2.5;
      ctx.globalAlpha = 0.31; // Fixed alpha, no phasing
      ctx.stroke();
      ctx.restore();
      drawTree(ctx, endX, endY, theta + (Math.random()-0.5)*0.2, len * (0.88 + Math.random()*0.06), depth + 1, treeIdx);
    }
  }
  rfAnimId = requestAnimationFrame(animateRandomForestBackground);
}
function startRandomForestBackground() {
  const canvas = document.getElementById('rf-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateRandomForestBackground();
}
function stopRandomForestBackground() {
  const canvas = document.getElementById('rf-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (rfAnimId) cancelAnimationFrame(rfAnimId);
}

// --- KNN Background Animation Integration ---
let knnAnimId = null;
let knnRandomNeighborIndices = null;
let knnRandomTargetIdx = null;
let knnLastSwitchTime = 0;

function animateKNNBackground() {
  const canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- KNN Background Grid of Dots (very faint, whole canvas) ---
  const bgSpacing = Math.max(18, Math.min(canvas.width, canvas.height) / 64); // 1 unit square, visually reasonable
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = 'rgba(168, 85, 247, 1)';
  for (let y = bgSpacing / 2; y < canvas.height; y += bgSpacing) {
    for (let x = bgSpacing / 2; x < canvas.width; x += bgSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  ctx.restore();

  // --- KNN Visualization: Grid, Target, Neighbors ---
  // Parameters
  const gridRows = 7;
  const gridCols = 11;
  const marginX = canvas.width * 0.12;
  const marginY = canvas.height * 0.18;
  const gridW = canvas.width - 2 * marginX;
  const gridH = canvas.height - 2 * marginY;
  const ptRadius = 13;
  const k = 5;

  // Build grid points
  const points = [];
  for (let i = 0; i < gridRows; i++) {
    for (let j = 0; j < gridCols; j++) {
      points.push({
        x: marginX + (gridW) * j / (gridCols - 1),
        y: marginY + (gridH) * i / (gridRows - 1),
        color: '#e5e7eb', // base gray
        grid: true
      });
    }
  }

  // Pick a random target point and its 5 nearest neighbors every 2 seconds
  const now = Date.now();
  if (
    knnRandomTargetIdx === null ||
    !knnRandomNeighborIndices ||
    now - knnLastSwitchTime > 1000
  ) {
    // Pick a random target index
    let prevIdx = knnRandomTargetIdx;
    let idxs = Array.from({length: points.length}, (_, i) => i);
    if (prevIdx !== null && idxs.length > 1) idxs.splice(prevIdx, 1); // avoid same as last
    knnRandomTargetIdx = idxs[Math.floor(Math.random() * idxs.length)];
    // Find k nearest neighbors to the target (excluding itself)
    const targetPt = points[knnRandomTargetIdx];
    const dists = points.map((pt, i) => ({i, d: Math.hypot(pt.x - targetPt.x, pt.y - targetPt.y)}));
    dists.sort((a, b) => a.d - b.d);
    // dists[0] is self, take next k
    knnRandomNeighborIndices = dists.slice(1, k + 1).map(obj => obj.i);
    knnLastSwitchTime = now;
  }
  const target = points[knnRandomTargetIdx];
  const neighbors = knnRandomNeighborIndices.map(idx => points[idx]);

  // Draw only the neighbors and the target (background dots are hidden)
  // (Neighbors and target are drawn below)

  // Draw a creative, organic, glowing, irregular shape around the selected area
  // Use a smooth closed path through the points (target + neighbors), with some jitter for a hand-drawn or organic look
  const hullPoints = [target, ...neighbors];
  // Sort points by angle from centroid for a smooth path
  const centroid = hullPoints.reduce((acc, pt) => ({x: acc.x + pt.x, y: acc.y + pt.y}), {x:0, y:0});
  centroid.x /= hullPoints.length;
  centroid.y /= hullPoints.length;
  const sorted = hullPoints.slice().sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
  // Add jitter for creativity
  const jitter = 18;
  ctx.save();
  ctx.beginPath();
  sorted.forEach((pt, i) => {
    const angle = Math.atan2(pt.y - centroid.y, pt.x - centroid.x);
    const r = Math.hypot(pt.x - centroid.x, pt.y - centroid.y) + (Math.random()-0.5)*jitter;
    const x = centroid.x + Math.cos(angle) * r;
    const y = centroid.y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  // Fill with a soft purple background effect
  ctx.globalAlpha = 0.13;
  ctx.fillStyle = 'rgba(168, 85, 247, 1)';
  ctx.shadowColor = 'rgba(168, 85, 247, 0.12)';
  ctx.shadowBlur = 44;
  ctx.fill();
  // Draw the glowing stroke on top
  ctx.globalAlpha = 0.21;
  ctx.shadowColor = 'rgba(168, 85, 247, 0.7)';
  ctx.shadowBlur = 38;
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
  ctx.stroke();
  ctx.restore();

  // Draw lines from target to k-nearest neighbors
  neighbors.forEach((pt, idx) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(target.x, target.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = `rgba(168, 85, 247, 0.7)`;
    ctx.lineWidth = 5 - idx; // closer = thicker
    ctx.setLineDash([8, 5]);
    ctx.globalAlpha = 0.55;
    ctx.stroke();
    ctx.restore();
  });

  // Draw k-nearest neighbors as purple
  neighbors.forEach((pt, idx) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, ptRadius + 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#a855f7';
    ctx.globalAlpha = 0.7;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.restore();
  });

  // Draw target point
  ctx.save();
  ctx.beginPath();
  ctx.arc(target.x, target.y, ptRadius + 4, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 22;
  ctx.globalAlpha = 1;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#a855f7';
  ctx.stroke();
  ctx.restore();

  // Continue animation
  knnAnimId = requestAnimationFrame(animateKNNBackground);
}



function startKNNBackground() {
  const canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateKNNBackground();
}

function stopKNNBackground() {
  const canvas = document.getElementById('knn-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (knnAnimId) cancelAnimationFrame(knnAnimId);
  knnAnimId = null;
  knnRandomNeighborIndices = null;
  knnRandomTargetIdx = null;
  knnLastSwitchTime = 0;
}


// Add animated scanlines and glow via CSS for deep learning
const dlEffectStyle = document.createElement('style');
dlEffectStyle.textContent = `
#deeplearning-bg-overlay.active {
  display: block !important;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(215,38,61,0.10),
      rgba(215,38,61,0.10) 1px,
      transparent 1px,
      transparent 4px
    ),
    radial-gradient(circle at 50% 60%, rgba(215,38,61,0.18) 0%, transparent 80%),
    linear-gradient(120deg, rgba(220,38,38,0.12) 0%, rgba(39,15,30,0.16) 100%);
  animation: deeplearning-glow 3s ease-in-out infinite alternate;
  mix-blend-mode: lighten;
  z-index: 1;
}
@keyframes deeplearning-glow {
  0%   { filter: blur(0px) brightness(1.1); }
  100% { filter: blur(3px) brightness(1.25); }
}
#svm-bg-overlay.active {
  display: block !important;
  z-index: 1;
  mix-blend-mode: lighten;
  pointer-events: none;
  opacity: 0.92;
}
`;
document.head.appendChild(dlEffectStyle);

// SVM background animation
let svmAnimId = null;
function animateSVMBackground() {
  const canvas = document.getElementById('svm-bg-overlay');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // SVM representation: static with gentle glow/pulse
  // Draw two clusters
  const cluster1 = { x: canvas.width * 0.32, y: canvas.height * 0.55, color: 'rgba(0,191,255,0.18)' };
  const cluster2 = { x: canvas.width * 0.68, y: canvas.height * 0.45, color: 'rgba(255,255,255,0.12)' };
  // Draw cluster points
  for (let i = 0; i < 10; i++) {
    let angle = (i / 10) * Math.PI * 2;
    let r = 60 + 18 * Math.sin(i);
    let x1 = cluster1.x + Math.cos(angle) * r + Math.random() * 6;
    let y1 = cluster1.y + Math.sin(angle) * r + Math.random() * 6;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x1, y1, 13, 0, 2 * Math.PI);
    ctx.fillStyle = cluster1.color;
    ctx.shadowColor = 'rgba(0,191,255,0.35)';
    ctx.shadowBlur = 24;
    ctx.globalAlpha = 0.10;
    ctx.fill();
    ctx.restore();
    // A few support vectors (highlighted)
    if (i % 4 === 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x1, y1, 18, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00e1ff';
      ctx.lineWidth = 4.5;
      ctx.shadowColor = '#00e1ff';
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 0.25;
      ctx.stroke();
      ctx.restore();
    }
    let x2 = cluster2.x + Math.cos(angle) * r + Math.random() * 6;
    let y2 = cluster2.y + Math.sin(angle) * r + Math.random() * 6;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x2, y2, 13, 0, 2 * Math.PI);
    ctx.fillStyle = cluster2.color;
    ctx.shadowColor = 'rgba(255,255,255,0.25)';
    ctx.shadowBlur = 22;
    ctx.globalAlpha = 0.10;
    ctx.fill();
    ctx.restore();
    // A few support vectors (highlighted)
    if (i % 4 === 1) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x2, y2, 18, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00e1ff';
      ctx.lineWidth = 4.5;
      ctx.shadowColor = '#00e1ff';
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 0.18;
      ctx.stroke();
      ctx.restore();
    }
  }
  // Draw the decision boundary (hyperplane)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(canvas.width * 0.50, 0);
  ctx.lineTo(canvas.width * 0.50, canvas.height);
  ctx.strokeStyle = 'rgba(0,191,255,0.45)';
  ctx.lineWidth = 7;
  ctx.shadowColor = 'rgba(0,191,255,0.35)';
  ctx.shadowBlur = 48;
  ctx.globalAlpha = 0.25 + 0.08 * Math.sin(Date.now() / 1000); // subtle pulse
  ctx.stroke();
  ctx.restore();
  // Optionally: add faint background grid
  ctx.save();
  ctx.strokeStyle = 'rgba(0,191,255,0.08)';
  ctx.lineWidth = 1.2;
  for (let i = 1; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo((canvas.width / 8) * i, 0);
    ctx.lineTo((canvas.width / 8) * i, canvas.height);
    ctx.stroke();
  }
  for (let i = 1; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(0, (canvas.height / 6) * i);
    ctx.lineTo(canvas.width, (canvas.height / 6) * i);
    ctx.stroke();
  }
  ctx.restore();
  // Gentle pulse loop
  svmAnimId = requestAnimationFrame(animateSVMBackground);
}
function startSVMBackground() {
  const canvas = document.getElementById('svm-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.classList.add('active');
  animateSVMBackground();
}
function stopSVMBackground() {
  const canvas = document.getElementById('svm-bg-overlay');
  if (!canvas) return;
  canvas.style.display = 'none';
  canvas.classList.remove('active');
  if (svmAnimId) cancelAnimationFrame(svmAnimId);
}

// Create symbol container
const symbolContainer = document.createElement('div');
symbolContainer.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 opacity-0 pointer-events-none z-10';
document.body.appendChild(symbolContainer);

// Animation for recommendation text
function showRecommendation(event) {
  const output = document.getElementById("recommendation-output");
  // --- Neural Network Animation Trigger ---
  const card = event.currentTarget;
  const model = card.getAttribute('data-model');
  const mood = document.querySelector('select').value;
  const canvas = document.getElementById('neural-bg');
  if (canvas) {
    // Always stop all backgrounds first
    stopNeuralNetworkAnimation(canvas);
    stopRandomForestBackground();
    stopSVMBackground();
    stopKNNBackground();
    document.getElementById('deeplearning-bg-overlay').classList.remove('active');

    if (model === 'deep-learning' && mood) {
      canvas.style.opacity = 1;
      startNeuralNetworkAnimation(canvas);
      document.getElementById('deeplearning-bg-overlay').classList.add('active');
    } else if (model === 'svm') {
      startSVMBackground();
    } else if (model === 'random-forest') {
      startRandomForestBackground();
    } else if (model === 'knn') {
      startKNNBackground();
    } else if (model === 'quantum-ml' && mood) {
      startQMLBackground();
    } else if (model === 'quantum-dl' && mood) {
      startQDLBackground();
    }
    // Always stop QML background if not QML
    if (model !== 'quantum-ml') {
      stopQMLBackground();
    }
    // Always stop QDL background if not QDL
    if (model !== 'quantum-dl') {
      stopQDLBackground();
    }
  }
  const config = modelConfigs[model];

  if (!mood) {
      alert("Please select a mood.");
      return;
  }
  card.classList.add('active');

  // // Show dummy recommendations for quantum-ml and quantum-dl
  // if (model === "quantum-ml") {
  //     const dummy = [
  //         { track_name: "Quantum Leap", artists: "Qubit Ensemble" },
  //         { track_name: "Entangled Grooves", artists: "Superposition DJs" },
  //         { track_name: "Schrodinger's Beat", artists: "WaveFunction" },
  //         { track_name: "Spin Dance", artists: "Quantum Vibes" },
  //         { track_name: "Heisenberg Shuffle", artists: "Uncertainty Crew" }
  //     ];
  //     output.innerHTML = `
  //         <div class="animate-fade-in">
  //             <h3 class="text-lg font-medium mb-2">Top Recommendations</h3>
  //             <ul class="text-left text-sm mt-2">
  //                 ${dummy.map(song => `<li>${song.track_name} — ${song.artists}</li>`).join('')}
  //             </ul>
  //             <p class="text-gray-400 text-sm mt-2">(Preview) Quantum ML dummy recommendations</p>
  //         </div>
  //     `;
  //     return;
  // }
  // if (model === "quantum-dl") {
  //     const dummy = [
  //         { track_name: "Quantum Deep", artists: "Neural Qubits" },
  //         { track_name: "Quantum State", artists: "EntangleNet" },
  //         { track_name: "Superposed Dreams", artists: "QDL Collective" },
  //         { track_name: "Decoherence", artists: "Collapse Theory" },
  //         { track_name: "Quantum Tunnel", artists: "Barrier Breakers" }
  //     ];
  //     output.innerHTML = `
  //         <div class="animate-fade-in">
  //             <h3 class="text-lg font-medium mb-2">Top Recommendations</h3>
  //             <ul class="text-left text-sm mt-2">
  //                 ${dummy.map(song => `<li>${song.track_name} — ${song.artists}</li>`).join('')}
  //             </ul>
  //             <p class="text-gray-400 text-sm mt-2">(Preview) Quantum DL dummy recommendations</p>
  //         </div>
  //     `;
  //     return;
  // }

  output.innerHTML = `<div class="loading animate-fade-in">Loading...</div>`;
  fetch("/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood, model })
  })
    .then(res => res.json())
    .then(songs => {
      if (songs.error) {
        output.innerHTML = `<span class="text-red-500">${songs.error}</span>`;
        return;
      }
      if (!songs.length) {
        output.innerHTML = `<p class="text-gray-400">No recommendations found for this mood/model.</p>`;
        return;
      }
  
      // Build each <li> with optional album_cover and spotify_link
      const listItems = songs.map(song => {
        // fall back artist key (you wrote sometimes "artist", sometimes "artists")
        const artistName = song.artist || song.artists || "Unknown Artist";
  
        return `
          <li class="mb-4 flex items-center">
            ${song.album_cover
              ? `<img
                   src="${song.album_cover}"
                   alt="Cover for ${song.track_name}"
                   class="w-12 h-12 rounded mr-4"
                 />`
              : `<div class="w-12 h-12 bg-gray-700 rounded mr-4"></div>`
            }
            <div>
              <div class="font-medium">${song.track_name}</div>
              <div class="text-sm text-gray-300">${artistName}</div>
              ${song.spotify_link
                ? `<a
                     href="${song.spotify_link}"
                     target="_blank"
                     class="text-xs text-green-400 hover:underline"
                   >Play on Spotify</a>`
                : ``
              }
            </div>
          </li>`;
      }).join("");
  
      output.innerHTML = `
        <div class="animate-fade-in">
          <h3 class="text-lg font-medium mb-2">Top Recommendations</h3>
          <ul class="list-none p-0 text-sm text-left">
            ${listItems}
          </ul>
          <p class="text-gray-400 text-xs mt-2">Based on your mood and model selection</p>
        </div>
      `;
    })
    .catch(err => {
      output.innerHTML = `<span class="text-red-500">Error: ${err.message}</span>`;
    });
  
  
  
}

// Ripple effect on card click
function createRippleEffect(event) {
  const card = event.currentTarget;
  const ripple = document.createElement('div');
  
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.className = 'ripple';
  
  card.appendChild(ripple);
  
  setTimeout(() => {
      ripple.remove();
  }, 1000);
}

// Hover effect for model cards
document.querySelectorAll('.model-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const angleX = (y - centerY) / 20;
      const angleY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

// Add loading animation to Get Recommendations button
document.querySelector('.btn-primary').addEventListener('click', function() {
  const button = this;
  const originalText = button.textContent;
  
  button.disabled = true;
  button.innerHTML = '<span class="loading-dots">Getting Recommendations</span>';
  
  // Simulate loading (replace with actual API call)
  setTimeout(() => {
      button.disabled = false;
      button.textContent = originalText;
  }, 1500);
});

// Initialize mood select with custom styling
document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('select');
  
  select.addEventListener('change', () => {
      if (select.value) {
          select.classList.add('selected');
      } else {
          select.classList.remove('selected');
      }
  });
});

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
  .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 1s linear;
      pointer-events: none;
  }

  @keyframes ripple-animation {
      to {
          transform: scale(4);
          opacity: 0;
      }
  }

  .loading-dots::after {
      content: '...';
      animation: loading-dots 1.5s infinite;
  }

  @keyframes loading-dots {
      0% { content: '.'; }
      33% { content: '..'; }
      66% { content: '...'; }
  }

  .animate-fade-in {
      animation: fadeIn 0.5s ease-out;
  }

  @keyframes fadeIn {
      from {
          opacity: 0;
          transform: translateY(10px);
      }
      to {
          opacity: 1;
          transform: translateY(0);
      }
  }

  .model-card {
      transition: transform 0.3s ease-out;
  }

  select.selected {
      border-color: var(--button-primary);
  }

  /* Hover effect for recommendation section */
  body.rec-hovered #deeplearning-bg-overlay.active,
  body.rec-hovered #qml-bg-overlay.active,
  body.rec-hovered #qdl-bg-overlay.active {
    opacity: 1 !important;
    transition: opacity 0.3s;
  }
  body.rec-hovered #svm-bg-overlay.active,
  body.rec-hovered #knn-bg-overlay.active,
  body.rec-hovered #rf-bg-overlay.active {
    opacity: 1 !important;
    transition: opacity 0.3s;
  }
  #deeplearning-bg-overlay.active,
  #svm-bg-overlay.active,
  #knn-bg-overlay.active,
  #rf-bg-overlay.active,
  #qml-bg-overlay.active,
  #qdl-bg-overlay.active {
    opacity: 0.3;
    transition: opacity 0.3s;
  }
`;
document.head.appendChild(style);

// Add new CSS for floating animation
const newStyles = `
  @keyframes float {
      0% {
          transform: translate(-50%, -50%);
      }
      50% {
          transform: translate(-50%, -60%);
      }
      100% {
          transform: translate(-50%, -50%);
      }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// Add hover effect to recommendation section for max opacity
// This code assumes the recommendation section has id 'recommendation-output'
document.addEventListener('DOMContentLoaded', function() {
  const recSection = document.getElementById('recommendation-output');
  if (recSection) {
    recSection.addEventListener('mouseenter', function() {
      document.body.classList.add('rec-hovered');
    });
    recSection.addEventListener('mouseleave', function() {
      document.body.classList.remove('rec-hovered');
    });
  }
});
