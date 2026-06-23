const canvas = document.querySelector("#framing-canvas");
const ctx = canvas.getContext("2d");

const controls = {
  earthY: document.querySelector("#earth-y"),
  surfaceHeight: document.querySelector("#surface-height"),
  earthScale: document.querySelector("#earth-scale"),
  guides: document.querySelector("#guides-toggle"),
};

const labels = {
  earthY: document.querySelector("#earth-y-value"),
  surfaceHeight: document.querySelector("#surface-height-value"),
  earthScale: document.querySelector("#earth-scale-value"),
  readoutScale: document.querySelector("#readout-scale"),
  readoutEarthY: document.querySelector("#readout-earth-y"),
  readoutSurface: document.querySelector("#readout-surface"),
  readoutGuides: document.querySelector("#readout-guides"),
};

const presetButtons = Array.from(document.querySelectorAll(".preset-button"));

const stars = Array.from({ length: 120 }, (_, index) => {
  const seed = index + 1;
  return {
    x: (Math.sin(seed * 12.9898) * 43758.5453) % 1,
    y: (Math.sin(seed * 78.233) * 24634.6345) % 1,
    size: 0.6 + ((seed * 37) % 10) / 12,
    alpha: 0.36 + ((seed * 19) % 12) / 24,
  };
});

function positiveUnit(value) {
  return value < 0 ? value + 1 : value;
}

function currentState() {
  return {
    earthY: Number(controls.earthY.value),
    surfaceHeight: Number(controls.surfaceHeight.value),
    earthScale: Number(controls.earthScale.value),
    guides: controls.guides.checked,
  };
}

function formatScale(scale) {
  return `${Number(scale.toFixed(1)).toString()}x`;
}

function updateReadout(state) {
  const scale = formatScale(state.earthScale);
  labels.earthY.textContent = `${state.earthY}%`;
  labels.surfaceHeight.textContent = `${state.surfaceHeight}%`;
  labels.earthScale.textContent = scale;
  labels.readoutScale.textContent = scale;
  labels.readoutEarthY.textContent = `${state.earthY}%`;
  labels.readoutSurface.textContent = `${state.surfaceHeight}%`;
  labels.readoutGuides.textContent = state.guides ? "On" : "Off";

  presetButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.scale) === state.earthScale);
  });
}

function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#03040a");
  gradient.addColorStop(0.58, "#070b15");
  gradient.addColorStop(1, "#11141d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    const x = positiveUnit(star.x) * width;
    const y = positiveUnit(star.y) * height * 0.86;
    ctx.beginPath();
    ctx.fillStyle = `rgba(237, 245, 255, ${star.alpha})`;
    ctx.arc(x, y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawEarth(width, height, state) {
  const radius = height * 0.035 * state.earthScale;
  const x = width * 0.5;
  const y = height * (state.earthY / 100);

  const glow = ctx.createRadialGradient(x, y, radius * 0.75, x, y, radius * 1.65);
  glow.addColorStop(0, "rgba(125, 218, 255, 0.28)");
  glow.addColorStop(1, "rgba(125, 218, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, radius * 1.65, 0, Math.PI * 2);
  ctx.fill();

  const earth = ctx.createRadialGradient(x - radius * 0.32, y - radius * 0.38, radius * 0.2, x, y, radius);
  earth.addColorStop(0, "#f5fbff");
  earth.addColorStop(0.18, "#86d7ff");
  earth.addColorStop(0.54, "#2f8fd7");
  earth.addColorStop(1, "#113a7a");
  ctx.fillStyle = earth;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = "rgba(136, 219, 161, 0.8)";
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.25, y + radius * 0.05, radius * 0.28, radius * 0.12, -0.35, 0, Math.PI * 2);
  ctx.ellipse(x + radius * 0.22, y - radius * 0.16, radius * 0.24, radius * 0.1, 0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
  ctx.lineWidth = Math.max(1, radius * 0.055);
  ctx.beginPath();
  ctx.arc(x - radius * 0.22, y - radius * 0.2, radius * 0.48, 0.15, 1.5);
  ctx.arc(x + radius * 0.18, y + radius * 0.15, radius * 0.42, 3.35, 5.6);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "rgba(237, 245, 255, 0.55)";
  ctx.lineWidth = Math.max(1, radius * 0.025);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawLunarSurface(width, height, state) {
  const surfaceHeight = height * (state.surfaceHeight / 100);
  const horizonY = height - surfaceHeight;

  const surface = ctx.createLinearGradient(0, horizonY, 0, height);
  surface.addColorStop(0, "#7f7a6e");
  surface.addColorStop(0.42, "#4d4a43");
  surface.addColorStop(1, "#27251f");

  ctx.fillStyle = surface;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  for (let x = 0; x <= width; x += width / 18) {
    const wave = Math.sin(x / width * Math.PI * 3) * height * 0.012;
    ctx.lineTo(x, horizonY + wave);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(237, 245, 255, 0.26)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= width; x += width / 18) {
    const wave = Math.sin(x / width * Math.PI * 3) * height * 0.012;
    if (x === 0) {
      ctx.moveTo(x, horizonY + wave);
    } else {
      ctx.lineTo(x, horizonY + wave);
    }
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  for (let i = 0; i < 14; i += 1) {
    const x = width * (((i * 23) % 100) / 100);
    const y = horizonY + surfaceHeight * (0.18 + ((i * 17) % 70) / 100);
    const radius = width * (0.012 + ((i * 11) % 8) / 1000);
    ctx.beginPath();
    ctx.ellipse(x, y, radius * 1.8, radius * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGuideLine(y, width, label, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = color;
  ctx.font = "700 13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(label, 12, y - 8);
}

function drawGuides(width, height) {
  const centerX = width * 0.5;
  const centerY = height * 0.5;
  const guideColor = "rgba(125, 218, 255, 0.72)";
  const surfaceGuideColor = "rgba(255, 210, 125, 0.78)";

  ctx.strokeStyle = guideColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, height);
  ctx.moveTo(0, centerY);
  ctx.lineTo(width, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = guideColor;
  ctx.font = "700 13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("Center", centerX + 10, centerY - 10);

  drawGuideLine(height * 0.75, width, "Lunar surface 1/4", surfaceGuideColor);
  drawGuideLine(height * (2 / 3), width, "Lunar surface 1/3", surfaceGuideColor);
}

function render() {
  const state = currentState();
  const width = canvas.width;
  const height = canvas.height;

  updateReadout(state);
  drawBackground(width, height);
  drawEarth(width, height, state);
  drawLunarSurface(width, height, state);

  if (state.guides) {
    drawGuides(width, height);
  }
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  render();
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", render);
});

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    controls.earthScale.value = button.dataset.scale;
    render();
  });
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
