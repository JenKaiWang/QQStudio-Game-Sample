// Ramen Dash - vanilla JS prototype
// Configurable client object for easy reuse
const clientConfig = {
  clientName: "Ramen House",
  gameTitle: "Ramen Dash",
  subtitle: "Survive longer to unlock ramen coupons!",
  coupons: [
    { time: 10, reward: "Free appetizer", code: "RAMEN-APP-2026" },
    { time: 20, reward: "Free drink", code: "RAMEN-DRINK-2026" },
    { time: 30, reward: "10% off ramen", code: "RAMEN10-2026" },
    { time: 45, reward: "Free ramen topping", code: "RAMEN-TOPPING-2026" },
    { time: 60, reward: "Buy one ramen, get one half off", code: "RAMEN-BOGO50-2026" }
  ],
  theme: {
    primaryColor: "#d94f30",
    backgroundColor: "#fff3df",
    obstacleColor: "#7a3e1d",
    playerColor: "#ffcc66"
  }
};

// Canvas and game variables
let canvas, ctx;
let cw = 360, ch = 640; // default portrait area (will be resized)
let DPR = window.devicePixelRatio || 1;

// Images (optional): place background at `assets/bg.jpg` or `assets/bp.png`.
let bgImg = null;
let playerOpenImg = null;
let playerClosedImg = null;
let imagesReady = false;
let playerFrame = 'open';
let playerFrameTimer = null;
const playerClosedDuration = 125;

// Game state
const STATE = { START: 'start', PLAYING: 'playing', GAMEOVER: 'gameOver', COUPON: 'coupon' };
let gameState = STATE.START;

let player = { x: 90, y: 200, r: 16, vy: 0 };
let gravity = 1100; // px/s^2
let jumpVelocity = -380; // px/s

let obstacles = [];
let lastSpawn = 0;
let spawnInterval = 1500; // ms
let speed = 180; // base ground speed px/s

let startTime = 0;
let elapsedTime = 0;
let lastTime = 0;

// DOM elements
const el = {};

function q(id){ return document.getElementById(id); }

