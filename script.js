console.log("Let's write some JavaScript")

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Arjit Singh</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div></li>`;
    }

    // Attach an eventlistner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
    
}

const playMusic = (track, pause=false) => {
    currentSong.src = `/${currFolder}/` + track
    if(!pause){

        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 000:00"

}

async function displayAlbums(){
    console.log("displaying albums")
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let classContainer = document.querySelector(".classContainer")
    let array = Array.from(anchors)
        for(let index=0; index < array.length; index++){
            const e = array[index];

        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]

            // Get the matadata of the folder
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            classContainer.innerHTML = classContainer.innerHTML + `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25" cy="25" r="25" fill="green" />
                            <g transform="translate(12.5, 12.5) scale(1.0)">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    fill="black" stroke="none" stroke-width="1.5" stroke-linejoin="round" />
                            </g>
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`
        }
    }

     // Load the playlist whenever card is clicked
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {
    
    // Get the list of all songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()

    // Attach an event listner to play, next and previous
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
        })

        // Add an event listner to seekbar
        document.querySelector(".seekbar").addEventListener("click", e=>{
            let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration)* percent)/100
        })

        // Add an event listner to hamburger
        document.querySelector(".hamburger").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "0"
        })

        document.querySelector(".close").addEventListener("click", ()=>{
            document.querySelector(".left").style.left = "-120%"
        })    
        
        previous.addEventListener("click", ()=>{
            console.log("Previous Clicked")

            let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
            if((index - 1) >=0){
                playMusic(songs[index - 1])
            }
            
        })

        // Add an event listner to next
        next.addEventListener("click", ()=>{
            currentSong.pause()
            console.log("Next Clicked")

            let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
            if((index + 1) < songs.length){
                playMusic(songs[index + 1])
            }
        })

        // Add an event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
            console.log("Setting volume to ", e.target.value, "/ 100")
            currentSong.volume = parseInt(e.target.value)/100
            if(currentSong.volume > 0){
                document.querySelector(".volume img").src = document.querySelector(".volume img").src.replace("mute.svg", "volume.svg")
            }
        })

        // Add an event listner to mute the track
        document.querySelector(".volume img").addEventListener("click", e=>{
            if(e.target.src.includes("volume.svg")){
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                currentSong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else{
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                currentSong.volume = .10;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            }
        })
       
}
main()
