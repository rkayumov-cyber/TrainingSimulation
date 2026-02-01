// Pure functions that generate clinical SVG diagrams

export type ECGPattern =
  | "normal"
  | "stemi"
  | "afib"
  | "vfib"
  | "vtach"
  | "asystole";
export type ChestXrayFinding =
  | "normal"
  | "pneumothorax"
  | "pleural_effusion"
  | "cardiomegaly";
export interface PupilState {
  size: number; // mm 1-9
  reactive: boolean;
}

// ── ECG Generator ──

export function generateECG(
  pattern: ECGPattern,
  params?: { hr?: number; width?: number; height?: number },
): string {
  const w = params?.width || 800;
  const h = params?.height || 400;
  const hr = params?.hr || 75;

  const bgColor = "#0a0a0a";
  const gridColor = "#1a3a1a";
  const traceColor =
    pattern === "vfib" || pattern === "vtach" ? "#ff4444" : "#00ff44";

  let pathData: string;

  switch (pattern) {
    case "normal":
      pathData = generateNormalSinus(w, h, hr);
      break;
    case "stemi":
      pathData = generateSTEMI(w, h, hr);
      break;
    case "afib":
      pathData = generateAFib(w, h);
      break;
    case "vfib":
      pathData = generateVFib(w, h);
      break;
    case "vtach":
      pathData = generateVTach(w, h);
      break;
    case "asystole":
      pathData = generateAsystole(w, h);
      break;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${bgColor}"/>
  <!-- Grid -->
  ${generateGrid(w, h, gridColor)}
  <!-- Label -->
  <text x="15" y="25" fill="${traceColor}" font-family="monospace" font-size="14">${getECGLabel(pattern)} ${hr ? `${hr} BPM` : ""}</text>
  <text x="15" y="${h - 10}" fill="#555" font-family="monospace" font-size="10">Lead II | 25mm/s | 10mm/mV</text>
  <!-- Trace -->
  <path d="${pathData}" fill="none" stroke="${traceColor}" stroke-width="2" stroke-linejoin="round"/>
</svg>`;
}

function getECGLabel(pattern: ECGPattern): string {
  switch (pattern) {
    case "normal":
      return "Normal Sinus Rhythm";
    case "stemi":
      return "ST-Elevation MI";
    case "afib":
      return "Atrial Fibrillation";
    case "vfib":
      return "Ventricular Fibrillation";
    case "vtach":
      return "Ventricular Tachycardia";
    case "asystole":
      return "Asystole";
  }
}

function generateGrid(w: number, h: number, color: string): string {
  let grid = "";
  const smallStep = 20;
  const largeStep = 100;
  for (let x = 0; x <= w; x += smallStep) {
    const isLarge = x % largeStep === 0;
    grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${color}" stroke-width="${isLarge ? 0.8 : 0.3}"/>`;
  }
  for (let y = 0; y <= h; y += smallStep) {
    const isLarge = y % largeStep === 0;
    grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${color}" stroke-width="${isLarge ? 0.8 : 0.3}"/>`;
  }
  return grid;
}

