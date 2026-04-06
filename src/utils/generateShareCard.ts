const difficultyMap: Record<number, string> = {
  1: "EASY",
  2: "MEDIUM",
  3: "HARD",
} as const;

const firstPart = [
  "It just got wild",
  "Absolute chaos",
  "We just smashed it",
  "We just crushed it",
];

const secondPart = [
  "Beat that.",
  "Your turn.",
  "Think you can top it?",
  "Can you beat our score?",
];

interface GenerateShareCardProps {
  currentMode: string;
  currentDifficulty: number;
  starsCount: number;
  totalCount: number;
  averageTime: string;
  firstPartIndex: number;
  secondPartIndex: number;
}

export async function generateShareCard({
  currentMode,
  currentDifficulty,
  starsCount,
  totalCount,
  averageTime,
  firstPartIndex,
  secondPartIndex,
}: GenerateShareCardProps): Promise<Blob | null> {
  const SIZE = 810;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // ── Background ──────────────────────────────────────────
  ctx.fillStyle = "#111016";
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Dot grid pattern ────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  const spacing = 28;
  const radius = 1.2;
  for (let x = spacing; x < SIZE; x += spacing) {
    for (let y = spacing; y < SIZE; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Top stripe ──────────────────────────────────────────
  const stripeGrad = ctx.createLinearGradient(0, 0, SIZE, 0);
  stripeGrad.addColorStop(0, "#e8522a");
  stripeGrad.addColorStop(0.5, "#c9303a");
  stripeGrad.addColorStop(1, "#9b2dd4");
  ctx.fillStyle = stripeGrad;
  ctx.fillRect(0, 0, SIZE, 5);

  // ── Film strip corners ───────────────────────────────────
  drawFilmCorner(ctx, 20, 20, false, false);
  drawFilmCorner(ctx, SIZE - 20, 20, true, false);
  drawFilmCorner(ctx, 20, SIZE - 20, false, true);
  drawFilmCorner(ctx, SIZE - 20, SIZE - 20, true, true);

  // ── App name ─────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "600 18px 'Times New Roman', serif";
  ctx.letterSpacing = "8px";
  ctx.textAlign = "center";
  ctx.fillText("TAMILCHARADES.com", SIZE / 2, 148);
  // margin-bottom:50px;

  // ── Mode badge ───────────────────────────────────────────
  const badgeText = `${currentMode} on ${difficultyMap[currentDifficulty]}`;
  ctx.font = "500 22px 'Times New Roman', serif";
  ctx.letterSpacing = "4px";
  const badgeW = ctx.measureText(badgeText).width + 40;
  const badgeX = SIZE / 2 - badgeW / 2;
  const badgeY = 200;

  // badge background
  ctx.fillStyle = "rgba(232,82,42,0.13)";
  roundRect(ctx, badgeX, badgeY, badgeW, 32, 13);
  ctx.fill();
  // badge border
  ctx.strokeStyle = "rgba(232,82,42,0.38)";
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, badgeY, badgeW, 32, 13);
  ctx.stroke();
  // badge text
  ctx.fillStyle = "#e8845a";
  ctx.fillText(badgeText, SIZE / 2, badgeY + 23);

  // ── Score number ─────────────────────────────────────────
  ctx.letterSpacing = "-4px";
  ctx.font = "700 120px Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(String(starsCount), SIZE / 2 - (ctx.measureText(String(starsCount)).width / 1.5), 360);

  // denominator
  ctx.letterSpacing = "0px";
  ctx.font = "400 50px Georgia, serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText(`/ ${totalCount}`, SIZE / 2 + (ctx.measureText(`/ ${totalCount}`).width / 2), 360);

  // ── Tagline ──────────────────────────────────────────────
  ctx.font = "400 18px 'Times New Roman', serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.letterSpacing = "1px";
  ctx.fillText(firstPart[firstPartIndex], SIZE / 2, 418);

  // ── Divider ──────────────────────────────────────────────
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(SIZE / 2 - 48, 460);
  ctx.lineTo(SIZE / 2 + 48, 460);
  ctx.stroke();

  // ── Stats row ────────────────────────────────────────────
  ctx.font = "600 22px 'Times New Roman', serif";
  ctx.fillStyle = "#ffffff";
  ctx.letterSpacing = "0px";
  ctx.fillText(averageTime, SIZE / 2, 516);
  console.log(averageTime);

  ctx.font = "400 14px 'Times New Roman', serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.letterSpacing = "2px";
  ctx.fillText("AVG TIME", SIZE / 2, 546);

  // ── CTA footer ───────────────────────────────────────────
  ctx.font = "400 15px 'Times New Roman', serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.letterSpacing = "2px";
  ctx.fillText(secondPart[secondPartIndex].toUpperCase(), SIZE / 2, 648);

  // ── Export ───────────────────────────────────────────────
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/png"),
  );
}

// ── Helpers ──────────────────────────────────────────────────

function drawFilmCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  flipX: boolean,
  flipY: boolean,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  // sprocket holes
  [
    [0, 0],
    [0, 10],
    [0, 20],
  ].forEach(([dx, dy]) => {
    ctx.fillRect(dx, dy, 7, 7);
  });
  // film strip body
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(10, 0, 24, 30);
  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}
