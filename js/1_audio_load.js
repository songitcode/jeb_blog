const audio = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-button');
const playIcon = document.getElementById('play-icon');
const rewindBtn = document.querySelector('.rewind-button');
const forwardBtn = document.querySelector('.fast-forward-button');
const backBtn = document.querySelector('.back-button');
const skipBtn = document.querySelector('.skip-button');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalDurationEl = document.getElementById('total-duration');
const volumeIcon = document.getElementById('volume-icon');
const volumeBar = document.getElementById('volume-bar');

let lastVolume = 1; // Lưu âm lượng trước khi mute

volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeBar.value = 0;
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        audio.volume = lastVolume;
        volumeBar.value = lastVolume;
        volumeIcon.className = (lastVolume > 0.5) ? 'fas fa-volume-up' : 'fas fa-volume-down';
    }
    const percent = volumeBar.value * 100;
    volumeBar.style.setProperty('--volume', `${percent}%`);
});
volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;

    if (audio.volume == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume <= 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }

    // Cập nhật màu thanh volume
    const percent = volumeBar.value * 100;
    volumeBar.style.setProperty('--volume', `${percent}%`);
});

progressBar.addEventListener('input', () => {
    const percent = (progressBar.value / progressBar.max) * 100;
    progressBar.style.setProperty('--progress', `${percent}%`);
    audio.currentTime = progressBar.value;
});

const playlist = [
    {
        src: '/music1_songsat_bray.mp3',
        title: 'Bray - Song Sắt'
    },
    {
        src: '/music2_an_lilwuyn.mp3',
        title: 'Lil Wuyn - An (feat. Minstu) [An album]'

    },
    {
        src: '/music3_naobietdau_lilwuyn.m4a',
        title: 'Lil Wuyn - Nào biết đâu(An album)'
    }
];
let currentTrack = 0;

// Load current song
function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    audio.load();
    audio.play();
    playIcon.className = 'fas fa-pause';

    // Hiển thị tên bài hát
    const titleElement = document.getElementById('song-title');
    titleElement.textContent = `${track.title}`;
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playIcon.className = 'fas fa-pause';
    } else {
        audio.pause();
        playIcon.className = 'fas fa-play';
    }
});

rewindBtn.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 5);
});

forwardBtn.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
});

backBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
});

skipBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
});

audio.addEventListener('loadedmetadata', () => {
    progressBar.max = Math.floor(audio.duration);
    totalDurationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);

    const percent = (progressBar.value / progressBar.max) * 100;
    progressBar.style.setProperty('--progress', `${percent}%`);
});

progressBar.addEventListener('input', () => {
    audio.currentTime = progressBar.value;
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

audio.addEventListener('ended', () => {
    skipBtn.click();
});

// Khởi động
let hasInteracted = false;
document.addEventListener('click', () => {
    if (!hasInteracted) {
        loadTrack(currentTrack); // chỉ gọi 1 lần sau tương tác
        hasInteracted = true;
    }
});

/////
const musicPrompt = document.getElementById('music-prompt');

musicPrompt.addEventListener('click', () => {
    loadTrack(currentTrack);
    musicPrompt.style.display = 'none';
});

setTimeout(() => {
    if (!audio.currentTime || audio.paused) {
        musicPrompt.innerText = "Bạn có muốn xem không? Nhấn đi...";
    }
}, 5000);