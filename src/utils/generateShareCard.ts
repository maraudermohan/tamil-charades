import { lora, poppins, rubik } from "@/app/fonts";

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

/**
 * The card always uses the dark theme. Canvas can't read CSS variables for a theme that
 * isn't applied, so these mirror the dark-mode values in src/app/tokens.css.
 */
const colors = {
  bg: "#1e1d33", // --color-bg
  text: "#fffcf6", // --color-text
  textMuted: "#fffcf6b3", // --color-text-muted
  chip: "#5b4b8a", // --color-accent
  onChip: "#fffcf6", // --color-on-accent
  card: "#fffcf6", // --color-word-card
  onCard: "#2b2a4c", // --color-on-word-card
  cardBorder: "#474556", // --color-word-card-border
  highlight: "#e5b653", // --color-highlight
  stripe: ["#e0644a", "#e5b653", "#2a9d8f"], // tomato, mustard, teal (bright)
  dots: "#fffcf60f",
  filmHoles: "#fffcf629",
  filmBody: "#fffcf614",
};

const fonts = {
  lora: lora.style.fontFamily,
  poppins: poppins.style.fontFamily,
  rubik: rubik.style.fontFamily,
};

export interface ShareCardStats {
  bestStreak: number;
  fastestTitle: string | null;
  accuracy: number;
  totalTime: string;
}

interface GenerateShareCardProps {
  currentMode: string;
  starsCount: number;
  totalCount: number;
  stats: ShareCardStats;
  firstPartIndex: number;
  secondPartIndex: number;
}

/** Layout is in an 810×810 space, rendered at 1080×1080. */
const SIZE = 810;
const OUTPUT_SIZE = 1080;

