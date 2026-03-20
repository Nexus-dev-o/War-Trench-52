// ===========================
//  AUDIO ENGINE (Web Audio)
// ===========================
let AC = null;
function initAudio(){ if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); }

function noise(dur){
  if(!AC) return;
  const buf = AC.createBuffer(1, AC.sampleRate*dur, AC.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
  return buf;
}

function playShot(){ // Generic rifle crack
  if(!AC) return;
  const t = AC.currentTime;
  // Body crack (noise burst)
  const src = AC.createBufferSource();
  src.buffer = noise(0.18);
  const filt = AC.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=2200; filt.Q.value=1.5;
  const g = AC.createGain(); g.gain.setValueAtTime(.28,t); g.gain.exponentialRampToValueAtTime(.001,t+.18);
  src.connect(filt); filt.connect(g); g.connect(AC.destination);
  src.start(t); src.stop(t+.18);
  // Low thud
  const o = AC.createOscillator(), g2 = AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(180,t); o.frequency.exponentialRampToValueAtTime(40,t+.08);
  g2.gain.setValueAtTime(.18,t); g2.gain.exponentialRampToValueAtTime(.001,t+.1);
  o.connect(g2); g2.connect(AC.destination); o.start(t); o.stop(t+.1);
}

function playSniper(){ // Long crack + whiz
  if(!AC) return;
  const t = AC.currentTime;
  const src = AC.createBufferSource(); src.buffer = noise(0.35);
  const filt = AC.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=3000; filt.Q.value=3;
  const g = AC.createGain(); g.gain.setValueAtTime(.22,t); g.gain.exponentialRampToValueAtTime(.001,t+.35);
  src.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.35);
  // Whiz (Doppler pitch drop)
  const o = AC.createOscillator(), g2=AC.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(900,t+.04); o.frequency.exponentialRampToValueAtTime(120,t+.35);
  g2.gain.setValueAtTime(.06,t+.04); g2.gain.exponentialRampToValueAtTime(.001,t+.36);
  o.connect(g2); g2.connect(AC.destination); o.start(t+.04); o.stop(t+.36);
}

function playMachine(){ // Burst of 4 shots rapid
  if(!AC) return;
  for(let i=0;i<4;i++){
    const t = AC.currentTime + i*0.065;
    const src=AC.createBufferSource(); src.buffer=noise(.12);
    const filt=AC.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=1800+Math.random()*600; filt.Q.value=1.2;
    const g=AC.createGain(); g.gain.setValueAtTime(.2,t); g.gain.exponentialRampToValueAtTime(.001,t+.12);
    src.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.12);
    const o=AC.createOscillator(),g2=AC.createGain();
    o.type='square'; o.frequency.setValueAtTime(120,t); o.frequency.exponentialRampToValueAtTime(30,t+.07);
    g2.gain.setValueAtTime(.12,t); g2.gain.exponentialRampToValueAtTime(.001,t+.08);
    o.connect(g2); g2.connect(AC.destination); o.start(t); o.stop(t+.08);
  }
}

function playTank(){ // Deep boom + rattle
  if(!AC) return;
  const t = AC.currentTime;
  const src=AC.createBufferSource(); src.buffer=noise(.6);
  const filt=AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=300;
  const g=AC.createGain(); g.gain.setValueAtTime(.5,t); g.gain.exponentialRampToValueAtTime(.001,t+.6);
  src.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.6);
  const o=AC.createOscillator(),g2=AC.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(80,t); o.frequency.exponentialRampToValueAtTime(18,t+.25);
  g2.gain.setValueAtTime(.35,t); g2.gain.exponentialRampToValueAtTime(.001,t+.3);
  o.connect(g2); g2.connect(AC.destination); o.start(t); o.stop(t+.3);
}

function playExplosion(){ // Big boom layered
  if(!AC) return;
  const t = AC.currentTime;
  const src=AC.createBufferSource(); src.buffer=noise(.8);
  const filt=AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=500;
  const dist=AC.createWaveShaper();
  const curve=new Float32Array(256); for(let i=0;i<256;i++) curve[i]=Math.tanh((i/128-1)*4);
  dist.curve=curve;
  const g=AC.createGain(); g.gain.setValueAtTime(.7,t); g.gain.exponentialRampToValueAtTime(.001,t+.8);
  src.connect(dist); dist.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.8);
  const sub=AC.createOscillator(),gs=AC.createGain();
  sub.type='sine'; sub.frequency.setValueAtTime(60,t); sub.frequency.exponentialRampToValueAtTime(20,t+.4);
  gs.gain.setValueAtTime(.4,t); gs.gain.exponentialRampToValueAtTime(.001,t+.5);
  sub.connect(gs); gs.connect(AC.destination); sub.start(t); sub.stop(t+.5);
}

function playDeath(){
  if(!AC) return;
  const t = AC.currentTime;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(180,t); o.frequency.exponentialRampToValueAtTime(30,t+.35);
  g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+.38);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+.38);
}

function playDig(){
  if(!AC) return;
  const t = AC.currentTime;
  const src=AC.createBufferSource(); src.buffer=noise(.18);
  const filt=AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=600;
  const g=AC.createGain(); g.gain.setValueAtTime(.12,t); g.gain.exponentialRampToValueAtTime(.001,t+.18);
  src.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.18);
}

function playPlace(){
  if(!AC) return;
  const t=AC.currentTime, o=AC.createOscillator(),g=AC.createGain();
  o.type='sine'; o.frequency.setValueAtTime(700,t); o.frequency.exponentialRampToValueAtTime(450,t+.09);
  g.gain.setValueAtTime(.06,t); g.gain.exponentialRampToValueAtTime(.001,t+.1);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+.1);
}

const SOUNDS = {
  soldier:   playShot,
  sniper:    playSniper,
  machine:   playMachine,
  tank:      playTank,
  commander: playShot,
  medic:     ()=>{},
  digger:    playDig,
  builder:   playDig,
  fuzileiro: playShot,
  observer:  ()=>{},
  jipe:      playTank,
  artillery: playFifty,
  jet:       playJet,
};

function playFifty(){ // .50 cal — deep heavy crack
  if(!AC) return;
  for(let i=0;i<3;i++){
    const t=AC.currentTime+i*0.14;
    const src=AC.createBufferSource(); src.buffer=noise(.22);
    const filt=AC.createBiquadFilter(); filt.type='bandpass'; filt.frequency.value=900; filt.Q.value=1.8;
    const g=AC.createGain(); g.gain.setValueAtTime(.32,t); g.gain.exponentialRampToValueAtTime(.001,t+.22);
    src.connect(filt); filt.connect(g); g.connect(AC.destination); src.start(t); src.stop(t+.22);
    const o=AC.createOscillator(),g2=AC.createGain();
    o.type='sawtooth'; o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(28,t+.18);
    g2.gain.setValueAtTime(.28,t); g2.gain.exponentialRampToValueAtTime(.001,t+.2);
    o.connect(g2); g2.connect(AC.destination); o.start(t); o.stop(t+.2);
  }
}

function playJet(){ // Jet engine roar + bomb drop
  if(!AC) return;
  const t=AC.currentTime;
  // Engine whine swoosh
  const o=AC.createOscillator(),g=AC.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(200,t); o.frequency.linearRampToValueAtTime(800,t+.15); o.frequency.exponentialRampToValueAtTime(60,t+.5);
  g.gain.setValueAtTime(.0,t); g.gain.linearRampToValueAtTime(.3,t+.08); g.gain.exponentialRampToValueAtTime(.001,t+.55);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+.55);
  // Boom on impact
  const src=AC.createBufferSource(); src.buffer=noise(.9);
  const filt=AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=400;
  const g2=AC.createGain(); g2.gain.setValueAtTime(.0,t+.4); g2.gain.linearRampToValueAtTime(.7,t+.45); g2.gain.exponentialRampToValueAtTime(.001,t+1.3);
  src.connect(filt); filt.connect(g2); g2.connect(AC.destination); src.start(t+.4); src.stop(t+1.3);
}

function playMissile(){
  if(!AC) return;
  const t=AC.currentTime;
  // Rocket whoosh
  const o=AC.createOscillator(),g=AC.createGain();
  o.type='sawtooth'; o.frequency.setValueAtTime(400,t); o.frequency.exponentialRampToValueAtTime(80,t+.3);
  g.gain.setValueAtTime(.15,t); g.gain.exponentialRampToValueAtTime(.001,t+.35);
  o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+.35);
  // Boom after
  const src=AC.createBufferSource(); src.buffer=noise(.6);
  const filt=AC.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=600;
  const g2=AC.createGain(); g2.gain.setValueAtTime(.5,t+.25); g2.gain.exponentialRampToValueAtTime(.001,t+.85);
  src.connect(filt); filt.connect(g2); g2.connect(AC.destination); src.start(t+.25); src.stop(t+.85);
}

// ===========================
//  GAME CONFIG
// ===========================
let COLS=64, ROWS=64;
const TILE=12;

const T = { GRASS:0, TRENCH:1, HOLE:2, WALL:3, BASE_A:4, BASE_E:5, TREE:6, WATER:7, CONTINENT_A:8, CONTINENT_E:9, BRIDGE:10, MILBASE:11 };

const UDEFS = {
  soldier:   { name:'Soldado',    hp:70,  dmg:14, range:6,  spd:.85, fr:1.4,  ico:'🪖', sz:1, desc:'Infantaria básica' },
  sniper:    { name:'Sniper SVD', hp:45,  dmg:50, range:20, spd:.38, fr:.38,  ico:'🎯', sz:1, desc:'Longo alcance, dano alto' },
  machine:   { name:'Metralhador',hp:90,  dmg:9,  range:7,  spd:.45, fr:3.5,  ico:'🔫', sz:1, desc:'Alta cadência de fogo' },
  tank:      { name:'Tanque',     hp:350, dmg:65, range:11, spd:.28, fr:.18,  ico:'🛡', sz:2, desc:'Míssil AOE potente — recarga lenta' },
  artillery: { name:'.50 Cal',    hp:70,  dmg:22, range:12, spd:.35, fr:2.8,  ico:'🔩', sz:1, desc:'Metralhadora pesada .50 — alta cadência, dano sustentado' },
  jet:       { name:'Jato',        hp:120, dmg:95, range:28, spd:3.5, fr:.18,  ico:'✈️',  sz:2, desc:'Passa rápido pelo campo, lança bomba em área grande' },
  commander: { name:'Comandante', hp:120, dmg:18, range:9,  spd:.6,  fr:.9,   ico:'⭐', sz:1, desc:'+30% dano aliados próximos' },
  medic:     { name:'Médico',     hp:55,  dmg:4,  range:5,  spd:.7,  fr:.5,   ico:'🏥', sz:1, desc:'Cura tropas aliadas' },
  digger:    { name:'Escavador',  hp:60,  dmg:6,  range:3,  spd:.5,  fr:.3,   ico:'⛏', sz:1, desc:'Cava trincheiras automaticamente' },
  builder:   { name:'Construtor', hp:65,  dmg:5,  range:3,  spd:.45, fr:.25,  ico:'🔨', sz:1, desc:'Constrói pontes sobre água' },
  fuzileiro: { name:'Fuzileiro',  hp:85,  dmg:38, range:2,  spd:1.3, fr:1.8,  ico:'🔪', sz:1, desc:'Corpo a corpo — dano enorme de perto' },
  observer:  { name:'Observador', hp:40,  dmg:0,  range:0,  spd:.55, fr:0,    ico:'🔭', sz:1, desc:'Revela inimigos num raio grande' },
  jipe:      { name:'Jipe',       hp:200, dmg:20, range:7,  spd:1.6, fr:.8,   ico:'🚗', sz:2, desc:'Veloz — carrega até 2 aliados próximos, move-os junto' },
};

// ===========================
//  STATE
// ===========================
let grid=[], units=[], bullets=[], particles=[], effects=[];
let currentTool=null, selectedUnit=null;
let phase='build', paused=false, speed=1;
let gameTime=0, alliedScore=0, enemyScore=0, warOver=false;
let battleStarted=false, uidc=0;
let lastTS=0;
let cont1Name='Aliança do Norte', cont2Name='Império do Sul';
let cont1Color='#2E5F2E', cont2Color='#7A1C1C';

// Map shape: array of booleans (which cells are landmass)
let landmask=[];

// ===========================
//  MAP PRESETS
// ===========================
let currentPreset = 'custom';

const PRESET_DESCS = {
  custom: '',
  normandy: 'Praia longa + falésias — emboscadas e trincheiras costeiras',
  stalingrad: 'Cidade destruída — ruas e edifícios bloqueando passagens',
  pacific: 'Ilhas separadas por mar — pontes estreitas de combate',
  milbase: 'Base Militar 32×32 — estrutura real com muros, trincheiras e zona neutra',
};

function selectPreset(name){
  currentPreset = name;
  document.getElementById('preset-desc').textContent = PRESET_DESCS[name] || '';
}

function buildPresetNormandy(){
  // Praia longa horizontal: faixa de terra toda contínua, mar ao norte e sul
  landmask=[];
  for(let r=0;r<ROWS;r++){
    landmask[r]=[];
    for(let c=0;c<COLS;c++){
      // Main land strip — wider in the middle
      const wave = Math.sin(c/COLS*Math.PI*3)*2;
      const top = Math.floor(ROWS*0.18 + wave);
      const bot = Math.floor(ROWS*0.82 + wave);
      landmask[r][c] = (r>=top && r<=bot);
    }
  }
  grid=[];
  for(let r=0;r<ROWS;r++){
    grid[r]=[];
    for(let c=0;c<COLS;c++){
      if(!landmask[r][c]){ grid[r][c]=T.WATER; continue; }
      grid[r][c] = c < COLS/2 ? T.CONTINENT_A : T.CONTINENT_E;
    }
  }
  // Falésias (paredes) no terço norte e sul
  for(let c=5;c<COLS-5;c++){
    const top = Math.floor(ROWS*0.18 + Math.sin(c/COLS*Math.PI*3)*2);
    const bot = Math.floor(ROWS*0.82 + Math.sin(c/COLS*Math.PI*3)*2);
    if(valid(c,top+1)&&grid[top+1][c]!==T.WATER) grid[top+1][c]=T.WALL;
    if(valid(c,bot-1)&&grid[bot-1][c]!==T.WATER) grid[bot-1][c]=T.WALL;
  }
  // Trincheiras pre-cavadas em cada lado
  const midR=Math.floor(ROWS/2);
  for(let r=midR-6;r<=midR+6;r++){
    if(valid(10,r)) grid[r][10]=T.TRENCH;
    if(valid(11,r)) grid[r][11]=T.TRENCH;
    if(valid(COLS-11,r)) grid[r][COLS-11]=T.TRENCH;
    if(valid(COLS-12,r)) grid[r][COLS-12]=T.TRENCH;
  }
  // Árvores esparsas no meio
  for(let i=0;i<Math.floor(COLS*ROWS*0.02);i++){
    const rr=Math.floor(Math.random()*ROWS), cc=Math.floor(Math.random()*COLS);
    if(grid[rr]?.[cc]===T.CONTINENT_A||grid[rr]?.[cc]===T.CONTINENT_E) grid[rr][cc]=T.TREE;
  }
  placeBases();
}

