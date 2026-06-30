const canvas = document.querySelector("#scale-canvas");
const ctx = canvas.getContext("2d");

const EARTH_MOON_DISTANCE_KM = 384400;
const EARTH_RADIUS_KM = 6371;
const MOON_RADIUS_KM = 1737.4;
const LIGHT_SPEED_KM_S = 299792.458;
const LOOP_DELAY_SECONDS = 0.7;

const presets = {
  light: {
    label: "Light / Laser",
    speed: LIGHT_SPEED_KM_S,
    note: "빛의 속도로 비교합니다.",
    color: "#8eeaff",
  },
  "near-light": {
    label: "Near-light Threat",
    speed: LIGHT_SPEED_KM_S * 0.25,
    note: "광속의 25%인 가상 비교 속도입니다.",
    color: "#c6a7ff",
  },
  "fast-missile": {
    label: "Fast Missile",
    speed: 20,
    note: "20 km/s의 단순 직선 이동 비교입니다.",
    color: "#ffb86f",
  },
  "slow-projectile": {
    label: "Slow Projectile",
    speed: 2,
    note: "2 km/s의 느린 물체를 비교합니다.",
    color: "#ff7f72",
  },
  "crewed-spacecraft": {
    label: "Crewed Spacecraft",
    speed: 11,
    note: "11 km/s 일정 속도 기준이며 실제 임무 궤도는 단순화합니다.",
    color: "#f4e0a1",
  },
  custom: {
    label: "Custom Speed",
    speed: 100,
    note: "입력한 km/s 속도로 비교합니다.",
    color: "#7fffc3",
  },
};

const elements = {
  preset: document.querySelector("#preset-select"),
  presetNote: document.querySelector("#preset-note"),
  customSpeedGroup: document.querySelector("#custom-speed-group"),
  customSpeed: document.querySelector("#custom-speed"),
  warp: document.querySelector("#warp-select"),
  customWarpGroup: document.querySelector("#custom-warp-group"),
  customWarp: document.querySelector("#custom-warp"),
  direction: document.querySelector("#direction-select"),
  play: document.querySelector("#play-button"),
  reset: document.querySelector("#reset-button"),
  loop: document.querySelector("#loop-toggle"),
  loopLabel: document.querySelector("#loop-label"),
  replayEarth: document.querySelector("#replay-earth"),
  replayMoon: document.querySelector("#replay-moon"),
  infoPreset: document.querySelector("#info-preset"),
  infoSpeed: document.querySelector("#info-speed"),
  infoWarp: document.querySelector("#info-warp"),
  infoDuration: document.querySelector("#info-duration"),
  infoViewDuration: document.querySelector("#info-view-duration"),
  infoDirection: document.querySelector("#info-direction"),
  runState: document.querySelector("#run-state"),
  progressLabel: document.querySelector("#progress-label"),
  progressTrack: document.querySelector("#progress-track"),
  progressFill: document.querySelector("#progress-fill"),
  viewTimeSummary: document.querySelector("#view-time-summary"),
  statusMessage: document.querySelector("#status-message"),
};

const state = {
  preset: "light",
  direction: "earth-to-moon",
  progress: 0,
  playing: false,
  loop: false,
  loopDelay: 0,
  lastTimestamp: null,
};

const stars = Array.from({ length: 150 }, (_, index) => {
  const seed = index + 1;
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  const y = Math.sin(seed * 78.233) * 24634.6345;
  return {
    x: x - Math.floor(x),
    y: y - Math.floor(y),
    radius: 0.35 + ((seed * 17) % 10) / 14,
    alpha: 0.18 + ((seed * 29) % 10) / 22,
  };
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function currentSpeed() {
  if (state.preset !== "custom") {
    return presets[state.preset].speed;
  }

  const value = Number(elements.customSpeed.value);
  return clamp(Number.isFinite(value) ? value : presets.custom.speed, 0.1, LIGHT_SPEED_KM_S);
}

function currentWarp() {
  if (elements.warp.value !== "custom") {
    return Number(elements.warp.value);
  }

  const value = Number(elements.customWarp.value);
  return clamp(Number.isFinite(value) ? value : 1, 1, 1000000);
}

function travelDurationSeconds() {
  return EARTH_MOON_DISTANCE_KM / currentSpeed();
}

function formatNumber(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits,
  }).format(value);
}

function formatSpeed(speed) {
  if (speed >= 1000) {
    return `${formatNumber(speed, 0)} km/s`;
  }
  return `${formatNumber(speed, speed < 10 ? 1 : 0)} km/s`;
}

