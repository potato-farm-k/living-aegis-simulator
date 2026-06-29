const canvas = document.querySelector("#trajectory-canvas");
const ctx = canvas.getContext("2d");

const controls = {
  sourceType: document.querySelector("#source-type"),
  trajectoryShape: document.querySelector("#trajectory-shape"),
  boostDuration: document.querySelector("#boost-duration"),
  curveAmount: document.querySelector("#curve-amount"),
  threatSpeed: document.querySelector("#threat-speed"),
  warningProgress: document.querySelector("#warning-progress"),
  cameraPitch: document.querySelector("#camera-pitch"),
  verticalFov: document.querySelector("#vertical-fov"),
  defenseRadius: document.querySelector("#defense-radius"),
  trailLength: document.querySelector("#trail-length"),
};

const outputs = {
  boostDuration: document.querySelector("#boost-duration-value"),
  curveAmount: document.querySelector("#curve-amount-value"),
  threatSpeed: document.querySelector("#threat-speed-value"),
  warningProgress: document.querySelector("#warning-progress-value"),
  cameraPitch: document.querySelector("#camera-pitch-value"),
  verticalFov: document.querySelector("#vertical-fov-value"),
  defenseRadius: document.querySelector("#defense-radius-value"),
  trailLength: document.querySelector("#trail-length-value"),
};

const readout = {
  source: document.querySelector("#state-source"),
  shape: document.querySelector("#state-shape"),
  progress: document.querySelector("#state-progress"),
  threat: document.querySelector("#state-threat"),
  warning: document.querySelector("#state-warning"),
  contact: document.querySelector("#state-contact"),
  occluded: document.querySelector("#state-occluded"),
  screen: document.querySelector("#state-screen"),
  predicted: document.querySelector("#state-predicted"),
  pitch: document.querySelector("#state-pitch"),
  fov: document.querySelector("#state-fov"),
  liveState: document.querySelector("#live-state"),
};

const buttons = {
  play: document.querySelector("#play-toggle"),
  restart: document.querySelector("#restart-button"),
  defaults: document.querySelector("#defaults-button"),
};

const defaults = {
  sourceType: "earth",
  trajectoryShape: "guided",
  boostDuration: 1.8,
  curveAmount: 58,
  threatSpeed: 110,
  warningProgress: 72,
  cameraPitch: 12,
  verticalFov: 46,
  defenseRadius: 72,
  trailLength: 16,
};

const sourceNames = {
  earth: "Earth Surface",
  orbital: "Orbital",
  test: "Test Source",
};

const shapeNames = {
  straight: "Straight",
  arc: "Arc",
  guided: "Guided Curve",
};

const animation = {
  progress: 0,
  running: true,
  lastTime: performance.now(),
};

let viewport = { width: 1200, height: 720, dpr: 1 };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function normalizeAngle(angle) {
  let result = angle;
  while (result > Math.PI) result -= Math.PI * 2;
  while (result < -Math.PI) result += Math.PI * 2;
  return result;
}

function values() {
  return {
    sourceType: controls.sourceType.value,
    trajectoryShape: controls.trajectoryShape.value,
    boostDuration: Number(controls.boostDuration.value),
    curveAmount: Number(controls.curveAmount.value),
    threatSpeed: Number(controls.threatSpeed.value),
    warningProgress: Number(controls.warningProgress.value) / 100,
    cameraPitch: Number(controls.cameraPitch.value),
    verticalFov: Number(controls.verticalFov.value),
    defenseRadius: Number(controls.defenseRadius.value),
    trailLength: Number(controls.trailLength.value),
  };
}

function totalDuration(state) {
  return lerp(11.5, 3.2, (state.threatSpeed - 40) / 180);
}

function surfaceY(x, width, height) {
  const start = width * 0.59;
  if (x < start) return height * 0.76;
  const t = clamp((x - start) / (width - start), 0, 1);
  const ridge = Math.exp(-Math.pow((t - 0.45) / 0.16, 2)) * height * 0.105;
  const texture = Math.sin(t * Math.PI * 5) * height * 0.008;
  return height * (0.72 + t * 0.035) - ridge + texture;
}