function buildPresetStalingrad(){
  // Cidade destruída: terra full, blocos de paredes como ruínas de edifícios
  landmask=[];
  for(let r=0;r<ROWS;r++){ landmask[r]=[]; for(let c=0;c<COLS;c++) landmask[r][c]=true; }
  grid=[];
  for(let r=0;r<ROWS;r++){
    grid[r]=[];
    for(let c=0;c<COLS;c++){
      grid[r][c] = c < COLS/2 ? T.CONTINENT_A : T.CONTINENT_E;
    }
  }
  // Rio central estreito (3 células)
  const mid=Math.floor(COLS/2);
  for(let r=0;r<ROWS;r++){
    grid[r][mid-1]=T.WATER; grid[r][mid]=T.WATER; grid[r][mid+1]=T.WATER;
    landmask[r][mid-1]=false; landmask[r][mid]=false; landmask[r][mid+1]=false;
  }
  // Blocos de "edifícios" — quadrados de parede irregulares
  const blocks=[
    [4,4,5,5],[4,12,5,5],[4,20,5,5],[4,28,5,5],[4,36,5,5],[4,44,5,5],[4,52,5,5],
    [10,8,4,4],[10,18,4,4],[10,30,4,4],[10,42,4,4],[10,54,4,4],
    [16,4,5,3],[16,14,5,3],[16,24,5,3],[16,34,5,3],[16,44,5,3],[16,54,5,3],
    [22,10,4,4],[22,22,4,4],[22,36,4,4],[22,48,4,4],
  ];
  function mirrorBlock(r,c,h,w){
    for(let dr=0;dr<h;dr++) for(let dc=0;dc<w;dc++){
      // left side
      if(valid(c+dc, r+dr)&&grid[r+dr][c+dc]!==T.WATER) grid[r+dr][c+dc]=T.WALL;
      // right mirror
      const mc=COLS-1-(c+dc);
      if(valid(mc, r+dr)&&grid[r+dr][mc]!==T.WATER) grid[r+dr][mc]=T.WALL;
    }
  }
  blocks.forEach(([c,r,w,h])=>mirrorBlock(r,c,h,w));
  // Buracos espalhados (crateras)
  for(let i=0;i<30;i++){
    const rr=Math.floor(Math.random()*ROWS), cc=Math.floor(Math.random()*COLS);
    if(grid[rr]?.[cc]!==T.WALL&&grid[rr]?.[cc]!==T.WATER) grid[rr][cc]=T.HOLE;
  }
  placeBases();
}

function buildPresetPacific(){
  // 3 ilhas por lado (6 total) separadas por mar
  landmask=[];
  for(let r=0;r<ROWS;r++){ landmask[r]=[]; for(let c=0;c<COLS;c++) landmask[r][c]=false; }
  grid=[];
  for(let r=0;r<ROWS;r++){ grid[r]=[]; for(let c=0;c<COLS;c++) grid[r][c]=T.WATER; }

  // Island centers: 3 aliadas à esquerda, 3 inimigas à direita
  const islands=[
    {cx:10, cy:10, rx:9, ry:7, side:'A'},
    {cx:10, cy:32, rx:9, ry:8, side:'A'},
    {cx:10, cy:54, rx:9, ry:7, side:'A'},
    {cx:54, cy:10, rx:9, ry:7, side:'E'},
    {cx:54, cy:32, rx:9, ry:8, side:'E'},
    {cx:54, cy:54, rx:9, ry:7, side:'E'},
  ];
  islands.forEach(({cx,cy,rx,ry,side})=>{
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
      // Ellipse with sine noise
      const ang=Math.atan2(r-cy,c-cx);
      const nr=rx+Math.sin(ang*5)*2;
      const nnr=ry+Math.cos(ang*4)*2;
      if((c-cx)**2/nr**2+(r-cy)**2/nnr**2<1){
        landmask[r][c]=true;
        grid[r][c]=side==='A'?T.CONTINENT_A:T.CONTINENT_E;
      }
    }
  });
  // Pontes estreitas ligando ilhas ao centro (coluna 30-34)
  [[10,32],[32,54],[10,54]].forEach(([y1,y2])=>{
    const minY=Math.min(y1,y2), maxY=Math.max(y1,y2);
    for(let r=minY;r<=maxY;r++){
      for(let c=28;c<=36;c++){
        if(!valid(c,r)) continue;
        landmask[r][c]=true;
        grid[r][c]=T.CONTINENT_A;
      }
    }
  });
  [[10,32],[32,54],[10,54]].forEach(([y1,y2])=>{
    const minY=Math.min(y1,y2), maxY=Math.max(y1,y2);
    for(let r=minY;r<=maxY;r++){
      for(let c=28;c<=36;c++){
        if(!valid(c,r)) continue;
        landmask[r][c]=true;
        grid[r][c]=T.CONTINENT_E;
      }
    }
  });
  // Árvores nas ilhas
  for(let i=0;i<Math.floor(COLS*ROWS*0.03);i++){
    const rr=Math.floor(Math.random()*ROWS), cc=Math.floor(Math.random()*COLS);
    if(grid[rr]?.[cc]===T.CONTINENT_A||grid[rr]?.[cc]===T.CONTINENT_E) grid[rr][cc]=T.TREE;
  }
  placeBases();
}

function placeBases(){
  const midR=Math.floor(ROWS/2);
  const bh=Math.floor(ROWS*0.2), bw=4;
  for(let r=midR-Math.floor(bh/2);r<midR+Math.ceil(bh/2);r++){
    for(let c=1;c<1+bw;c++) if(valid(c,r)&&grid[r][c]!==T.WATER) grid[r][c]=T.BASE_A;
    for(let c=COLS-1-bw;c<COLS-1;c++) if(valid(c,r)&&grid[r][c]!==T.WATER) grid[r][c]=T.BASE_E;
  }
}

// ===========================
//  MAP GENERATION
function buildPresetMilbase(){
  // 32x32 map — symmetric military base, two sides
  COLS=32; ROWS=32;
  landmask=[];
  for(let r=0;r<ROWS;r++){ landmask[r]=[]; for(let c=0;c<COLS;c++) landmask[r][c]=true; }
  grid=[];
  for(let r=0;r<ROWS;r++){
    grid[r]=[];
    for(let c=0;c<COLS;c++){
      grid[r][c] = c < COLS/2 ? T.CONTINENT_A : T.CONTINENT_E;
    }
  }

  function setRect(c0,r0,w,h,t){ for(let r=r0;r<r0+h;r++) for(let c=c0;c<c0+w;c++) if(valid(c,r)) grid[r][c]=t; }
  function setWallBorder(c0,r0,w,h){
    for(let c=c0;c<c0+w;c++){ if(valid(c,r0)) grid[r0][c]=T.WALL; if(valid(c,r0+h-1)) grid[r0+h-1][c]=T.WALL; }
    for(let r=r0;r<r0+h;r++){ if(valid(c0,r)) grid[r][c0]=T.WALL; if(valid(c0+w-1,r)) grid[r][c0+w-1]=T.WALL; }
  }

  // === ALLIED BASE (left side, cols 0-14) ===
  // Outer perimeter wall
  setWallBorder(0,0,15,32);
  // Inner base platform
  setRect(1,1,13,30, T.MILBASE);
  // Main command building (center-left)
  setRect(3,12,5,8, T.WALL);
  setRect(4,13,3,6, T.MILBASE); // inside
  // Barracks block top
  setRect(3,2,4,4, T.WALL);
  setRect(4,3,2,2, T.MILBASE);
  // Barracks block bottom
  setRect(3,26,4,4, T.WALL);
  setRect(4,27,2,2, T.MILBASE);
  // Trenches along front wall (col 12-13)
  for(let r=4;r<28;r+=2) if(valid(12,r)) grid[r][12]=T.TRENCH;
  for(let r=5;r<27;r+=2) if(valid(11,r)) grid[r][11]=T.TRENCH;
  // Watchtower holes at corners
  grid[1][1]=T.HOLE; grid[1][13]=T.HOLE;
  grid[30][1]=T.HOLE; grid[30][13]=T.HOLE;
  // Trees inside base
  for(const [c,r] of [[2,7],[2,24],[6,5],[6,26],[9,8],[9,23]]){ if(valid(c,r)) grid[r][c]=T.TREE; }

  // === ENEMY BASE (right side, cols 17-31) — mirror ===
  setWallBorder(17,0,15,32);
  setRect(18,1,13,30, T.MILBASE);
  setRect(23,12,5,8, T.WALL);
  setRect(24,13,3,6, T.MILBASE);
  setRect(24,2,4,4, T.WALL);
  setRect(25,3,2,2, T.MILBASE);
  setRect(24,26,4,4, T.WALL);
  setRect(25,27,2,2, T.MILBASE);
  for(let r=4;r<28;r+=2) if(valid(19,r)) grid[r][19]=T.TRENCH;
  for(let r=5;r<27;r+=2) if(valid(20,r)) grid[r][20]=T.TRENCH;
  grid[1][18]=T.HOLE; grid[1][30]=T.HOLE;
  grid[30][18]=T.HOLE; grid[30][30]=T.HOLE;
  for(const [c,r] of [[29,7],[29,24],[25,5],[25,26],[22,8],[22,23]]){ if(valid(c,r)) grid[r][c]=T.TREE; }

  // === NO MAN'S LAND (cols 15-16) — narrow contested zone ===
  for(let r=0;r<ROWS;r++){
    grid[r][15]=T.HOLE;
    grid[r][16]=T.HOLE;
  }
  // A few walls in no man's land for cover
  grid[8][15]=T.WALL;  grid[8][16]=T.WALL;
  grid[15][15]=T.WALL; grid[16][16]=T.WALL;
  grid[23][15]=T.WALL; grid[23][16]=T.WALL;

  // === SPAWN BASES (actual base_a / base_e tiles) ===
  for(let r=13;r<19;r++){
    grid[r][1]=T.BASE_A; grid[r][2]=T.BASE_A;
    grid[r][29]=T.BASE_E; grid[r][30]=T.BASE_E;
  }
}

// ===========================
function genLandmask(){
  landmask=[];
  for(let r=0;r<ROWS;r++){
    landmask[r]=[];
    for(let c=0;c<COLS;c++){
      const cx1=COLS*0.25, cy1=ROWS*0.5;
      const cx2=COLS*0.75, cy2=ROWS*0.5;
      const ang1=Math.atan2(r-cy1,c-cx1);
      const ang2=Math.atan2(r-cy2,c-cx2);
      const rad1=COLS*0.26 + Math.sin(ang1*3)*COLS*0.05 + Math.cos(ang1*7)*COLS*0.03;
      const rad2=COLS*0.26 + Math.sin(ang2*4)*COLS*0.05 + Math.cos(ang2*5)*COLS*0.03;
      const d1=Math.hypot(c-cx1, r-cy1);
      const d2=Math.hypot(c-cx2, r-cy2);
      landmask[r][c] = (d1<rad1 || d2<rad2);
    }
  }
}

function initGrid(){
  if(currentPreset==='normandy'){ buildPresetNormandy(); return; }
  if(currentPreset==='stalingrad'){ buildPresetStalingrad(); return; }
  if(currentPreset==='pacific'){ buildPresetPacific(); return; }
  if(currentPreset==='milbase'){ buildPresetMilbase(); return; }

  genLandmask();
  grid=[];
  for(let r=0;r<ROWS;r++){
    grid[r]=[];
    for(let c=0;c<COLS;c++){
      if(!landmask[r][c]){ grid[r][c]=T.WATER; continue; }
      const cx1=COLS*0.25, cx2=COLS*0.75;
      const d1=Math.abs(c-cx1), d2=Math.abs(c-cx2);
      grid[r][c] = d1<=d2 ? T.CONTINENT_A : T.CONTINENT_E;
    }
  }
  const midR=Math.floor(ROWS/2);
  const bh=Math.floor(ROWS*0.22), bw=4;
  for(let r=midR-Math.floor(bh/2);r<midR+Math.ceil(bh/2);r++){
    for(let c=1;c<1+bw;c++) if(r>=0&&r<ROWS&&c>=0&&c<COLS&&grid[r][c]!==T.WATER) grid[r][c]=T.BASE_A;
    for(let c=COLS-1-bw;c<COLS-1;c++) if(r>=0&&r<ROWS&&c>=0&&c<COLS&&grid[r][c]!==T.WATER) grid[r][c]=T.BASE_E;
  }
  for(let i=0;i<Math.floor(COLS*ROWS*0.025);i++){
    const rr=Math.floor(Math.random()*ROWS), cc=Math.floor(Math.random()*COLS);
    if(grid[rr][cc]===T.CONTINENT_A||grid[rr][cc]===T.CONTINENT_E) grid[rr][cc]=T.TREE;
  }
}

function resetUnits(){ units=[]; bullets=[]; particles=[]; effects=[]; milbases=[]; }

// ===========================
//  TOOL SELECTION
// ===========================
function selTool(side, type){
  document.querySelectorAll('.unit-btn').forEach(b=>b.classList.remove('selected'));
  if(currentTool&&currentTool.side===side&&currentTool.type===type){ currentTool=null; return; }
  currentTool={side,type};
  const b=document.getElementById(`t-${side}-${type}`);
  if(b) b.classList.add('selected');
}