function formatDuration(seconds) {
  if (seconds < 0.01) {
    return `${formatNumber(seconds * 1000, 2)} ms`;
  }
  if (seconds < 60) {
    return `${formatNumber(seconds, seconds < 10 ? 2 : 1)}초`;
  }

  const rounded = Math.round(seconds);
  const days = Math.floor(rounded / 86400);
  const hours = Math.floor((rounded % 86400) / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const remainingSeconds = rounded % 60;
  const parts = [];

  if (days) parts.push(`${days}일`);
  if (hours) parts.push(`${hours}시간`);
  if (minutes) parts.push(`${minutes}분`);
  if (!days && remainingSeconds) parts.push(`${remainingSeconds}초`);

  return parts.join(" ");
}

function directionLabel() {
  return state.direction === "earth-to-moon" ? "Earth → Moon" : "Moon → Earth";
}

function runStateLabel() {
  if (state.playing && state.loopDelay > 0) return "Loop wait";
  if (state.playing) return "Playing";
  if (state.progress >= 1) return "Arrived";
  if (state.progress > 0) return "Paused";
  return "Ready";
}

function updateReadouts() {
  const preset = presets[state.preset];
  const speed = currentSpeed();
  const warp = currentWarp();
  const duration = travelDurationSeconds();
  const viewingDuration = duration / warp;
  const progressPercent = state.progress * 100;

  elements.infoPreset.textContent = preset.label;
  elements.infoSpeed.textContent = formatSpeed(speed);
  elements.infoWarp.textContent = `${formatNumber(warp, 0)}×`;
  elements.infoDuration.textContent = formatDuration(duration);
  elements.infoViewDuration.textContent = formatDuration(viewingDuration);
  elements.infoDirection.textContent = directionLabel();
  elements.runState.textContent = runStateLabel();
  elements.progressLabel.textContent = `${progressPercent.toFixed(1)}%`;
  elements.progressFill.style.width = `${progressPercent}%`;
  elements.progressTrack.setAttribute("aria-valuenow", progressPercent.toFixed(1));
  elements.viewTimeSummary.textContent = `실제 ${formatDuration(duration)} · 현재 warp에서 ${formatDuration(viewingDuration)}`;
  elements.play.textContent = state.playing ? "Pause" : "Play";
  elements.loopLabel.textContent = state.loop ? "Loop On" : "Loop Off";
  elements.presetNote.textContent = preset.note;
}

function setConditionalControls() {
  const customSpeedEnabled = state.preset === "custom";
  const customWarpEnabled = elements.warp.value === "custom";

  elements.customSpeed.disabled = !customSpeedEnabled;
  elements.customSpeedGroup.setAttribute("aria-disabled", String(!customSpeedEnabled));
  elements.customWarp.disabled = !customWarpEnabled;
  elements.customWarpGroup.setAttribute("aria-disabled", String(!customWarpEnabled));
}

function resetPlayback(announce = true) {
  state.progress = 0;
  state.playing = false;
  state.loopDelay = 0;
  updateReadouts();
  if (announce) {
    elements.statusMessage.textContent = `${directionLabel()} 시작점으로 초기화`;
  }
}

function playFrom(direction) {
  state.direction = direction;
  elements.direction.value = direction;
  state.progress = 0;
  state.loopDelay = 0;
  state.playing = true;
  updateReadouts();
  elements.statusMessage.textContent = `${directionLabel()} 재생 시작`;
}

function togglePlayback() {
  if (!state.playing && state.progress >= 1) {
    state.progress = 0;
    state.loopDelay = 0;
  }
  state.playing = !state.playing;
  updateReadouts();
  elements.statusMessage.textContent = state.playing ? "재생" : "일시정지";
}

function drawBackground(width, height) {
  const background = ctx.createLinearGradient(0, 0, 0, height);
  background.addColorStop(0, "#02040a");
  background.addColorStop(0.58, "#050a13");
  background.addColorStop(1, "#080d16");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(224, 240, 255, ${star.alpha})`;
    ctx.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  const vignette = ctx.createRadialGradient(width * 0.5, height * 0.52, 0, width * 0.5, height * 0.52, width * 0.68);
  vignette.addColorStop(0.45, "rgba(3, 7, 14, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawEarth(x, y, radius) {
  const halo = ctx.createRadialGradient(x, y, radius * 0.6, x, y, Math.max(radius * 2.6, radius + 14));
  halo.addColorStop(0, "rgba(73, 174, 255, 0.32)");
  halo.addColorStop(1, "rgba(73, 174, 255, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(radius * 2.6, radius + 14), 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(x - radius * 0.38, y - radius * 0.4, radius * 0.08, x, y, radius);
  body.addColorStop(0, "#d9f7ff");
  body.addColorStop(0.18, "#6fd6ff");
  body.addColorStop(0.58, "#2276be");
  body.addColorStop(1, "#0a2857");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "rgba(118, 194, 130, 0.82)";
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.2, y - radius * 0.05, radius * 0.33, radius * 0.15, -0.45, 0, Math.PI * 2);
  ctx.ellipse(x + radius * 0.3, y + radius * 0.2, radius * 0.25, radius * 0.1, 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMoon(x, y, radius) {
  const haloRadius = Math.max(radius * 3.2, radius + 9);
  const halo = ctx.createRadialGradient(x, y, radius, x, y, haloRadius);
  halo.addColorStop(0, "rgba(238, 233, 216, 0.26)");
  halo.addColorStop(1, "rgba(238, 233, 216, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
  ctx.fill();

  const body = ctx.createRadialGradient(x - radius * 0.35, y - radius * 0.4, radius * 0.05, x, y, radius);
  body.addColorStop(0, "#f4f0e4");
  body.addColorStop(0.55, "#afa99a");
  body.addColorStop(1, "#57544e");
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  if (radius > 2.5) {
    ctx.fillStyle = "rgba(55, 54, 51, 0.36)";
    ctx.beginPath();
    ctx.arc(x - radius * 0.28, y + radius * 0.12, radius * 0.18, 0, Math.PI * 2);
    ctx.arc(x + radius * 0.22, y - radius * 0.26, radius * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLabel(x, y, primary, secondary, alignment = "center") {
  ctx.textAlign = alignment;
  ctx.fillStyle = "rgba(235, 247, 255, 0.94)";
  ctx.font = "700 12px system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(primary, x, y);
  ctx.fillStyle = "rgba(145, 166, 186, 0.8)";
  ctx.font = "500 10px SFMono-Regular, Consolas, monospace";
  ctx.fillText(secondary, x, y + 16);
}

function drawArrow(x, y, direction, color) {
  ctx.save();
  ctx.translate(x, y);
  if (direction < 0) ctx.rotate(Math.PI);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-6, -5);
  ctx.lineTo(-3, 0);
  ctx.lineTo(-6, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function routeX(progress, startX, endX) {
  const normalized = state.direction === "earth-to-moon" ? progress : 1 - progress;
  return startX + (endX - startX) * normalized;
}

function drawRoute(layout) {
  const { routeStartX, routeEndX, y } = layout;
  const direction = state.direction === "earth-to-moon" ? 1 : -1;
  const startX = direction > 0 ? routeStartX : routeEndX;
  const markerX = routeX(state.progress, routeStartX, routeEndX);
  const presetColor = presets[state.preset].color;

  ctx.strokeStyle = "rgba(137, 181, 214, 0.24)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.moveTo(routeStartX, y);
  ctx.lineTo(routeEndX, y);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = presetColor;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.lineTo(markerX, y);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const arrowX = routeX(0.55, routeStartX, routeEndX);
  drawArrow(arrowX, y, direction, "rgba(123, 220, 255, 0.88)");

  for (let index = 5; index >= 1; index -= 1) {
    const ghostProgress = Math.max(0, state.progress - index * 0.035);
    if (ghostProgress >= state.progress || state.progress === 0) continue;
    const ghostX = routeX(ghostProgress, routeStartX, routeEndX);
    ctx.beginPath();
    ctx.fillStyle = presetColor;
    ctx.globalAlpha = 0.08 + (5 - index) * 0.05;
    ctx.arc(ghostX, y, 2 + (5 - index) * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const markerGlow = ctx.createRadialGradient(markerX, y, 0, markerX, y, 15);
  markerGlow.addColorStop(0, presetColor);
  markerGlow.addColorStop(0.25, `${presetColor}88`);
  markerGlow.addColorStop(1, `${presetColor}00`);
  ctx.fillStyle = markerGlow;
  ctx.beginPath();
  ctx.arc(markerX, y, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7fdff";
  ctx.beginPath();
  ctx.arc(markerX, y, 3.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawDistanceGuide(layout, width, height) {
  const { earthX, moonX, y } = layout;
  const guideY = Math.min(height - 52, y + Math.max(86, height * 0.17));

  ctx.strokeStyle = "rgba(123, 220, 255, 0.28)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(earthX, guideY);
  ctx.lineTo(moonX, guideY);
  ctx.moveTo(earthX, guideY - 5);
  ctx.lineTo(earthX, guideY + 5);
  ctx.moveTo(moonX, guideY - 5);
  ctx.lineTo(moonX, guideY + 5);
  ctx.stroke();

  ctx.fillStyle = "rgba(145, 166, 186, 0.88)";
  ctx.font = "600 10px SFMono-Regular, Consolas, monospace";
  ctx.textAlign = "center";
  ctx.fillText("384,400 km average center distance", width * 0.5, guideY + 19);
}

function renderCanvas() {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const dpr = window.devicePixelRatio || 1;
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  drawBackground(width, height);

  const earthX = width * (width < 560 ? 0.08 : 0.075);
  const moonX = width * (width < 560 ? 0.92 : 0.925);
  const y = height * 0.66;
  const centerDistancePixels = moonX - earthX;
  const earthRadius = centerDistancePixels * (EARTH_RADIUS_KM / EARTH_MOON_DISTANCE_KM);
  const moonRadius = centerDistancePixels * (MOON_RADIUS_KM / EARTH_MOON_DISTANCE_KM);
  const layout = {
    earthX,
    moonX,
    y,
    earthRadius,
    moonRadius,
    routeStartX: earthX + earthRadius,
    routeEndX: moonX - moonRadius,
  };

  drawRoute(layout);
  drawEarth(earthX, y, earthRadius);
  drawMoon(moonX, y, moonRadius);
  drawLabel(earthX, y - Math.max(earthRadius + 23, 38), "EARTH", "R 6,371 km");
  drawLabel(moonX, y - Math.max(moonRadius + 23, 35), "MOON", "R 1,737.4 km");
  drawDistanceGuide(layout, width, height);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(145, 166, 186, 0.58)";
  ctx.font = "600 9px SFMono-Regular, Consolas, monospace";
  ctx.fillText("TRUE RELATIVE BODY + DISTANCE SCALE", width - 14, height - 14);
}

function tick(timestamp) {
  if (state.lastTimestamp === null) {
    state.lastTimestamp = timestamp;
  }

  const deltaSeconds = Math.min(0.1, (timestamp - state.lastTimestamp) / 1000);
  state.lastTimestamp = timestamp;

  if (state.playing) {
    if (state.loopDelay > 0) {
      state.loopDelay = Math.max(0, state.loopDelay - deltaSeconds);
      if (state.loopDelay === 0) state.progress = 0;
    } else {
      state.progress += (deltaSeconds * currentWarp()) / travelDurationSeconds();
      if (state.progress >= 1) {
        state.progress = 1;
        if (state.loop) {
          state.loopDelay = LOOP_DELAY_SECONDS;
        } else {
          state.playing = false;
          elements.statusMessage.textContent = `${directionLabel()} 도착`;
        }
      }
    }
  }

  updateReadouts();
  renderCanvas();
  window.requestAnimationFrame(tick);
}

elements.preset.addEventListener("change", () => {
  state.preset = elements.preset.value;
  setConditionalControls();
  resetPlayback(false);
  elements.statusMessage.textContent = `${presets[state.preset].label} 선택`;
});

elements.customSpeed.addEventListener("input", () => {
  resetPlayback(false);
});

elements.customSpeed.addEventListener("change", () => {
  elements.customSpeed.value = currentSpeed();
  updateReadouts();
});

elements.warp.addEventListener("change", () => {
  setConditionalControls();
  updateReadouts();
  elements.statusMessage.textContent = `Time warp ${formatNumber(currentWarp(), 0)}배`;
});

elements.customWarp.addEventListener("input", updateReadouts);
elements.customWarp.addEventListener("change", () => {
  elements.customWarp.value = currentWarp();
  updateReadouts();
});

elements.direction.addEventListener("change", () => {
  state.direction = elements.direction.value;
  resetPlayback();
});

elements.play.addEventListener("click", togglePlayback);
elements.reset.addEventListener("click", () => resetPlayback());
elements.replayEarth.addEventListener("click", () => playFrom("earth-to-moon"));
elements.replayMoon.addEventListener("click", () => playFrom("moon-to-earth"));

elements.loop.addEventListener("change", () => {
  state.loop = elements.loop.checked;
  if (!state.loop && state.loopDelay > 0) {
    state.loopDelay = 0;
    state.progress = 1;
    state.playing = false;
  }
  updateReadouts();
  elements.statusMessage.textContent = state.loop ? "반복 재생 켜짐" : "반복 재생 꺼짐";
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLButtonElement) {
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  }
  if (event.key.toLowerCase() === "r") {
    resetPlayback();
  }
});

window.addEventListener("resize", renderCanvas);

setConditionalControls();
updateReadouts();
window.requestAnimationFrame(tick);