function initGame(){
  canvas = q('gameCanvas');
  ctx = canvas.getContext('2d');
  console.log('Canvas initialized:', canvas);
  el.time = q('time');
  el.reward = q('reward');
  el.next = q('next');
  el.startScreen = q('startScreen');
  el.startBtn = q('startBtn');
  el.gameOverScreen = q('gameOverScreen');
  el.survivedText = q('survivedText');
  el.finalCoupon = q('finalCoupon');
  el.claimBtn = q('claimBtn');
  el.playAgainBtn = q('playAgainBtn');
  el.couponModal = q('couponModal');
  el.couponText = q('couponText');
  el.couponCode = q('couponCode');
  el.backBtn = q('backBtn');
  el.playAgainBtn2 = q('playAgainBtn2');

  // Wire events
  el.startBtn.addEventListener('click', startGame);
  el.claimBtn.addEventListener('click', showCouponScreen);
  el.playAgainBtn.addEventListener('click', resetGame);
  el.backBtn.addEventListener('click', hideCouponModal);
  el.playAgainBtn2.addEventListener('click', resetGame);

  // Input: touch, mouse, keyboard
  // Listen globally but avoid preventing touch events meant for UI buttons.
  window.addEventListener('touchstart', onPointer, {passive:false});
  window.addEventListener('mousedown', onPointer);
  window.addEventListener('keydown', (e)=>{ if(e.code === 'Space') onPointer(e); });

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // start loading images (if present)
  loadImages();

  // Show start content from config
  q('title').textContent = clientConfig.gameTitle;
  q('subtitle').textContent = clientConfig.subtitle;
  updateNextReward(0);

  // Start animation loop but only update when playing
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

function loadImages(){
  imagesReady = false;
  bgImg = new Image();
  playerOpenImg = new Image();
  playerClosedImg = new Image();
  let toLoad = 3;
  const checkLoaded = ()=>{ if(--toLoad <= 0) imagesReady = true; };

  // Try to load background and character frames. If not found, the game will still run.
  bgImg.onload = checkLoaded;
  // try primary name, then fallback to bp.png if available
  let bgTriedAlternate = false;
  bgImg.onerror = ()=>{
    if(!bgTriedAlternate){
      bgTriedAlternate = true;
      bgImg.src = 'assets/bp.png';
    } else {
      console.info('bg image not found at assets/bg.jpg or assets/bp.png — using placeholder');
      checkLoaded();
    }
  };
  bgImg.src = 'assets/bg.jpg';

  playerOpenImg.onload = checkLoaded;
  playerOpenImg.onerror = ()=>{ console.info('open character image not found at assets/character_open.png - using placeholder'); checkLoaded(); };
  playerOpenImg.src = 'assets/character_open.png';

  playerClosedImg.onload = checkLoaded;
  playerClosedImg.onerror = ()=>{ console.info('closed character image not found at assets/character_close.png - using open frame or placeholder'); checkLoaded(); };
  playerClosedImg.src = 'assets/character_close.png';
}

function getObstacleRects(ob){
  const groundHeight = 24;
  const topHeight = ob.topGapStart;
  const bottomY = ob.topGapStart + ob.gap;
  const bottomHeight = ch - bottomY - groundHeight;
  return [
    { x: ob.x, y: 0, w: ob.width, h: topHeight },
    { x: ob.x, y: bottomY, w: ob.width, h: bottomHeight }
  ];
}

function resizeCanvas(){
  // Aim for 9:16 portrait area that fits viewport
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const desiredWidth = Math.min(vw, vh * 9/16);
  const desiredHeight = desiredWidth * 16/9;
  cw = Math.round(desiredWidth);
  ch = Math.round(desiredHeight);
  canvas.style.width = cw + 'px';
  canvas.style.height = ch + 'px';
  canvas.width = Math.round(cw * DPR);
  canvas.height = Math.round(ch * DPR);
  ctx.setTransform(DPR,0,0,DPR,0,0);
}

function onPointer(e){
  // Determine if the event target is a UI button so we don't swallow it.
  const tgt = e.target;
  const isUIButton = tgt && (tgt.closest && (tgt.closest('.big-btn') || tgt.tagName === 'BUTTON'));

  // For touch events: prevent default to stop page scroll when user taps the game area,
  // but allow the event to proceed if it targets a UI button.
  if(e.type === 'touchstart'){
    if(!isUIButton){
      e.preventDefault();
    } else {
      // Let button handlers run normally
      return;
    }
  }

  // For mouse events: ignore clicks that are targeting UI buttons so their handlers run.
  if(e.type === 'mousedown' && isUIButton){
    return;
  }

  if(gameState === STATE.START){
    startGame();
    return;
  }
  if(gameState === STATE.PLAYING){
    jump();
    return;
  }
  // when game over, ignore tap unless using explicit buttons
}

function startGame(){
  // initialize gameplay
  document.body.classList.add('playing');
  gameState = STATE.PLAYING;
  resetPlayerFrame();
  player.y = ch/2;
  player.vy = 0;
  obstacles = [];
  lastSpawn = 0;
  startTime = performance.now();
  elapsedTime = 0;
  lastTime = performance.now();
  el.startScreen.classList.add('hidden');
  el.gameOverScreen.classList.add('hidden');
  el.couponModal.classList.add('hidden');
}

function loop(now){
  const dt = Math.min(50, now - lastTime) / 1000; // cap to avoid big jumps
  lastTime = now;
  if(gameState === STATE.PLAYING){
    updateGame(dt);
  }
  drawGame();
  requestAnimationFrame(loop);
}

function updateGame(dt){
  // physics
  player.vy += gravity * dt;
  player.y += player.vy * dt;

  // ground/top collision
  if(player.y + player.r > ch - 8){
    player.y = ch - 8 - player.r;
    endGame();
  }
  if(player.y - player.r < 8){
    player.y = 8 + player.r;
    endGame();
  }

  // spawn obstacles
  elapsedTime = (performance.now() - startTime) / 1000;
  updateDifficulty(elapsedTime);
  lastSpawn += dt*1000;
  if(lastSpawn >= spawnInterval){
    spawnObstacle();
    lastSpawn = 0;
  }

  // update obstacles
  for(let i=obstacles.length-1;i>=0;i--){
    const ob = obstacles[i];
    ob.x -= ob.speed * dt;
    // remove off-screen
    if(ob.x + ob.width < -20) obstacles.splice(i,1);
    // collision
    if(checkCollision(player, ob)){
      endGame();
    }
  }

  // update UI
  el.time.textContent = `Time: ${elapsedTime.toFixed(1)}s`;
  const curr = getCurrentCoupon(elapsedTime);
  el.reward.textContent = `Current Reward: ${curr ? curr.reward : 'None'}`;
  const next = getNextCoupon(elapsedTime);
  el.next.textContent = next ? `Next: ${next.reward} at ${next.time}s` : 'Next: —';
}

function drawGame(){
  // clear
  ctx.clearRect(0,0,cw,ch);
  // DEBUG: log first frame to verify drawing is happening
  if(!window.drawCount) { window.drawCount = 0; console.log('Drawing frame:', window.drawCount, 'Canvas size:', cw, 'x', ch, 'imagesReady:', imagesReady); }
  window.drawCount++;
  // background: image if available, otherwise solid color
  if(imagesReady && bgImg && bgImg.complete && bgImg.naturalWidth){
    // draw background to cover canvas while preserving aspect
    const iw = bgImg.naturalWidth, ih = bgImg.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const iwScaled = iw * scale, ihScaled = ih * scale;
    const dx = (cw - iwScaled) / 2;
    const dy = (ch - ihScaled) / 2;
    ctx.drawImage(bgImg, dx, dy, iwScaled, ihScaled);
  } else {
    ctx.fillStyle = clientConfig.theme.backgroundColor;
    ctx.fillRect(0,0,cw,ch);
  }

  // ground
  ctx.fillStyle = '#e6c8b0';
  ctx.fillRect(0,ch-24,cw,24);

  // draw obstacles as ramen-themed rounded rectangles
  for(const ob of obstacles){
    const rects = getObstacleRects(ob);
    const topRect = rects[0];
    const bottomRect = rects[1];
    drawObstacleRect(topRect.x, topRect.y, topRect.w, topRect.h);
    drawObstacleRect(bottomRect.x, bottomRect.y, bottomRect.w, bottomRect.h);
  }

  // draw player: image if available, otherwise circle placeholder with noodle stroke
  const playerSprite = getPlayerSprite();
  if(imagesReady && playerSprite){
    const imgW = player.r * 4;
    const imgH = player.r * 4;
    ctx.drawImage(playerSprite, player.x - imgW/2, player.y - imgH/2, imgW, imgH);
  } else {
    ctx.fillStyle = clientConfig.theme.playerColor;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.r, 0, Math.PI*2);
    ctx.fill();
    // a simple noodle arc
    ctx.strokeStyle = '#d99a3b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(player.x - player.r/1.5, player.y - player.r/4);
    ctx.quadraticCurveTo(player.x, player.y - player.r, player.x + player.r/1.5, player.y - player.r/6);
    ctx.stroke();
    // small steam lines for theme
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(player.x-6, player.y- player.r -6); ctx.quadraticCurveTo(player.x-6, player.y- player.r -12, player.x-2, player.y- player.r -10); ctx.stroke();
  }
}

