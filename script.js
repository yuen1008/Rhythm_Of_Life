const animals = [
    {
        id: 1, name: "Blue Whale", bpmString: "BPM 10-30", bpmValue: 20,
        image: "assets/image/1-BlueWhale-chinh-le-duc-P19iVmm7XUA-unsplash.jpg",
        icon: "assets/image/Icons/1-whale.png",
        bgm: "assets/audio/BGM/1-samuelfjohanns-deep-slow-beat-21093.mp3",
        emoji: "🦐"
    },
    {
        id: 2, name: "Asian Elephant", bpmString: "BPM 25-35", bpmValue: 30,
        image: "assets/image/2-AsianElephant-rohit-varma-BgBaVw_mON4-unsplash.jpg",
        icon: "assets/image/Icons/2-elephant.png",
        bgm: "assets/audio/BGM/2- syouki_takahashi-midnight-forest-184304.mp3",
        emoji: "🌿"
    },
    {
        id: 3, name: "Red-Crowned Crane", bpmString: "BPM 52-104", bpmValue: 78,
        image: "assets/image/3-RedCrownedCrane-bo-zhang-9nx7XhPc0cI-unsplash.jpg",
        icon: "assets/image/Icons/3-crane.png",
        bgm: "assets/audio/BGM/3-alex-morgan-string-quartet-elegance-537464.mp3",
        emoji: "🐚" 
    },
    {
        id: 4, name: "Snow Leopard", bpmString: "BPM 70-100", bpmValue: 85,
        image: "assets/image/4-SnowLeopard-robert-sachowski-HFIvhaOcHVA-unsplash.jpg",
        icon: "assets/image/Icons/4-leopard.png",
        bgm: "assets/audio/BGM/4-dubdown-snow-132947.mp3",
        emoji: "🥩" 
    },
    {
        id: 5, name: "Red Panda", bpmString: "BPM 110-140", bpmValue: 125,
        image: "assets/image/5-RedPanda-xiangkun-zhu-3rQyUimQAEU-unsplash.jpg",
        icon: "assets/image/Icons/5-redpanda.png",
        bgm: "assets/audio/BGM/5-sub_clair-energy-instrumental-585247.mp3",
        emoji: "🎋" 
    },
    {
        id: 6, name: "Black-Footed Ferret", bpmString: "BPM 250-300", bpmValue: 275,
        image: "assets/image/6-BlackFootFerret-rohan-chang-hn0AtxarNNw-unsplash.jpg",
        icon: "assets/image/Icons/6-ferret.png",
        bgm: "assets/audio/BGM/6-sub_clair-phonk-instrumental-588308.mp3",
        emoji: "🐭" 
    },
    {
        id: 7, name: "Amargosa Vole", bpmString: "BPM 400-600", bpmValue: 500,
        image: "assets/image/7-AmargosaVole-ryan-stone-6u64uoqRBZE-unsplash.jpg",
        icon: "assets/image/Icons/7-vole.png",
        bgm: "assets/audio/BGM/7-grand_project-funny-running-129223.mp3",
        emoji: "🌱" 
    }
];