function sceneModel(width, height, state) {
  const sourcePoints = {
    earth: { x: width * 0.12, y: height * 0.61 },
    orbital: { x: width * 0.16, y: height * 0.27 },
    test: { x: width * 0.12, y: height * 0.43 },
  };
  const impactX = width * 0.79;
  const playerX = width * 0.91;

  return {
    source: sourcePoints[state.sourceType],
    impact: { x: impactX, y: surfaceY(impactX, width, height) - 3 },
    player: { x: playerX, y: surfaceY(playerX, width, height) - height * 0.027 },
    lunarStart: width * 0.59,
  };
}

function trajectoryPoint(progress, model, state, width, height) {
  const t = clamp(progress, 0, 1);
  const start = model.source;
  const end = model.impact;
  const curve = state.curveAmount / 100;

  if (state.trajectoryShape === "straight") {
    return { x: lerp(start.x, end.x, t), y: lerp(start.y, end.y, t) };
  }

  if (state.trajectoryShape === "arc") {
    const control = {
      x: lerp(start.x, end.x, 0.5),
      y: Math.min(start.y, end.y) - height * (0.05 + curve * 0.25),
    };
    const inverse = 1 - t;
    return {
      x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
      y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
    };
  }

  const controlA = {
    x: start.x + width * 0.17,
    y: start.y - height * (0.035 + curve * 0.2),
  };
  const controlB = {
    x: end.x - width * 0.19,
    y: end.y - height * (0.08 + curve * 0.24),
  };
  const inverse = 1 - t;
  return {
    x: inverse ** 3 * start.x + 3 * inverse ** 2 * t * controlA.x + 3 * inverse * t ** 2 * controlB.x + t ** 3 * end.x,
    y: inverse ** 3 * start.y + 3 * inverse ** 2 * t * controlA.y + 3 * inverse * t ** 2 * controlB.y + t ** 3 * end.y,
  };
}

function pathAngle(progress, model, state, width, height) {
  const before = trajectoryPoint(Math.max(0, progress - 0.003), model, state, width, height);
  const after = trajectoryPoint(Math.min(1, progress + 0.003), model, state, width, height);
  return Math.atan2(after.y - before.y, after.x - before.x);
}

function isSurfaceOccluded(threat, player, width, height) {
  for (let index = 1; index < 60; index += 1) {
    const t = index / 60;
    const x = lerp(player.x, threat.x, t);
    const y = lerp(player.y, threat.y, t);
    if (x >= width * 0.59 && y >= surfaceY(x, width, height) - 1) return true;
  }
  return false;
}

function runtimeState(state, model, width, height) {
  const progress = animation.progress;
  const threat = trajectoryPoint(progress, model, state, width, height);
  const boostProgress = clamp(state.boostDuration / totalDuration(state), 0.08, 0.42);
  const direction = Math.PI + state.cameraPitch * Math.PI / 180;
  const threatDirection = Math.atan2(threat.y - model.player.y, threat.x - model.player.x);
  const angleDifference = normalizeAngle(threatDirection - direction);
  const inViewCone = Math.abs(angleDifference) <= state.verticalFov * Math.PI / 360;
  const surfaceOccluded = isSurfaceOccluded(threat, model.player, width, height);
  const visualContact = inViewCone && !surfaceOccluded;
  const impactWarning = progress >= state.warningProgress;
  const predictedContact = impactWarning && !visualContact;
  const threatOnScreen = inViewCone;

  let threatState = "TRANSIT";
  if (progress >= 0.998) threatState = "IMPACT";
  else if (progress <= boostProgress) threatState = "BOOST";
  else if (impactWarning) threatState = "IMPACT WARNING";
  else if (surfaceOccluded) threatState = "SURFACE OCCLUDED";

  return {
    progress,
    threat,
    boostProgress,
    angleDifference,
    inViewCone,
    surfaceOccluded,
    visualContact,
    impactWarning,
    predictedContact,
    threatOnScreen,
    threatState,
  };
}