// ===========================
//  PHASE / SPEED / PAUSE
// ===========================
function setPhase(p){
  phase=p;
  document.getElementById('phase-disp').textContent = p==='build'?'🔨 CONSTRUÇÃO':'⚔ BATALHA';
  document.getElementById('btn-build').classList.toggle('active',p==='build');
  document.getElementById('btn-battle').classList.toggle('active',p==='battle');
  if(p==='battle'&&!battleStarted){
    battleStarted=true;
    addLog('⚔ BATALHA INICIADA! As tropas avançam!','ev');
    initAudio();
  }
}
function setSpeed(s){ speed=s; [1,2,3].forEach(n=>document.getElementById('sp'+n).classList.toggle('active',n===s)); }
function togglePause(){
  paused=!paused;
  document.getElementById('btn-pause').textContent=paused?'▶ CONTINUAR':'⏸ PAUSAR';
}

// ===========================
//  CANVAS & VIEWPORT
// ===========================
const canvas=document.getElementById('gameCanvas');
const wrap=document.getElementById('canvas-wrap');
const C=canvas.getContext('2d');
let ox=0, oy=0, zoom=1;
let mouseX=0, mouseY=0;

function resizeCanvas(){ canvas.width=wrap.clientWidth; canvas.height=wrap.clientHeight; }

function g2c(col,row){ return {x:col*TILE*zoom+ox, y:row*TILE*zoom+oy}; }
function c2g(cx,cy){ return {col:Math.floor((cx-ox)/(TILE*zoom)), row:Math.floor((cy-oy)/(TILE*zoom))}; }
function valid(c,r){ return c>=0&&c<COLS&&r>=0&&r<ROWS; }

// ===========================
//  MOUSE INPUT
// ===========================
let rmb=false, panFrom=null, lmbDown=false;

canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('mousedown',e=>{
  initAudio();
  if(e.button===2){ rmb=true; panFrom={x:e.clientX-ox,y:e.clientY-oy}; return; }
  if(e.button===0){ lmbDown=true; handleClick(e); }
});
canvas.addEventListener('mousemove',e=>{
  const r=canvas.getBoundingClientRect();
  mouseX=e.clientX-r.left; mouseY=e.clientY-r.top;
  if(rmb&&panFrom){ ox=e.clientX-panFrom.x; oy=e.clientY-panFrom.y; }
  if(lmbDown&&currentTool?.side==='terrain') handleClick(e);
  updateTip();
});
canvas.addEventListener('mouseup',e=>{ if(e.button===2)rmb=false; if(e.button===0)lmbDown=false; });
canvas.addEventListener('wheel',e=>{
  e.preventDefault();
  const f=e.deltaY>0?.88:1.14;
  const {col,row}=c2g(e.offsetX,e.offsetY);
  zoom=Math.max(.35,Math.min(4,zoom*f));
  ox=e.offsetX-col*TILE*zoom; oy=e.offsetY-row*TILE*zoom;
},{passive:false});

function handleClick(e){
  if(activeSquad){
    initAudio();
    const r=canvas.getBoundingClientRect();
    const {col,row}=c2g(e.clientX-r.left,e.clientY-r.top);
    if(valid(col,row)) placeSquad(col,row);
    return;
  }
  const r=canvas.getBoundingClientRect();
  const {col,row}=c2g(e.clientX-r.left,e.clientY-r.top);
  if(!valid(col,row)) return;
  if(!currentTool){
    const u=unitAt(col,row);
    selectedUnit=u||null;
    if(u) showDetail(u); else clearDetail();
    return;
  }
  const {side,type}=currentTool;
  if(side==='terrain'){
    const t=grid[row][col];
    if(t===T.BASE_A||t===T.BASE_E) return;
    if(type==='trench') grid[row][col]=T.TRENCH;
    else if(type==='bridge'){ if(grid[row][col]===T.WATER) grid[row][col]=T.BRIDGE; }
    else if(type==='hole') grid[row][col]=T.HOLE;
    else if(type==='wall') grid[row][col]=T.WALL;
    else if(type==='tree') grid[row][col]=T.TREE;
    else if(type==='water') grid[row][col]=T.WATER;
    else if(type==='milbase'){
      // 1 per side limit
      const existingSide = milbases.find(b=>b.side===side);
      if(existingSide){
        addLog(`⚠ Já existe uma base militar ${side==='allied'?'aliada':'inimiga'}!`,'ev');
        return;
      }
    let fits=true;
    for(let dr=0;dr<MILBASE_H&&fits;dr++) for(let dc=0;dc<MILBASE_W&&fits;dc++){
      if(!valid(col+dc,row+dr)||grid[row+dr][col+dc]===T.WATER) fits=false;
    }
    if(!fits){ addLog('⚠ Sem espaço suficiente (9×10)!','ev'); return; }
    placeMilbase(side, col, row);
    playPlace();
    return;
  }
  else if(type==='delete'){
      if(t!==T.BASE_A&&t!==T.BASE_E) grid[row][col]=landmask[row][col]?(col<COLS/2?T.CONTINENT_A:T.CONTINENT_E):T.WATER;
      const ui=units.findIndex(u=>Math.floor(u.col)===col&&Math.floor(u.row)===row);
      if(ui>=0) units.splice(ui,1);
    }
    playPlace();
    return;
  }
  if(unitAt(col,row)) return;
  if(grid[row][col]===T.WATER) return;
  // Milbase placed via side tool (allied/enemy)
  if(type==='milbase'){
    const existing = milbases.find(b=>b.side===side);
    if(existing){ addLog(`⚠ Já existe uma base militar ${side==='allied'?'aliada':'inimiga'}!`,'ev'); return; }
    let fits=true;
    for(let dr=0;dr<MILBASE_H&&fits;dr++) for(let dc=0;dc<MILBASE_W&&fits;dc++){
      if(!valid(col+dc,row+dr)||grid[row+dr][col+dc]===T.WATER) fits=false;
    }
    if(!fits){ addLog('⚠ Sem espaço suficiente (9×10)!','ev'); return; }
    placeMilbase(side,col,row); playPlace(); return;
  }
  const u=mkUnit(side,type,col,row);
  if(u){ units.push(u); playPlace(); addLog(`${side==='allied'?'🟢':'🔴'} ${UDEFS[type].name} em (${col},${row})`,side==='allied'?'al':'en'); }
}

function unitAt(col,row){
  return units.find(u=>!u.dead&&Math.abs(u.col-col-.5)<u.sz&&Math.abs(u.row-row-.5)<u.sz);
}

function updateTip(){
  const {col,row}=c2g(mouseX,mouseY);
  const tip=document.getElementById('tooltip');
  if(!valid(col,row)){tip.style.display='none';return;}
  const u=unitAt(col,row);
  if(u){
    const d=UDEFS[u.type];
    tip.innerHTML=`<b style="color:${u.side==='allied'?'#4CAF50':'#F44336'}">${d.ico} ${d.name}</b><br>❤ ${Math.ceil(u.hp)}/${u.maxHp} &nbsp; ⚔ ${u.dmg}<br>🎯 Range:${u.range} &nbsp; 🏆 Kills:${u.kills}<br>${u.inTrench?'🛡 Na trincheira':''}`;
  }else{
    const names=['Grama','Trincheira','Buraco','Barricada','Base Aliada','Base Inimiga','Floresta','Rio',cont1Name,cont2Name,'Ponte','Base Militar'];
    tip.innerHTML=names[grid[row][col]]||'?';
  }
  tip.style.display='block';
  tip.style.left=(mouseX+14)+'px';
  tip.style.top=(mouseY+14)+'px';
}

// ===========================
//  UNIT FACTORY
// ===========================
function mkUnit(side,type,col,row){
  const d=UDEFS[type]; if(!d) return null;
  return {
    id:uidc++, side, type,
    col:col+.5, row:row+.5,
    hp:d.hp, maxHp:d.hp,
    dmg:d.dmg, range:d.range, spd:d.spd, fr:d.fr,
    sz:d.sz||1,
    fireCd:Math.random()*1.5,
    target:null, dead:false, kills:0,
    inTrench:false, flashT:0, angle:side==='allied'?0:Math.PI,
    digTimer:0, buildTimer:0,
    // AI
    aiState:'advance',
    flankDir:Math.random()<.5?-1:1,
    flankTimer:0,
    stuckCheck:1.5+Math.random(),
    lastCol:col, lastRow:row,
    pathCache:null, pathIdx:0, pathTimer:0,
    suppressTimer:0,   // time to stay and fire before pushing
    coverCol:-1, coverRow:-1, // cached cover cell
  };
}

// ===========================
//  PATHFINDING (BFS, water-aware)
// ===========================
function bfsPath(fc, fr, tc, tr, side){
  // Returns array of {c,r} steps or null
  if(fc===tc&&fr===tr) return [];
  const key=(c,r)=>r*COLS+c;
  const visited=new Set();
  const queue=[{c:fc,r:fr,path:[]}];
  visited.add(key(fc,fr));
  const dirs=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  let itr=0;
  while(queue.length>0&&itr++<2000){
    const {c,r,path}=queue.shift();
    for(const [dc,dr] of dirs){
      const nc=c+dc, nr=r+dr;
      if(!valid(nc,nr)) continue;
      if(visited.has(key(nc,nr))) continue;
      const t=grid[nr][nc];
      // impassable tiles
      if(t===T.WALL||t===T.TREE||t===T.MILBASE) continue;
      if(t===T.WATER) continue; // water blocks unless bridge
      // bases: enemy can enter allied base (triggers win), skip enemy base for allied
      visited.add(key(nc,nr));
      const newPath=[...path,{c:nc,r:nr}];
      if(nc===tc&&nr===tr) return newPath;
      queue.push({c:nc,r:nr,path:newPath});
    }
  }
  return null;
}

function tilePassable(c,r){
  if(!valid(c,r)) return false;
  const t=grid[r][c];
  return t!==T.WALL&&t!==T.TREE&&t!==T.WATER;
}