const educationalData = {
    1: {
        status: "Endangered",
        data: "The global population of Blue Whales is estimated at 10,000 to 25,000 individuals. Recovery is agonizingly slow due to low reproductive rates.",
        cause: "Primary threats today include ship strikes in heavy traffic lanes, entanglement in commercial fishing gear, and climate change affecting krill distribution.",
        solution: "Support marine protected areas (MPAs), reduce single-use plastics, and advocate for shifting shipping lanes away from critical habitats."
    },
    2: {
        status: "Endangered",
        data: "There are approximately 40,000 to 50,000 Asian Elephants remaining in the wild. Their population has declined by an estimated 50% over the past 75 years.",
        cause: "Habitat loss and fragmentation from agricultural expansion are leading causes, resulting in severe human-elephant conflict.",
        solution: "Purchase products with certified sustainable palm oil to prevent deforestation. Support organizations creating wildlife corridors."
    },
    3: {
        status: "Vulnerable",
        data: "The Red-crowned Crane is one of the rarest cranes, with a wildly fluctuating population estimated around 2,500 to 3,000 mature individuals.",
        cause: "The overwhelming threat is the loss and degradation of wetland habitats across Asia due to agricultural expansion and industrial development.",
        solution: "Advocate for wetland conservation and support organizations working with local communities to balance agriculture and habitat preservation."
    },
    4: {
        status: "Vulnerable",
        data: "Estimates suggest only 4,000 to 6,500 Snow Leopards remain in the wild across the mountains of Central Asia.",
        cause: "Climate change is rapidly shrinking their alpine habitat, forcing them closer to humans, leading to retaliatory killings and poaching.",
        solution: "Support community-based conservation programs that compensate herders for lost livestock, reducing retaliatory killings."
    },
    5: {
        status: "Endangered",
        data: "The Red Panda population is estimated to be fewer than 10,000 in the wild, declining by 50% over the last two decades.",
        cause: "Deforestation and the clearing of bamboo forests severely fragment their habitat. They also face threats from the illegal pet trade.",
        solution: "Support eco-tourism initiatives providing alternative income for local communities and donate to anti-poaching patrols."
    },
    6: {
        status: "Endangered",
        data: "Once thought extinct, the Black-Footed Ferret has about 300 individuals in the wild thanks to captive breeding.",
        cause: "Their decline is directly tied to the eradication of prairie dogs (their prey) by farmers, alongside the lethal sylvatic plague.",
        solution: "Support captive breeding programs and advocate for the protection of prairie dog ecosystems."
    },
    7: {
        status: "Critically Endangered",
        data: "The Amargosa Vole is critically endangered, restricted to a tiny, fragile wetland ecosystem in the Mojave Desert.",
        cause: "Total reliance on a specific marsh habitat makes them incredibly susceptible to climate change, droughts, and human water diversion.",
        solution: "Conserve water to maintain ground tables and support local groups focused on habitat restoration in the Mojave."
    }
};

let currentAnimalIndex = 0;
let collectedAnimals = new Set();
let gameScore = 0;
let gameLoopId;
let blockSpawnInterval;
let activeBlocks = [];
let currentBGM = null;
const maxSpawns = 15;
const maxScore = maxSpawns * 100;

const screens = {
    lottery: document.getElementById('screen-lottery'),
    selection: document.getElementById('screen-selection'),
    audioCheck: document.getElementById('screen-audio-check'),
    game: document.getElementById('screen-game'),
    score: document.getElementById('screen-score'),
    collect: document.getElementById('screen-collect'),
    info: document.getElementById('screen-info'),
    conclusion: document.getElementById('screen-conclusion')
};

function init() {
    setupRepository();
    
    document.getElementById('repo-toggle-btn').onclick = () => document.getElementById('repository-modal').classList.toggle('hidden');
    document.getElementById('close-repo-btn').onclick = () => document.getElementById('repository-modal').classList.add('hidden');
    document.getElementById('close-repo-detail-btn').onclick = () => document.getElementById('repo-detail-modal').classList.add('hidden');
    
    document.getElementById('btn-lottery').onclick = spinLottery;
    document.getElementById('btn-rotate').onclick = () => showScreen('lottery');
    document.getElementById('btn-begin').onclick = () => {
        showScreen('audioCheck');
        checkAndApplyPanAnimation();
    };
    
    document.getElementById('btn-skip-audio').onclick = startGame;
    
    document.getElementById('btn-restart').onclick = () => showScreen('selection');
    document.getElementById('btn-continue').onclick = () => {
        document.getElementById('collect-image').src = animals[currentAnimalIndex].image;
        showScreen('collect');
    };
    document.getElementById('collect-image').onclick = collectCurrentAnimal;
    
    document.querySelectorAll('.floating-node').forEach(node => {
        node.onclick = (e) => {
            const targetType = e.target.dataset.target.replace('info-', '');
            const animalId = animals[currentAnimalIndex].id;
            const textContent = educationalData[animalId][targetType];
            
            document.getElementById('reading-title').textContent = e.target.textContent;
            document.getElementById('reading-text').textContent = textContent;
            document.getElementById('info-reading-modal').classList.remove('hidden');
        };
    });
    
    document.querySelector('.btn-close-modal').onclick = () => {
        document.getElementById('info-reading-modal').classList.add('hidden');
    };
    
    // Updated Navigation Buttons
    document.getElementById('btn-start-next').onclick = () => showScreen('lottery');
    document.getElementById('btn-finish-journey').onclick = () => showScreen('conclusion');
    
    // Final restart clears everything
    document.getElementById('btn-final-restart').onclick = () => {
        collectedAnimals.clear();
        updateRepositoryView();
        showScreen('lottery');
    };

    window.addEventListener('keydown', handleGlobalKeydown);
}

