let currSong=new Audio();
let isSongLoaded = false; 
let songs;

function formatTime(seconds) {
    // Calculate the number of minutes
    const minutes = Math.floor(seconds / 60);
    // Calculate the remaining seconds
    const remainingSeconds = seconds % 60;
    // Format seconds to always show two digits (e.g., 05 instead of 5)
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    // Return the formatted time as a string
    return `${minutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            const fileName = decodeURIComponent(element.href.split("/songs/")[1]);
            songs.push(fileName); // Keep the decoded file name for display purposes
        }
    }
    return songs;
}

const playMusic = (track,pause=false) => {
    //let audio = new Audio(`http://127.0.0.1:3000/songs/${encodeURIComponent(track)}`);
    currSong.src=`http://127.0.0.1:3000/songs/${encodeURIComponent(track)}`;
    if(!pause){
        currSong.play();
        play.src="pause.svg";
    }
    isSongLoaded = true;
    document.querySelector(".song-info").innerHTML=track
    document.querySelector(".song-time").innerHTML="00:00/00:00"
};


async function main() {
    // Getting list of all songs
    songs = await getSongs();
    console.log(songs);

    let ul = document.querySelector(".song-list").getElementsByTagName("ul")[0];
    ul.innerHTML = ""; // Clear the list before adding new items

    // Function to clean up the song name
    const cleanSongName = (song) => {
        return song
            .replaceAll("%20", " ") // Replace URL-encoded spaces
            .replace(/128\s?Kbps/i, "") // Remove "128 Kbps" if present
            .trim();
    };
    

    for (const song of songs) {
        const cleanedName = cleanSongName(song);

        ul.innerHTML += `<li class="music">
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div>${cleanedName}</div> <!-- Use cleaned song name here -->
                            <div id="artist">Artist</div>
                        </div>
                        <img id="playNow" class="invert" src="play.svg" alt="">
                        </li>`; 
    }
    //attach an eventlistener to each song
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=> {
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
    //attach event listener to next and previous
    play.addEventListener("click",()=>{
        if (!isSongLoaded && songs.length > 0) {
            // If no song is loaded, play the first song
            playMusic(songs[0]);
        } 
        else if(currSong.paused){
            currSong.play();
            play.src="pause.svg";
        }
        else{
            currSong.pause();
            play.src="play.svg";
        }
    })

    //time update event
    currSong.addEventListener("timeupdate", () => {
        console.log(currSong.currentTime, currSong.duration);
        document.querySelector(".song-time").innerHTML = 
            `${formatTime(Math.floor(currSong.currentTime))} / ${formatTime(Math.floor(currSong.duration))}`;
            document.querySelector(".circle").style.left=(currSong.currentTime/currSong.duration)*100+"%";
    });

    //add event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent +"%";
        //change song duration when the seekbar is selected in various positions
        currSong.currentTime=((currSong.duration)*percent)/100;
    })

    //Adding event listener to prev and next buttons
    //prev
    prev.addEventListener("click",()=>{
        console.log("Prev clicked")
        let currentFilename = decodeURIComponent(currSong.src.split("/").pop()); 
        let idx = songs.indexOf(currentFilename);
        if((idx-1)>=0){
            playMusic(songs[idx-1])
        }
        console.log(songs, idx);
    })
    //next
    next.addEventListener("click", () => {
        console.log("next clicked");
        let currentFilename = decodeURIComponent(currSong.src.split("/").pop()); 
        let idx = songs.indexOf(currentFilename);
        if((idx+1)>length){
            playMusic(songs[idx+1])
        }
        console.log(songs, idx);
    });
    
    
}



main()