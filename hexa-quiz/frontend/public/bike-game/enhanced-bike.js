/*
  HEXA Ride advanced gameplay layer.
  Keeps the original iframe contract and local Three.js runtime unchanged.
*/
(() => {
  const refs = {
    countdown: $("countdown"),
    countdownText: $("countdown")?.querySelector("span"),
    warning: $("dangerWarning"),
    warningText: $("dangerText"),
    vignette: $("rideVignette"),
    speedLines: $("speedLines"),
    digitalRain: $("digitalRain"),
    scanSweep: $("scanSweep"),
    laneFlash: $("laneFlash"),
    finishFlash: $("finishFlash"),
    powerupBanner: $("powerupBanner"),
    powerupIcon: $("powerupIcon"),
    powerupText: $("powerupText"),
    speedValue: $("hudSpeedValue"),
    speedFill: $("speedMeterFill"),
    energy: $("hudEnergy"),
    crashes: $("hudCrashes"),
    shield: $("hudShield"),
    score: $("hudScoreValue"),
    comboReadout: $("comboReadout"),
    combo: $("comboValue"),
    boostFill: $("boostMeterFill"),
    boostStatus: $("boostStatus")
  };

  const MODE_THEMES = {
    easy: {
      primary:0x55eaff, secondary:0x54ffbd, hot:0x2c91ff,
      fog:0x07162c, sky:0x020914, building:0x0c2340, road:0x07172c
    },
    medium: {
      primary:0xbe75ff, secondary:0x58eaff, hot:0xff55d5,
      fog:0x150925, sky:0x080512, building:0x24113d, road:0x170d2d
    },
    hard: {
      primary:0xff654f, secondary:0xffbf4e, hot:0xff315c,
      fog:0x21070a, sky:0x100304, building:0x351014, road:0x2a0b0d
    }
  };

  const POWERUP_INFO = {
    shield: { label:"AEGIS SHIELD", icon:"S", color:0x58efff, duration:8 },
    magnet: { label:"ENERGY MAGNET", icon:"M", color:0xff5cda, duration:8 },
    slowmo: { label:"TIME DILATION", icon:"T", color:0xa784ff, duration:6 },
    double: { label:"DOUBLE POINTS", icon:"2X", color:0xffd85b, duration:8 }
  };

  Object.assign(state, {
    boost:100,
    boostCooldown:0,
    shieldTime:0,
    magnetTime:0,
    slowmoTime:0,
    doubleTime:0,
    comboTime:0,
    maxCombo:1,
    countdownTime:0,
    rideStarted:false
  });

  const pools = {};
  const particlePool = [];
  const shared = {};
  let engineOsc = null;
  let engineGain = null;
  let warningBeepCooldown = 0;
  let bannerTimeout = 0;
  let comboHudValue = 1;
  let previousEnergy = 0;
  let previousCrashes = 0;
  let boostSparkTimer = 0;
  let finishTimer = 0;
  let resultAnimationFrame = 0;

  function geometry(key, factory){
    shared.geometries ||= {};
    shared.geometries[key] ||= factory();
    return shared.geometries[key];
  }

  function basicMaterial(key, settings){
    shared.basicMaterials ||= {};
    shared.basicMaterials[key] ||= new THREE.MeshBasicMaterial(settings);
    return shared.basicMaterials[key];
  }

  function material(color, emissive = color, intensity = .65, options = {}){
    const settings = {
      color,
      emissive,
      emissiveIntensity:intensity,
      roughness:options.roughness ?? .35,
      metalness:options.metalness ?? .42,
      transparent:Boolean(options.transparent),
      opacity:options.opacity ?? 1
    };
    if(options.side !== undefined) settings.side = options.side;
    return new THREE.MeshStandardMaterial(settings);
  }

  function addMesh(parent, geometry, mat, x, y, z){
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeThreat(kind){
    const group = new THREE.Group();
    group.visible = false;

    if(kind === "barrier" || kind === "movingBarrier"){
      const blockMat = material(kind === "movingBarrier" ? 0xff54d7 : 0xff526d, 0x7b0d32, .85);
      const stripeMat = material(0xffffff, 0x58efff, 1.1);
      addMesh(group, new THREE.BoxGeometry(2.7,1.1,.72), blockMat, 0,.62,0);
      for(let i=-1;i<=1;i++){
        const stripe = addMesh(group, new THREE.BoxGeometry(.18,1.16,.76), stripeMat, i*.76,.63,.01);
        stripe.rotation.z = .54;
      }
      if(kind === "movingBarrier"){
        const arrowMat = material(0xffe86b,0xff8a00,1.2);
        addMesh(group,new THREE.ConeGeometry(.23,.55,3),arrowMat,-.48,1.46,0).rotation.z = -Math.PI/2;
        addMesh(group,new THREE.ConeGeometry(.23,.55,3),arrowMat,.48,1.46,0).rotation.z = Math.PI/2;
      }
    }

    if(kind === "laser"){
      const postMat = material(0x18283f,0x294d70,.45);
      const laserMat = material(0xff496c,0xff1648,2.2,{ transparent:true, opacity:.82 });
      addMesh(group,new THREE.BoxGeometry(.2,2.6,.35),postMat,-1.25,1.3,0);
      addMesh(group,new THREE.BoxGeometry(.2,2.6,.35),postMat,1.25,1.3,0);
      const beam = addMesh(group,new THREE.BoxGeometry(2.35,.12,.18),laserMat,0,.82,0);
      beam.userData.laserBeam = true;
      group.userData.beam = beam;
    }

    if(kind === "oil"){
      const oilMat = material(0x0b0915,0x501c78,.68,{ transparent:true, opacity:.9 });
      const spill = addMesh(group,new THREE.CircleGeometry(1.35,18),oilMat,0,.035,0);
      spill.rotation.x = -Math.PI/2;
      for(let i=0;i<4;i++){
        const crack = addMesh(group,new THREE.BoxGeometry(.08,.035,.8 + i*.22),material(0x111020,0xff43d7,.8),0,.04,0);
        crack.rotation.y = i * 1.37;
        crack.position.x = (i-1.5)*.24;
      }
    }

    if(kind === "drone"){
      const dark = material(0x172239,0x122a51,.55);
      const hot = material(0xff5adb,0xff2cc8,1.7);
      addMesh(group,new THREE.OctahedronGeometry(.75,0),dark,0,1.25,0);
      [-1,1].forEach(x => {
        addMesh(group,new THREE.BoxGeometry(.72,.1,.12),dark,x*.72,1.28,0);
        addMesh(group,new THREE.TorusGeometry(.28,.06,8,18),hot,x*1.05,1.28,0).rotation.x = Math.PI/2;
      });
      addMesh(group,new THREE.SphereGeometry(.16,12,12),hot,0,1.25,-.66);
    }

    if(kind === "cyberBlock"){
      const shell = material(0x312665,0x8d6bff,1.05);
      const core = material(0x57e9ff,0x57e9ff,1.8);
      const cube = addMesh(group,new THREE.BoxGeometry(1.65,1.65,1.65),shell,0,.88,0);
      cube.rotation.set(.2,.35,.12);
      addMesh(group,new THREE.OctahedronGeometry(.58,0),core,0,.88,0);
    }

    Game3D.scene.add(group);
    return { kind, type:"hazard", mesh:group, active:false, lane:1, phase:Math.random()*10, rotSpeed:0 };
  }

  function makeRing(){
    const mat = material(0xffe465,0xffbd20,1.4);
    const coreMat = material(0x50ffad,0x20ff92,1.25);
    const group = new THREE.Group();
    const ring = addMesh(group,new THREE.TorusGeometry(.6,.16,12,28),mat,0,1.35,0);
    ring.rotation.x = Math.PI/2;
    addMesh(group,new THREE.OctahedronGeometry(.2,0),coreMat,0,1.35,0);
    group.visible = false;
    Game3D.scene.add(group);
    return { kind:"ring", type:"ring", mesh:group, active:false, baseY:0, phase:Math.random()*10, rotSpeed:4 };
  }

  function makePowerup(kind){
    const info = POWERUP_INFO[kind];
    const group = new THREE.Group();
    const shell = material(info.color,info.color,1.4,{ transparent:true, opacity:.85 });
    const core = material(0xffffff,info.color,1.8);
    addMesh(group,new THREE.IcosahedronGeometry(.7,1),shell,0,1.35,0);
    addMesh(group,new THREE.OctahedronGeometry(.31,0),core,0,1.35,0);
    group.visible = false;
    Game3D.scene.add(group);
    return { kind, type:"powerup", mesh:group, active:false, baseY:0, phase:Math.random()*10, rotSpeed:2.8 };
  }

  // Build repeated gameplay meshes before GO so the ride loop does not compile them mid-race.
  function prewarmPools(){
    if(shared.poolsWarmed) return;
    shared.poolsWarmed = true;
    const counts = {
      barrier:3, movingBarrier:3, laser:3, oil:3, drone:3, cyberBlock:3,
      ring:18, shield:2, magnet:2, slowmo:2, double:2
    };
    Object.entries(counts).forEach(([kind,count])=>{
      pools[kind] ||= [];
      for(let i=0;i<count;i++){
        const item = kind === "ring"
          ? makeRing()
          : POWERUP_INFO[kind]
            ? makePowerup(kind)
            : makeThreat(kind);
        pools[kind].push(item);
      }
    });
    const warmedParticles = [];
    for(let i=0;i<96;i++) warmedParticles.push(getParticle());
    warmedParticles.forEach(particle=>{
      particle.userData.active = false;
      particle.visible = false;
    });
  }

  function getPooled(kind){
    pools[kind] ||= [];
    let item = pools[kind].find(entry => !entry.active);
    if(!item){
      item = kind === "ring"
        ? makeRing()
        : POWERUP_INFO[kind]
          ? makePowerup(kind)
          : makeThreat(kind);
      pools[kind].push(item);
    }
    item.active = true;
    item.mesh.visible = true;
    item.mesh.scale.setScalar(1);
    item.mesh.rotation.set(0,0,0);
    item.rotSpeed = kind === "ring" ? 4 + Math.random()*2 : (Math.random()-.5)*.7;
    item.phase = Math.random()*Math.PI*2;
    Game3D.objects.push(item);
    return item;
  }

  function deactivate(item){
    item.active = false;
    item.mesh.visible = false;
  }

  function spawn(kind, lane = Math.floor(Math.random()*3), z = -110 - Math.random()*38){
    const item = getPooled(kind);
    item.lane = lane;
    item.baseX = Game3D.lanes[lane];
    item.mesh.position.set(item.baseX,0,z);
    return item;
  }

  function getParticle(){
    let particle = particlePool.find(p => !p.userData.active);
    if(!particle && particlePool.length >= 220){
      particle = particlePool.reduce((oldest,current)=>
        current.userData.life < oldest.userData.life ? current : oldest
      );
    }
    if(!particle){
      const geo = shared.particleGeo ||= new THREE.SphereGeometry(.08,6,6);
      const mat = new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0 });
      particle = new THREE.Mesh(geo,mat);
      particle.visible = false;
      particle.userData.active = false;
      particle.userData.vel = new THREE.Vector3();
      particlePool.push(particle);
      Game3D.scene.add(particle);
    }
    particle.userData.active = true;
    particle.visible = true;
    return particle;
  }

  function pooledSpark(position, color, count = 18, force = 7){
    for(let i=0;i<count;i++){
      const p = getParticle();
      p.material.color.setHex(color);
      p.material.opacity = .95;
      p.position.copy(position);
      p.scale.setScalar(.75 + Math.random()*1.4);
      p.userData.life = .42 + Math.random()*.4;
      p.userData.maxLife = p.userData.life;
      p.userData.vel.set((Math.random()-.5)*force,Math.random()*force*.62,(Math.random()-.5)*force);
    }
  }

  function pooledBoostSparks(dt){
    if(!Game3D.wasBoosting || !state.rideStarted) return;
    boostSparkTimer -= dt;
    if(boostSparkTimer > 0) return;
    boostSparkTimer = .045;
    const position = shared.effectPosition ||= new THREE.Vector3();
    position.set(Game3D.bike.position.x,1,Game3D.bike.position.z+1.8);
    for(let i=0;i<3;i++){
      const p = getParticle();
      p.material.color.setHex(i === 2 ? MODE_THEMES[state.selectedMode].hot : MODE_THEMES[state.selectedMode].primary);
      p.material.opacity = .9;
      p.position.copy(position);
      p.position.x += (Math.random()-.5)*.7;
      p.scale.setScalar(.45+Math.random()*.7);
      p.userData.life = .25+Math.random()*.2;
      p.userData.maxLife = p.userData.life;
      p.userData.vel.set((Math.random()-.5)*1.5,Math.random()*.9,6+Math.random()*5);
    }
  }

  function updateParticles(dt){
    for(const p of particlePool){
      if(!p.userData.active) continue;
      p.userData.life -= dt;
      p.position.addScaledVector(p.userData.vel,dt);
      p.userData.vel.y -= dt*2.4;
      p.material.opacity = Math.max(0,p.userData.life/p.userData.maxLife);
      if(p.userData.life <= 0){
        p.userData.active = false;
        p.visible = false;
      }
    }
  }

  function flashHudStat(element, extraClass = ""){
    const card = element?.parentElement;
    if(!card) return;
    card.classList.remove("bump","energy-burst");
    void card.offsetWidth;
    card.classList.add("bump");
    if(extraClass) card.classList.add(extraClass);
    clearTimeout(card._visualTimer);
    card._visualTimer = setTimeout(()=>card.classList.remove("bump","energy-burst"),420);
  }

  function playSfx(name){
    if(name === "boost"){
      tone(130,.18,"sawtooth",.08);
      setTimeout(()=>tone(420,.2,"triangle",.07),70);
    }else if(name === "crash"){
      tone(75,.3,"sawtooth",.15);
      tone(125,.16,"square",.08);
    }else if(name === "collect"){
      tone(690 + state.combo*28,.07,"triangle",.1);
      setTimeout(()=>tone(980 + state.combo*20,.08,"sine",.07),45);
    }else if(name === "powerup"){
      [420,620,840].forEach((f,i)=>setTimeout(()=>tone(f,.12,"triangle",.08),i*70));
    }else if(name === "shield"){
      tone(210,.16,"sine",.09);
      setTimeout(()=>tone(520,.2,"triangle",.07),50);
    }else if(name === "warning"){
      tone(940,.055,"square",.045);
    }else if(name === "complete"){
      [520,690,880,1170].forEach((f,i)=>setTimeout(()=>tone(f,.16,"triangle",.08),i*90));
    }
  }

  function ensureEngineAudio(){
    if(!state.audioReady || state.muted || engineOsc) return;
    engineOsc = audioCtx.createOscillator();
    engineGain = audioCtx.createGain();
    engineOsc.type = "sawtooth";
    engineOsc.frequency.value = 55;
    engineGain.gain.value = 0;
    engineOsc.connect(engineGain);
    engineGain.connect(masterGain);
    engineOsc.start();
  }

  function updateEngineAudio(){
    if(!engineOsc || !engineGain || !audioCtx) return;
    const active = state.phase === "bike" && !state.paused && state.rideStarted && !state.muted;
    engineOsc.frequency.setTargetAtTime(48 + Game3D.speed*2.2,audioCtx.currentTime,.05);
    engineGain.gain.setTargetAtTime(active ? .018 + Game3D.speed*.00022 : 0,audioCtx.currentTime,.08);
  }

  function showPowerup(kind){
    const info = POWERUP_INFO[kind];
    refs.powerupIcon.textContent = info.icon;
    refs.powerupText.textContent = info.label;
    refs.powerupBanner.classList.add("active");
    clearTimeout(bannerTimeout);
    bannerTimeout = setTimeout(()=>refs.powerupBanner.classList.remove("active"),1600);
  }

  function triggerPowerup(kind){
    const info = POWERUP_INFO[kind];
    state[`${kind}Time`] = info.duration;
    state.stageStats.powerups = (state.stageStats.powerups || 0) + 1;
    showPowerup(kind);
    pooledSpark(Game3D.bike.position,info.color,26,8);
    playSfx("powerup");
    toast(`${info.label} active`);
  }

  function triggerCrash(item){
    if(state.shieldTime > 0){
      state.shieldTime = 0;
      state.stageStats.shieldBlocks = (state.stageStats.shieldBlocks || 0) + 1;
      pooledSpark(item.mesh.position,0x58efff,30,9);
      playSfx("shield");
      toast("Shield absorbed the impact");
      return;
    }
    const loss = Math.min(state.score,90 + state.currentLevel*18);
    state.score -= loss;
    state.stageStats.crashes++;
    state.combo = 1;
    state.comboTime = 0;
    Game3D.speed *= item.kind === "oil" ? .74 : .52;
    Game3D.crashShake = .72;
    Game3D.invulnerableTime = 1.05;
    document.body.classList.add("crashing");
    refs.vignette.classList.add("crash");
    setTimeout(()=>{
      document.body.classList.remove("crashing");
      refs.vignette.classList.remove("crash");
    },430);
    pooledSpark(item.mesh.position,item.kind === "oil" ? 0xff55dd : 0xff4f70,32,10);
    playSfx("crash");
    toast(`${item.kind === "oil" ? "Road spill" : "Impact"}: -${loss} points`);
  }

  function collectRing(item){
    const multiplier = state.doubleTime > 0 ? 2 : 1;
    const points = (45 + state.currentLevel*9) * state.combo * multiplier;
    state.score += points;
    state.stageStats.score += points;
    state.stageStats.collected++;
    state.combo = Math.min(12,state.combo+1);
    state.maxCombo = Math.max(state.maxCombo,state.combo);
    state.comboTime = 3.4;
    pooledSpark(item.mesh.position,0x54ffad,18,7);
    playSfx("collect");
    toast(`+${points} energy ${multiplier > 1 ? "x2" : ""}`);
  }

  function updatePowerTimers(dt){
    ["shield","magnet","slowmo","double"].forEach(kind => {
      state[`${kind}Time`] = Math.max(0,state[`${kind}Time`] - dt);
    });
    if(state.combo > 1){
      state.comboTime -= dt;
      if(state.comboTime <= 0){
        state.combo = Math.max(1,state.combo-1);
        state.comboTime = state.combo > 1 ? 1.1 : 0;
      }
    }
  }

  function updateCountdown(dt){
    if(state.rideStarted) return false;
    state.countdownTime -= dt;
    const value = state.countdownTime > .35 ? Math.ceil(state.countdownTime) : "GO";
    if(refs.countdownText.textContent !== String(value)){
      refs.countdownText.textContent = value;
      refs.countdownText.style.animation = "none";
      void refs.countdownText.offsetWidth;
      refs.countdownText.style.animation = "";
      tone(value === "GO" ? 880 : 440,.1,"triangle",.055);
    }
    if(state.countdownTime <= 0){
      state.rideStarted = true;
      refs.countdown.classList.remove("active");
      toast("Ride live. Build the sync combo.");
    }
    return true;
  }

  function warnForThreats(dt){
    warningBeepCooldown = Math.max(0,warningBeepCooldown-dt);
    const threat = Game3D.objects.find(item =>
      item.active &&
      item.type === "hazard" &&
      item.mesh.position.z > -40 &&
      item.mesh.position.z < -8 &&
      Math.abs(item.mesh.position.x-Game3D.laneX) < 1.9
    );
    refs.warning.classList.toggle("active",Boolean(threat));
    if(threat){
      const labels = {
        barrier:"STATIC BARRIER",
        movingBarrier:"MOVING BARRIER",
        laser:"LASER GATE",
        oil:"ROAD FRACTURE",
        drone:"TRAFFIC DRONE",
        cyberBlock:"CYBER BLOCK"
      };
      refs.warningText.textContent = `${labels[threat.kind]} AHEAD`;
      if(warningBeepCooldown <= 0){
        playSfx("warning");
        warningBeepCooldown = .58;
      }
    }
  }

  function spawnHazard(){
    const level = state.currentLevel;
    const modeIndex = ["easy","medium","hard"].indexOf(state.selectedMode);
    const choices = ["barrier","oil","cyberBlock"];
    if(level >= 2 || modeIndex >= 1) choices.push("movingBarrier");
    if(level >= 3 || modeIndex >= 1) choices.push("laser");
    if(level >= 4 || modeIndex >= 2) choices.push("drone");
    const kind = choices[Math.floor(Math.random()*choices.length)];
    return spawn(kind);
  }

  function spawnRingSequence(){
    const lane = Math.floor(Math.random()*3);
    const count = 1 + (Math.random() < .48 ? 2 : 0);
    for(let i=0;i<count;i++) spawn("ring",lane,-80-i*7-Math.random()*20);
  }

  function spawnRandomPowerup(){
    const kinds = Object.keys(POWERUP_INFO);
    spawn(kinds[Math.floor(Math.random()*kinds.length)],Math.floor(Math.random()*3),-105-Math.random()*20);
  }

  function updateObject(item,dt,dz,time){
    item.mesh.position.z += dz;
    item.mesh.rotation.y += dt*item.rotSpeed;

    if(item.kind === "movingBarrier"){
      item.mesh.position.x = item.baseX + Math.sin(time*2.5 + item.phase)*2.15;
    }else if(item.kind === "drone"){
      item.mesh.position.y = .2 + Math.sin(time*4 + item.phase)*.46;
      item.mesh.rotation.z = Math.sin(time*3 + item.phase)*.18;
    }else if(item.kind === "laser"){
      const on = Math.sin(time*4.5 + item.phase) > -.25;
      item.mesh.userData.beam.visible = on;
      item.laserOn = on;
    }else if(item.kind === "cyberBlock"){
      item.mesh.rotation.x += dt*1.3;
      item.mesh.rotation.z += dt*.8;
      item.mesh.position.y = .18 + Math.sin(time*3 + item.phase)*.28;
    }else if(item.type === "ring" || item.type === "powerup"){
      item.mesh.position.y = .12 + Math.sin(time*5 + item.phase)*.22;
      if(item.type === "ring" && state.magnetTime > 0 && item.mesh.position.z > -35){
        item.mesh.position.x += (Game3D.laneX-item.mesh.position.x)*Math.min(1,dt*8);
      }
    }
  }

  function collides(item){
    if(item.kind === "laser" && !item.laserOn) return false;
    const zDistance = Math.abs(item.mesh.position.z-Game3D.bike.position.z);
    const xDistance = Math.abs(item.mesh.position.x-Game3D.laneX);
    const xLimit = item.kind === "oil" ? 1.3 : item.type === "powerup" || item.type === "ring" ? 1.25 : 1.5;
    return zDistance < (item.kind === "oil" ? 1.55 : 2.05) && xDistance < xLimit;
  }

  function animateBike(dt,time,boosting,braking){
    const bike = Game3D.bike;
    const targetX = Game3D.lanes[Game3D.targetLane];
    const leanTarget = THREE.MathUtils.clamp((targetX-Game3D.laneX)*-.11,-.38,.38);
    bike.rotation.z += (leanTarget-bike.rotation.z)*Math.min(1,dt*11);
    bike.rotation.x += (((braking ? -.07 : boosting ? .055 : 0))-bike.rotation.x)*Math.min(1,dt*6);
    bike.position.y = Math.sin(time*10)*.018 + Math.min(.06,Game3D.speed*.0007);

    const wheelRot = Game3D.speed*dt*1.45;
    bike.userData.wheelF.rotation.x -= wheelRot;
    bike.userData.wheelB.rotation.x -= wheelRot;
    bike.userData.riderTorso.rotation.z = bike.rotation.z*-.65;
    bike.userData.riderTorso.rotation.x = .25 + Math.sin(time*8)*.018 + (boosting ? .12 : 0);
    bike.userData.riderHelmet.position.y = 2.75 + Math.sin(time*8)*.018;
    bike.userData.riderHelmet.material.emissiveIntensity = .95+Math.sin(time*7)*.35+(boosting ? .7 : 0);
    bike.userData.flames.forEach((flame,i)=>{
      flame.visible = boosting;
      flame.scale.z = boosting ? .8 + Math.sin(time*35+i)*.24 + Game3D.speed*.008 : .1;
      flame.material.opacity = boosting ? .82 : 0;
    });
    bike.userData.trails.forEach((trail,i)=>{
      trail.visible = Game3D.speed > 32;
      trail.material.opacity = THREE.MathUtils.clamp((Game3D.speed-30)/100,.08,.48);
      trail.scale.z = 1 + Game3D.speed*.018 + (boosting ? 1.8 : 0);
      trail.position.z = 1.35 + trail.scale.z*.8;
      trail.position.x = i === 0 ? -.42 : .42;
    });
    bike.userData.shield.visible = state.shieldTime > 0;
    bike.userData.shield.rotation.y += dt*.8;
    if(state.shieldTime > 0){
      const shieldPulse = 1+Math.sin(time*8)*.035;
      bike.userData.shield.scale.setScalar(shieldPulse);
      bike.userData.shield.material.opacity = .15+Math.sin(time*9)*.055;
    }
    bike.userData.boostAura.visible = boosting;
    bike.userData.boostAura.material.opacity = boosting ? .35+Math.sin(time*18)*.16 : 0;
    bike.userData.boostAura.scale.setScalar(1+Math.sin(time*14)*.09);
    bike.userData.boostAura.rotation.z += dt*4;
    bike.userData.exhaustCore.rotation.z += dt*(boosting ? 9 : 3);
    bike.userData.exhaustCore.material.emissiveIntensity = boosting ? 2.4 : 1.1;
  }

  function updateCamera(dt,time,boosting){
    if(!state.rideStarted){
      const progress = THREE.MathUtils.clamp((3-state.countdownTime)/3,0,1);
      const orbit = (1-progress)*1.2;
      const targetX = Math.sin(progress*Math.PI*1.25)*5.6*orbit;
      const targetY = 3.8+progress*3.4+Math.sin(progress*Math.PI)*1.4;
      const targetZ = 7.2+progress*5.2;
      Game3D.camera.position.x += (targetX-Game3D.camera.position.x)*Math.min(1,dt*3.4);
      Game3D.camera.position.y += (targetY-Game3D.camera.position.y)*Math.min(1,dt*3.4);
      Game3D.camera.position.z += (targetZ-Game3D.camera.position.z)*Math.min(1,dt*3.4);
      Game3D.camera.fov += (58-Game3D.camera.fov)*Math.min(1,dt*4);
      Game3D.camera.updateProjectionMatrix();
      Game3D.camera.lookAt(Game3D.bike.position.x,1.35,-4-progress*9);
      Game3D.camera.rotation.z += ((Math.sin(progress*Math.PI)*-.035)-Game3D.camera.rotation.z)*Math.min(1,dt*5);
      return;
    }
    const shake = Game3D.crashShake + Math.max(0,(Game3D.speed-70)*.0025);
    Game3D.crashShake = Math.max(0,Game3D.crashShake-dt*2.1);
    const shakeX = (Math.random()-.5)*shake;
    const shakeY = (Math.random()-.5)*shake*.55;
    const targetY = boosting ? 7.45 : 7.2;
    const targetZ = boosting ? 13.35 : 12.45;
    Game3D.camera.position.x += (Game3D.bike.position.x*.43 + shakeX-Game3D.camera.position.x)*Math.min(1,dt*4);
    Game3D.camera.position.y += (targetY + shakeY-Game3D.camera.position.y)*Math.min(1,dt*3.5);
    Game3D.camera.position.z += (targetZ-Game3D.camera.position.z)*Math.min(1,dt*3);
    const targetFov = boosting ? 72 : 62;
    Game3D.camera.fov += (targetFov-Game3D.camera.fov)*Math.min(1,dt*4);
    Game3D.camera.updateProjectionMatrix();
    Game3D.camera.lookAt(Game3D.bike.position.x*.2,1.85,-13-(boosting ? 4 : 0));
    const cameraTilt = THREE.MathUtils.clamp(Game3D.bike.rotation.z*.12,-.045,.045);
    Game3D.camera.rotation.z += (cameraTilt-Game3D.camera.rotation.z)*Math.min(1,dt*5.5);
    refs.speedLines.classList.toggle("active",boosting || Game3D.speed > 72);
    refs.vignette.classList.toggle("active",state.phase === "bike");
  }

  function updateVisualWorld(dt,dz,time){
    if(Game3D.cyberAtmosphere){
      const attribute = Game3D.cyberAtmosphere.geometry.attributes.position;
      const positions = attribute.array;
      for(let i=0;i<positions.length;i+=3){
        positions[i+2] += dz*.42;
        positions[i+1] += Math.sin(time*1.7+i)*dt*.08;
        if(positions[i+2] > 22) positions[i+2] = -360-Math.random()*30;
      }
      attribute.needsUpdate = true;
      Game3D.cyberAtmosphere.rotation.y = Math.sin(time*.12)*.035;
    }
    Game3D.cyberLights?.forEach((light,index)=>{
      light.position.x = light.userData.baseX+Math.sin(time*.72+light.userData.phase)*5;
      light.position.z = -18-index*24+Math.sin(time*.5+index)*12;
      light.intensity = 4.8+Math.sin(time*2.1+index)*1.4;
    });
    Game3D.lanePulseMeshes?.forEach(pulse=>{
      pulse.userData.lanePulse = Math.max(0,pulse.userData.lanePulse-dt*2.8);
      pulse.material.opacity = pulse.userData.lanePulse*.55;
      pulse.scale.z = 16+pulse.userData.lanePulse*24;
    });
    if(Game3D.cyberReflection){
      Game3D.cyberReflection.material.opacity = .07+Math.sin(time*1.6)*.025+(Game3D.wasBoosting ? .08 : 0);
    }
  }

  const originalBuildWorld = Game3D.buildWorld.bind(Game3D);
  Game3D.buildWorld = function(){
    originalBuildWorld();
    this.createCyberWorld();
  };

  const originalCreateBike = Game3D.createBike.bind(Game3D);
  Game3D.createBike = function(){
    originalCreateBike();
    const bike = this.bike;
    const cyan = material(0x57e9ff,0x57e9ff,1.6);
    const pink = material(0xff55db,0xff2fc8,1.4);
    const dark = material(0x11182a,0x183253,.45);
    const flameMat = material(0xffe46b,0xff6d18,2,{ transparent:true, opacity:0 });
    const shieldMat = material(0x58efff,0x58efff,1.2,{ transparent:true, opacity:.18, side:THREE.DoubleSide });
    const auraMat = new THREE.MeshBasicMaterial({ color:0x57e9ff, transparent:true, opacity:0, blending:THREE.AdditiveBlending, depthWrite:false });

    const nose = addMesh(bike,new THREE.ConeGeometry(.54,1.4,6),cyan,0,1.25,-1.95);
    nose.rotation.x = -Math.PI/2;
    addMesh(bike,new THREE.BoxGeometry(1.45,.14,1.5),dark,0,1.08,-.2);
    addMesh(bike,new THREE.BoxGeometry(.14,.14,2.55),cyan,-.56,1.12,.05);
    addMesh(bike,new THREE.BoxGeometry(.14,.14,2.55),pink,.56,1.12,.05);
    const sideWingL = addMesh(bike,new THREE.BoxGeometry(.48,.16,1.65),dark,-.72,1.05,.15);
    sideWingL.rotation.z = -.17;
    const sideWingR = addMesh(bike,new THREE.BoxGeometry(.48,.16,1.65),dark,.72,1.05,.15);
    sideWingR.rotation.z = .17;
    const headlight = addMesh(bike,new THREE.SphereGeometry(.18,12,10),cyan,0,1.3,-2.42);
    headlight.castShadow = false;
    const rimF = addMesh(bike,new THREE.TorusGeometry(.48,.035,8,28),cyan,0,.55,-1.05);
    rimF.rotation.y = Math.PI/2;
    const rimB = addMesh(bike,new THREE.TorusGeometry(.48,.035,8,28),pink,0,.55,1.05);
    rimB.rotation.y = Math.PI/2;

    const armGeo = new THREE.BoxGeometry(.13,.72,.13);
    const leftArm = addMesh(bike,armGeo,dark,-.37,2.02,-.62);
    leftArm.rotation.x = .86;
    const rightArm = addMesh(bike,armGeo,dark,.37,2.02,-.62);
    rightArm.rotation.x = .86;

    const flames = [-.32,.32].map(x => {
      const flame = addMesh(bike,new THREE.ConeGeometry(.15,.9,9),flameMat.clone(),x,.92,1.63);
      flame.rotation.x = Math.PI/2;
      flame.visible = false;
      return flame;
    });
    const trails = [-.42,.42].map(x => {
      const trailMat = new THREE.MeshBasicMaterial({ color:x < 0 ? 0x57e9ff : 0xff55db, transparent:true, opacity:0, blending:THREE.AdditiveBlending });
      const trail = addMesh(bike,new THREE.BoxGeometry(.08,.035,1.6),trailMat,x,.55,2);
      trail.visible = false;
      return trail;
    });
    const shield = addMesh(bike,new THREE.SphereGeometry(2.15,20,14),shieldMat,0,1.45,0);
    shield.castShadow = false;
    shield.visible = false;
    const boostAura = addMesh(bike,new THREE.TorusGeometry(1.42,.055,10,34),auraMat,0,1.32,.2);
    boostAura.rotation.x = Math.PI/2;
    boostAura.visible = false;
    const exhaustCore = addMesh(bike,new THREE.TorusGeometry(.32,.055,8,18),pink,0,.94,1.55);
    exhaustCore.rotation.x = Math.PI/2;

    bike.userData.riderTorso = bike.children.find(child => child.geometry?.type === "CapsuleGeometry");
    bike.userData.riderHelmet = bike.children.find(child => child.geometry?.type === "SphereGeometry" && child !== shield);
    bike.userData.flames = flames;
    bike.userData.trails = trails;
    bike.userData.shield = shield;
    bike.userData.boostAura = boostAura;
    bike.userData.exhaustCore = exhaustCore;
    bike.userData.headlight = headlight;
  };

  // Premium city system: shared geometry, mode-colored materials, and parallax layers.
  Game3D.createCyberWorld = function(){
    const theme = MODE_THEMES[state.selectedMode];
    const unitBox = geometry("unitBox",()=>new THREE.BoxGeometry(1,1,1));
    const unitPlane = geometry("unitPlane",()=>new THREE.PlaneGeometry(1,1));
    const thinBox = geometry("thinBox",()=>new THREE.BoxGeometry(1,.06,.06));
    const towerGeo = geometry("serverTower",()=>new THREE.CylinderGeometry(.6,.82,1,8));
    const antennaGeo = geometry("antenna",()=>new THREE.ConeGeometry(.16,.65,6));

    const mats = this.cyberMaterials = {
      grid:material(theme.primary,theme.primary,.9,{ transparent:true, opacity:.74 }),
      accent:material(theme.hot,theme.hot,1.25,{ transparent:true, opacity:.82 }),
      secondary:material(theme.secondary,theme.secondary,1.1,{ transparent:true, opacity:.78 }),
      building:material(theme.building,theme.primary,.16),
      buildingFar:material(theme.sky,theme.secondary,.1),
      window:material(0xffffff,theme.primary,1.55,{ transparent:true, opacity:.78 }),
      windowHot:material(0xffffff,theme.hot,1.65,{ transparent:true, opacity:.82 }),
      dark:material(0x050913,theme.primary,.16),
      hologram:material(theme.primary,theme.primary,1.5,{ transparent:true, opacity:.26, side:THREE.DoubleSide }),
      firewall:material(theme.hot,theme.hot,1.65,{ transparent:true, opacity:.48 }),
      glow:basicMaterial(`glow-${state.selectedMode}`,{ color:theme.primary, transparent:true, opacity:.2, blending:THREE.AdditiveBlending, side:THREE.DoubleSide })
    };
    this.cyberAnimated = [];
    this.cyberLights = [];
    this.lanePulseMeshes = [];

    // Hide the old distant neighborhood silhouettes while retaining the road and curbs.
    this.scenery.forEach(item => {
      if(item.userData.house || item.userData.walker || Math.abs(item.position.x) > 10.6) item.visible = false;
    });

    // Animated circuit road: cross-grid, lane traces, and a subtle reflective glow plane.
    const reflection = new THREE.Mesh(unitPlane,mats.hologram);
    reflection.scale.set(16,600,1);
    reflection.rotation.x = -Math.PI/2;
    reflection.position.set(0,.012,-160);
    reflection.material.opacity = .1;
    this.scene.add(reflection);
    this.cyberReflection = reflection;

    for(let z=12;z>-350;z-=8){
      const line = new THREE.Mesh(thinBox,z%32===0 ? mats.accent : mats.grid);
      line.scale.set(34,1,1);
      line.position.set(0,.025,z);
      line.userData.wrapDistance = 364;
      line.userData.circuitLine = true;
      line.userData.pulsePhase = z*.07;
      this.scene.add(line);
      this.scenery.push(line);
      this.cyberAnimated.push(line);
    }
    [-6.4,-4.2,-2.1,0,2.1,4.2,6.4].forEach((x,index)=>{
      const trace = new THREE.Mesh(unitBox,index%2 ? mats.grid : mats.secondary);
      trace.scale.set(.045,.025,680);
      trace.position.set(x,.026,-160);
      trace.userData.roadTrace = true;
      trace.userData.pulsePhase = index*.75;
      this.scene.add(trace);
      this.cyberAnimated.push(trace);
    });

    // Lane-change pulse strips live on the road and are reused for every input.
    this.lanes.forEach((x,index)=>{
      const pulse = new THREE.Mesh(unitBox,mats.secondary.clone());
      pulse.material.transparent = true;
      pulse.material.opacity = 0;
      pulse.scale.set(3.5,.03,16);
      pulse.position.set(x,.055,1);
      pulse.userData.lanePulse = 0;
      pulse.userData.laneIndex = index;
      this.scene.add(pulse);
      this.lanePulseMeshes.push(pulse);
    });

    // Three parallax city layers make the world feel much larger than the road.
    const buildLayer = (count,depth,parallax) => {
      for(let i=0;i<count;i++){
        const side = i%2 ? -1 : 1;
        const group = new THREE.Group();
        const width = depth === "far" ? 5+Math.random()*6 : 3.4+Math.random()*4;
        const height = depth === "far" ? 11+Math.random()*24 : 7+Math.random()*17;
        const body = new THREE.Mesh(unitBox,depth === "far" ? mats.buildingFar : mats.building);
        body.scale.set(width,height,width*.72);
        body.position.y = height/2;
        body.castShadow = depth !== "far";
        group.add(body);

        const windowMat = i%3 === 0 ? mats.windowHot : mats.window;
        for(let row=0;row<4;row++){
          const strip = new THREE.Mesh(unitBox,windowMat);
          strip.scale.set(width*.68,.08,.04);
          strip.position.set(0,1.8+row*(height-3)/4,-width*.365-.03);
          group.add(strip);
        }
        const crown = new THREE.Mesh(unitBox,i%2 ? mats.grid : mats.accent);
        crown.scale.set(width*.72,.12,width*.72);
        crown.position.y = height+.12;
        group.add(crown);
        const antenna = new THREE.Mesh(antennaGeo,i%2 ? mats.secondary : mats.accent);
        antenna.position.y = height+.48;
        group.add(antenna);

        const xBase = depth === "far" ? 34+Math.random()*25 : 15+Math.random()*12;
        group.position.set(side*xBase,0,-15-i*(depth === "far" ? 15 : 19));
        group.userData.wrapDistance = depth === "far" ? 390 : 410;
        group.userData.parallax = parallax;
        group.userData.cyberBuilding = true;
        group.userData.pulsePhase = i*.63;
        this.scene.add(group);
        this.scenery.push(group);
        this.cyberAnimated.push(group);
      }
    };
    buildLayer(34,"far",.24);
    buildLayer(24,"near",.62);

    // Repeating infrastructure: energy tunnels, data bridges, servers, firewall walls, billboards.
    for(let i=0;i<10;i++){
      const tunnel = new THREE.Group();
      const tunnelMat = i%2 ? mats.grid : mats.accent;
      [-8.15,8.15].forEach(x=>{
        const post = new THREE.Mesh(unitBox,tunnelMat);
        post.scale.set(.14,6.2,.14);
        post.position.set(x,3.1,0);
        tunnel.add(post);
      });
      const roof = new THREE.Mesh(unitBox,tunnelMat);
      roof.scale.set(16.4,.14,.14);
      roof.position.y = 6.2;
      tunnel.add(roof);
      for(let beam=-6;beam<=6;beam+=3){
        const rib = new THREE.Mesh(unitBox,mats.hologram);
        rib.scale.set(.045,6,.08);
        rib.position.set(beam,3.1,0);
        tunnel.add(rib);
      }
      tunnel.position.z = -42-i*42;
      tunnel.userData.wrapDistance = 420;
      tunnel.userData.cyberTunnel = true;
      tunnel.userData.pulsePhase = i*.7;
      this.scene.add(tunnel);
      this.scenery.push(tunnel);
      this.cyberAnimated.push(tunnel);
    }

    for(let i=0;i<18;i++){
      const side = i%2 ? -1 : 1;
      const server = new THREE.Group();
      const shell = new THREE.Mesh(towerGeo,mats.dark);
      shell.scale.set(1,4.5+(i%4)*.9,1);
      shell.position.y = shell.scale.y/2;
      server.add(shell);
      for(let row=0;row<5;row++){
        const light = new THREE.Mesh(unitBox,row%2 ? mats.grid : mats.secondary);
        light.scale.set(.75,.06,.06);
        light.position.set(0,.8+row*.72,-.62);
        server.add(light);
      }
      server.position.set(side*(10.8+(i%3)*1.4),0,-18-i*22);
      server.userData.wrapDistance = 400;
      server.userData.serverTower = true;
      server.userData.pulsePhase = i*.55;
      this.scene.add(server);
      this.scenery.push(server);
      this.cyberAnimated.push(server);
    }

    for(let i=0;i<10;i++){
      const side = i%2 ? -1 : 1;
      const wall = new THREE.Group();
      const field = new THREE.Mesh(unitPlane,mats.firewall);
      field.scale.set(5.5,3.8,1);
      wall.add(field);
      for(let x=-2.4;x<=2.4;x+=.8){
        const column = new THREE.Mesh(unitBox,(Math.round(x*10)+i)%2 ? mats.accent : mats.secondary);
        column.scale.set(.055,3.5,.06);
        wall.add(column);
      }
      const warning = new THREE.Mesh(geometry("warningTriangle",()=>new THREE.ConeGeometry(.6,1.05,3)),mats.accent);
      warning.position.set(0,0,.08);
      wall.add(warning);
      wall.position.set(side*14.5,3.1,-55-i*38);
      wall.rotation.y = side>0 ? -.32 : .32;
      wall.userData.wrapDistance = 400;
      wall.userData.firewallWall = true;
      wall.userData.pulsePhase = i*.9;
      this.scene.add(wall);
      this.scenery.push(wall);
      this.cyberAnimated.push(wall);
    }

    for(let i=0;i<12;i++){
      const side = i%2 ? -1 : 1;
      const board = new THREE.Group();
      const panel = new THREE.Mesh(unitPlane,i%3===0 ? mats.firewall : mats.hologram);
      panel.scale.set(4.4,2.1,1);
      board.add(panel);
      for(let row=0;row<4;row++){
        const data = new THREE.Mesh(unitBox,row%2 ? mats.window : mats.windowHot);
        data.scale.set(2.8-row*.34,.055,.05);
        data.position.set(0,.62-row*.38,.02);
        board.add(data);
      }
      board.position.set(side*13.6,3.4,-28-i*31);
      board.rotation.y = side>0 ? -.28 : .28;
      board.userData.wrapDistance = 390;
      board.userData.hologramBoard = true;
      board.userData.pulsePhase = i*.8;
      this.scene.add(board);
      this.scenery.push(board);
      this.cyberAnimated.push(board);
    }

    for(let i=0;i<7;i++){
      const bridge = new THREE.Group();
      const beam = new THREE.Mesh(unitBox,mats.dark);
      beam.scale.set(27,.34,.6);
      beam.position.y = 8.2;
      bridge.add(beam);
      for(let x=-11;x<=11;x+=2.75){
        const data = new THREE.Mesh(unitBox,(Math.round(x)+i)%2 ? mats.grid : mats.accent);
        data.scale.set(.08,.9,.18);
        data.position.set(x,8.2,0);
        bridge.add(data);
      }
      bridge.position.z = -70-i*58;
      bridge.userData.wrapDistance = 420;
      bridge.userData.dataBridge = true;
      bridge.userData.pulsePhase = i*.9;
      this.scene.add(bridge);
      this.scenery.push(bridge);
      this.cyberAnimated.push(bridge);
    }

    // Floating data particles use one BufferGeometry and one material.
    const particleCount = window.innerWidth < 700 ? 70 : 140;
    const positions = new Float32Array(particleCount*3);
    for(let i=0;i<particleCount;i++){
      positions[i*3]=(Math.random()-.5)*72;
      positions[i*3+1]=1+Math.random()*24;
      positions[i*3+2]=-Math.random()*360;
    }
    const atmosphereGeo = new THREE.BufferGeometry();
    atmosphereGeo.setAttribute("position",new THREE.BufferAttribute(positions,3));
    const atmosphereMat = new THREE.PointsMaterial({
      color:theme.primary,size:.12,transparent:true,opacity:.58,
      blending:THREE.AdditiveBlending,depthWrite:false
    });
    this.cyberAtmosphere = new THREE.Points(atmosphereGeo,atmosphereMat);
    this.scene.add(this.cyberAtmosphere);

    // A few animated lights are enough for atmosphere without expensive post-processing.
    [theme.primary,theme.hot,theme.secondary].forEach((color,index)=>{
      const light = new THREE.PointLight(color,5.5,42);
      light.position.set(index===1 ? 0 : index===0 ? -11 : 11,5,-22-index*25);
      light.userData.baseX = light.position.x;
      light.userData.phase = index*2.1;
      this.scene.add(light);
      this.cyberLights.push(light);
    });
  };

  Game3D.applyCyberTheme = function(){
    const theme = MODE_THEMES[state.selectedMode];
    document.body.dataset.rideMode = state.selectedMode;
    this.scene.background = new THREE.Color(theme.sky);
    this.scene.fog.color.setHex(theme.fog);
    this.scene.fog.near = 16;
    this.scene.fog.far = state.selectedMode === "hard" ? 128 : 155;
    this.road.material.color.setHex(theme.road);
    if(!this.cyberMaterials) return;
    const updateMat = (mat,color,intensity) => {
      mat.color.setHex(color);
      mat.emissive?.setHex(color);
      if(intensity !== undefined) mat.emissiveIntensity = intensity;
    };
    updateMat(this.cyberMaterials.grid,theme.primary,.9);
    updateMat(this.cyberMaterials.accent,theme.hot,1.25);
    updateMat(this.cyberMaterials.secondary,theme.secondary,1.1);
    updateMat(this.cyberMaterials.building,theme.building,.16);
    updateMat(this.cyberMaterials.buildingFar,theme.sky,.1);
    this.cyberMaterials.window.emissive.setHex(theme.primary);
    this.cyberMaterials.windowHot.emissive.setHex(theme.hot);
    updateMat(this.cyberMaterials.hologram,theme.primary,1.5);
    updateMat(this.cyberMaterials.firewall,theme.hot,1.65);
    this.cyberMaterials.glow.color.setHex(theme.primary);
    this.cyberAtmosphere?.material.color.setHex(theme.primary);
    this.cyberLights?.forEach((light,index)=>light.color.setHex([theme.primary,theme.hot,theme.secondary][index]));
  };

  const originalSetKey = Game3D.setKey.bind(Game3D);
  Game3D.setKey = function(key,isDown){
    if(isDown) initAudio();
    originalSetKey(key,isDown);
  };

  const originalMoveLane = Game3D.moveLane.bind(Game3D);
  Game3D.moveLane = function(direction){
    initAudio();
    const before = this.targetLane;
    originalMoveLane(direction);
    if(this.targetLane !== before){
      refs.laneFlash.className = "lane-flash";
      void refs.laneFlash.offsetWidth;
      refs.laneFlash.classList.add(direction < 0 ? "left" : "right");
      const pulse = this.lanePulseMeshes?.[this.targetLane];
      if(pulse) pulse.userData.lanePulse = 1;
    }
  };

  Game3D.spark = pooledSpark;

  Game3D.resetForStage = function(){
    this.active = true;
    this.targetLane = 1;
    this.laneX = 0;
    this.speed = 0;
    this.targetSpeed = 0;
    this.distance = 0;
    this.spawnObstacleTimer = .55;
    this.spawnCoinTimer = .3;
    this.spawnPowerupTimer = 4.5;
    this.crashShake = 0;
    this.invulnerableTime = 0;
    this.releaseAllControls();
    this.objects.forEach(deactivate);
    this.objects = [];
    prewarmPools();
    particlePool.forEach(p => { p.userData.active=false; p.visible=false; });
    this.bike.position.set(0,0,4.8);
    this.bike.rotation.set(0,0,0);
    this.camera.position.set(-5.6,3.8,7.2);
    this.camera.rotation.set(0,0,0);
    this.applyCyberTheme();
    state.boost = 100;
    state.boostCooldown = 0;
    state.shieldTime = 0;
    state.magnetTime = 0;
    state.slowmoTime = 0;
    state.doubleTime = 0;
    state.comboTime = 0;
    state.maxCombo = 1;
    state.countdownTime = 3;
    state.rideStarted = false;
    previousEnergy = 0;
    previousCrashes = 0;
    boostSparkTimer = 0;
    refs.countdown.classList.add("active");
    refs.countdownText.textContent = "3";
    refs.warning.classList.remove("active");
    refs.finishFlash.classList.remove("active");
    refs.laneFlash.className = "lane-flash";
  };

  Game3D.update = function(dt){
    ensureEngineAudio();
    if(updateCountdown(dt)){
      const countdownNow = performance.now()*.001;
      animateBike(dt,countdownNow,false,false);
      updateCamera(dt,countdownNow,false);
      updateVisualWorld(dt,0,countdownNow);
      updateEngineAudio();
      updateHUD();
      return;
    }

    const config = modeConfig[state.selectedMode];
    const level = state.currentLevel;
    const modeIndex = ["easy","medium","hard"].indexOf(state.selectedMode);
    const time = performance.now()*.001;
    const braking = Boolean(this.keys.s || this.keys.arrowdown);
    let boosting = Boolean(this.keys.w || this.keys.arrowup) && state.boost > 0 && state.boostCooldown <= 0;
    this.invulnerableTime = Math.max(0,this.invulnerableTime-dt);

    if(boosting){
      state.boost = Math.max(0,state.boost-dt*(24+modeIndex*2));
      if(state.boost === 0){
        state.boostCooldown = 2.1;
        boosting = false;
      }
      if(!this.wasBoosting) playSfx("boost");
    }else{
      state.boostCooldown = Math.max(0,state.boostCooldown-dt);
      if(state.boostCooldown <= 0) state.boost = Math.min(100,state.boost+dt*16);
    }
    this.wasBoosting = boosting;
    document.body.classList.toggle("boosting",boosting);

    const baseSpeed = config.speedBase + (level-1)*config.speedLevel + modeIndex*2;
    this.targetSpeed = baseSpeed + (boosting ? 28+level*1.1 : 0) - (braking ? 21 : 0);
    this.targetSpeed = Math.max(14,this.targetSpeed);
    const accel = braking ? 7.5 : boosting ? 5.8 : 3.4;
    this.speed += (this.targetSpeed-this.speed)*Math.min(1,dt*accel);

    const targetX = this.lanes[this.targetLane];
    this.laneX += (targetX-this.laneX)*Math.min(1,dt*(config.steer+2.8));
    this.bike.position.x = this.laneX;
    animateBike(dt,time,boosting,braking);
    updateCamera(dt,time,boosting);

    const slowFactor = state.slowmoTime > 0 ? .62 : 1;
    const dz = this.speed*dt*slowFactor;
    this.distance += dz;
    for(const item of this.scenery){
      item.position.z += dz*(item.userData.parallax || 1);
      if(item.userData.walker){
        const swing = Math.sin(time*item.userData.walkPace*6+item.userData.walkPhase)*.62;
        item.position.z += item.userData.walkDirection*item.userData.walkPace*dt;
        item.position.x = item.userData.walkBaseX+Math.sin(time*item.userData.walkPace+item.userData.walkPhase)*.34;
        item.userData.leftArm.rotation.x = -swing*.72;
        item.userData.rightArm.rotation.x = swing*.72;
        item.userData.leftLeg.rotation.x = swing;
        item.userData.rightLeg.rotation.x = -swing;
      }
      if(item.userData.house){
        const glow = .72+(Math.sin(time*2+item.userData.housePhase)+1)*.28;
        item.userData.windowMaterials.forEach(mat=>mat.emissiveIntensity=glow);
        item.userData.beacon.position.y = 5.95+Math.sin(time*2.6+item.userData.housePhase)*.08;
      }
      if(item.userData.cyberHoop) item.rotation.z = Math.sin(time*.7+item.position.z)*.012;
      if(item.userData.cyberSign) item.rotation.z = Math.sin(time*2+item.position.z)*.025;
      if(item.userData.cyberBuilding){
        item.rotation.z = Math.sin(time*.32+item.userData.pulsePhase)*.0025;
        item.children[item.children.length-1].rotation.y += dt*.5;
      }
      if(item.userData.cyberTunnel){
        const pulse = 1+Math.sin(time*2.4+item.userData.pulsePhase)*.018;
        item.scale.set(pulse,pulse,1);
      }
      if(item.userData.serverTower) item.rotation.y = Math.sin(time*.7+item.userData.pulsePhase)*.08;
      if(item.userData.firewallWall){
        item.scale.y = .94+Math.sin(time*4.2+item.userData.pulsePhase)*.08;
        item.rotation.z = Math.sin(time*2+item.userData.pulsePhase)*.018;
      }
      if(item.userData.hologramBoard){
        item.scale.x = .94+Math.sin(time*2.2+item.userData.pulsePhase)*.06;
        item.position.y = 3.4+Math.sin(time*1.7+item.userData.pulsePhase)*.28;
      }
      if(item.userData.dataBridge) item.position.y = Math.sin(time*.9+item.userData.pulsePhase)*.08;
      if(item.userData.circuitLine){
        item.scale.x = 26+Math.sin(time*3+item.userData.pulsePhase)*8;
        item.position.x = Math.sin(time*.65+item.userData.pulsePhase)*3;
      }
      if(item.position.z > 24) item.position.z -= item.userData.wrapDistance || 380;
    }
    updateVisualWorld(dt,dz,time);
    pooledBoostSparks(dt);

    this.spawnObstacleTimer -= dt;
    this.spawnCoinTimer -= dt;
    this.spawnPowerupTimer -= dt;
    const secondsPressure = Math.max(0,(state.bikeSeconds-20)*.004);
    const obstacleDelay = Math.max(.34,config.obstacleRate-level*.032-modeIndex*.035-secondsPressure);
    const coinDelay = Math.max(.32,config.coinRate-level*.014);
    if(this.spawnObstacleTimer <= 0){
      spawnHazard();
      this.spawnObstacleTimer = obstacleDelay+Math.random()*.42;
    }
    if(this.spawnCoinTimer <= 0){
      spawnRingSequence();
      this.spawnCoinTimer = coinDelay+Math.random()*.48;
    }
    if(this.spawnPowerupTimer <= 0){
      spawnRandomPowerup();
      this.spawnPowerupTimer = Math.max(4.5,8.8-level*.18-Math.random()*1.8);
    }

    for(let i=this.objects.length-1;i>=0;i--){
      const item = this.objects[i];
      updateObject(item,dt,dz,time);
      if(item.mesh.position.z > 10){
        deactivate(item);
        this.objects.splice(i,1);
        continue;
      }
      if(collides(item) && (item.type !== "hazard" || this.invulnerableTime <= 0)){
        if(item.type === "ring") collectRing(item);
        else if(item.type === "powerup") triggerPowerup(item.kind);
        else triggerCrash(item);
        deactivate(item);
        this.objects.splice(i,1);
      }
    }

    updateParticles(dt);
    updatePowerTimers(dt);
    warnForThreats(dt);
    state.bikeTimeLeft -= dt;
    if(state.bikeTimeLeft <= 0){
      state.bikeTimeLeft = 0;
      endBikeStage();
    }
    updateEngineAudio();
    updateHUD();
  };

  const originalUpdateHUD = updateHUD;
  updateHUD = function(){
    originalUpdateHUD();
    const speed = Math.round(Game3D.speed*2.35);
    refs.speedValue.textContent = String(speed).padStart(3,"0");
    refs.speedFill.style.width = `${Math.min(100,speed/2.1)}%`;
    refs.energy.textContent = state.stageStats.collected || 0;
    refs.crashes.textContent = state.stageStats.crashes || 0;
    if((state.stageStats.collected || 0) !== previousEnergy){
      previousEnergy = state.stageStats.collected || 0;
      flashHudStat(refs.energy,"energy-burst");
    }
    if((state.stageStats.crashes || 0) !== previousCrashes){
      previousCrashes = state.stageStats.crashes || 0;
      flashHudStat(refs.crashes);
    }
    refs.shield.textContent = state.shieldTime > 0 ? `${state.shieldTime.toFixed(1)}S` : "OFF";
    refs.shield.classList.toggle("active",state.shieldTime > 0);
    refs.score.textContent = state.score;
    refs.combo.textContent = `x${state.combo}`;
    if(comboHudValue !== state.combo){
      comboHudValue = state.combo;
      refs.comboReadout.classList.remove("pulse");
      void refs.comboReadout.offsetWidth;
      refs.comboReadout.classList.add("pulse");
    }
    refs.boostFill.style.width = `${state.boost}%`;
    refs.boostFill.parentElement.classList.toggle("cooldown",state.boostCooldown > 0);
    refs.boostFill.parentElement.classList.toggle("boosting",Boolean(Game3D.wasBoosting));
    refs.boostStatus.textContent = Game3D.wasBoosting
      ? "ACTIVE"
      : state.boostCooldown > 0
      ? `COOLDOWN ${state.boostCooldown.toFixed(1)}`
      : state.boost > 94 ? "READY" : state.boost < 12 ? "EMPTY" : "CHARGING";
  };

  const originalStartBikeStage = startBikeStage;
  startBikeStage = function(){
    originalStartBikeStage();
    state.stageStats = {
      collected:0,
      crashes:0,
      score:0,
      bonusPoints:0,
      powerups:0,
      shieldBlocks:0
    };
    Game3D.resetForStage();
    updateHUD();
  };

  const originalEndBikeStage = endBikeStage;
  endBikeStage = function(){
    if(state.phase !== "bike" || finishTimer) return;
    const cleanBonus = Math.max(0,450-state.stageStats.crashes*120);
    const comboBonus = Math.max(0,(state.maxCombo-1)*35);
    const powerBonus = (state.stageStats.powerups || 0)*45;
    const bonus = cleanBonus+comboBonus+powerBonus;
    state.stageStats.bonusPoints = bonus;
    state.stageStats.score += bonus;
    state.score += bonus;
    refs.warning.classList.remove("active");
    refs.countdown.classList.remove("active");
    document.body.classList.remove("boosting");
    state.phase = "finishing";
    Game3D.releaseAllControls();
    refs.finishFlash.classList.remove("active");
    void refs.finishFlash.offsetWidth;
    refs.finishFlash.classList.add("active");
    const finishPosition = shared.finishPosition ||= new THREE.Vector3();
    finishPosition.set(Game3D.bike.position.x,2,-2);
    pooledSpark(finishPosition,MODE_THEMES[state.selectedMode].primary,58,13);
    pooledSpark(finishPosition,MODE_THEMES[state.selectedMode].hot,34,10);
    playSfx("complete");
    finishTimer = setTimeout(()=>{
      finishTimer = 0;
      refs.finishFlash.classList.remove("active");
      state.phase = "bike";
      originalEndBikeStage();
      if(!embeddedReward){
        ui.resultStats.insertAdjacentHTML("beforeend",`
          <div class="ending-row"><span>Performance bonus</span><strong>${bonus}</strong></div>
          <div class="ending-row"><span>Best sync combo</span><strong>x${state.maxCombo}</strong></div>
          <div class="ending-row"><span>Power-ups captured</span><strong>${state.stageStats.powerups || 0}</strong></div>
        `);
        ui.stageFeedback.textContent = state.stageStats.crashes === 0 && state.maxCombo >= 7
          ? "Elite cyber rider. Flawless defense, high sync, full control."
          : state.stageStats.crashes <= 2
            ? "Strong run. Chain more energy rings and use nitro through clear lanes."
            : "Ride complete. Watch the threat scanner and brake before crowded lanes.";
        animateResultStats();
      }
    },880);
  };

  function animateResultStats(){
    cancelAnimationFrame(resultAnimationFrame);
    const values = [...ui.resultStats.querySelectorAll("strong")].map(element => {
      const text = element.textContent.trim();
      const numeric = Number(text.replace(/[^0-9.-]/g,""));
      return { element, prefix:text.startsWith("x") ? "x" : "", target:Number.isFinite(numeric) ? numeric : 0 };
    });
    values.forEach(item=>item.element.textContent=`${item.prefix}0`);
    const start = performance.now();
    const tick = now => {
      const progress = Math.min(1,(now-start)/850);
      const eased = 1-Math.pow(1-progress,3);
      values.forEach(item=>item.element.textContent=`${item.prefix}${Math.round(item.target*eased)}`);
      if(progress < 1) resultAnimationFrame = requestAnimationFrame(tick);
    };
    resultAnimationFrame = requestAnimationFrame(tick);
  }

  const originalIdleUpdate = Game3D.idleUpdate.bind(Game3D);
  Game3D.idleUpdate = function(dt){
    if(state.phase === "finishing"){
      const time = performance.now()*.001;
      this.bike.position.y = .06+Math.sin(time*9)*.025;
      this.bike.rotation.z *= Math.max(0,1-dt*4);
      this.camera.position.x += ((Math.sin(time*1.8)*2.2)-this.camera.position.x)*Math.min(1,dt*2.5);
      this.camera.position.y += (5.8-this.camera.position.y)*Math.min(1,dt*2.5);
      this.camera.position.z += (10.8-this.camera.position.z)*Math.min(1,dt*2.5);
      this.camera.lookAt(this.bike.position.x,1.4,-9);
      updateVisualWorld(dt,this.speed*dt*.28,time);
      updateParticles(dt);
      return;
    }
    originalIdleUpdate(dt);
  };

  const originalCompleteEmbeddedReward = completeEmbeddedReward;
  completeEmbeddedReward = function(reason){
    refs.warning.classList.remove("active");
    refs.countdown.classList.remove("active");
    refs.powerupBanner.classList.remove("active");
    refs.speedLines.classList.remove("active");
    refs.vignette.classList.remove("active","crash");
    refs.finishFlash.classList.remove("active");
    refs.laneFlash.className = "lane-flash";
    document.body.classList.remove("boosting","crashing");
    originalCompleteEmbeddedReward(reason);
  };

  const originalTogglePause = togglePause;
  togglePause = function(){
    originalTogglePause();
    if(state.paused) Game3D.releaseAllControls();
    updateEngineAudio();
  };

  window.addEventListener("blur",()=>{
    if(state.phase === "bike") Game3D.releaseAllControls();
  });
  window.addEventListener("pagehide",()=>{
    Game3D.releaseAllControls();
    clearTimeout(finishTimer);
    finishTimer = 0;
    cancelAnimationFrame(resultAnimationFrame);
    if(engineOsc){
      try{ engineOsc.stop(); }catch(_error){}
      engineOsc = null;
      engineGain = null;
    }
  });
})();
