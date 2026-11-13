/* ==========================================================================
   1. PENGATURAN UTAMA & KONFIGURASI DAFTAR LAGU
   ========================================================================== */
const START_DATE = "2026-12-31"; /*start proyek*/
const TOTAL_DAYS = 6; /*Jumlah pesan*/

// Daftar Lagu 
const BGM_PLAYLIST = [
    { title: "Nanti kita seperti ini", src: "audio/bgm_1.mp3" },
    { title: "Attention", src: "audio/bgm_2.mp3" },
    { title: "TipToe", src: "audio/bgm_3.mp3" },
    { title: "Call me maybe", src: "audio/bgm_4.mp3" },
    { title: "Regenage", src: "audio/bgm_5.mp3" },
    { title: "Unforgettable Freestyle", src: "audio/bgm_6.mp3" },
    { title: "Gata only", src: "audio/bgm_7.mp3" },
    { title: "I wanna be yours", src: "audio/bgm_8.mp3" },
    { title: "Love songs", src: "audio/bgm_9.mp3" },
    { title: "One call away", src: "audio/bgm_10.mp3" },
    { title: "Lady Killers II", src: "audio/bgm_11.mp3" },
    { title: "Nevada", src: "audio/bgm_12.mp3" },
    { title: "Intro", src: "audio/bgm_13.mp3" },
    { title: "Saturn", src: "audio/bgm_14.mp3" },
    { title: "Never be alone", src: "audio/bgm_15.mp3" },
    { title: "Est-ce que tu m_amies", src: "audio/bgm_16.mp3" },
    { title: "I love you so", src: "audio/bgm_17.mp3" },
    { title: "One off the girls", src: "audio/bgm_18.mp3" },
    { title: "I was never there", src: "audio/bgm_19.mp3" },
    { title: "No reason", src: "audio/bgm_20.mp3" },
    { title: "That girl", src: "audio/bgm_21.mp3" },
    { title: "Starboy", src: "audio/bgm_22.mp3" },
    { title: "Whoa", src: "audio/bgm_23.mp3" },
    { title: "Love story", src: "audio/bgm_24.mp3" },
    { title: "We don't talk anymore", src: "audio/bgm_25.mp3" },
    { title: "The lost soul down", src: "audio/bgm_26.mp3" },
    { title: "Blue", src: "audio/bgm_27.mp3" },
    { title: "Say yes to heaven", src: "audio/bgm_28.mp3" },
    { title: "Melting", src: "audio/bgm_29.mp3" },
    { title: "Alive", src: "audio/bgm_30.mp3" },
    { title: "Birds of a feather", src: "audio/bgm_31.mp3" },
    { title: "we fell in love in october", src: "audio/bgm_32.mp3" },
    { title: "Say yes to heaven", src: "audio/bgm_33.mp3" },
    { title: "Melting", src: "audio/bgm_34.mp3" },
    { title: "Treat you better" , src: "audio/bgm_35.mp3"}
];

let messagesData = [];
let currentBgmIndex = Math.floor(Math.random() * BGM_PLAYLIST.length);
let isBgmPlaying = false;
let activeFilter = 'all';

/* ==========================================================================
   2. HITUNG HARI & LOAD JSON
   ========================================================================== */