// ===========================
//  AI STATE MACHINE (v2)
// ===========================
function updateUnits(dt){
  if(phase!=='battle') return;
  units.forEach(u=>{
    if(u.dead) return;
    u.flashT=Math.max(0,u.flashT-dt);
    u.fireCd=Math.max(0,u.fireCd-dt);
    u.suppressTimer=Math.max(0,u.suppressTimer-dt);

    const cr=Math.floor(u.row), cc=Math.floor(u.col);
    u.inTrench = valid(cc,cr)&&(grid[cr][cc]===T.TRENCH||grid[cr][cc]===T.HOLE);

    // ---- Commander aura ----
    let dmgMult=1;
    units.forEach(a=>{ if(a.side===u.side&&a.type==='commander'&&!a.dead&&Math.hypot(a.col-u.col,a.row-u.row)<8) dmgMult=1.3; });

    // ---- Medic heal ----
    if(u.type==='medic'){
      units.forEach(a=>{ if(a.side===u.side&&!a.dead&&a!==u&&Math.hypot(a.col-u.col,a.row-u.row)<4&&a.hp<a.maxHp) a.hp=Math.min(a.maxHp,a.hp+7*dt); });
    }

    // ---- Observer: mark enemies in radius (flag visually, no attack) ----
    if(u.type==='observer'){
      u.observeTimer=(u.observeTimer||0)-dt;
      if(u.observeTimer<=0){
        u.observeTimer=2;
        const radius=14;
        units.filter(e=>e.side!==u.side&&!e.dead&&Math.hypot(e.col-u.col,e.row-u.row)<radius)
          .forEach(e=>{ e.spotted=true; e.spottedTimer=3; });
      }
      // Observer slowly advances but doesn't fight
      aiAdvancePath(u,dt);
      return;
    }

    // ---- Jipe: carry nearby allies with it ----
    if(u.type==='jipe'){
      // Carry up to 2 nearby allies — move them to jipe position
      let carried=0;
      units.forEach(a=>{
        if(carried>=2) return;
        if(a.side!==u.side||a.dead||a===u) return;
        if(a.type==='tank'||a.type==='jipe'||a.type==='artillery'||a.type==='jet') return;
        const d=Math.hypot(a.col-u.col,a.row-u.row);
        if(d<2.5){
          // Snap passenger slightly behind jipe
          const offsetSign = carried===0?1:-1;
          a.col=u.col-Math.cos(u.angle)*1.2+Math.sin(u.angle)*offsetSign*0.6;
          a.row=u.row-Math.sin(u.angle)*1.2-Math.cos(u.angle)*offsetSign*0.6;
          a.angle=u.angle;
          carried++;
        }
      });
      // Jipe fires and advances normally — handled by general AI below
    }

    // ---- Digger: auto-trench ----
    if(u.type==='digger'){
      u.digTimer-=dt;
      if(u.digTimer<=0){
        u.digTimer=1.1;
        const dc=Math.floor(u.col), dr=Math.floor(u.row);
        if(valid(dc,dr)&&grid[dr][dc]!==T.BASE_A&&grid[dr][dc]!==T.BASE_E&&grid[dr][dc]!==T.WATER&&grid[dr][dc]!==T.BRIDGE){
          grid[dr][dc]=T.TRENCH; playDig();
        }
      }
    }

    // ---- Builder: auto-bridge water ----
    if(u.type==='builder'){
      u.buildTimer-=dt;
      if(u.buildTimer<=0){
        u.buildTimer=1.8;
        // Look ahead in movement direction for water cells
        const fwd = u.side==='allied'?1:-1;
        for(let step=1;step<=3;step++){
          const bc=Math.floor(u.col)+fwd*step;
          const br=Math.floor(u.row);
          if(valid(bc,br)&&grid[br][bc]===T.WATER){
            grid[br][bc]=T.BRIDGE; playDig();
            addLog(`🌉 Ponte construída em (${bc},${br}) por ${u.side==='allied'?'aliado':'inimigo'}!`,u.side==='allied'?'al':'en');
            break;
          }
          // Also check diagonals
          for(const dr of [-1,1]){
            const br2=Math.floor(u.row)+dr;
            if(valid(bc,br2)&&grid[br2][bc]===T.WATER){
              grid[br2][bc]=T.BRIDGE; playDig();
              break;
            }
          }
        }
        // Invalidate path caches for all same-side units so they can use the new bridge
        units.forEach(a=>{ if(a.side===u.side) a.pathCache=null; });
      }
    }

    // ---- Spotted timer decay ----
    if(u.spottedTimer>0){ u.spottedTimer-=dt; if(u.spottedTimer<=0) u.spotted=false; }

    // ---- Target selection (needed by all units below) ----
    const enemies=units.filter(e=>e.side!==u.side&&!e.dead);
    if(enemies.length===0){ aiAdvance(u,dt); return; }
    let closest=null, closestD=Infinity;
    enemies.forEach(e=>{ const d=Math.hypot(e.col-u.col,e.row-u.row); if(d<closestD){closestD=d;closest=e;} });
    u.target=closest;

    // ---- Fuzileiro: charge straight at closest enemy ----
    if(u.type==='fuzileiro'){
      if(closestD<=u.range){
        u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
        if(u.fireCd<=0){ u.fireCd=1/u.fr; hitUnit(closest,u.dmg*dmgMult,u.side); SOUNDS.fuzileiro(); }
      } else {
        const dx=closest.col-u.col, dy=closest.row-u.row, len=Math.hypot(dx,dy)||1;
        u.angle=Math.atan2(dy,dx);
        moveUnit(u,dx/len,dy/len,dt);
      }
      doStuckCheck(u,dt);
      return;
    }

    // ---- .50 Cal: plant and suppress, seek cover, fire fast non-AOE bursts ----
    if(u.type==='artillery'){
      if(closestD<=u.range){
        if(!u.inTrench) seekCover(u,dt);
        u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
        if(u.fireCd<=0){ u.fireCd=1/u.fr; fireBullet(u,closest,dmgMult); SOUNDS.artillery(); }
      } else { aiAdvancePath(u,dt); }
      return;
    }

    // ---- Jet: flies fast across map, drops bomb on target area ----
    if(u.type==='jet'){
      u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
      // Jets ignore terrain — move fast in straight line
      const dx=closest.col-u.col, dy=closest.row-u.row, len=Math.hypot(dx,dy)||1;
      const s=u.spd*speed;
      u.col=Math.max(0,Math.min(COLS-1,u.col+dx/len*s*dt));
      u.row=Math.max(0,Math.min(ROWS-1,u.row+dy/len*s*dt));
      if(closestD<=u.range){
        if(u.fireCd<=0){
          u.fireCd=1/u.fr;
          // Drop bomb — big AOE
          bullets.push({
            x:u.col, y:u.row,
            tx:closest.col, ty:closest.row,
            target:closest, spd:30, dmg:u.dmg*dmgMult,
            side:u.side, type:'jet',
            aoe:true, aoeR:5.5,
            dead:false, trail:[],
            isMissile:false,
          });
          SOUNDS.jet();
        }
      }
      // Jets bounce off map edges
      if(u.col<=0||u.col>=COLS-1){ u.col=Math.max(1,Math.min(COLS-2,u.col)); u.flankDir*=-1; }
      if(u.row<=0||u.row>=ROWS-1){ u.row=Math.max(1,Math.min(ROWS-2,u.row)); }
      return;
    }

    // ---- Sniper: hold position in range, seek cover ----
    if(u.type==='sniper'){
      if(closestD<=u.range){
        // Try to get into trench/hole for cover
        if(!u.inTrench) seekCover(u,dt);
        u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
        if(u.fireCd<=0){ u.fireCd=1/u.fr; fireBullet(u,closest,dmgMult); SOUNDS.sniper(); }
      } else { aiAdvance(u,dt); }
      return;
    }

    // ---- Tank: fires missiles (AOE), smash walls ----
    if(u.type==='tank'){
      u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
      if(closestD<=u.range){
        if(u.fireCd<=0){ u.fireCd=1/u.fr; fireMissile(u,closest,dmgMult); playMissile(); }
        // Tanks destroy walls they walk into
        const fwd=u.side==='allied'?1:-1;
        const wc=Math.floor(u.col)+fwd, wr=Math.floor(u.row);
        if(valid(wc,wr)&&grid[wr][wc]===T.WALL){ grid[wr][wc]=u.side==='allied'?T.CONTINENT_A:T.CONTINENT_E; }
      } else { aiAdvancePath(u,dt); }
      return;
    }

    // ---- Commander: rally nearby units, fight ----
    if(u.type==='commander'){
      // Command bonus already applied via dmgMult above for allies
      if(closestD<=u.range){
        u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
        if(u.fireCd<=0){ u.fireCd=1/u.fr; fireBullet(u,closest,dmgMult); SOUNDS.commander(); }
        // Commander shouts: slightly boost nearby allied morale (reset their retreat)
        units.forEach(a=>{ if(a.side===u.side&&!a.dead&&Math.hypot(a.col-u.col,a.row-u.row)<6&&a.aiState==='retreat') a.aiState='advance'; });
      } else { aiAdvancePath(u,dt); }
      return;
    }

    // ---- General units state machine ----
    const inRange = closestD<=u.range;
    const nearbyAllies = units.filter(a=>a.side===u.side&&!a.dead&&a!==u&&Math.hypot(a.col-u.col,a.row-u.row)<5).length;
    const nearbyEnemies = enemies.filter(e=>Math.hypot(e.col-u.col,e.row-u.row)<7).length;
    const hpPct = u.hp/u.maxHp;

    // State transitions
    if(hpPct<0.22&&nearbyAllies<2){ u.aiState='retreat'; }
    else if(inRange){ u.aiState='attack'; u.suppressTimer=1.5+Math.random(); }
    else if(nearbyEnemies>nearbyAllies+2&&hpPct>0.45&&u.suppressTimer<=0){ u.aiState='flank'; u.flankTimer=1.8+Math.random()*1.5; }
    else if(u.aiState==='attack'&&!inRange){ u.aiState='advance'; u.pathCache=null; }
    else if(u.aiState==='retreat'&&hpPct>0.55){ u.aiState='advance'; u.pathCache=null; }

    if(u.aiState==='attack'){
      u.angle=Math.atan2(closest.row-u.row,closest.col-u.col);
      if(u.fireCd<=0){ u.fireCd=1/u.fr; fireBullet(u,closest,dmgMult); SOUNDS[u.type]&&SOUNDS[u.type](); }
      // While attacking, inch toward cover
      if(!u.inTrench&&u.suppressTimer>0) seekCover(u,dt);
    } else if(u.aiState==='flank'){
      u.flankTimer-=dt;
      if(u.flankTimer<=0){ u.aiState='advance'; u.pathCache=null; }
      const fwd=u.side==='allied'?1:-1;
      const dx=fwd*0.5+u.flankDir*0.85, dy=u.flankDir*0.4;
      const len=Math.hypot(dx,dy)||1;
      moveUnit(u,dx/len,dy/len,dt);
    } else if(u.aiState==='retreat'){
      const dx=u.side==='allied'?-1:1;
      moveUnit(u,dx,0,dt);
      // Fire back while retreating
      if(inRange&&u.fireCd<=0){ u.fireCd=1/u.fr; fireBullet(u,closest,dmgMult*.7); SOUNDS[u.type]&&SOUNDS[u.type](); }
    } else {
      aiAdvancePath(u,dt);
    }

    // Stuck detection
    doStuckCheck(u,dt);
  });
}

function doStuckCheck(u,dt){
  u.stuckCheck-=dt;
  if(u.stuckCheck<=0){
    u.stuckCheck=2+Math.random();
    if(Math.hypot(u.col-u.lastCol,u.row-u.lastRow)<0.4&&(u.aiState==='advance'||u.aiState==='flank')){
      u.flankDir*=-1; u.aiState='flank'; u.flankTimer=1.2; u.pathCache=null;
    }
    u.lastCol=u.col; u.lastRow=u.row;
  }
}

function seekCover(u, dt){
  // Find nearest trench/hole within 4 tiles
  const cc=Math.floor(u.col), cr=Math.floor(u.row);
  if(u.coverCol>=0){
    // Move toward cached cover
    const dx=u.coverCol-u.col, dy=u.coverRow-u.row, d=Math.hypot(dx,dy);
    if(d<0.5||grid[u.coverRow]?.[u.coverCol]===T.TRENCH===false){ u.coverCol=-1; return; }
    moveUnit(u,dx/d,dy/d,dt*.6);
    return;
  }
  let bestD=Infinity;
  for(let dr=-4;dr<=4;dr++) for(let dc=-4;dc<=4;dc++){
    const nc=cc+dc, nr=cr+dr;
    if(!valid(nc,nr)) continue;
    const t=grid[nr][nc];
    if(t===T.TRENCH||t===T.HOLE){
      const d=Math.hypot(dc,dr);
      if(d<bestD){ bestD=d; u.coverCol=nc; u.coverRow=nr; }
    }
  }
}

function aiAdvance(u, dt){
  const tCol = u.side==='allied'?COLS-2:2;
  const tRow = ROWS/2 + (Math.sin(gameTime*0.25+u.id*0.7)*ROWS*0.18);
  const dx=tCol-u.col, dy=tRow-u.row, len=Math.hypot(dx,dy)||1;
  u.angle=Math.atan2(dy,dx);
  moveUnit(u,dx/len,dy/len,dt);
}

function aiAdvancePath(u, dt){
  // Refresh path every 3s or when invalidated
  u.pathTimer-=dt;
  if(!u.pathCache||u.pathTimer<=0||u.pathIdx>=u.pathCache.length){
    const tCol=u.side==='allied'?COLS-3:3;
    // Pick target row: aim at nearest enemy or enemy base midpoint
    const enemies=units.filter(e=>e.side!==u.side&&!e.dead);
    let tRow=Math.floor(ROWS/2);
    if(enemies.length>0){
      let closest=enemies[0], cD=Infinity;
      enemies.forEach(e=>{ const d=Math.hypot(e.col-u.col,e.row-u.row); if(d<cD){cD=d;closest=e;} });
      tRow=Math.floor(closest.row);
    }
    const path=bfsPath(Math.floor(u.col),Math.floor(u.row),tCol,tRow,u.side);
    u.pathCache=path&&path.length>0?path:null;
    u.pathIdx=0;
    u.pathTimer=3+Math.random()*1.5;
    if(!u.pathCache){ aiAdvance(u,dt); return; }
  }
  // Follow path
  if(u.pathIdx<u.pathCache.length){
    const step=u.pathCache[u.pathIdx];
    const tx=step.c+.5, ty=step.r+.5;
    const dx=tx-u.col, dy=ty-u.row, d=Math.hypot(dx,dy);
    if(d<0.35){ u.pathIdx++; return; }
    u.angle=Math.atan2(dy,dx);
    moveUnit(u,dx/d,dy/d,dt);
  } else {
    u.pathCache=null;
  }
}

function isBlocked(nc, nr, u){
  if(!valid(nc,nr)) return true;
  const t=grid[nr][nc];
  if(t===T.WATER) return true;
  if(t===T.WALL||t===T.TREE||t===T.MILBASE){
    if(u.type==='tank'&&t===T.WALL){ grid[nr][nc]=u.side==='allied'?T.CONTINENT_A:T.CONTINENT_E; return false; }
    return true;
  }
  return false;
}

function moveUnit(u,dx,dy,dt){
  if(u.type==='jet') return; // jets handle movement themselves
  const s=u.spd*speed;
  const mx=dx*s*dt, my=dy*s*dt;
  let nx=u.col+mx, ny=u.row+my;
  const nc=Math.floor(nx), nr=Math.floor(ny);

  // Check base win condition first
  const tc=grid[Math.floor(ny)]?.[Math.floor(nx)];
  if(tc===T.BASE_A&&u.side!=='allied'){ endWar('enemy'); return; }
  if(tc===T.BASE_E&&u.side!=='enemy'){ endWar('allied'); return; }

  if(!isBlocked(nc,nr,u)){
    // Full move
    const spedMult=(tc===T.BRIDGE)?0.65:(tc===T.TRENCH||tc===T.HOLE)?0.7:1;
    u.col=Math.max(0,Math.min(COLS-1,nx));
    u.row=Math.max(0,Math.min(ROWS-1,ny));
    return;
  }
  // Try sliding along X axis
  const nxOnly=u.col+mx, ncX=Math.floor(nxOnly), nrX=Math.floor(u.row);
  if(!isBlocked(ncX,nrX,u)){
    u.col=Math.max(0,Math.min(COLS-1,nxOnly));
    u.pathCache=null; // re-path around obstacle
    return;
  }
  // Try sliding along Y axis
  const nyOnly=u.row+my, ncY=Math.floor(u.col), nrY=Math.floor(nyOnly);
  if(!isBlocked(ncY,nrY,u)){
    u.row=Math.max(0,Math.min(ROWS-1,nyOnly));
    u.pathCache=null;
    return;
  }
  // Fully blocked — invalidate path so bot re-routes
  u.pathCache=null;
}

// ===========================
//  BULLETS
// ===========================
function fireBullet(shooter, target, dmgMult){
  bullets.push({
    x:shooter.col, y:shooter.row,
    tx:target.col, ty:target.row,
    target, spd:shooter.type==='sniper'?28:(shooter.type==='artillery'?9:20),
    dmg:shooter.dmg*dmgMult,
    side:shooter.side, type:shooter.type,
    aoe:false, aoeR:0,
    dead:false,
    trail:[],
  });
}

function fireMissile(shooter, target, dmgMult){
  // Tank missile: fast, AOE radius 4, leaves smoke trail
  bullets.push({
    x:shooter.col, y:shooter.row,
    tx:target.col, ty:target.row,
    target, spd:22, dmg:shooter.dmg*dmgMult,
    side:shooter.side, type:'missile',
    aoe:true, aoeR:4,
    dead:false, trail:[],
    isMissile:true,
  });
}