function showScreen(screenKey) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    
    screens[screenKey].classList.remove('hidden');
    screens[screenKey].classList.add('active');
    
    if (!['lottery', 'info', 'conclusion'].includes(screenKey)) {
        const bgImgStr = `url('${animals[currentAnimalIndex].image}')`;
        document.getElementById('audio-bg').style.backgroundImage = bgImgStr;
        document.getElementById('game-bg').style.backgroundImage = bgImgStr;
        document.getElementById('score-bg').style.backgroundImage = bgImgStr;
        document.getElementById('collect-bg').style.backgroundImage = bgImgStr;
    }
    
    if(screenKey === 'audioCheck') {
        const txtContainer = document.querySelector('.fade-sequence');
        const newContainer = txtContainer.cloneNode(true);
        txtContainer.parentNode.replaceChild(newContainer, txtContainer);
        document.getElementById('btn-skip-audio').onclick = startGame;
    }
}

function checkAndApplyPanAnimation() {
    const img = new Image();
    img.src = animals[currentAnimalIndex].image;
    img.onload = () => {
        const audioBg = document.getElementById('audio-bg');
        audioBg.classList.remove('pan-vertical', 'pan-horizontal');
        if(img.naturalWidth < img.naturalHeight) {
            audioBg.classList.add('pan-vertical');
        } else {
            audioBg.classList.add('pan-horizontal');
        }
    }
}

function spinLottery() {
    const rouletteImg = document.getElementById('roulette-img');
    const btn = document.getElementById('btn-lottery');
    btn.disabled = true;
    
    let spinCount = 0;
    const spinsTotal = 20;
    let speed = 50;
    
    const spinInterval = setInterval(() => {
        currentAnimalIndex = Math.floor(Math.random() * animals.length);
        rouletteImg.src = animals[currentAnimalIndex].icon;
        
        spinCount++;
        if (spinCount > spinsTotal) {
            clearInterval(spinInterval);
            setTimeout(() => {
                updateSelectionScreen();
                showScreen('selection');
                btn.disabled = false;
            }, 500);
        }
    }, speed);
}

function updateSelectionScreen() {
    const animal = animals[currentAnimalIndex];
    document.getElementById('sel-name').textContent = animal.name;
    document.getElementById('sel-bpm').textContent = animal.bpmString;
    document.getElementById('sel-image').src = animal.image;
}

function setupRepository() {
    const grid = document.getElementById('repo-grid');
    grid.innerHTML = '';
    // Request: 7 slots arranged in a column
    for(let i=0; i<7; i++) {
        const slot = document.createElement('div');
        slot.className = 'repo-slot';
        grid.appendChild(slot);
    }
    updateRepositoryView();
}

function collectCurrentAnimal() {
    const animal = animals[currentAnimalIndex];
    if(!collectedAnimals.has(animal.id)) {
        collectedAnimals.add(animal.id);
        updateRepositoryView();
    }
    document.getElementById('info-reading-modal').classList.add('hidden');
    showScreen('info');
}

function updateRepositoryView() {
    const slots = document.querySelectorAll('.repo-slot');
    const collectedArray = Array.from(collectedAnimals).map(id => animals.find(a => a.id === id));
    
    slots.forEach((slot, index) => {
        slot.innerHTML = '';
        slot.classList.remove('filled');
        slot.onclick = null;
        
        if(collectedArray[index]) {
            const animal = collectedArray[index];
            const img = document.createElement('img');
            img.src = animal.icon;
            slot.appendChild(img);
            slot.classList.add('filled');
            
            // Add click listener to show details
            slot.onclick = () => showRepoDetail(animal.id);
        }
    });
}

function showRepoDetail(animalId) {
    const animal = animals.find(a => a.id === animalId);
    const data = educationalData[animalId];
    
    document.getElementById('repo-detail-name').textContent = animal.name;
    document.getElementById('repo-detail-status').textContent = `Status: ${data.status}`;
    document.getElementById('repo-detail-data').textContent = data.data;
    document.getElementById('repo-detail-cause').textContent = data.cause;
    document.getElementById('repo-detail-solution').textContent = data.solution;
    
    document.getElementById('repo-detail-modal').classList.remove('hidden');
}

function handleGlobalKeydown(e) {
    if (e.code === 'Space') {
        if (screens.audioCheck.classList.contains('active')) {
            startGame();
        } else if (screens.game.classList.contains('active')) {
            checkRhythmHit();
        }
    }
}