function calculateCurrentDay() {
    const start = new Date(START_DATE);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

async function loadMessagesData() {
    try {
        const response = await fetch('messages.json');
        if (!response.ok) throw new Error("Gagal mengambil file JSON");
        
        const rawData = await response.json();
        const startDateObj = new Date(START_DATE);

        // Otomatis memberikan nomor 'day' dan 'date' berdasarkan urutan baris (index)
        messagesData = rawData.map((msg, index) => {
            const dayNumber = index + 1; 
            
            const messageDate = new Date(startDateObj);
            messageDate.setDate(startDateObj.getDate() + (dayNumber - 1));
            
            const formattedDate = messageDate.toLocaleDateString('id-ID', {
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
            });

            return {
                ...msg,
                day: dayNumber,     // Otomatis terisi nomor hari berurutan
                date: formattedDate // Otomatis terisi tanggal harian
            };
        });

    } catch (error) {
        console.warn("Menggunakan data fallback karena messages.json belum terbaca:", error);
        messagesData = generateFallbackMessages();
    }
}

function generateFallbackMessages() {
    const sampleMessages = [];
    const startDateObj = new Date(START_DATE);
    for (let i = 1; i <= TOTAL_DAYS; i++) {
        const currentDate = new Date(startDateObj);
        currentDate.setDate(startDateObj.getDate() + (i - 1));
        sampleMessages.push({
            day: i,
            date: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            title: i === 1 ? "Selamat Datang di Daily Messages! 🎉" : `Pesan Hari ke-${i}`,
            text: `Halo Sayang! Ini adalah pesan hari ke-${i} untuk pean. ❤️`,
            photo: null,
            audio: null
        });
    }
    return sampleMessages;
}

/* ==========================================================================
   3. RENDER GRID
   ========================================================================== */
function renderCapsules(filter = 'all') {
    activeFilter = filter;
    const grid = document.getElementById('capsules-grid');
    grid.innerHTML = '';
    const currentDay = calculateCurrentDay();

    const unlockedCount = Math.min(Math.max(currentDay, 0), TOTAL_DAYS);
    const percentage = Math.round((unlockedCount / TOTAL_DAYS) * 100);
    document.getElementById('current-day-badge').innerText = `Hari ke-${Math.max(1, currentDay)}`;
    document.getElementById('progress-percentage').innerText = `${percentage}% Terbuka`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;

    if (currentDay < 1) {
        document.getElementById('days-remaining').innerText = `dimulai dalam ${Math.abs(currentDay - 1)} hari lagi!`;
    } else if (currentDay <= TOTAL_DAYS) {
        document.getElementById('days-remaining').innerText = `${TOTAL_DAYS - currentDay} Pesan tersisa.`;
    } else {
        document.getElementById('days-remaining').innerText = `Semua pesan telah terbuka! 🎉`;
    }

    ['all', 'unlocked', 'locked'].forEach(f => {
        const btn = document.getElementById(`filter-${f}`);
        if (f === filter) {
            btn.className = "px-4 py-2 rounded-full bg-love-red text-white shadow-sm transition";
        } else {
            btn.className = "px-4 py-2 rounded-full bg-white text-gray-600 shadow-sm hover:bg-rose-50 transition";
        }
    });

    messagesData.forEach(msg => {
        const isUnlocked = msg.day <= currentDay;
        const isToday = msg.day === currentDay;

        if (filter === 'unlocked' && !isUnlocked) return;
        if (filter === 'locked' && isUnlocked) return;

        const card = document.createElement('div');
        card.onclick = () => openCapsule(msg.day);

        if (isUnlocked) {
            if (isToday) {
                card.className = "bg-gradient-to-b from-rose-500 to-love-red text-white p-5 rounded-3xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 relative flex flex-col items-center justify-center min-h-[140px] capsule-today border-2 border-white";
                card.innerHTML = `
                    <div class="absolute -top-3 bg-yellow-400 text-deep-rose text-[10px] font-bold px-3 py-0.5 rounded-full shadow">SPESIAL HARI INI! ✨</div>
                    <div class="text-3xl mb-1"><i class="fas fa-gift animate-bounce"></i></div>
                    <span class="font-bold text-lg">Hari #${msg.day}</span>
                    <span class="text-xs opacity-90 mt-1">Buka Sekarang</span>
                `;
            } else {
                card.className = "bg-white p-4 rounded-3xl shadow-sm border border-rose-100 hover:border-pink-300 cursor-pointer transform transition duration-200 hover:-translate-y-1 flex flex-col items-center justify-center min-h-[130px] text-center";
                card.innerHTML = `
                    <div class="w-10 h-10 rounded-2xl bg-rose-50 text-love-red flex items-center justify-center mb-2 text-lg"><i class="fas fa-envelope-open-text"></i></div>
                    <span class="font-bold text-gray-700 text-sm">Hari #${msg.day}</span>
                    <span class="text-[10px] text-green-500 font-medium mt-1 flex items-center gap-1"><i class="fas fa-check-circle"></i> Terbuka</span>
                `;
            }
        } else {
            card.className = "bg-gray-50 p-4 rounded-3xl border border-gray-200 cursor-pointer opacity-75 hover:opacity-100 transition flex flex-col items-center justify-center min-h-[130px] text-center";
            card.innerHTML = `
                <div class="w-10 h-10 rounded-2xl bg-gray-200 text-gray-400 flex items-center justify-center mb-2 text-lg"><i class="fas fa-lock"></i></div>
                <span class="font-semibold text-gray-400 text-sm">Hari #${msg.day}</span>
                <span class="text-[10px] text-gray-400 mt-1">Terkunci</span>
            `;
        }
        grid.appendChild(card);
    });
}

/* ==========================================================================
   4. MODAL INTERAKSI
   ========================================================================== */
function openCapsule(dayNumber) {
    const currentDay = calculateCurrentDay();
    const message = messagesData.find(m => m.day === dayNumber);
    if (!message) return;

    if (dayNumber > currentDay) {
        document.getElementById('lock-modal-desc').innerText = `Sabar yahh... Pesan Hari ke-${dayNumber} baru bisa dibuka pada tanggal harinyaa humph`;
        showModal('lock-modal');
    } else {
        document.getElementById('modal-day-badge').innerText = `Hari ke-${message.day}`;
        document.getElementById('modal-title').innerText = message.title;
        document.getElementById('modal-date').innerText = message.date || '';
        document.getElementById('modal-text').innerText = message.text || message.message || '';

        const photoContainer = document.getElementById('modal-photo-container');
        const photoImg = document.getElementById('modal-photo');
        if (message.photo || message.image) {
            photoImg.src = message.photo || message.image;
            photoContainer.classList.remove('hidden');
        } else {
            photoContainer.classList.add('hidden');
        }

        const audioContainer = document.getElementById('modal-audio-container');
        const audioPlayer = document.getElementById('modal-audio-player');
        if (message.audio) {
            audioPlayer.src = message.audio;
            audioContainer.classList.remove('hidden');
        } else {
            audioContainer.classList.add('hidden');
            audioPlayer.pause();
        }
        showModal('message-modal');
    }
}

function showModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('div').classList.remove('scale-95');
        modal.querySelector('div').classList.add('scale-100');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('message-modal');
    document.getElementById('modal-audio-player').pause();
    modal.classList.add('opacity-0');
    modal.querySelector('div').classList.remove('scale-100');
    modal.querySelector('div').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function closeLockModal() {
    const modal = document.getElementById('lock-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

/* ==========================================================================
   5. AUDIO & PLAYLIST SYSTEM
   ========================================================================== */
function initBGM() {
    const player = document.getElementById('bgm-player');
    loadBgmSong(currentBgmIndex);
    renderPlaylistUI();

    // Aturan Browser: Autoplay baru akan aktif setelah interaksi klik pertama di halaman web
    const handleFirstInteraction = () => {
        if (!isBgmPlaying) {
            playBgm();
        }
        document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);

    // Otomatis putar lagu berikutnya jika lagu saat ini habis
    player.onended = () => {
        nextBGM();
    };
}

function loadBgmSong(index) {
    const player = document.getElementById('bgm-player');
    const song = BGM_PLAYLIST[index];
    player.src = song.src;
    document.getElementById('bgm-title').innerText = song.title;
    highlightActivePlaylist(index);
}

function toggleBGM() {
    if (isBgmPlaying) {
        pauseBgm();
    } else {
        playBgm();
    }
}

function playBgm() {
    const player = document.getElementById('bgm-player');
    player.play().then(() => {
        isBgmPlaying = true;
        document.getElementById('bgm-icon').className = "fas fa-pause";
        document.getElementById('bgm-status').innerText = "Sedang Memutar";
    }).catch(err => {
        console.log("Autoplay / File audio belum tersedia:", err);
        document.getElementById('bgm-status').innerText = "Klik Play/Ganti Lagu";
    });
}

function pauseBgm() {
    const player = document.getElementById('bgm-player');
    player.pause();
    isBgmPlaying = false;
    document.getElementById('bgm-icon').className = "fas fa-music";
    document.getElementById('bgm-status').innerText = "Dihentikan";
}

function nextBGM() {
    currentBgmIndex = (currentBgmIndex + 1) % BGM_PLAYLIST.length;
    loadBgmSong(currentBgmIndex);
    playBgm();
}

function selectSong(index) {
    currentBgmIndex = index;
    loadBgmSong(currentBgmIndex);
    playBgm();
    togglePlaylist(); // Tutup dropdown setelah memilih
}

function togglePlaylist() {
    const box = document.getElementById('playlist-box');
    box.classList.toggle('hidden');
}

function renderPlaylistUI() {
    const container = document.getElementById('playlist-items');
    container.innerHTML = '';
    BGM_PLAYLIST.forEach((song, index) => {
        const item = document.createElement('div');
        item.id = `playlist-item-${index}`;
        item.className = "playlist-item p-2 rounded-xl cursor-pointer flex justify-between items-center text-gray-700";
        item.innerHTML = `<span>${song.title}</span> <i class="fas fa-play text-[10px] text-rose-400"></i>`;
        item.onclick = () => selectSong(index);
        container.appendChild(item);
    });
}

function highlightActivePlaylist(index) {
    BGM_PLAYLIST.forEach((_, i) => {
        const el = document.getElementById(`playlist-item-${i}`);
        if (el) {
            if (i === index) {
                el.className = "playlist-item p-2 rounded-xl cursor-pointer flex justify-between items-center bg-rose-100 font-semibold text-love-red";
            } else {
                el.className = "playlist-item p-2 rounded-xl cursor-pointer flex justify-between items-center text-gray-700";
            }
        }
    });
}

/* ==========================================================================
   6. FLOATING HEARTS & INIT
   ========================================================================== */
function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartIcons = ['💖', '💕', '💗', '❤️', '🌸'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${6 + Math.random() * 6}s`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        heart.style.fontSize = `${14 + Math.random() * 16}px`;
        container.appendChild(heart);
    }
}

window.onload = async function () {
    await loadMessagesData();
    renderCapsules('all');
    initBGM();
    createHearts();
};