function updateBullets(dt){
  bullets.forEach(b=>{
    if(b.dead) return;
    b.trail.push({x:b.x,y:b.y});
    if(b.trail.length>6) b.trail.shift();
    const dx=b.tx-b.x, dy=b.ty-b.y, dist=Math.hypot(dx,dy);
    const mv=b.spd*speed*dt;
    if(dist<=mv+.2){
      b.dead=true;
      if(b.aoe){
        units.filter(u=>u.side!==b.side&&!u.dead).forEach(u=>{
          const d=Math.hypot(u.col-b.tx,u.row-b.ty);
          if(d<b.aoeR) hitUnit(u,b.dmg*(1-d/b.aoeR*.6),b.side);
        });
        // Crater — convert tiles in radius to HOLE
        const cr=Math.ceil(b.aoeR);
        for(let dr=-cr;dr<=cr;dr++){
          for(let dc=-cr;dc<=cr;dc++){
            if(Math.hypot(dc,dr)>b.aoeR) continue;
            const tc2=Math.floor(b.tx)+dc, tr2=Math.floor(b.ty)+dr;
            if(!valid(tc2,tr2)) continue;
            const tt=grid[tr2][tc2];
            // Don't destroy bases or water
            if(tt===T.BASE_A||tt===T.BASE_E||tt===T.WATER) continue;
            // Walls and milbase become holes too
            grid[tr2][tc2]=T.HOLE;
          }
        }
        spawnExpl(b.tx,b.ty);
        playExplosion();
      } else {
        if(b.target&&!b.target.dead) hitUnit(b.target,b.dmg,b.side);
        spawnHit(b.tx,b.ty);
      }
    } else {
      // Check if bullet path crosses a wall/structure — stop it there
      const stepX=b.x+dx/dist*mv, stepY=b.y+dy/dist*mv;
      const sc=Math.floor(stepX), sr=Math.floor(stepY);
      if(valid(sc,sr)){
        const bt=grid[sr][sc];
        if(bt===T.WALL||bt===T.MILBASE||bt===T.TREE){
          b.dead=true;
          spawnHit(stepX,stepY);
          // Explosions also damage the wall tile
          if(b.aoe) spawnExpl(stepX,stepY);
          return; // stop bullet here
        }
      }
      b.x=stepX; b.y=stepY;
    }
  });
  bullets=bullets.filter(b=>!b.dead);
}

function hitUnit(u,dmg,side){
  const red=u.inTrench?.5:1;
  const d=dmg*red;
  u.hp-=d; u.flashT=.12;
  spawnDmg(u.col,u.row,Math.ceil(d));
  if(u.hp<=0){
    u.dead=true; playDeath();
    if(side==='allied') alliedScore++; else enemyScore++;
    document.getElementById('allied-score').textContent=alliedScore;
    document.getElementById('enemy-score').textContent=enemyScore;
    addLog(`💀 ${UDEFS[u.type].name} ${u.side==='allied'?'aliado':'inimigo'} morto`,u.side==='allied'?'en':'al');
    spawnDeathFX(u.col,u.row,u.side);
    if(selectedUnit?.id===u.id) clearDetail();
  }
}

// ===========================
//  PARTICLES
// ===========================
function spawnExpl(x,y){
  for(let i=0;i<18;i++){
    const a=Math.random()*Math.PI*2, s=2+Math.random()*6;
    particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,
      life:.5+Math.random()*.3,maxLife:.6,
      color:['#FF8C00','#FF4500','#FFD700','#888','#ccc'][Math.floor(Math.random()*5)],sz:.35+Math.random()*.5});
  }
}
function spawnHit(x,y){
  for(let i=0;i<4;i++){
    const a=Math.random()*Math.PI*2;
    particles.push({x,y,vx:Math.cos(a)*2,vy:Math.sin(a)*2,life:.18,maxLife:.18,color:'#FFD700',sz:.18});
  }
}
function spawnDeathFX(x,y,side){
  for(let i=0;i<8;i++){
    const a=Math.random()*Math.PI*2;
    particles.push({x,y,vx:Math.cos(a)*2.5,vy:Math.sin(a)*2.5,life:.35,maxLife:.35,
      color:side==='allied'?'#4CAF50':'#F44336',sz:.22});
  }
}
function spawnDmg(x,y,d){
  effects.push({x,y,vy:-1.8,life:.9,text:'-'+d,alpha:1});
}
// ===========================
//  MILITARY BASE SPAWNER
// ===========================
const MILBASE_W = 9;
const MILBASE_H = 10;
const MILBASE_SIZE = 9; // kept for compat
// milbases: [{side, col, row, spawnTimer, spawnInterval, waveIndex}]
let milbases = [];

function placeMilbase(side, anchorCol, anchorRow){
  milbases = milbases.filter(b => b.side !== side);
  const c0=anchorCol, r0=anchorRow, W=MILBASE_W, H=MILBASE_H;

  // Fill interior with milbase terrain
  for(let r=r0;r<r0+H;r++) for(let c=c0;c<c0+W;c++){
    if(!valid(c,r)) continue;
    grid[r][c]=T.MILBASE;
  }

  // Outer wall border
  for(let c=c0;c<c0+W;c++){
    if(valid(c,r0))     grid[r0][c]=T.WALL;
    if(valid(c,r0+H-1)) grid[r0+H-1][c]=T.WALL;
  }
  for(let r=r0;r<r0+H;r++){
    if(valid(c0,r))     grid[r][c0]=T.WALL;
    if(valid(c0+W-1,r)) grid[r][c0+W-1]=T.WALL;
  }

  // ENTRANCE — opening in the front wall (facing the battlefield)
  // Allied: entrance on right side (c0+W-1), Enemy: entrance on left side (c0)
  const midR = r0 + Math.floor(H/2);
  if(side==='allied'){
    // Right wall entrance (2 cells tall at center)
    if(valid(c0+W-1, midR-1)) grid[midR-1][c0+W-1]=T.MILBASE;
    if(valid(c0+W-1, midR))   grid[midR][c0+W-1]=T.MILBASE;
  } else {
    // Left wall entrance
    if(valid(c0, midR-1)) grid[midR-1][c0]=T.MILBASE;
    if(valid(c0, midR))   grid[midR][c0]=T.MILBASE;
  }

  // Command post — small 2x2 block in back-center
  const cmdC = side==='allied' ? c0+1 : c0+W-3;
  const cmdR = r0+Math.floor(H/2)-1;
  for(let dr=0;dr<2;dr++) for(let dc=0;dc<2;dc++){
    if(valid(cmdC+dc, cmdR+dr)) grid[cmdR+dr][cmdC+dc]=T.WALL;
  }
  // Open center of command post
  if(valid(cmdC, cmdR)) grid[cmdR][cmdC]=T.MILBASE;

  // Trenches along front interior wall
  const frontC = side==='allied' ? c0+W-3 : c0+2;
  for(let r=r0+1;r<r0+H-1;r++) if(valid(frontC,r)) grid[r][frontC]=T.TRENCH;

  // Corner watchtower holes
  [[c0+1,r0+1],[c0+W-2,r0+1],[c0+1,r0+H-2],[c0+W-2,r0+H-2]]
    .forEach(([c,r])=>{ if(valid(c,r)) grid[r][c]=T.HOLE; });

  // Spawn point just outside the entrance
  const spawnX = side==='allied' ? c0+W : c0-1;
  const spawnY = midR;

  milbases.push({
    side, col:anchorCol, row:anchorRow,
    spawnTimer: 15,
    spawnInterval: 25,
    waveIndex: 0,
    spawnX, spawnY,
  });
  addLog(`🏛 Base Militar ${side==='allied'?'aliada':'inimiga'} construída em (${anchorCol},${anchorRow})`, side==='allied'?'al':'en');
}

// Spawn wave patterns for bases — cycles through these
const BASE_WAVES = [
  // Wave 1 — light patrol
  [{type:'soldier',dc:0,dr:0},{type:'soldier',dc:0,dr:1},{type:'soldier',dc:0,dr:2},{type:'machine',dc:0,dr:3}],
  // Wave 2 — assault squad
  [{type:'fuzileiro',dc:0,dr:0},{type:'fuzileiro',dc:0,dr:1},{type:'soldier',dc:1,dr:0},{type:'soldier',dc:1,dr:1},{type:'medic',dc:1,dr:2}],
  // Wave 3 — heavy push
  [{type:'tank',dc:0,dr:1},{type:'soldier',dc:2,dr:0},{type:'soldier',dc:2,dr:1},{type:'soldier',dc:2,dr:2},{type:'sniper',dc:3,dr:0},{type:'commander',dc:3,dr:2}],
  // Wave 4 — blitz
  [{type:'jipe',dc:0,dr:1},{type:'fuzileiro',dc:2,dr:0},{type:'fuzileiro',dc:2,dr:1},{type:'fuzileiro',dc:2,dr:2},{type:'machine',dc:3,dr:0},{type:'machine',dc:3,dr:2},{type:'medic',dc:3,dr:1}],
];

function updateMilbases(dt){
  if(phase!=='battle') return;
  milbases.forEach(base=>{
    base.spawnTimer -= dt * speed;
    if(base.spawnTimer > 0) return;
    base.spawnTimer = base.spawnInterval;
    // Pick wave pattern
    const wave = BASE_WAVES[base.waveIndex % BASE_WAVES.length];
    base.waveIndex++;
    let placed=0;
    wave.forEach(u=>{
      const c = base.spawnX + (base.side==='allied' ? u.dc : -u.dc);
      const r = base.spawnY + u.dr - 1;
      if(!valid(c,r)||grid[r][c]===T.WATER||unitAt(c,r)) return;
      const unit = mkUnit(base.side, u.type, c, r);
      if(unit){ units.push(unit); placed++; }
    });
    if(placed>0){
      playPlace();
      addLog(`🏛 Base ${base.side==='allied'?'aliada':'inimiga'} lançou esquadrão — ${placed} unidades!`, base.side==='allied'?'al':'en');
      // Spawn flash particles
      for(let i=0;i<8;i++){
        const a=Math.random()*Math.PI*2;
        particles.push({x:base.spawnX,y:base.spawnY,vx:Math.cos(a)*3,vy:Math.sin(a)*3,life:.5,maxLife:.5,color:base.side==='allied'?'#4CAF50':'#F44336',sz:.3});
      }
    }
  });
}

function drawMilbaseOverlays(){
  if(!milbases.length) return;
  const ti=TILE*zoom;
  milbases.forEach(base=>{
    const W=MILBASE_W, H=MILBASE_H;
    const x=base.col*ti+ox, y=base.row*ti+oy;
    // Glowing border
    C.strokeStyle=base.side==='allied'?'rgba(76,175,80,.5)':'rgba(244,67,54,.5)';
    C.lineWidth=2; C.setLineDash([5,4]);
    C.strokeRect(x,y,W*ti,H*ti);
    C.setLineDash([]);
    // Spawn point indicator
    const sx=base.spawnX*ti+ox, sy=base.spawnY*ti+oy;
    C.strokeStyle=base.side==='allied'?'#4CAF50':'#F44336';
    C.lineWidth=1.5;
    C.beginPath(); C.arc(sx+ti/2,sy+ti/2,ti*.7,0,Math.PI*2); C.stroke();
    // Spawn countdown arc
    const total=base.spawnInterval, rem=base.spawnTimer;
    const prog=1-(rem/total);
    C.strokeStyle=base.side==='allied'?'rgba(76,175,80,.9)':'rgba(244,67,54,.9)';
    C.lineWidth=2.5;
    C.beginPath(); C.arc(sx+ti/2,sy+ti/2,ti*.7,-Math.PI/2,-Math.PI/2+prog*Math.PI*2); C.stroke();
    // Timer text
    C.fillStyle=base.side==='allied'?'#4CAF50':'#F44336';
    C.font=`bold ${Math.max(8,ti*.65)}px Oswald`;
    C.textAlign='center'; C.textBaseline='middle';
    C.fillText(Math.ceil(rem)+'s', sx+ti/2, sy+ti/2);
    // Label
    C.font=`bold ${Math.max(7,9*zoom)}px Oswald`;
    C.fillStyle='rgba(200,168,75,.9)';
    C.textAlign='center';
    C.fillText('BASE MILITAR', x+W*ti/2, y-6*zoom);
  });
}

function updateParticles(dt){
  particles.forEach(p=>{p.x+=p.vx*speed*dt;p.y+=p.vy*speed*dt;p.life-=dt*speed;p.vx*=.9;p.vy*=.9;});
  particles=particles.filter(p=>p.life>0);
  effects.forEach(e=>{e.y+=e.vy*speed*dt;e.life-=dt*speed;e.alpha=e.life/.9;});
  effects=effects.filter(e=>e.life>0);
}

// ===========================
//  RENDERING
// ===========================
function hexToRgb(h){ const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16); return{r,g,b}; }

const TCOLORS={
  [T.GRASS]:'#3B5E2A',[T.TRENCH]:'#4A3820',[T.HOLE]:'#2A1E0F',
  [T.WALL]:'#8B7355',[T.BASE_A]:'#1E3D1E',[T.BASE_E]:'#3D1E1E',
  [T.TREE]:'#2A5E1E',[T.WATER]:'#1A3050',[T.BRIDGE]:'#8B6914',
  [T.CONTINENT_A]:null,[T.CONTINENT_E]:null
};

function getTileColor(t){
  if(t===T.CONTINENT_A){ const c=hexToRgb(cont1Color); return `rgb(${Math.floor(c.r*.55)},${Math.floor(c.g*.55)},${Math.floor(c.b*.55)})`; }
  if(t===T.CONTINENT_E){ const c=hexToRgb(cont2Color); return `rgb(${Math.floor(c.r*.55)},${Math.floor(c.g*.55)},${Math.floor(c.b*.55)})`; }
  return TCOLORS[t]||'#3B5E2A';
}