function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "#05080d");
  gradient.addColorStop(0.65, "#0a1119");
  gradient.addColorStop(1, "#10151b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(113, 211, 235, 0.07)";
  ctx.lineWidth = 1;
  const grid = Math.max(32, width / 24);
  for (let x = 0; x <= width; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += grid) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawLabel(text, x, y, color = "#edf4fa", align = "left", compact = false) {
  ctx.save();
  ctx.font = `700 ${compact ? 9 : 11}px SFMono-Regular, Consolas, monospace`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  const metrics = ctx.measureText(text);
  const padding = compact ? 4 : 6;
  const left = align === "right" ? x - metrics.width - padding : align === "center" ? x - metrics.width / 2 - padding : x - padding;
  ctx.fillStyle = "rgba(5, 8, 13, 0.82)";
  ctx.fillRect(left, y - 9, metrics.width + padding * 2, 18);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function strokeTrajectory(startProgress, endProgress, model, state, width, height, style, lineWidth, dash = []) {
  ctx.save();
  ctx.strokeStyle = style;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.setLineDash(dash);
  ctx.beginPath();
  for (let step = 0; step <= 100; step += 1) {
    const progress = lerp(startProgress, endProgress, step / 100);
    const point = trajectoryPoint(progress, model, state, width, height);
    if (step === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSourceArea(model, state, width, height, compact) {
  const areaX = width * 0.075;
  const areaY = height * 0.52;
  ctx.save();
  ctx.fillStyle = "rgba(63, 119, 155, 0.18)";
  ctx.strokeStyle = "rgba(113, 211, 235, 0.52)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(areaX, areaY, width * 0.055, height * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = "#f4c46c";
  ctx.beginPath();
  ctx.arc(model.source.x, model.source.y, compact ? 4 : 6, 0, Math.PI * 2);
  ctx.fill();
  drawLabel("Earth Source Area", width * 0.025, height * 0.28, "#71d3eb", "left", compact);
  drawLabel(sourceNames[state.sourceType], model.source.x + 10, model.source.y + 18, "#f4c46c", "left", compact);
}

function drawCameraCone(model, state, width, height, compact) {
  const direction = Math.PI + state.cameraPitch * Math.PI / 180;
  const halfFov = state.verticalFov * Math.PI / 360;
  const radius = width * 0.39;

  ctx.save();
  ctx.fillStyle = "rgba(138, 221, 173, 0.08)";
  ctx.strokeStyle = "rgba(138, 221, 173, 0.5)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(model.player.x, model.player.y);
  ctx.arc(model.player.x, model.player.y, radius, direction - halfFov, direction + halfFov);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const horizonLength = width * 0.28;
  ctx.save();
  ctx.strokeStyle = "rgba(237, 244, 250, 0.42)";
  ctx.setLineDash([7, 6]);
  ctx.beginPath();
  ctx.moveTo(model.player.x, model.player.y);
  ctx.lineTo(model.player.x - horizonLength, model.player.y);
  ctx.stroke();
  ctx.restore();

  if (!compact) {
    drawLabel("Visual Contact Zone", width * 0.59, height * 0.53, "#8addad", "center");
    drawLabel("Local Horizon Line", model.player.x - width * 0.19, model.player.y + 13, "#c4d0da");
  }
}

function drawCorridor(model, state, width, height, compact) {
  strokeTrajectory(state.warningProgress, 1, model, state, width, height, "rgba(255, 129, 116, 0.13)", compact ? 14 : 24);
  strokeTrajectory(state.warningProgress, 1, model, state, width, height, "rgba(255, 129, 116, 0.7)", compact ? 1.5 : 2, [8, 7]);
  const labelProgress = Math.min(0.9, state.warningProgress + (1 - state.warningProgress) * 0.45);
  const labelPoint = trajectoryPoint(labelProgress, model, state, width, height);
  drawLabel("Impact Warning Corridor", labelPoint.x - 24, labelPoint.y - (compact ? 19 : 42), "#ff8174", "right", compact);
}

function drawTrajectory(model, state, runtime, width, height, compact) {
  drawCorridor(model, state, width, height, compact);
  strokeTrajectory(0, 1, model, state, width, height, "rgba(113, 211, 235, 0.85)", compact ? 1.5 : 2.2);
  strokeTrajectory(0, runtime.boostProgress, model, state, width, height, "rgba(244, 196, 108, 0.98)", compact ? 3 : 5);

  const boostEnd = trajectoryPoint(runtime.boostProgress, model, state, width, height);
  drawLabel("Boost Segment", lerp(model.source.x, boostEnd.x, 0.52), lerp(model.source.y, boostEnd.y, 0.52) - 14, "#f4c46c", "center", compact);
  if (!compact) {
    const mainPoint = trajectoryPoint(0.48, model, state, width, height);
    drawLabel("Main Trajectory", mainPoint.x, mainPoint.y - 18, "#71d3eb", "center");
  }
}

function drawTrail(model, state, runtime, width, height, compact) {
  const count = Math.min(state.trailLength, Math.max(0, Math.floor(runtime.progress / 0.012)));
  for (let index = count; index >= 1; index -= 1) {
    const progress = Math.max(0, runtime.progress - index * 0.012);
    const point = trajectoryPoint(progress, model, state, width, height);
    const alpha = (1 - index / (count + 1)) * 0.55;
    ctx.fillStyle = `rgba(113, 211, 235, ${alpha})`;
    ctx.beginPath();
    ctx.arc(point.x, point.y, compact ? 1.4 : 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSurface(model, state, width, height, compact) {
  const gradient = ctx.createLinearGradient(0, height * 0.58, 0, height);
  gradient.addColorStop(0, "#686b70");
  gradient.addColorStop(0.35, "#3b4046");
  gradient.addColorStop(1, "#1e2227");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(model.lunarStart, height);
  ctx.lineTo(model.lunarStart, surfaceY(model.lunarStart, width, height));
  for (let x = model.lunarStart; x <= width; x += Math.max(3, width / 180)) {
    ctx.lineTo(x, surfaceY(x, width, height));
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(237, 244, 250, 0.5)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let x = model.lunarStart; x <= width; x += Math.max(3, width / 180)) {
    if (x === model.lunarStart) ctx.moveTo(x, surfaceY(x, width, height));
    else ctx.lineTo(x, surfaceY(x, width, height));
  }
  ctx.stroke();

  ctx.save();
  ctx.fillStyle = "rgba(182, 146, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(width * 0.64, surfaceY(width * 0.64, width, height));
  for (let x = width * 0.64; x <= width * 0.84; x += width / 100) {
    ctx.lineTo(x, surfaceY(x, width, height));
  }
  ctx.lineTo(width * 0.84, height);
  ctx.lineTo(width * 0.64, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!compact) {
    drawLabel("Lunar Surface Cross Section", width * 0.63, height * 0.9, "#d7dde2");
    drawLabel("Surface Occluded Zone", width * 0.65, height * 0.82, "#b692ff");
  }
}

function drawDefenseZone(model, state, width, height, compact) {
  const radius = width * (state.defenseRadius / 1250);
  ctx.save();
  ctx.strokeStyle = "rgba(255, 129, 116, 0.9)";
  ctx.fillStyle = "rgba(255, 129, 116, 0.12)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.arc(model.impact.x, model.impact.y, radius, Math.PI, 0);
  ctx.lineTo(model.impact.x + radius, model.impact.y);
  ctx.lineTo(model.impact.x - radius, model.impact.y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "#ff8174";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(model.impact.x - 7, model.impact.y - 7);
  ctx.lineTo(model.impact.x + 7, model.impact.y + 7);
  ctx.moveTo(model.impact.x + 7, model.impact.y - 7);
  ctx.lineTo(model.impact.x - 7, model.impact.y + 7);
  ctx.stroke();

  drawLabel("Lunar Defense Zone", model.impact.x, model.impact.y - radius - 22, "#ff8174", "center", compact);
  if (!compact) drawLabel("Impact Point", model.impact.x - 14, model.impact.y + 24, "#ffb1a8", "right");
}

function drawPlayerCamera(model, compact) {
  ctx.save();
  ctx.translate(model.player.x, model.player.y);
  ctx.fillStyle = "#8addad";
  ctx.beginPath();
  ctx.arc(0, 0, compact ? 4 : 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-4, -4);
  ctx.lineTo(-14, 0);
  ctx.lineTo(-4, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  drawLabel("Player Camera", model.player.x - 12, model.player.y + 20, "#8addad", "right", compact);
}

function drawThreat(model, state, runtime, width, height, compact) {
  const angle = pathAngle(runtime.progress, model, state, width, height);
  ctx.save();
  ctx.translate(runtime.threat.x, runtime.threat.y);
  ctx.rotate(angle);
  ctx.fillStyle = runtime.impactWarning ? "#ff8174" : "#edf4fa";
  ctx.shadowColor = runtime.impactWarning ? "#ff8174" : "#71d3eb";
  ctx.shadowBlur = compact ? 5 : 10;
  ctx.beginPath();
  ctx.moveTo(compact ? 7 : 11, 0);
  ctx.lineTo(compact ? -5 : -8, compact ? -4 : -6);
  ctx.lineTo(compact ? -2 : -3, 0);
  ctx.lineTo(compact ? -5 : -8, compact ? 4 : 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  if (!compact && runtime.progress < 0.96) {
    const label = runtime.surfaceOccluded ? "Threat Marker · OCCLUDED" : "Threat Marker";
    drawLabel(label, runtime.threat.x - 14, runtime.threat.y - 25, runtime.surfaceOccluded ? "#b692ff" : "#edf4fa", "right");
  }
}

function drawProjectionPreview(model, state, runtime, width, height, compact) {
  const inset = compact
    ? { x: width * 0.64, y: 10, width: width * 0.34, height: height * 0.3 }
    : { x: width * 0.68, y: 20, width: width * 0.29, height: height * 0.29 };
  const centerX = inset.x + inset.width * 0.5;
  const centerY = inset.y + inset.height * 0.52;
  const projectionRange = inset.height * 0.38;
  const halfFov = state.verticalFov * Math.PI / 360;
  const normalizedY = runtime.angleDifference / halfFov;
  const projectedY = centerY - clamp(normalizedY, -1, 1) * projectionRange;
  const horizonDelta = normalizeAngle(Math.PI - (Math.PI + state.cameraPitch * Math.PI / 180));
  const horizonY = centerY - clamp(horizonDelta / halfFov, -1, 1) * projectionRange;

  ctx.save();
  ctx.fillStyle = "rgba(8, 13, 20, 0.94)";
  ctx.strokeStyle = "rgba(113, 211, 235, 0.48)";
  ctx.lineWidth = 1.2;
  ctx.fillRect(inset.x, inset.y, inset.width, inset.height);
  ctx.strokeRect(inset.x, inset.y, inset.width, inset.height);

  ctx.strokeStyle = "rgba(237, 244, 250, 0.38)";
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(inset.x + 8, horizonY);
  ctx.lineTo(inset.x + inset.width - 8, horizonY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "rgba(104, 107, 112, 0.55)";
  ctx.fillRect(inset.x + 1, Math.max(horizonY, inset.y + inset.height * 0.7), inset.width - 2, inset.y + inset.height - Math.max(horizonY, inset.y + inset.height * 0.7) - 1);

  ctx.strokeStyle = "rgba(255, 129, 116, 0.85)";
  ctx.beginPath();
  ctx.arc(centerX, inset.y + inset.height - 15, compact ? 7 : 10, Math.PI, 0);
  ctx.stroke();

  if (runtime.threatOnScreen) {
    ctx.fillStyle = runtime.surfaceOccluded ? "#b692ff" : runtime.impactWarning ? "#ff8174" : "#edf4fa";
    ctx.beginPath();
    ctx.arc(centerX, projectedY, compact ? 3.5 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(237, 244, 250, 0.6)";
    ctx.beginPath();
    ctx.arc(centerX, projectedY, compact ? 7 : 10, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = "#80909f";
    ctx.beginPath();
    ctx.moveTo(centerX, projectedY);
    ctx.lineTo(centerX - 5, projectedY + (normalizedY > 0 ? 7 : -7));
    ctx.lineTo(centerX + 5, projectedY + (normalizedY > 0 ? 7 : -7));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  drawLabel(compact ? "Front Preview" : "Front Projection Preview", inset.x + 8, inset.y + 13, "#71d3eb", "left", compact);
  const previewState = runtime.surfaceOccluded
    ? "SURFACE OCCLUDED"
    : runtime.visualContact
      ? "VISUAL CONTACT"
      : runtime.impactWarning
        ? "PREDICTED CONTACT"
        : "OUT OF VIEW";
  drawLabel(previewState, centerX, inset.y + inset.height - 14, runtime.surfaceOccluded ? "#b692ff" : runtime.visualContact ? "#8addad" : "#ff8174", "center", compact);
}

function render() {
  const state = values();
  const { width, height } = viewport;
  const compact = width < 720;
  const model = sceneModel(width, height, state);
  const runtime = runtimeState(state, model, width, height);

  ctx.setTransform(viewport.dpr, 0, 0, viewport.dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);
  drawSourceArea(model, state, width, height, compact);
  drawCameraCone(model, state, width, height, compact);
  drawTrajectory(model, state, runtime, width, height, compact);
  drawTrail(model, state, runtime, width, height, compact);
  drawSurface(model, state, width, height, compact);
  drawDefenseZone(model, state, width, height, compact);
  drawPlayerCamera(model, compact);
  drawThreat(model, state, runtime, width, height, compact);
  drawProjectionPreview(model, state, runtime, width, height, compact);
  updateReadout(state, runtime);
}

function setBooleanReadout(element, active, activeText = "Yes") {
  element.textContent = active ? activeText : "No";
  element.dataset.tone = active ? "on" : "off";
}

function updateReadout(state, runtime) {
  outputs.boostDuration.textContent = `${state.boostDuration.toFixed(1)} s`;
  outputs.curveAmount.textContent = `${state.curveAmount}%`;
  outputs.threatSpeed.textContent = `${state.threatSpeed} sim u/s`;
  outputs.warningProgress.textContent = `${Math.round(state.warningProgress * 100)}%`;
  outputs.cameraPitch.textContent = `${state.cameraPitch}°`;
  outputs.verticalFov.textContent = `${state.verticalFov}°`;
  outputs.defenseRadius.textContent = `${state.defenseRadius} sim u`;
  outputs.trailLength.textContent = `${state.trailLength} points`;

  readout.source.textContent = sourceNames[state.sourceType];
  readout.shape.textContent = shapeNames[state.trajectoryShape];
  readout.progress.textContent = `${(runtime.progress * 100).toFixed(1)}%`;
  readout.threat.textContent = runtime.threatState;
  readout.liveState.textContent = runtime.threatState;
  readout.pitch.textContent = `${state.cameraPitch}°`;
  readout.fov.textContent = `${state.verticalFov}°`;

  readout.warning.textContent = runtime.impactWarning ? "Active" : "Off";
  readout.warning.dataset.tone = runtime.impactWarning ? "warning" : "off";
  setBooleanReadout(readout.contact, runtime.visualContact);
  readout.occluded.textContent = runtime.surfaceOccluded ? "Yes" : "No";
  readout.occluded.dataset.tone = runtime.surfaceOccluded ? "occluded" : "off";
  setBooleanReadout(readout.screen, runtime.threatOnScreen);
  readout.predicted.textContent = runtime.predictedContact ? "Yes" : "No";
  readout.predicted.dataset.tone = runtime.predictedContact ? "warning" : "off";
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.max(320, rect.width);
  const height = Math.max(192, rect.height);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);

  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  viewport = { width, height, dpr };
  render();
}

function restart() {
  animation.progress = 0;
  animation.running = true;
  animation.lastTime = performance.now();
  buttons.play.textContent = "Pause";
  render();
}

function setDefaults() {
  Object.entries(defaults).forEach(([key, value]) => {
    controls[key].value = value;
  });
  restart();
}

function togglePlay() {
  if (animation.progress >= 1) {
    restart();
    return;
  }
  animation.running = !animation.running;
  animation.lastTime = performance.now();
  buttons.play.textContent = animation.running ? "Pause" : "Resume";
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", render);
});

controls.sourceType.addEventListener("change", restart);
controls.trajectoryShape.addEventListener("change", restart);
buttons.play.addEventListener("click", togglePlay);
buttons.restart.addEventListener("click", restart);
buttons.defaults.addEventListener("click", setDefaults);

new ResizeObserver(resizeCanvas).observe(canvas);

function animate(time) {
  const delta = Math.min(0.05, (time - animation.lastTime) / 1000);
  animation.lastTime = time;

  if (animation.running) {
    const state = values();
    animation.progress = Math.min(1, animation.progress + delta / totalDuration(state));
    if (animation.progress >= 1) {
      animation.running = false;
      buttons.play.textContent = "Replay";
    }
    render();
  }

  requestAnimationFrame(animate);
}

resizeCanvas();
requestAnimationFrame(animate);