function generateNormalSinus(w: number, h: number, hr: number): string {
  const mid = h / 2;
  const cycleWidth = Math.min(200, w / Math.max(1, Math.round(hr / 20)));
  const points: [number, number][] = [];
  let x = 0;

  while (x < w) {
    // P wave
    points.push([x, mid]);
    points.push([x + cycleWidth * 0.08, mid - 15]);
    points.push([x + cycleWidth * 0.16, mid]);
    // PR segment
    points.push([x + cycleWidth * 0.22, mid]);
    // Q wave
    points.push([x + cycleWidth * 0.26, mid + 8]);
    // R wave
    points.push([x + cycleWidth * 0.32, mid - 80]);
    // S wave
    points.push([x + cycleWidth * 0.36, mid + 15]);
    // ST segment
    points.push([x + cycleWidth * 0.42, mid]);
    // T wave
    points.push([x + cycleWidth * 0.55, mid - 20]);
    points.push([x + cycleWidth * 0.65, mid]);
    // Baseline
    points.push([x + cycleWidth, mid]);
    x += cycleWidth;
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

function generateSTEMI(w: number, h: number, hr: number): string {
  const mid = h / 2;
  const cycleWidth = Math.min(200, w / Math.max(1, Math.round(hr / 20)));
  const points: [number, number][] = [];
  let x = 0;

  while (x < w) {
    points.push([x, mid]);
    // P wave
    points.push([x + cycleWidth * 0.08, mid - 12]);
    points.push([x + cycleWidth * 0.16, mid]);
    points.push([x + cycleWidth * 0.22, mid]);
    // Q wave (pathological)
    points.push([x + cycleWidth * 0.26, mid + 20]);
    // R wave (reduced)
    points.push([x + cycleWidth * 0.32, mid - 55]);
    // S wave
    points.push([x + cycleWidth * 0.36, mid + 10]);
    // ST elevation (key feature)
    points.push([x + cycleWidth * 0.40, mid - 35]);
    points.push([x + cycleWidth * 0.50, mid - 38]);
    // Elevated T wave merging with ST
    points.push([x + cycleWidth * 0.60, mid - 30]);
    points.push([x + cycleWidth * 0.70, mid]);
    points.push([x + cycleWidth, mid]);
    x += cycleWidth;
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

function generateAFib(w: number, h: number): string {
  const mid = h / 2;
  const points: [number, number][] = [];
  let x = 0;

  while (x < w) {
    // Irregular baseline (fibrillatory)
    const segLen = 30 + Math.random() * 60;
    for (let dx = 0; dx < segLen && x + dx < w; dx += 3) {
      points.push([x + dx, mid + (Math.random() - 0.5) * 10]);
    }
    // Irregular QRS
    const qrsX = x + segLen;
    if (qrsX < w) {
      points.push([qrsX, mid + 6]);
      points.push([qrsX + 8, mid - 65 - Math.random() * 30]);
      points.push([qrsX + 14, mid + 12]);
      points.push([qrsX + 22, mid]);
      // Irregular T
      points.push([qrsX + 40, mid - 15]);
      points.push([qrsX + 55, mid]);
    }
    x += segLen + 60;
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

function generateVFib(w: number, h: number): string {
  const mid = h / 2;
  const points: [number, number][] = [];

  for (let x = 0; x < w; x += 4) {
    const amplitude = 30 + Math.random() * 60;
    const freq = 0.15 + Math.random() * 0.1;
    points.push([x, mid + Math.sin(x * freq) * amplitude]);
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

function generateVTach(w: number, h: number): string {
  const mid = h / 2;
  const cycleWidth = 60;
  const points: [number, number][] = [];
  let x = 0;

  while (x < w) {
    // Wide QRS complex - monomorphic
    points.push([x, mid]);
    points.push([x + 8, mid - 80]);
    points.push([x + 20, mid + 70]);
    points.push([x + 30, mid - 40]);
    points.push([x + 38, mid + 20]);
    points.push([x + cycleWidth, mid]);
    x += cycleWidth;
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

function generateAsystole(w: number, h: number): string {
  const mid = h / 2;
  const points: [number, number][] = [];

  for (let x = 0; x < w; x += 5) {
    points.push([x, mid + (Math.random() - 0.5) * 3]);
  }

  return "M " + points.map(([px, py]) => `${px},${py}`).join(" L ");
}

// ── Chest X-ray Generator ──

export function generateChestXray(
  findings:
    | "normal"
    | "pneumothorax"
    | "pleural_effusion"
    | "cardiomegaly",
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 600;
  const h = params?.height || 600;
  const cx = w / 2;
  const cy = h / 2;

  let abnormality = "";
  let label = "Normal Chest X-ray (PA)";

  switch (findings) {
    case "pneumothorax":
      label = "Right Pneumothorax";
      // Collapsed lung border + absent markings area
      abnormality = `
        <ellipse cx="${cx + 110}" cy="${cy - 30}" rx="80" ry="160" fill="none" stroke="#666" stroke-width="2" stroke-dasharray="6,4"/>
        <text x="${cx + 140}" y="${cy - 120}" fill="#aa4444" font-size="11" font-family="sans-serif">Absent lung</text>
        <text x="${cx + 140}" y="${cy - 105}" fill="#aa4444" font-size="11" font-family="sans-serif">markings</text>
        <line x1="${cx + 30}" y1="${cy - 190}" x2="${cx + 30}" y2="${cy + 130}" stroke="#888" stroke-width="1.5" stroke-dasharray="4,3"/>`;
      break;
    case "pleural_effusion":
      label = "Right Pleural Effusion";
      abnormality = `
        <path d="M ${cx + 20} ${cy + 120} Q ${cx + 80} ${cy + 80} ${cx + 160} ${cy + 100} L ${cx + 180} ${cy + 200} L ${cx + 20} ${cy + 200} Z" fill="#445566" opacity="0.6"/>
        <path d="M ${cx + 20} ${cy + 120} Q ${cx + 80} ${cy + 80} ${cx + 160} ${cy + 100}" fill="none" stroke="#667788" stroke-width="1.5"/>
        <text x="${cx + 50}" y="${cy + 170}" fill="#8899aa" font-size="11" font-family="sans-serif">Meniscus sign</text>`;
      break;
    case "cardiomegaly":
      label = "Cardiomegaly";
      break;
  }

  const heartWidth = findings === "cardiomegaly" ? 160 : 100;
  const heartOpacity = findings === "cardiomegaly" ? 0.7 : 0.5;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#111"/>
  <!-- Body outline -->
  <ellipse cx="${cx}" cy="${cy}" rx="200" ry="230" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
  <!-- Ribcage -->
  ${generateRibs(cx, cy)}
  <!-- Spine -->
  <line x1="${cx}" y1="${cy - 200}" x2="${cx}" y2="${cy + 200}" stroke="#444" stroke-width="3"/>
  <!-- Mediastinum -->
  <rect x="${cx - 25}" y="${cy - 180}" width="50" height="360" fill="#222" rx="10"/>
  <!-- Heart shadow -->
  <ellipse cx="${cx - 15}" cy="${cy + 40}" rx="${heartWidth}" ry="110" fill="#333" opacity="${heartOpacity}" stroke="#444" stroke-width="1"/>
  <!-- Diaphragm -->
  <path d="M ${cx - 200} ${cy + 150} Q ${cx - 80} ${cy + 100} ${cx} ${cy + 130} Q ${cx + 80} ${cy + 100} ${cx + 200} ${cy + 150}" fill="none" stroke="#555" stroke-width="2"/>
  <!-- Clavicles -->
  <line x1="${cx - 180}" y1="${cy - 190}" x2="${cx - 20}" y2="${cy - 210}" stroke="#555" stroke-width="3"/>
  <line x1="${cx + 20}" y1="${cy - 210}" x2="${cx + 180}" y2="${cy - 190}" stroke="#555" stroke-width="3"/>
  ${abnormality}
  <!-- Label -->
  <text x="15" y="25" fill="#888" font-family="monospace" font-size="13">${label}</text>
  <text x="15" y="${h - 10}" fill="#555" font-family="monospace" font-size="10">PA View | Upright</text>
  ${findings === "cardiomegaly" ? `
  <line x1="${cx - 175}" y1="${cy + 40}" x2="${cx + 145}" y2="${cy + 40}" stroke="#aa4444" stroke-width="1" stroke-dasharray="5,3"/>
  <text x="${cx + 50}" y="${cy + 30}" fill="#aa4444" font-size="11" font-family="sans-serif">CTR > 0.5</text>` : ""}
</svg>`;
}

function generateRibs(cx: number, cy: number): string {
  let ribs = "";
  for (let i = 0; i < 8; i++) {
    const y = cy - 160 + i * 45;
    const curve = 15 + i * 3;
    // Left ribs
    ribs += `<path d="M ${cx - 20} ${y} Q ${cx - 120} ${y - curve} ${cx - 190} ${y + 10}" fill="none" stroke="#3a3a3a" stroke-width="2"/>`;
    // Right ribs
    ribs += `<path d="M ${cx + 20} ${y} Q ${cx + 120} ${y - curve} ${cx + 190} ${y + 10}" fill="none" stroke="#3a3a3a" stroke-width="2"/>`;
  }
  return ribs;
}

// ── Pupil Chart Generator ──

export function generatePupilChart(
  left: PupilState,
  right: PupilState,
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 500;
  const h = params?.height || 300;

  function pupilSvg(
    cx: number,
    cy: number,
    state: PupilState,
    label: string,
  ): string {
    const irisR = 45;
    const pupilR = (state.size / 9) * 35 + 5;
    const reactiveColor = state.reactive ? "#44aa44" : "#aa4444";
    const reactiveText = state.reactive ? "Reactive" : "Fixed";

    return `
      <circle cx="${cx}" cy="${cy}" r="${irisR}" fill="#5577aa" stroke="#334466" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${pupilR}" fill="#111"/>
      ${!state.reactive ? `<line x1="${cx - pupilR + 3}" y1="${cy - pupilR + 3}" x2="${cx + pupilR - 3}" y2="${cy + pupilR - 3}" stroke="#aa4444" stroke-width="2"/>` : ""}
      <text x="${cx}" y="${cy + irisR + 25}" text-anchor="middle" fill="#ccc" font-family="sans-serif" font-size="14" font-weight="bold">${label}</text>
      <text x="${cx}" y="${cy + irisR + 45}" text-anchor="middle" fill="#999" font-family="sans-serif" font-size="12">${state.size}mm</text>
      <text x="${cx}" y="${cy + irisR + 62}" text-anchor="middle" fill="${reactiveColor}" font-family="sans-serif" font-size="12">${reactiveText}</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
  <text x="${w / 2}" y="30" text-anchor="middle" fill="#aaa" font-family="sans-serif" font-size="16" font-weight="bold">Pupil Assessment</text>
  ${pupilSvg(w * 0.3, h * 0.4, left, "Left (OS)")}
  ${pupilSvg(w * 0.7, h * 0.4, right, "Right (OD)")}
  <text x="${w / 2}" y="${h - 10}" text-anchor="middle" fill="#555" font-family="monospace" font-size="10">PERRL = Pupils Equal, Round, Reactive to Light</text>
</svg>`;
}

// ── Vital Trend Generator ──

export interface VitalDataPoint {
  time: number; // minutes
  value: number;
}

export function generateVitalTrend(
  data: VitalDataPoint[],
  vitalType: string,
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 700;
  const h = params?.height || 350;
  const pad = { top: 40, right: 30, bottom: 40, left: 60 };

  if (data.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
      <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
      <text x="${w / 2}" y="${h / 2}" text-anchor="middle" fill="#555" font-size="14">No data</text>
    </svg>`;
  }

  const minTime = Math.min(...data.map((d) => d.time));
  const maxTime = Math.max(...data.map((d) => d.time));
  const minVal = Math.min(...data.map((d) => d.value)) * 0.9;
  const maxVal = Math.max(...data.map((d) => d.value)) * 1.1;

  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const scaleX = (t: number) =>
    pad.left + ((t - minTime) / (maxTime - minTime || 1)) * chartW;
  const scaleY = (v: number) =>
    pad.top + chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH;

  const pathPoints = data
    .map((d) => `${scaleX(d.time)},${scaleY(d.value)}`)
    .join(" L ");

  const dots = data
    .map(
      (d) =>
        `<circle cx="${scaleX(d.time)}" cy="${scaleY(d.value)}" r="3" fill="#00cc66"/>`,
    )
    .join("");

  // Y-axis ticks
  const yTicks: string[] = [];
  const step = (maxVal - minVal) / 5;
  for (let i = 0; i <= 5; i++) {
    const val = minVal + step * i;
    const y = scaleY(val);
    yTicks.push(
      `<line x1="${pad.left}" y1="${y}" x2="${w - pad.right}" y2="${y}" stroke="#222" stroke-width="0.5"/>`,
    );
    yTicks.push(
      `<text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" fill="#666" font-size="10" font-family="monospace">${Math.round(val)}</text>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
  <text x="${w / 2}" y="25" text-anchor="middle" fill="#aaa" font-family="sans-serif" font-size="14" font-weight="bold">${vitalType} Trend</text>
  ${yTicks.join("")}
  <path d="M ${pathPoints}" fill="none" stroke="#00cc66" stroke-width="2"/>
  ${dots}
  <text x="${w / 2}" y="${h - 8}" text-anchor="middle" fill="#555" font-size="10" font-family="monospace">Time (minutes)</text>
</svg>`;
}

// ── ABG Chart Generator ──

export function generateABGChart(
  ph: number,
  pco2: number,
  hco3: number,
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 500;
  const h = params?.height || 400;

  // Determine disorder
  let disorder = "Normal";
  let disorderColor = "#44aa44";
  if (ph < 7.35) {
    disorder = pco2 > 45 ? "Respiratory Acidosis" : "Metabolic Acidosis";
    disorderColor = "#ee4444";
  } else if (ph > 7.45) {
    disorder = pco2 < 35 ? "Respiratory Alkalosis" : "Metabolic Alkalosis";
    disorderColor = "#4488ee";
  }

  const barMaxH = 200;

  function bar(
    x: number,
    label: string,
    value: number,
    min: number,
    max: number,
    normalLow: number,
    normalHigh: number,
    unit: string,
  ): string {
    const barW = 60;
    const barY = 120;
    const fillHeight = ((value - min) / (max - min)) * barMaxH;
    const isLow = value < normalLow;
    const isHigh = value > normalHigh;
    const barColor = isLow ? "#ee6644" : isHigh ? "#ee6644" : "#44aa44";
    const normalLowY = barY + barMaxH - ((normalLow - min) / (max - min)) * barMaxH;
    const normalHighY = barY + barMaxH - ((normalHigh - min) / (max - min)) * barMaxH;

    return `
      <rect x="${x}" y="${barY}" width="${barW}" height="${barMaxH}" fill="#1a1a1a" stroke="#333" rx="4"/>
      <rect x="${x}" y="${barY + barMaxH - fillHeight}" width="${barW}" height="${fillHeight}" fill="${barColor}" opacity="0.6" rx="4"/>
      <rect x="${x - 5}" y="${normalHighY}" width="${barW + 10}" height="${normalLowY - normalHighY}" fill="#44aa44" opacity="0.15" rx="2"/>
      <text x="${x + barW / 2}" y="${barY - 10}" text-anchor="middle" fill="#ccc" font-size="13" font-weight="bold">${label}</text>
      <text x="${x + barW / 2}" y="${barY + barMaxH + 20}" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">${value}</text>
      <text x="${x + barW / 2}" y="${barY + barMaxH + 36}" text-anchor="middle" fill="#666" font-size="10">${unit}</text>
      <text x="${x + barW + 12}" y="${normalHighY + 4}" fill="#555" font-size="9">${normalHigh}</text>
      <text x="${x + barW + 12}" y="${normalLowY + 4}" fill="#555" font-size="9">${normalLow}</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
  <text x="${w / 2}" y="30" text-anchor="middle" fill="#aaa" font-family="sans-serif" font-size="16" font-weight="bold">Arterial Blood Gas Analysis</text>
  <text x="${w / 2}" y="55" text-anchor="middle" fill="${disorderColor}" font-family="sans-serif" font-size="13">${disorder}</text>
  ${bar(60, "pH", ph, 6.8, 7.8, 7.35, 7.45, "")}
  ${bar(210, "pCO2", pco2, 15, 80, 35, 45, "mmHg")}
  ${bar(360, "HCO3", hco3, 5, 40, 22, 26, "mEq/L")}
</svg>`;
}

// ── GCS Scale Generator ──

export function generateGCSScale(
  eye: number,
  verbal: number,
  motor: number,
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 450;
  const h = params?.height || 350;
  const total = eye + verbal + motor;

  let severity = "Mild (13-15)";
  let severityColor = "#44aa44";
  if (total <= 8) {
    severity = "Severe (3-8)";
    severityColor = "#ee4444";
  } else if (total <= 12) {
    severity = "Moderate (9-12)";
    severityColor = "#eeaa44";
  }

  function scoreRow(
    y: number,
    label: string,
    score: number,
    max: number,
  ): string {
    const barW = 220;
    const barX = 160;
    const fillW = (score / max) * barW;
    const color =
      score === max
        ? "#44aa44"
        : score >= max / 2
          ? "#eeaa44"
          : "#ee4444";

    return `
      <text x="145" y="${y + 15}" text-anchor="end" fill="#ccc" font-family="sans-serif" font-size="13">${label}</text>
      <rect x="${barX}" y="${y}" width="${barW}" height="22" fill="#1a1a1a" stroke="#333" rx="4"/>
      <rect x="${barX}" y="${y}" width="${fillW}" height="22" fill="${color}" opacity="0.6" rx="4"/>
      <text x="${barX + barW + 15}" y="${y + 16}" fill="#fff" font-size="14" font-weight="bold">${score}/${max}</text>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
  <text x="${w / 2}" y="35" text-anchor="middle" fill="#aaa" font-family="sans-serif" font-size="16" font-weight="bold">Glasgow Coma Scale</text>
  <text x="${w / 2}" y="60" text-anchor="middle" fill="${severityColor}" font-family="sans-serif" font-size="24" font-weight="bold">${total}/15</text>
  <text x="${w / 2}" y="80" text-anchor="middle" fill="${severityColor}" font-family="sans-serif" font-size="12">${severity}</text>
  ${scoreRow(110, "Eye Opening (E)", eye, 4)}
  ${scoreRow(155, "Verbal (V)", verbal, 5)}
  ${scoreRow(200, "Motor (M)", motor, 6)}
  <text x="${w / 2}" y="${h - 15}" text-anchor="middle" fill="#555" font-family="monospace" font-size="10">GCS = E${eye} + V${verbal} + M${motor}</text>
</svg>`;
}

// ── Burn Chart (Rule of 9s) Generator ──

export function generateBurnChart(
  areas: { region: string; percent: number }[],
  params?: { width?: number; height?: number },
): string {
  const w = params?.width || 500;
  const h = params?.height || 600;

  const totalBSA = areas.reduce((sum, a) => sum + a.percent, 0);

  // Body region coordinates (simplified human figure)
  const regionPaths: Record<string, string> = {
    head: `M ${w / 2 - 25} 80 Q ${w / 2} 50 ${w / 2 + 25} 80 Q ${w / 2 + 30} 110 ${w / 2 + 20} 130 L ${w / 2 - 20} 130 Q ${w / 2 - 30} 110 ${w / 2 - 25} 80`,
    chest: `M ${w / 2 - 55} 140 L ${w / 2 + 55} 140 L ${w / 2 + 55} 260 L ${w / 2 - 55} 260 Z`,
    back: `M ${w / 2 - 55} 140 L ${w / 2 + 55} 140 L ${w / 2 + 55} 260 L ${w / 2 - 55} 260 Z`,
    abdomen: `M ${w / 2 - 50} 260 L ${w / 2 + 50} 260 L ${w / 2 + 45} 340 L ${w / 2 - 45} 340 Z`,
    left_arm: `M ${w / 2 - 60} 150 L ${w / 2 - 90} 150 L ${w / 2 - 100} 300 L ${w / 2 - 70} 300 Z`,
    right_arm: `M ${w / 2 + 60} 150 L ${w / 2 + 90} 150 L ${w / 2 + 100} 300 L ${w / 2 + 70} 300 Z`,
    left_leg: `M ${w / 2 - 40} 345 L ${w / 2 - 10} 345 L ${w / 2 - 5} 520 L ${w / 2 - 45} 520 Z`,
    right_leg: `M ${w / 2 + 10} 345 L ${w / 2 + 40} 345 L ${w / 2 + 45} 520 L ${w / 2 + 5} 520 Z`,
    perineum: `M ${w / 2 - 10} 335 L ${w / 2 + 10} 335 L ${w / 2 + 10} 350 L ${w / 2 - 10} 350 Z`,
  };

  const areaMap = new Map(areas.map((a) => [a.region, a.percent]));

  let bodyParts = "";
  for (const [region, path] of Object.entries(regionPaths)) {
    const pct = areaMap.get(region) || 0;
    const color = pct > 0 ? `rgba(238, 68, 68, ${Math.min(0.8, pct / 30)})` : "#2a2a2a";
    const stroke = pct > 0 ? "#ee4444" : "#444";
    bodyParts += `<path d="${path}" fill="${color}" stroke="${stroke}" stroke-width="1.5"/>`;
  }

  // Legend
  const legendItems = areas
    .map(
      (a, i) =>
        `<text x="${w - 150}" y="${80 + i * 20}" fill="#ccc" font-size="11" font-family="sans-serif">${a.region}: ${a.percent}%</text>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#0f0f0f" rx="8"/>
  <text x="${w / 2}" y="30" text-anchor="middle" fill="#aaa" font-family="sans-serif" font-size="16" font-weight="bold">Burn Assessment (Rule of 9s)</text>
  <text x="${w / 2}" y="55" text-anchor="middle" fill="${totalBSA > 20 ? "#ee4444" : "#eeaa44"}" font-size="20" font-weight="bold">Total BSA: ${totalBSA}%</text>
  ${bodyParts}
  ${legendItems}
  <text x="${w / 2}" y="${h - 10}" text-anchor="middle" fill="#555" font-family="monospace" font-size="10">Adult Rule of 9s</text>
</svg>`;
}
