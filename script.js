let currSong = new Audio();
let isSongLoaded = false;
let songs = [];
let currentIndex = 0;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

async function getSongs() {
    return [
        {
            name: "Piyu Bole (Parineeta)",
            artist: "Shreya Ghoshal, Sonu Nigam",
            file: "songs/Piyu Bole (Parineeta) - (Raag.Fm).mp3"
        },
        {
            name: "Saathiya",
            artist: "Sonu Nigam",
            file: "songs/Saathiya - (Raag.Fm).mp3"
        },
        {
            name: "Kesariya (Brahmastra)",
            artist: "Arijit Singh",
            file: "songs/Kesariya (Brahmastra) - (Raag.Fm).mp3"
        },
        {
            name: "Kalank Duet",
            artist: "Arijit Singh, Shilpa Rao",
            file: "songs/Kalank Duet - (Raag.Fm).mp3"
        },
        {
            name: "Fakira",
            artist: "Sanam Puri, Neeti Mohan",
            file: "songs/Fakira - (Raag.Fm).mp3"
        },
        {
            name: "Duniya",
            artist: "Akhil, Dhvani Bhanushali",
            file: "songs/Duniya - (Raag.Fm).mp3"
        },
        {
            name: "Mere Sohneya",
            artist: "Sachet Tandon, Parampara Tandon",
            file: "songs/Mere Sohneya - (Raag.Fm).mp3"
        },
        {
            name: "Kaise Hua",
            artist: "Vishal Mishra",
            file: "songs/Kaise Hua - (Raag.Fm).mp3"
        },
        {
            name: "Tujhe Kitna Chahne Lage",
            artist: "Arijit Singh",
            file: "songs/Tujhe Kitna Chahne Lage - (Raag.Fm).mp3"
        },
        {
            name: "Ishq Hai",
            artist: "Ankit Tiwari",
            file: "songs/Ishq Hai - (Raag.Fm).mp3"
        }
    ];
}

function playMusic(index, pause = false) {
    currentIndex = index;
    currSong.src = songs[currentIndex].file;

    if (!pause) {
        currSong.play();
        document.getElementById("play").src = "pause.svg";
    }

    isSongLoaded = true;
    document.querySelector(".song-info").innerHTML =
        `${songs[currentIndex].name} - ${songs[currentIndex].artist}`;
    document.querySelector(".song-time").innerHTML = "00:00/00:00";
}

async function main() {
    songs = await getSongs();

    let ul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    ul.innerHTML = "";

    // Populate the UI list
    songs.forEach((song, idx) => {
        ul.innerHTML += `
            <li class="music">
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                    <div>${song.name}</div>
                    <div id="artist">${song.artist}</div>
                </div>
                <img id="playNow" class="invert" src="play.svg" alt="">
            </li>`;
    });

    // Attach event listeners to list items
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach((li, idx) => {
        li.addEventListener("click", () => {
            playMusic(idx);
        });
    });

    // Play/Pause button
    const playBtn = document.getElementById("play");
    playBtn.addEventListener("click", () => {
        if (!isSongLoaded && songs.length > 0) {
            playMusic(0);
        } else if (currSong.paused) {
            currSong.play();
            playBtn.src = "pause.svg";
        } else {
            currSong.pause();
            playBtn.src = "play.svg";
        }
    });

    // Time update
    currSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML =
            `${formatTime(Math.floor(currSong.currentTime))} / ${formatTime(Math.floor(currSong.duration))}`;
        document.querySelector(".circle").style.left = (currSong.currentTime / currSong.duration) * 100 + "%";
    });

    // Seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currSong.currentTime = (currSong.duration * percent) / 100;
    });

    // Prev button
    const prevBtn = document.getElementById("prev");
    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            playMusic(currentIndex - 1);
        }
    });

    // Next button
    const nextBtn = document.getElementById("next");
    nextBtn.addEventListener("click", () => {
        if (currentIndex < songs.length - 1) {
            playMusic(currentIndex + 1);
        }
    });
}

main();