function drawGrid(){
  const ti=TILE*zoom;
  const sc=Math.max(0,Math.floor(-ox/ti)), ec=Math.min(COLS,Math.ceil((canvas.width-ox)/ti));
  const sr=Math.max(0,Math.floor(-oy/ti)), er=Math.min(ROWS,Math.ceil((canvas.height-oy)/ti));

  for(let r=sr;r<er;r++){
    for(let c=sc;c<ec;c++){
      const t=grid[r][c];
      const x=c*ti+ox, y=r*ti+oy;
      C.fillStyle=getTileColor(t);
      C.fillRect(x,y,ti,ti);

      // Texture overlays
      if(t===T.WATER){
        const wave=(Math.sin(c*.4+gameTime*.8)+1)*.5;
        C.fillStyle=`rgba(60,120,200,${.08+wave*.06})`;
        C.fillRect(x,y,ti,ti);
      }
      if(t===T.BRIDGE){
        // Wooden planks look
        C.fillStyle='rgba(180,140,60,.9)'; C.fillRect(x+ti*.08,y+ti*.08,ti*.84,ti*.84);
        C.strokeStyle='#5a3a10'; C.lineWidth=1;
        for(let p=0;p<3;p++){
          C.beginPath(); C.moveTo(x+ti*.1,y+ti*(0.2+p*0.28)); C.lineTo(x+ti*.9,y+ti*(0.2+p*0.28)); C.stroke();
        }
        C.strokeStyle='#8B6914'; C.lineWidth=1.5;
        C.strokeRect(x+ti*.08,y+ti*.08,ti*.84,ti*.84);
      }
      if(t===T.TRENCH){
        C.strokeStyle='rgba(0,0,0,.5)'; C.lineWidth=1;
        C.beginPath(); C.moveTo(x+ti*.15,y+ti*.5); C.lineTo(x+ti*.85,y+ti*.5); C.stroke();
        C.beginPath(); C.moveTo(x+ti*.5,y+ti*.15); C.lineTo(x+ti*.5,y+ti*.85); C.stroke();
      }
      if(t===T.WALL){
        C.fillStyle='rgba(255,255,255,.07)';
        C.fillRect(x+1,y+1,ti-2,ti*.45);
        C.fillStyle='rgba(0,0,0,.15)';
        C.fillRect(x+1,y+ti*.45,ti-2,ti*.1);
      }
      if(t===T.TREE){
        C.fillStyle='rgba(30,80,20,.7)';
        C.beginPath(); C.arc(x+ti/2,y+ti/2,ti*.38,0,Math.PI*2); C.fill();
        C.fillStyle='rgba(60,140,40,.4)';
        C.beginPath(); C.arc(x+ti*.35,y+ti*.35,ti*.22,0,Math.PI*2); C.fill();
      }
      if(t===T.HOLE){
        C.fillStyle='rgba(0,0,0,.55)';
        C.beginPath(); C.ellipse(x+ti/2,y+ti/2,ti*.38,ti*.28,0,0,Math.PI*2); C.fill();
      }
      if(t===T.MILBASE){
        // Military base — dark platform with cross marking
        C.fillStyle='rgba(80,70,40,.9)'; C.fillRect(x+1,y+1,ti-2,ti-2);
        C.strokeStyle='rgba(200,168,75,.5)'; C.lineWidth=.8;
        C.beginPath(); C.moveTo(x+ti*.5,y+ti*.15); C.lineTo(x+ti*.5,y+ti*.85); C.stroke();
        C.beginPath(); C.moveTo(x+ti*.15,y+ti*.5); C.lineTo(x+ti*.85,y+ti*.5); C.stroke();
        C.strokeStyle='rgba(200,168,75,.3)'; C.lineWidth=1;
        C.strokeRect(x+1,y+1,ti-2,ti-2);
      }
      // Base labels
      if(t===T.BASE_A){ C.fillStyle=`rgba(${hexToRgb(cont1Color).r},${hexToRgb(cont1Color).g},${hexToRgb(cont1Color).b},.6)`; C.fillRect(x,y,ti,ti); }
      if(t===T.BASE_E){ C.fillStyle=`rgba(${hexToRgb(cont2Color).r},${hexToRgb(cont2Color).g},${hexToRgb(cont2Color).b},.6)`; C.fillRect(x,y,ti,ti); }

      // Grid lines
      if(zoom>.65){ C.strokeStyle='rgba(0,0,0,.1)'; C.lineWidth=.4; C.strokeRect(x,y,ti,ti); }
    }
  }

  // Continent border glow (blob boundary)
  C.save();
  for(let r=sr;r<er;r++){
    for(let c=sc;c<ec;c++){
      if(!landmask[r]||!landmask[r][c]) continue;
      const x=c*ti+ox, y=r*ti+oy;
      const t=grid[r][c];
      const shore=[[0,-1],[0,1],[-1,0],[1,0]].some(([dc,dr])=>{
        const nr2=r+dr, nc2=c+dc;
        return !valid(nc2,nr2)||grid[nr2]?.[nc2]===T.WATER;
      });
      if(shore){
        C.strokeStyle='rgba(180,160,100,.3)'; C.lineWidth=1.5;
        C.strokeRect(x,y,ti,ti);
      }
    }
  }
  C.restore();

  // Continent name labels
  drawContLabel(COLS*.18, ROWS/2, cont1Name, cont1Color);
  drawContLabel(COLS*.82, ROWS/2, cont2Name, cont2Color);
}

function drawContLabel(col, row, name, color){
  const x=col*TILE*zoom+ox, y=row*TILE*zoom+oy;
  const fs=Math.max(10, 16*zoom);
  C.save();
  C.font=`bold ${fs}px Oswald`;
  C.textAlign='center'; C.textBaseline='middle';
  C.fillStyle='rgba(0,0,0,.45)';
  const w=C.measureText(name).width;
  C.fillRect(x-w/2-6,y-fs*.65,w+12,fs*1.3);
  const rgb=hexToRgb(color);
  C.fillStyle=`rgba(${rgb.r+80},${rgb.g+80},${rgb.b+80},.85)`;
  C.fillText(name, x, y);
  C.restore();
}

function drawBullets(){
  const ti=TILE*zoom;
  bullets.forEach(b=>{
    C.save();
    // Trail
    if(b.trail.length>1){
      C.globalAlpha=.35;
      C.strokeStyle=b.type==='sniper'?'#FFD700':(b.aoe?'#FF8C00':'rgba(255,220,120,.7)');
      C.lineWidth=b.aoe?2:1;
      C.beginPath();
      b.trail.forEach((p,i)=>{ i===0?C.moveTo(p.x*ti+ox,p.y*ti+oy):C.lineTo(p.x*ti+ox,p.y*ti+oy); });
      C.stroke();
      C.globalAlpha=1;
    }
    const x=b.x*ti+ox, y=b.y*ti+oy;
    C.translate(x,y);
    C.rotate(Math.atan2(b.ty-b.y,b.tx-b.x));
    if(b.aoe){
      C.fillStyle='#FF8C00'; C.beginPath(); C.arc(0,0,4*zoom,0,Math.PI*2); C.fill();
    } else if(b.type==='sniper'){
      C.strokeStyle='#FFE066'; C.lineWidth=2;
      C.beginPath(); C.moveTo(-8*zoom,0); C.lineTo(3*zoom,0); C.stroke();
    } else if(b.type==='machine'){
      C.fillStyle='#f8c060'; C.beginPath(); C.ellipse(0,0,2.5*zoom,1.5*zoom,0,0,Math.PI*2); C.fill();
    } else if(b.type==='jet'){
      // Falling bomb — dark oval
      C.fillStyle='#333'; C.beginPath(); C.ellipse(0,0,5*zoom,2.5*zoom,0,0,Math.PI*2); C.fill();
      C.fillStyle='rgba(255,200,0,.6)'; C.beginPath(); C.ellipse(4*zoom,0,2*zoom,1*zoom,0,0,Math.PI*2); C.fill();
    } else if(b.isMissile){
      // Missile — elongated with fire trail
      C.fillStyle='#FF8C00'; C.beginPath(); C.ellipse(0,0,5*zoom,2*zoom,0,0,Math.PI*2); C.fill();
      C.fillStyle='#FFD700'; C.beginPath(); C.ellipse(-4*zoom,0,3*zoom,1.2*zoom,0,0,Math.PI*2); C.fill();
      C.fillStyle='#fff'; C.beginPath(); C.ellipse(3*zoom,0,2*zoom,.8*zoom,0,0,Math.PI*2); C.fill();
    } else {
      C.fillStyle=b.side==='allied'?'#90EE90':'#FF8888';
      C.beginPath(); C.ellipse(0,0,3*zoom,1.5*zoom,0,0,Math.PI*2); C.fill();
    }
    C.restore();
  });
}

function drawUnits(){
  const ti=TILE*zoom;
  units.forEach(u=>{
    if(u.dead) return;
    const x=u.col*ti+ox, y=u.row*ti+oy;
    const r=ti*.44*u.sz;

    // Shadow
    C.fillStyle='rgba(0,0,0,.28)';
    C.beginPath(); C.ellipse(x,y+r*.55,r*.75,r*.28,0,0,Math.PI*2); C.fill();

    // Selection ring
    if(selectedUnit?.id===u.id){
      C.strokeStyle='#FFD700'; C.lineWidth=2;
      C.beginPath(); C.arc(x,y,r+3,0,Math.PI*2); C.stroke();
    }

    // Body
    C.fillStyle=u.flashT>0?'#fff':(u.side==='allied'?'#2E5F2E':'#7A1C1C');
    C.beginPath(); C.arc(x,y,r,0,Math.PI*2); C.fill();
    C.strokeStyle=u.side==='allied'?'#4CAF50':'#F44336';
    C.lineWidth=u.sz>1?2:1.5;
    C.beginPath(); C.arc(x,y,r,0,Math.PI*2); C.stroke();

    // Direction indicator
    C.save(); C.translate(x,y); C.rotate(u.angle);
    C.fillStyle='rgba(255,255,255,.3)';
    C.beginPath(); C.moveTo(r*.6,0); C.lineTo(r*.2,-r*.2); C.lineTo(r*.2,r*.2); C.closePath(); C.fill();
    C.restore();

    // Icon
    const fs=Math.max(7,r*1.35);
    C.font=`${fs}px serif`; C.textAlign='center'; C.textBaseline='middle';
    C.fillText(UDEFS[u.type].ico,x,y);

    // HP bar
    if(u.hp<u.maxHp){
      const bw=r*2.3, bh=3, bx=x-bw/2, by=y-r-6;
      C.fillStyle='#1a0a0a'; C.fillRect(bx,by,bw,bh);
      const pct=u.hp/u.maxHp;
      C.fillStyle=pct>.5?'#4CAF50':pct>.25?'#FFC107':'#F44336';
      C.fillRect(bx,by,bw*pct,bh);
    }

    // Trench ring
    if(u.inTrench){
      C.setLineDash([2,2]); C.strokeStyle='#C8A84B'; C.lineWidth=1;
      C.beginPath(); C.arc(x,y,r+5,0,Math.PI*2); C.stroke(); C.setLineDash([]);
    }

    // Digger progress arc
    if(u.type==='digger'){
      const prog=1-u.digTimer/1.2;
      C.strokeStyle='#C8A84B'; C.lineWidth=2;
      C.beginPath(); C.arc(x,y,r+7,-Math.PI/2,-Math.PI/2+prog*Math.PI*2); C.stroke();
    }

    // Observer radar ring (pulsing)
    if(u.type==='observer'){
      const pulse=(Math.sin(gameTime*3)+1)*.5;
      C.strokeStyle=`rgba(100,200,255,${0.25+pulse*0.25})`;
      C.lineWidth=1; C.setLineDash([3,4]);
      C.beginPath(); C.arc(x,y,(14*TILE*zoom)*.18+pulse*4,0,Math.PI*2); C.stroke();
      C.setLineDash([]);
    }

    // Spotted enemy marker (red exclamation)
    if(u.spotted){
      C.fillStyle='rgba(255,50,50,.9)';
      C.font=`bold ${Math.max(8,r*1.2)}px sans-serif`;
      C.textAlign='center'; C.textBaseline='bottom';
      C.fillText('!', x, y-r-2);
    }

    // Jet — draw as plane silhouette instead of circle
    if(u.type==='jet'){
      C.save();
      C.translate(x,y); C.rotate(u.angle);
      C.fillStyle=u.side==='allied'?'#4CAF50':'#F44336';
      // Fuselage
      C.beginPath(); C.ellipse(0,0,r*1.8,r*.45,0,0,Math.PI*2); C.fill();
      // Wings
      C.beginPath(); C.moveTo(-r*.2,-r*1.4); C.lineTo(r*.5,0); C.lineTo(-r*.2,r*1.4); C.closePath(); C.fill();
      // Tail
      C.beginPath(); C.moveTo(-r*1.4,-r*.7); C.lineTo(-r*.6,0); C.lineTo(-r*1.4,r*.7); C.closePath(); C.fill();
      // Engine glow
      C.fillStyle='rgba(255,150,50,.7)';
      C.beginPath(); C.ellipse(-r*1.8,0,r*.5,r*.25,0,0,Math.PI*2); C.fill();
      C.restore();
      // Skip normal drawing for jet
      if(u.hp<u.maxHp){
        const bw=r*2.3,bh=3,bx=x-bw/2,by=y-r-6;
        C.fillStyle='#1a0a0a'; C.fillRect(bx,by,bw,bh);
        const pct=u.hp/u.maxHp;
        C.fillStyle=pct>.5?'#4CAF50':pct>.25?'#FFC107':'#F44336';
        C.fillRect(bx,by,bw*pct,bh);
      }
      return; // skip rest of normal unit drawing
    }

    // Jipe passenger count badge
    if(u.type==='jipe'){
      const passengers=units.filter(a=>a.side===u.side&&!a.dead&&a!==u&&Math.hypot(a.col-u.col,a.row-u.row)<2.5&&a.type!=='tank'&&a.type!=='jipe').length;
      if(passengers>0){
        C.fillStyle='rgba(200,168,75,.9)';
        C.font=`bold ${Math.max(7,r*.9)}px Oswald`;
        C.textAlign='center'; C.textBaseline='top';
        C.fillText('+'+passengers, x+r*.8, y-r);
      }
    }
  });
}

function drawParticles(){
  const ti=TILE*zoom;
  particles.forEach(p=>{
    const x=p.x*ti+ox, y=p.y*ti+oy;
    const a=p.life/p.maxLife;
    C.fillStyle=p.color+Math.floor(a*255).toString(16).padStart(2,'0');
    C.beginPath(); C.arc(x,y,p.sz*ti*.3,0,Math.PI*2); C.fill();
  });
  effects.forEach(e=>{
    const x=e.x*ti+ox, y=e.y*ti+oy;
    C.fillStyle=`rgba(255,80,80,${e.alpha})`;
    C.font=`bold ${Math.max(8,11*zoom)}px Oswald`;
    C.textAlign='center';
    C.fillText(e.text,x,y);
  });
}