function startGame() {
    showScreen('game');
    gameScore = 0;
    updateProgressBar(0, 0);
    
    activeBlocks.forEach(b => b.remove());
    activeBlocks = [];
    
    if (currentBGM) { currentBGM.pause(); }
    currentBGM = new Audio(animals[currentAnimalIndex].bgm);
    currentBGM.loop = true;
    currentBGM.volume = 0.4;
    currentBGM.play().catch(e => console.log('Audio wait'));

    const track = document.getElementById('rhythm-track');
    const bpm = animals[currentAnimalIndex].bpmValue;
    const intervalMs = (60 / bpm) * 1000;
    
    let spawnCount = 0;
    
    blockSpawnInterval = setInterval(() => {
        if(spawnCount >= maxSpawns) {
            clearInterval(blockSpawnInterval);
            setTimeout(endGame, 3000); 
            return;
        }
        
        const block = document.createElement('div');
        block.className = 'falling-emoji';
        block.textContent = animals[currentAnimalIndex].emoji;
        block.style.top = '0px';
        track.appendChild(block);
        activeBlocks.push({ el: block, y: 0, missed: false });
        
        spawnCount++;
        updateProgressBar(spawnCount, gameScore);
    }, intervalMs);

    let lastTime = performance.now();
    const fallSpeed = track.clientHeight / 2000; 
    
    function updateGame(time) {
        const deltaTime = time - lastTime;
        lastTime = time;
        
        activeBlocks.forEach((blockObj, index) => {
            blockObj.y += fallSpeed * deltaTime;
            blockObj.el.style.top = blockObj.y + 'px';
            
            const tz = document.getElementById('target-zone').getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            const tzBottomInTrack = tz.bottom - trackRect.top;
            
            if (!blockObj.missed && blockObj.y > tzBottomInTrack + 20) {
                blockObj.missed = true;
                spawnFeedbackText("Too slow~", "miss-feedback");
                playBeep(200, 'sawtooth'); 
            }

            if (blockObj.y > track.clientHeight) {
                blockObj.el.remove();
                activeBlocks.splice(index, 1);
            }
        });
        
        gameLoopId = requestAnimationFrame(updateGame);
    }
    gameLoopId = requestAnimationFrame(updateGame);
}

function updateProgressBar(spawned, score) {
    const percentage = Math.round((spawned / maxSpawns) * 100);
    document.getElementById('game-progress-fill').style.width = percentage + '%';
    document.getElementById('game-progress-text').textContent = `Progress: ${percentage}% | Score: ${score} / ${maxScore}`;
}

function checkRhythmHit() {
    const targetZone = document.getElementById('target-zone');
    const tzRect = targetZone.getBoundingClientRect();
    
    for (let i = 0; i < activeBlocks.length; i++) {
        const bRect = activeBlocks[i].el.getBoundingClientRect();
        
        if (bRect.bottom >= tzRect.top - 20 && bRect.top <= tzRect.bottom + 20) {
            gameScore += 100;
            updateProgressBar(activeBlocks.length > 0 ? (maxSpawns - activeBlocks.length + 1) : maxSpawns, gameScore);
            
            spawnFeedbackText(Math.random() > 0.5 ? "BOOP! ✨" : "NOICE! ✨", "hit-feedback");
            playBeep(880, 'sine'); 
            
            const el = activeBlocks[i].el;
            el.style.transform = 'scale(2)';
            el.style.opacity = '0';
            setTimeout(() => { if(el.parentNode) el.parentNode.removeChild(el); }, 200);
            
            activeBlocks.splice(i, 1);
            break;
        }
    }
}

function spawnFeedbackText(text, className) {
    const track = document.getElementById('rhythm-track');
    const tz = document.getElementById('target-zone');
    const feedback = document.createElement('div');
    feedback.className = className + ' elegant-font';
    feedback.textContent = text;
    feedback.style.top = (tz.offsetTop - 20) + 'px';
    feedback.style.left = '50%';
    feedback.style.transform = 'translateX(-50%)';
    track.appendChild(feedback);
    setTimeout(() => { if(feedback.parentNode) feedback.parentNode.removeChild(feedback); }, 1000);
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, type) {
    if(audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function endGame() {
    cancelAnimationFrame(gameLoopId);
    if (currentBGM) { currentBGM.pause(); currentBGM.currentTime = 0; }
    
    document.getElementById('final-score-val').textContent = gameScore;
    document.getElementById('score-animal-img').src = animals[currentAnimalIndex].image;
    
    showScreen('score');
}

window.onload = init;
