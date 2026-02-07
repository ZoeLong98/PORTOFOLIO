const c = document.getElementById("c");
const ctx = c.getContext("2d");

function resize() {
  c.width = innerWidth;
  c.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const cx = () => c.width / 2;
const cy = () => c.height / 2;

const eyes = [
  { x: () => cx() - 180, color: "rgba(180,160,220,0.18)" },
  { x: () => cx() + 180, color: "rgba(230,190,150,0.18)" },
];

/* ---------- 水彩色带（关键修复点） ---------- */
function drawWash(x, y, w, h, color) {
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.06 + i * 0.015;
    ctx.fillRect(x - w / 2 + Math.random() * 40 - 20, y + i * 18, w, h);
  }
  ctx.globalAlpha = 1;
}

/* ---------- 眼睑线粒子 ---------- */
function drawUpperLid(cx, cy) {
  ctx.strokeStyle = "rgba(80,80,90,0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();

  for (let t = 0; t <= Math.PI; t += 0.08) {
    const x = cx + Math.cos(t) * 70;
    const y = cy - Math.sin(t) * 22 + Math.random() * 2;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/* ---------- 瞳孔（极简） ---------- */
function drawPupil(x, y) {
  ctx.fillStyle = "rgba(90,90,100,0.7)";
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- 主绘制 ---------- */
function draw() {
  ctx.clearRect(0, 0, c.width, c.height);

  eyes.forEach((e) => {
    drawWash(e.x(), cy() + 45, 240, 80, e.color);
    drawUpperLid(e.x(), cy());
    drawPupil(e.x(), cy());
  });

  requestAnimationFrame(draw);
}

draw();
