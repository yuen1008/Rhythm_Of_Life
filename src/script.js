// --- Data Structure matching directory_hierarchy.txt ---
const animals = [
    {
        id: 1, name: "Blue Whale", bpmRange: [10, 30],
        icon: "assets/image/Icons/1-whale.png",
        image: "assets/image/1-BlueWhale-chinh-le-duc-P19iVmm7XUA-unsplash.jpg",
        bgm: "assets/audio/BGM/1-samuelfjohanns-deep-slow-beat-21093.mp3"
    },
    {
        id: 2, name: "Asian Elephant", bpmRange: [25, 35],
        icon: "assets/image/Icons/2-elephant.png",
        image: "assets/image/2-AsianElephant-rohit-varma-BgBaVw_mON4-unsplash.jpg",
        bgm: "assets/audio/BGM/2- syouki_takahashi-midnight-forest-184304.mp3"
    },
    {
        id: 3, name: "Red-Crowned Crane", bpmRange: [52, 104],
        icon: "assets/image/Icons/3-crane.png",
        image: "assets/image/3-RedCrownedCrane-bo-zhang-9nx7XhPc0cI-unsplash.jpg",
        bgm: "assets/audio/BGM/3-alex-morgan-string-quartet-elegance-537464.mp3"
    },
    {
        id: 4, name: "Snow Leopard", bpmRange: [70, 100],
        icon: "assets/image/Icons/4-leopard.png",
        image: "assets/image/4-SnowLeopard-robert-sachowski-HFIvhaOcHVA-unsplash.jpg",
        bgm: "assets/audio/BGM/4-dubdown-snow-132947.mp3"
    },
    {
        id: 5, name: "Red Panda", bpmRange: [110, 140],
        icon: "assets/image/Icons/5-redpanda.png",
        image: "assets/image/5-RedPanda-xiangkun-zhu-3rQyUimQAEU-unsplash.jpg",
        bgm: "assets/audio/BGM/5-sub_clair-energy-instrumental-585247.mp3"
    },
    {
        id: 6, name: "Black-Footed Ferret", bpmRange: [250, 300],
        icon: "assets/image/Icons/6-ferret.png",
        image: "assets/image/6-BlackFootFerret-rohan-chang-hn0AtxarNNw-unsplash.jpg",
        bgm: "assets/audio/BGM/6-sub_clair-phonk-instrumental-588308.mp3"
    },
    {
        id: 7, name: "Amargosa Vole", bpmRange: [400, 600],
        icon: "assets/image/Icons/7-vole.png",
        image: "assets/image/7-AmargosaVole-ryan-stone-6u64uoqRBZE-unsplash.jpg",
        bgm: "assets/audio/BGM/7-grand_project-funny-running-129223.mp3"
    }
];

const notesFiles = [
    'assets/audio/C4.mp3', // Do
    'assets/audio/D4.mp3', // Re
    'assets/audio/E4.mp3', // Mi
    'assets/audio/Fs4.mp3', // Fa (using F#4 or F4 if available)
    'assets/audio/G4.mp3', // Sol
    'assets/audio/A4.mp3', // La
    'assets/audio/B5.mp3'  // Si
];

// --- Application State ---
let currentAnimal = null;
let noteIndex = 0;
let lastTapTime = 0;
let tapIntervals = [];
let puzzlePieces = [];
let currentBGM = null;

// Audio Preloading
const audioPool = notesFiles.map(src => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    return audio;
});

// --- DOM Elements ---
const screens = {
    selection: document.getElementById('selection-screen'),
    interaction: document.getElementById('interaction-screen'),
    story: document.getElementById('story-screen')
};
const animalGrid = document.getElementById('animal-grid');
const puzzleMaskGrid = document.getElementById('puzzle-mask-grid');
const puzzleImage = document.getElementById('puzzle-image');
const heartPulse = document.getElementById('heart-pulse');
const userBpmDisplay = document.getElementById('user-bpm');