export async function generateShareCard({
  currentMode,
  starsCount,
  totalCount,
  stats,
  firstPartIndex,
  secondPartIndex,
}: GenerateShareCardProps): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Fonts the page hasn't drawn yet (or Lora after its optional swap window) aren't ready for canvas.
  const fontsUsed = [
    `600 18px ${fonts.lora}`,
    `700 120px ${fonts.lora}`,
    `400 22px ${fonts.lora}`,
    `400 44px ${fonts.poppins}`,
    `600 17px ${fonts.poppins}`,
    `600 26px ${fonts.poppins}`,
    `400 17px ${fonts.rubik}`,
    `500 18px ${fonts.rubik}`,
  ];
  await Promise.all(fontsUsed.map((font) => document.fonts.load(font).catch(() => [])));

  ctx.scale(OUTPUT_SIZE / SIZE, OUTPUT_SIZE / SIZE);
  ctx.textAlign = "center";

  // ── Background ──────────────────────────────────────────
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Dot grid pattern ────────────────────────────────────
  ctx.fillStyle = colors.dots;
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
  colors.stripe.forEach((color, index) =>
    stripeGrad.addColorStop(index / (colors.stripe.length - 1), color),
  );
  ctx.fillStyle = stripeGrad;
  ctx.fillRect(0, 0, SIZE, 5);

  // ── Film strip corners ───────────────────────────────────
  drawFilmCorner(ctx, 20, 20, false, false);
  drawFilmCorner(ctx, SIZE - 20, 20, true, false);
  drawFilmCorner(ctx, 20, SIZE - 20, false, true);
  drawFilmCorner(ctx, SIZE - 20, SIZE - 20, true, true);

  // ── App name ─────────────────────────────────────────────
  ctx.fillStyle = colors.textMuted;
  ctx.font = `600 18px ${fonts.lora}`;
  ctx.letterSpacing = "8px";
  ctx.fillText("TAMILCHARADES.com", SIZE / 2, 124);

  // ── Mode chip: a tag, like the game header's category chip ──
  ctx.font = `600 17px ${fonts.poppins}`;
  ctx.letterSpacing = "2px";
  const chipText = fitText(ctx, currentMode.toUpperCase(), 560);
  const chipW = ctx.measureText(chipText).width + 36;
  const chipH = 36;
  const chipY = 150;
  ctx.fillStyle = colors.chip;
  roundRect(ctx, SIZE / 2 - chipW / 2, chipY, chipW, chipH, 7);
  ctx.fill();
  ctx.fillStyle = colors.onChip;
  ctx.textBaseline = "middle";
  ctx.fillText(chipText, SIZE / 2, chipY + chipH / 2 + 1);
  ctx.textBaseline = "alphabetic";

  // ── Score: "12 / 15", centered as one line ───────────────
  const scoreBaseline = 318;
  const scoreGap = 14;
  const starsText = String(starsCount);
  const totalText = `/ ${totalCount}`;
  ctx.letterSpacing = "0px";
  ctx.font = `700 120px ${fonts.lora}`;
  const starsW = ctx.measureText(starsText).width;
  ctx.font = `400 44px ${fonts.poppins}`;
  const totalW = ctx.measureText(totalText).width;
  const scoreLeft = SIZE / 2 - (starsW + scoreGap + totalW) / 2;

  ctx.textAlign = "left";
  ctx.font = `700 120px ${fonts.lora}`;
  ctx.fillStyle = colors.text;
  ctx.fillText(starsText, scoreLeft, scoreBaseline);
  ctx.font = `400 44px ${fonts.poppins}`;
  ctx.fillStyle = colors.textMuted;
  ctx.fillText(totalText, scoreLeft + starsW + scoreGap, scoreBaseline);
  ctx.textAlign = "center";

  // ── Tagline ──────────────────────────────────────────────
  ctx.font = `400 22px ${fonts.lora}`;
  ctx.fillStyle = colors.textMuted;
  ctx.letterSpacing = "1px";
  ctx.fillText(firstPart[firstPartIndex], SIZE / 2, 366);

  // ── Stat cards (2 × 2) ───────────────────────────────────
  const statCards = [
    { label: "Best Streak", value: String(stats.bestStreak) },
    { label: "Fastest guess", value: stats.fastestTitle ?? "–" },
    { label: "Accuracy", value: `${stats.accuracy}%` },
    { label: "Total time", value: stats.totalTime },
  ];
  const cardW = 252;
  const cardH = 104;
  const cardGap = 16;
  const gridLeft = SIZE / 2 - cardW - cardGap / 2;
  const gridTop = 404;
  statCards.forEach(({ label, value }, index) => {
    const x = gridLeft + (index % 2) * (cardW + cardGap);
    const y = gridTop + Math.floor(index / 2) * (cardH + cardGap);
    drawStatCard(ctx, x, y, cardW, cardH, label, value);
  });

  // ── CTA footer ───────────────────────────────────────────
  ctx.font = `500 18px ${fonts.rubik}`;
  ctx.fillStyle = colors.highlight;
  ctx.letterSpacing = "3px";
  ctx.fillText(secondPart[secondPartIndex].toUpperCase(), SIZE / 2, 700);

  // ── Export ───────────────────────────────────────────────
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/png"),
  );
}

// ── Helpers ──────────────────────────────────────────────────

function drawStatCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
) {
  const border = 3;
  const paddingX = 22;
  const textW = w - paddingX * 2;

  ctx.fillStyle = colors.cardBorder;
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.fillStyle = colors.card;
  roundRect(ctx, x + border, y + border, w - border * 2, h - border * 2, 14 - border);
  ctx.fill();

  ctx.save();
  ctx.textAlign = "left";
  ctx.letterSpacing = "0px";
  ctx.fillStyle = colors.onCard;

  ctx.font = `400 17px ${fonts.rubik}`;
  ctx.globalAlpha = 0.75;
  ctx.fillText(fitText(ctx, label, textW), x + paddingX, y + 40);

  ctx.font = `600 26px ${fonts.poppins}`;
  ctx.globalAlpha = 1;
  ctx.fillText(fitText(ctx, value, textW), x + paddingX, y + 78);
  ctx.restore();
}

/** Trims `text` with an ellipsis so it fits `maxWidth` in the current font. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let end = text.length;
  while (end > 0 && ctx.measureText(`${text.slice(0, end).trimEnd()}…`).width > maxWidth) {
    end--;
  }
  return `${text.slice(0, end).trimEnd()}…`;
}

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
  ctx.fillStyle = colors.filmHoles;
  // sprocket holes
  [
    [0, 0],
    [0, 10],
    [0, 20],
  ].forEach(([dx, dy]) => {
    ctx.fillRect(dx, dy, 7, 7);
  });
  // film strip body
  ctx.fillStyle = colors.filmBody;
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