function drawHoverCell(){
  const {col,row}=c2g(mouseX,mouseY);
  if(!valid(col,row)||!currentTool) return;
  const ti=TILE*zoom;
  C.strokeStyle='rgba(200,168,75,.7)'; C.lineWidth=1.5;
  C.strokeRect(col*ti+ox,row*ti+oy,ti,ti);
}

function drawMinimap(){
  const mm=90, mh=90;
  const mx=canvas.width-mm-8, my=canvas.height-mh-8;
  C.fillStyle='rgba(8,6,2,.88)'; C.fillRect(mx,my,mm,mh);
  C.strokeStyle='#4a3a15'; C.lineWidth=1; C.strokeRect(mx,my,mm,mh);
  const cw=mm/COLS, ch=mh/ROWS;
  const step=Math.max(1,Math.floor(COLS/90));
  for(let r=0;r<ROWS;r+=step){
    for(let c=0;c<COLS;c+=step){
      C.fillStyle=getTileColor(grid[r]?.[c]);
      C.fillRect(mx+c*cw,my+r*ch,cw*step+1,ch*step+1);
    }
  }
  units.forEach(u=>{
    if(u.dead) return;
    C.fillStyle=u.side==='allied'?'#4CAF50':'#F44336';
    C.fillRect(mx+u.col*cw-1,my+u.row*ch-1,2,2);
  });
  // Viewport box
  C.strokeStyle='rgba(200,168,75,.5)'; C.lineWidth=.8;
  const vx=mx-ox/(TILE*zoom)*cw;
  const vy=my-oy/(TILE*zoom)*ch;
  const vw=canvas.width/(TILE*zoom)*cw;
  const vh=canvas.height/(TILE*zoom)*ch;
  C.strokeRect(vx,vy,vw,vh);
  // Labels
  C.font=`bold ${Math.max(6,8)}px sans-serif`; C.textAlign='left';
  C.fillStyle='rgba(200,168,75,.7)'; C.fillText('MAPA',mx+3,my+9);
}

function render(){
  C.clearRect(0,0,canvas.width,canvas.height);
  C.fillStyle='#110d06'; C.fillRect(0,0,canvas.width,canvas.height);
  drawGrid();
  drawBullets();
  drawParticles();
  drawUnits();
  drawHoverCell();
  drawSquadPreview();
  drawMilbaseOverlays();
  drawMinimap();
}

// ===========================
//  GAME LOOP
// ===========================
function gameLoop(ts){
  if(!lastTS) lastTS=ts;
  let dt=Math.min((ts-lastTS)/1000,.05);
  lastTS=ts;
  if(!paused&&!warOver){
    gameTime+=dt*speed;
    document.getElementById('time-disp').textContent=Math.floor(gameTime)+'s';
    updateUnits(dt);
    updateBullets(dt);
    updateMilbases(dt);
    updateParticles(dt);
    if(selectedUnit&&!selectedUnit.dead) showDetail(selectedUnit);
    if(phase==='battle'&&gameTime>8) checkWin();
  }
  render();
  requestAnimationFrame(gameLoop);
}

function checkWin(){
  const al=units.filter(u=>u.side==='allied'&&!u.dead).length;
  const en=units.filter(u=>u.side==='enemy'&&!u.dead).length;
  if(al===0&&en>0) endWar('enemy');
  else if(en===0&&al>0) endWar('allied');
}

function endWar(winner){
  if(warOver) return;
  warOver=true;
  const modal=document.getElementById('modal');
  const title=document.getElementById('modal-title');
  const msg=document.getElementById('modal-msg');
  modal.classList.add('open');
  if(winner==='allied'){
    title.textContent=`🏆 ${cont1Name} VENCEU!`; title.style.color='#4CAF50';
    msg.textContent=`${cont1Name} dominou o campo! Inimigos eliminados: ${alliedScore}.`;
  } else {
    title.textContent=`💀 ${cont2Name} VENCEU!`; title.style.color='#F44336';
    msg.textContent=`${cont2Name} conquistou o território! Baixas aliadas: ${enemyScore}.`;
  }
  addLog(winner==='allied'?`🏆 ${cont1Name} VENCEU!`:`💀 ${cont2Name} VENCEU!`,'ev');
}

// ===========================
//  UNIT DETAIL
// ===========================
function showDetail(u){
  const d=UDEFS[u.type];
  const hp=(u.hp/u.maxHp*100).toFixed(0);
  document.getElementById('unit-detail').innerHTML=`
    <h4>${d.ico} ${d.name}</h4>
    <p style="font-size:.58rem;color:#5a4a2a;margin-bottom:4px;">${d.desc}</p>
    <div class="stat-bar"><span class="stat-nm">❤ HP</span><div class="bar-bg"><div class="bar-fill" style="width:${hp}%;background:${hp>50?'#4CAF50':hp>25?'#FFC107':'#F44336'}"></div></div><span style="font-size:.6rem">${Math.ceil(u.hp)}</span></div>
    <div class="stat-bar"><span class="stat-nm">⚔ DMG</span><div class="bar-bg"><div class="bar-fill" style="width:${Math.min(100,u.dmg/100*100)}%;background:#FF6B6B"></div></div><span style="font-size:.6rem">${u.dmg}</span></div>
    <div class="stat-bar"><span class="stat-nm">🎯 Range</span><div class="bar-bg"><div class="bar-fill" style="width:${u.range/22*100}%;background:#2196F3"></div></div><span style="font-size:.6rem">${u.range}</span></div>
    <div class="stat-bar"><span class="stat-nm">💨 Speed</span><div class="bar-bg"><div class="bar-fill" style="width:${u.spd/1.2*100}%;background:#9C27B0"></div></div></div>
    <p style="margin-top:6px;font-size:.62rem;">🏆 Abates:<b style="color:var(--acc)"> ${u.kills}</b></p>
    <p style="font-size:.6rem;color:#5a4a2a">Estado: <b>${u.aiState}</b> ${u.inTrench?'🛡':''}  (${Math.floor(u.col)},${Math.floor(u.row)})</p>
    <p style="font-size:.6rem;color:${u.side==='allied'?'#4CAF50':'#F44336'}">${u.side==='allied'?cont1Name:cont2Name}</p>`;
}
function clearDetail(){ document.getElementById('unit-detail').innerHTML='<h4>— Selecione —</h4><p style="font-size:.6rem;color:#5a4a2a;margin-top:4px;">Clique em uma unidade.</p>'; }

// ===========================
//  LOG
// ===========================
const logEl=document.getElementById('log-box');
const logs=[];
function addLog(msg,type='ev'){
  logs.unshift({msg,type});
  if(logs.length>100) logs.pop();
  logEl.innerHTML=logs.map(e=>`<div class="le le-${e.type}">${e.msg}</div>`).join('');
}

// ===========================
//  SAVE / LOAD
// ===========================
function saveGame(){
  const data={
    grid:grid.map(r=>[...r]), landmask:landmask.map(r=>[...r]),
    units:units.map(u=>({...u,target:null})),
    alliedScore,enemyScore,gameTime,phase,battleStarted,warOver:false,
    COLS,ROWS,cont1Name,cont2Name,cont1Color,cont2Color,v:3
  };
  localStorage.setItem('trenchwar_v2',JSON.stringify(data));
  addLog('💾 Partida salva!','ev');
}

function loadGame(){
  const raw=localStorage.getItem('trenchwar_v2');
  if(!raw){ addLog('📂 Nenhuma partida salva.','ev'); return; }
  try{
    const d=JSON.parse(raw);
    COLS=d.COLS||64; ROWS=d.ROWS||64;
    cont1Name=d.cont1Name||'Aliança'; cont2Name=d.cont2Name||'Império';
    cont1Color=d.cont1Color||'#2E5F2E'; cont2Color=d.cont2Color||'#7A1C1C';
    grid=d.grid; landmask=d.landmask||[]; units=d.units;
    bullets=[];particles=[];effects=[];
    alliedScore=d.alliedScore||0; enemyScore=d.enemyScore||0;
    gameTime=d.gameTime||0; battleStarted=d.battleStarted||false; warOver=false;
    document.getElementById('allied-score').textContent=alliedScore;
    document.getElementById('enemy-score').textContent=enemyScore;
    updateContLabels();
    setPhase(d.phase||'build');
    showMain();
    addLog('📂 Partida carregada!','ev');
  }catch(e){ addLog('❌ Erro ao carregar.','ev'); }
}

function confirmNew(){
  const ok = window.confirm ? window.confirm('Nova guerra? A partida atual será perdida.') : true;
  if(ok) newWar();
}

function newWar(){
  initGrid(); resetUnits();
  alliedScore=0; enemyScore=0; gameTime=0; battleStarted=false; warOver=false;
  paused=false; lastTS=0;
  currentTool=null;
  selectedUnit=null;
  document.querySelectorAll('.unit-btn').forEach(b=>b.classList.remove('selected'));
  document.getElementById('allied-score').textContent=0;
  document.getElementById('enemy-score').textContent=0;
  document.getElementById('time-disp').textContent='0s';
  document.getElementById('modal').classList.remove('open');
  document.getElementById('btn-pause').textContent='⏸ PAUSAR';
  setPhase('build');
  centerView();
  clearDetail();
  activeSquad = null;
  document.querySelectorAll('.squad-card').forEach(c=>c.classList.remove('sq-selected'));
  buildSquadUI();
  updateSquadLabels();
  addLog('🔄 Nova guerra iniciada! Posicione suas tropas.','ev');
}

function centerView(){
  zoom=Math.min(canvas.width/(COLS*TILE), canvas.height/(ROWS*TILE))*0.92;
  ox=canvas.width/2-COLS*TILE*zoom/2;
  oy=canvas.height/2-ROWS*TILE*zoom/2;
}

function updateContLabels(){
  document.getElementById('cont1-label').textContent=cont1Name;
  document.getElementById('cont2-label').textContent=cont2Name;
  document.getElementById('p-allied-title').textContent='🟢 '+cont1Name;
  document.getElementById('p-enemy-title').textContent='🔴 '+cont2Name;
  if(typeof updateSquadLabels==='function') updateSquadLabels();
}

// ===========================
//  START
// ===========================
function showMain(){
  document.getElementById('screen-intro').style.display='none';
  document.getElementById('main').style.display='flex';
}

function startGame(){
  COLS=parseInt(document.getElementById('sz-range').value)||64;
  ROWS=COLS;
  cont1Name=document.getElementById('cont1-name').value||'Aliança do Norte';
  cont2Name=document.getElementById('cont2-name').value||'Império do Sul';
  cont1Color=document.getElementById('cont1-color').value||'#2E5F2E';
  cont2Color=document.getElementById('cont2-color').value||'#7A1C1C';

  // Preset map overrides names/size
  if(currentPreset==='normandy'){
    COLS=64; ROWS=64;
    cont1Name=cont1Name||'Aliados'; cont2Name=cont2Name||'Eixo';
  } else if(currentPreset==='stalingrad'){
    COLS=64; ROWS=64;
  } else if(currentPreset==='pacific'){
    COLS=64; ROWS=64;
  } else if(currentPreset==='milbase'){
    COLS=32; ROWS=32;
  }

  showMain();
  resizeCanvas();
  initGrid();
  resetUnits();
  centerView();
  updateContLabels();
  buildSquadUI();
  updateSquadLabels();

  const presetLabel = currentPreset==='normandy'?'🏖 Normandia':currentPreset==='stalingrad'?'🏙 Stalingrado':currentPreset==='pacific'?'🌊 Pacífico':'✏ Livre';
  addLog(`🗺 Mapa: ${presetLabel} — ${cont1Name} vs ${cont2Name} (${COLS}×${ROWS})`,'ev');
  addLog('🔨 Posicione tropas e construa trincheiras antes de iniciar a batalha.','ev');
  addLog('🖱 Clique direito + arrastar = mover câmera · Scroll = zoom','ev');

  requestAnimationFrame(gameLoop);
}

// ===========================
//  SQUAD SYSTEM
// ===========================

const SQUADS = {
  allied: [
    {
      id:'al-elite', name:'Esquadrão Elite', side:'allied',
      desc:'Sniper + 2 Soldados + Comandante',
      units:[
        {type:'commander', dc:0, dr:1},
        {type:'sniper',    dc:1, dr:0},
        {type:'soldier',   dc:1, dr:2},
        {type:'soldier',   dc:2, dr:1},
      ]
    },
    {
      id:'al-assault', name:'Esquadrão Assalto', side:'allied',
      desc:'Tanque + 3 Soldados + Médico',
      units:[
        {type:'tank',    dc:0, dr:1},
        {type:'soldier', dc:2, dr:0},
        {type:'soldier', dc:2, dr:1},
        {type:'soldier', dc:2, dr:2},
        {type:'medic',   dc:1, dr:2},
      ]
    },
    {
      id:'al-support', name:'Esquadrão Suporte', side:'allied',
      desc:'Artilheiro + 2 Metralhadoras + Escavador + Construtor',
      units:[
        {type:'artillery', dc:0, dr:1},
        {type:'machine',   dc:1, dr:0},
        {type:'machine',   dc:1, dr:2},
        {type:'digger',    dc:2, dr:1},
        {type:'builder',   dc:2, dr:0},
      ]
    },
  ],
  enemy: [
    {
      id:'en-elite', name:'Esquadrão Perdidos', side:'enemy',
      desc:'Sniper + 2 Soldados + Comandante',
      units:[
        {type:'commander', dc:0, dr:1},
        {type:'sniper',    dc:1, dr:0},
        {type:'soldier',   dc:1, dr:2},
        {type:'soldier',   dc:2, dr:1},
      ]
    },
    {
      id:'en-assault', name:'Brigada Sombria', side:'enemy',
      desc:'Tanque + 3 Soldados + Médico',
      units:[
        {type:'tank',    dc:0, dr:1},
        {type:'soldier', dc:2, dr:0},
        {type:'soldier', dc:2, dr:1},
        {type:'soldier', dc:2, dr:2},
        {type:'medic',   dc:1, dr:2},
      ]
    },
    {
      id:'en-support', name:'Artilharia Vermelha', side:'enemy',
      desc:'Artilheiro + 2 Metralhadoras + Médico + Construtor',
      units:[
        {type:'artillery', dc:0, dr:1},
        {type:'machine',   dc:1, dr:0},
        {type:'machine',   dc:1, dr:2},
        {type:'medic',     dc:2, dr:1},
        {type:'builder',   dc:2, dr:0},
      ]
    },
  ]
};