// --- Initialization ---
function init() {
    // Populate Selection Screen
    animals.forEach(animal => {
        const card = document.createElement('div');
        card.className = 'animal-card';
        card.innerHTML = `
            <img src="${animal.icon}" alt="${animal.name} icon" onerror="this.src=''; this.alt='Icon'">
            <h3>${animal.name}</h3>
            <p>${animal.bpmRange[0]} - ${animal.bpmRange[1]} BPM</p>
        `;
        card.onclick = () => startGame(animal);
        animalGrid.appendChild(card);
    });

    // Back & Restart Buttons
    document.getElementById('back-btn').onclick = showSelectionScreen;
    document.getElementById('restart-btn').onclick = showSelectionScreen;

    // Spacebar Listener
    window.addEventListener('keydown', handleSpacebar);
}

// --- Core Game Logic ---
function startGame(animal) {
    currentAnimal = animal;
    resetState();
    
    // Setup Interaction UI
    document.getElementById('current-animal-name').textContent = animal.name;
    document.getElementById('target-bpm').textContent = `${animal.bpmRange[0]} - ${animal.bpmRange[1]}`;
    
    // Setup Puzzle
    puzzleImage.src = animal.image;
    setupPuzzleGrid();
    
    switchScreen('interaction');
}

function resetState() {
    noteIndex = 0;
    lastTapTime = 0;
    tapIntervals = [];
    userBpmDisplay.textContent = '0';
    if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
    }
}

function setupPuzzleGrid() {
    puzzleMaskGrid.innerHTML = '';
    // A 5x4 grid = 20 pieces to complete
    const cols = 5;
    const rows = 4;
    puzzleMaskGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    puzzleMaskGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    
    puzzlePieces = [];
    for (let i = 0; i < cols * rows; i++) {
        const piece = document.createElement('div');
        piece.className = 'mask-piece';
        puzzleMaskGrid.appendChild(piece);
        puzzlePieces.push(piece);
    }
    
    // Shuffle pieces so they reveal randomly
    puzzlePieces.sort(() => Math.random() - 0.5);
}

function handleSpacebar(e) {
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scrolling
        if (screens.interaction.classList.contains('active')) {
            processTap();
        }
    }
}

function processTap() {
    const now = performance.now();
    
    // Visual Feedback
    heartPulse.classList.add('beat');
    setTimeout(() => heartPulse.classList.remove('beat'), 100);

    if (lastTapTime > 0) {
        const intervalMs = now - lastTapTime;
        const bpm = Math.round(60000 / intervalMs);
        
        // Smooth BPM calculation over last 3 taps
        tapIntervals.push(bpm);
        if (tapIntervals.length > 3) tapIntervals.shift();
        
        const avgBpm = Math.round(tapIntervals.reduce((a, b) => a + b) / tapIntervals.length);
        userBpmDisplay.textContent = avgBpm;

        // Check if within target range (with 20% forgiveness buffer)
        const min = currentAnimal.bpmRange[0] * 0.8;
        const max = currentAnimal.bpmRange[1] * 1.2;

        if (avgBpm >= min && avgBpm <= max) {
            registerHit();
        }
    }
    lastTapTime = now;
}

function registerHit() {
    // Play Note (clone node to allow rapid overlapping playback)
    const note = audioPool[noteIndex].cloneNode();
    note.volume = 0.7;
    note.play().catch(e => console.warn('Audio play prevented by browser:', e));
    
    noteIndex = (noteIndex + 1) % notesFiles.length;

    // Reveal Puzzle Piece
    const hiddenPiece = puzzlePieces.find(p => p.style.opacity !== '0');
    if (hiddenPiece) {
        hiddenPiece.style.opacity = '0';
    } else {
        // Puzzle Complete!
        triggerStoryMode();
    }
}

// --- Story Mode ---
function triggerStoryMode() {
    document.getElementById('story-image').src = currentAnimal.image;
    document.getElementById('story-title').textContent = `You connected with the ${currentAnimal.name}.`;
    
    currentBGM = new Audio(currentAnimal.bgm);
    currentBGM.loop = true;
    currentBGM.volume = 0.5;
    currentBGM.play().catch(e => console.warn('BGM play prevented:', e));
    
    switchScreen('story');
}

// --- Navigation ---
function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
    screens[screenName].classList.remove('hidden');
}

function showSelectionScreen() {
    resetState();
    switchScreen('selection');
}

// Start
window.onload = init;