function jump(){
  player.vy = jumpVelocity;
  showClosedPlayerFrame();
}

function getPlayerSprite(){
  const closedReady = playerClosedImg && playerClosedImg.complete && playerClosedImg.naturalWidth;
  const openReady = playerOpenImg && playerOpenImg.complete && playerOpenImg.naturalWidth;
  if(playerFrame === 'closed' && closedReady) return playerClosedImg;
  if(openReady) return playerOpenImg;
  return null;
}

function showClosedPlayerFrame(){
  playerFrame = 'closed';
  if(playerFrameTimer) clearTimeout(playerFrameTimer);
  playerFrameTimer = setTimeout(()=>{
    playerFrame = 'open';
    playerFrameTimer = null;
  }, playerClosedDuration);
}

function resetPlayerFrame(){
  playerFrame = 'open';
  if(playerFrameTimer){
    clearTimeout(playerFrameTimer);
    playerFrameTimer = null;
  }
}

function drawObstacleRect(x, y, width, height){
  const radius = Math.min(12, Math.round(width * 0.18));
  ctx.fillStyle = '#7a3e1d';
  ctx.strokeStyle = '#4f2812';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // light highlight band
  ctx.strokeStyle = 'rgba(255,205,150,0.65)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y + Math.max(12, height * 0.12));
  ctx.lineTo(x + width - radius, y + Math.max(12, height * 0.12));
  ctx.stroke();
}