// ===========================
//  LARGE TROOPS (8-32 units)
// ===========================
const LARGE_TROOPS = [
  {
    id:'lt-allied-rush', name:'🟢 TROPA RELÂMPAGO', side:'allied',
    desc:'16 Fuzileiros em linha de choque',
    units: Array.from({length:16}, (_,i)=>({ type:'fuzileiro', dc:Math.floor(i/4), dr:i%4 }))
  },
  {
    id:'lt-allied-fortress', name:'🟢 FORTALEZA ALIADA', side:'allied',
    desc:'32 unidades — Exército completo de invasão',
    units: [
      // Front: 8 fuzileiros
      ...Array.from({length:8}, (_,i)=>({ type:'fuzileiro', dc:0, dr:i })),
      // Mid: 4 tanks + 4 machine
      ...Array.from({length:4}, (_,i)=>({ type:'tank',    dc:2, dr:i*2 })),
      ...Array.from({length:4}, (_,i)=>({ type:'machine', dc:3, dr:i*2+1 })),
      // Back: 4 snipers + 4 soldiers + 2 commanders + 2 medics + 2 artillery + 2 observers
      ...Array.from({length:4}, (_,i)=>({ type:'sniper',    dc:5, dr:i*2 })),
      ...Array.from({length:4}, (_,i)=>({ type:'soldier',   dc:5, dr:i*2+1 })),
      {type:'commander',dc:7,dr:1},{type:'commander',dc:7,dr:5},
      {type:'medic',    dc:7,dr:3},{type:'medic',    dc:7,dr:7},
      {type:'artillery',dc:8,dr:0},{type:'artillery',dc:8,dr:7},
      {type:'observer', dc:8,dr:3},{type:'observer', dc:8,dr:5},
    ]
  },
  {
    id:'lt-enemy-rush', name:'🔴 HORDA INIMIGA', side:'enemy',
    desc:'16 Soldados em carga total',
    units: Array.from({length:16}, (_,i)=>({ type:'soldier', dc:Math.floor(i/4), dr:i%4 }))
  },
  {
    id:'lt-enemy-fortress', name:'🔴 EXÉRCITO DO SUL', side:'enemy',
    desc:'32 unidades — Força de aniquilação total',
    units: [
      ...Array.from({length:8}, (_,i)=>({ type:'fuzileiro', dc:0, dr:i })),
      ...Array.from({length:4}, (_,i)=>({ type:'tank',    dc:2, dr:i*2 })),
      ...Array.from({length:4}, (_,i)=>({ type:'machine', dc:3, dr:i*2+1 })),
      ...Array.from({length:4}, (_,i)=>({ type:'sniper',    dc:5, dr:i*2 })),
      ...Array.from({length:4}, (_,i)=>({ type:'soldier',   dc:5, dr:i*2+1 })),
      {type:'commander',dc:7,dr:1},{type:'commander',dc:7,dr:5},
      {type:'medic',    dc:7,dr:3},{type:'medic',    dc:7,dr:7},
      {type:'artillery',dc:8,dr:0},{type:'artillery',dc:8,dr:7},
      {type:'observer', dc:8,dr:3},{type:'observer', dc:8,dr:5},
    ]
  },
  // ---- DUAL COMMANDER TROOPS ----
  {
    id:'lt-allied-dual', name:'🟢 BRIGADA DUPLO COMANDO', side:'allied',
    desc:'24 unidades — 2 Comandantes liderando frentes separadas',
    units: [
      // Comandante 1 — lidera frente norte (fila 0-3)
      {type:'commander', dc:0, dr:1},
      {type:'soldier',   dc:1, dr:0}, {type:'soldier',   dc:1, dr:1},
      {type:'soldier',   dc:1, dr:2}, {type:'machine',   dc:1, dr:3},
      {type:'sniper',    dc:2, dr:0}, {type:'medic',     dc:2, dr:3},
      {type:'tank',      dc:3, dr:1},
      // Separador
      // Comandante 2 — lidera frente sul (fila 5-8)
      {type:'commander', dc:0, dr:6},
      {type:'soldier',   dc:1, dr:5}, {type:'soldier',   dc:1, dr:6},
      {type:'soldier',   dc:1, dr:7}, {type:'machine',   dc:1, dr:8},
      {type:'sniper',    dc:2, dr:5}, {type:'medic',     dc:2, dr:8},
      {type:'tank',      dc:3, dr:6},
      // Retaguarda compartilhada
      {type:'artillery', dc:5, dr:1}, {type:'artillery', dc:5, dr:7},
      {type:'observer',  dc:5, dr:4},
      {type:'digger',    dc:4, dr:2}, {type:'digger',    dc:4, dr:6},
      {type:'builder',   dc:4, dr:4},
      {type:'jipe',      dc:6, dr:4},
      {type:'fuzileiro', dc:0, dr:4},
    ]
  },
  {
    id:'lt-enemy-dual', name:'🔴 DIVISÃO DUPLO COMANDO', side:'enemy',
    desc:'24 unidades — 2 Comandantes em pinça de ataque',
    units: [
      // Comandante 1 — pinça norte
      {type:'commander', dc:0, dr:1},
      {type:'soldier',   dc:1, dr:0}, {type:'soldier',   dc:1, dr:1},
      {type:'soldier',   dc:1, dr:2}, {type:'machine',   dc:1, dr:3},
      {type:'sniper',    dc:2, dr:0}, {type:'medic',     dc:2, dr:3},
      {type:'tank',      dc:3, dr:1},
      // Comandante 2 — pinça sul
      {type:'commander', dc:0, dr:6},
      {type:'soldier',   dc:1, dr:5}, {type:'soldier',   dc:1, dr:6},
      {type:'soldier',   dc:1, dr:7}, {type:'machine',   dc:1, dr:8},
      {type:'sniper',    dc:2, dr:5}, {type:'medic',     dc:2, dr:8},
      {type:'tank',      dc:3, dr:6},
      // Suporte pesado
      {type:'artillery', dc:5, dr:1}, {type:'artillery', dc:5, dr:7},
      {type:'observer',  dc:5, dr:4},
      {type:'digger',    dc:4, dr:2}, {type:'digger',    dc:4, dr:6},
      {type:'builder',   dc:4, dr:4},
      {type:'jipe',      dc:6, dr:4},
      {type:'fuzileiro', dc:0, dr:4},
    ]
  },
  // ---- NEW TROOPS ----
  {
    id:'lt-allied-blindada', name:'🟢 COLUNA BLINDADA', side:'allied',
    desc:'12 unidades — 4 Tanques com escolta de fuzileiros e jipe de comando',
    units:[
      // 4 tanques em coluna
      {type:'tank',      dc:0, dr:0},
      {type:'tank',      dc:0, dr:3},
      {type:'tank',      dc:0, dr:6},
      {type:'tank',      dc:0, dr:9},
      // Fuzileiros flanqueando cada tanque
      {type:'fuzileiro', dc:1, dr:1}, {type:'fuzileiro', dc:1, dr:2},
      {type:'fuzileiro', dc:1, dr:4}, {type:'fuzileiro', dc:1, dr:5},
      {type:'fuzileiro', dc:1, dr:7}, {type:'fuzileiro', dc:1, dr:8},
      // Jipe de comando + comandante na retaguarda
      {type:'jipe',      dc:3, dr:4},
      {type:'commander', dc:2, dr:5},
    ]
  },
  {
    id:'lt-enemy-blindada', name:'🔴 DIVISÃO ACORAZADA', side:'enemy',
    desc:'12 unidades — 4 Tanques com escolta e comandante',
    units:[
      {type:'tank',      dc:0, dr:0},
      {type:'tank',      dc:0, dr:3},
      {type:'tank',      dc:0, dr:6},
      {type:'tank',      dc:0, dr:9},
      {type:'fuzileiro', dc:1, dr:1}, {type:'fuzileiro', dc:1, dr:2},
      {type:'fuzileiro', dc:1, dr:4}, {type:'fuzileiro', dc:1, dr:5},
      {type:'fuzileiro', dc:1, dr:7}, {type:'fuzileiro', dc:1, dr:8},
      {type:'jipe',      dc:3, dr:4},
      {type:'commander', dc:2, dr:5},
    ]
  },
];

let activeSquad = null;
let squadBarOpen = true;

function toggleSquadBar(){
  squadBarOpen = !squadBarOpen;
  document.getElementById('squad-bar').classList.toggle('collapsed', !squadBarOpen);
  document.getElementById('squad-toggle').textContent = (squadBarOpen ? '▼' : '▲') + ' ESQUADRÕES';
}

function buildSquadUI(){
  ['allied','enemy'].forEach(side=>{
    const el = document.getElementById(`squads-${side}`);
    if(!el) return;
    el.innerHTML = '';
    // Regular squads
    SQUADS[side].forEach(sq=>{
      const card = document.createElement('div');
      card.className = `squad-card sq-${side}`;
      card.id = `sq-card-${sq.id}`;
      const icons = sq.units.map(u=>UDEFS[u.type]?.ico||'?').join(' ');
      card.innerHTML = `
        <div class="sq-name">${sq.name}</div>
        <div class="sq-units">${icons}</div>
        <div class="sq-units">${sq.desc}</div>
        <div class="sq-hint">Clique → seleciona · clique no mapa → posiciona</div>`;
      card.onclick = ()=>selectSquad(sq);
      el.appendChild(card);
    });
    // Large troops
    LARGE_TROOPS.filter(t=>t.side===side).forEach(sq=>{
      const card = document.createElement('div');
      card.className = `squad-card sq-${side}`;
      card.id = `sq-card-${sq.id}`;
      card.style.borderTop = '2px solid #C8A84B';
      card.innerHTML = `
        <div class="sq-name" style="color:#FFD700">${sq.name}</div>
        <div class="sq-units" style="color:#C8A84B">${sq.units.length} unidades</div>
        <div class="sq-units">${sq.desc}</div>
        <div class="sq-hint">⚠ TROPA GRANDE — precisa de espaço!</div>`;
      card.onclick = ()=>selectSquad(sq);
      el.appendChild(card);
    });
  });
}

function selectSquad(sq){
  document.querySelectorAll('.squad-card').forEach(c=>c.classList.remove('sq-selected'));
  document.querySelectorAll('.unit-btn').forEach(b=>b.classList.remove('selected'));
  if(activeSquad && activeSquad.id === sq.id){ activeSquad=null; currentTool=null; return; }
  activeSquad = sq;
  currentTool = null;
  document.getElementById(`sq-card-${sq.id}`)?.classList.add('sq-selected');
}

function getSquadBounds(sq){
  let maxDc=0, maxDr=0;
  sq.units.forEach(u=>{ maxDc=Math.max(maxDc,u.dc); maxDr=Math.max(maxDr,u.dr); });
  return {w:maxDc+1, h:maxDr+1};
}

function placeSquad(anchorCol, anchorRow){
  if(!activeSquad) return;
  const sq = activeSquad;
  let placed = 0;
  sq.units.forEach(u=>{
    const c=anchorCol+u.dc, r=anchorRow+u.dr;
    if(!valid(c,r)) return;
    if(grid[r][c]===T.WATER) return;
    if(unitAt(c,r)) return;
    const unit=mkUnit(sq.side,u.type,c,r);
    if(unit){ units.push(unit); placed++; }
  });
  if(placed>0){
    playPlace();
    addLog(`${sq.side==='allied'?'🟢':'🔴'} ${sq.name} posicionado — ${placed} unidades`,sq.side==='allied'?'al':'en');
  }
  activeSquad=null;
  document.querySelectorAll('.squad-card').forEach(c=>c.classList.remove('sq-selected'));
}

function drawSquadPreview(){
  if(!activeSquad) return;
  const {col,row}=c2g(mouseX,mouseY);
  if(!valid(col,row)) return;
  const sq=activeSquad;
  const ti=TILE*zoom;
  sq.units.forEach(u=>{
    const c=col+u.dc, r=row+u.dr;
    if(!valid(c,r)) return;
    const x=c*ti+ox, y=r*ti+oy;
    const def=UDEFS[u.type];
    const blocked=grid[r][c]===T.WATER||!!unitAt(c,r);
    C.fillStyle=blocked?'rgba(255,50,50,0.28)':'rgba(200,168,75,0.18)';
    C.fillRect(x,y,ti,ti);
    C.strokeStyle=blocked?'#F44336':(sq.side==='allied'?'#4CAF50':'#F44336');
    C.lineWidth=1.5;
    C.strokeRect(x,y,ti,ti);
    C.font=`${Math.max(8,ti*.52)}px serif`;
    C.textAlign='center'; C.textBaseline='middle';
    C.globalAlpha=0.8;
    C.fillStyle='#fff';
    C.fillText(def?.ico||'?',x+ti/2,y+ti/2);
    C.globalAlpha=1;
  });
  const {w,h}=getSquadBounds(sq);
  C.strokeStyle=sq.side==='allied'?'rgba(76,175,80,.8)':'rgba(244,67,54,.8)';
  C.lineWidth=2; C.setLineDash([4,3]);
  C.strokeRect(col*ti+ox,row*ti+oy,w*ti,h*ti);
  C.setLineDash([]);
  C.font=`bold ${Math.max(9,11*zoom)}px Oswald`;
  C.textAlign='left'; C.textBaseline='alphabetic';
  const lw=C.measureText(sq.name).width;
  C.fillStyle='rgba(12,9,4,.88)';
  C.fillRect(col*ti+ox,row*ti+oy-18*zoom,lw+10,16*zoom);
  C.fillStyle=sq.side==='allied'?'#4CAF50':'#F44336';
  C.fillText(sq.name,col*ti+ox+5,row*ti+oy-5*zoom);
}

function updateSquadLabels(){
  const e1=document.getElementById('sq-allied-title');
  const e2=document.getElementById('sq-enemy-title');
  if(e1) e1.textContent='🟢 '+cont1Name;
  if(e2) e2.textContent='🔴 '+cont2Name;
}

window.addEventListener('resize',()=>{resizeCanvas();});