function spawnObstacle(){
  // Fixed width for obstacles (in pixels) - scaled for mobile visibility
  const obstacleWidth = Math.min(100, Math.round(cw * 0.18));
  const minGap = Math.max(100, Math.round(140 - elapsedTime * 0.8));
  const maxGap = minGap + 40;
  const gap = Math.round(minGap + Math.random() * (maxGap - minGap));

  const topMin = 60;
  const topMax = ch - gap - 140;
  const topGapStart = Math.round(topMin + Math.random() * (Math.max(topMin, topMax) - topMin));

  obstacles.push({
    x: cw + 40,
    width: obstacleWidth,
    topGapStart,
    gap,
    speed
  });
}

function checkCollision(circle, rect){
  const rects = getObstacleRects(rect);
  for(const r of rects){
    const closestX = clamp(circle.x, r.x, r.x + r.w);
    const closestY = clamp(circle.y, r.y, r.y + r.h);
    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    if((dx*dx + dy*dy) < (circle.r * circle.r)) return true;
  }
  return false;
}

function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

function updateDifficulty(t){
  // adjust speed and spawn/gap based on elapsed seconds
  if(t < 10){ speed = 140; spawnInterval = 1600; }
  else if(t < 20){ speed = 170; spawnInterval = 1500; }
  else if(t < 30){ speed = 200; spawnInterval = 1400; }
  else if(t < 45){ speed = 240; spawnInterval = 1250; }
  else { speed = 300; spawnInterval = 1100; }
}

function endGame(){
  if(gameState !== STATE.PLAYING) return;
  gameState = STATE.GAMEOVER;
  document.body.classList.remove('playing');
  const finalTime = elapsedTime;
  el.survivedText.textContent = `You survived: ${finalTime.toFixed(1)}s`;
  const coupon = getCurrentCoupon(finalTime);
  el.finalCoupon.textContent = coupon ? coupon.reward : 'No coupon unlocked';
  el.gameOverScreen.classList.remove('hidden');
}

function getCurrentCoupon(t){
  // return highest coupon <= t
  let unlocked = null;
  for(const c of clientConfig.coupons){
    if(t >= c.time) unlocked = c;
  }
  return unlocked;
}

function getNextCoupon(t){
  for(const c of clientConfig.coupons){
    if(t < c.time) return c;
  }
  return null;
}

function updateNextReward(t){
  const next = getNextCoupon(t);
  el.next.textContent = next ? `Next: ${next.reward} at ${next.time}s` : 'Next: —';
}

function showCouponScreen(){
  const coupon = getCurrentCoupon(elapsedTime);
  if(!coupon){
    el.couponText.textContent = "You won: No coupon unlocked";
    el.couponCode.textContent = "";
  } else {
    el.couponText.textContent = `You won: ${coupon.reward}`;
    el.couponCode.textContent = `Coupon Code: ${coupon.code}`;
  }
  el.couponModal.classList.remove('hidden');
}

function hideCouponModal(){
  el.couponModal.classList.add('hidden');
}

function resetGame(){
  // fully reset to start state
  gameState = STATE.START;
  resetPlayerFrame();
  el.startScreen.classList.remove('hidden');
  el.gameOverScreen.classList.add('hidden');
  el.couponModal.classList.add('hidden');
  obstacles = [];
  player.y = ch/2; player.vy = 0;
  elapsedTime = 0;
  el.time.textContent = 'Time: 0.0s';
  el.reward.textContent = 'Current Reward: None';
  updateNextReward(0);
}

// start
window.addEventListener('load', initGame);
