let card_play = document.getElementsByClassName("play");
let audio = document.getElementById('audio');
let search_opt = document.getElementById('search-opt');
let search_bar = document.getElementById('search-bar');
let search_btn = document.getElementById('search-btn');

let audio_list = [];
let cur_aud = -1;

let menu = document.getElementsByClassName('left')[0];
let ham = document.getElementById("collapse")
let main = document.getElementsByClassName('right')[0];


// Managing the screen width and the left navigation side bar

if (window.innerWidth > 950) {
    ham.style.display = 'none';
}

if (window.innerWidth <= 950) {
    menu.style.width = '0%';
    menu.style.overflow = 'hidden';
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 950) {
        ham.style.display = 'none';
        if (window.innerWidth > 680) {
            menu.style.width = '25%';
            ham.style.left = '19%'
            main.style.width = 'calc(100vw - 25%)'
        }
        else {
            menu.style.width = '60%';
            ham.style.left = '50%'
            main.style.width = '99%'
        }



        main.style.margin = '10px 10px 10px 0px'
    }

    if (window.innerWidth <= 950) {
        ham.style.display = 'block';
        menu.style.width = '0%';
        menu.style.overflow = 'hidden';
        ham.style.left = '0.5%'
        main.style.width = '98%'
    }
})


ham.addEventListener('click', () => {

    if (menu.style.width == '0%') {
        if (window.innerWidth > 680) {
            menu.style.width = '25%';
            ham.style.left = '19%'
            main.style.width = 'calc(100vw - 25%)'
        }
        else {
            menu.style.width = '60%';
            ham.style.left = '50%';
            main.style.width = '99%'
        }


        main.style.margin = '10px 10px 10px 0px'
    }
    else {
        menu.style.width = '0%';
        menu.style.overflow = 'hidden';
        ham.style.left = '0.5%';
        main.style.width = '98%';
    }
})


// Handling the search bar events
search_opt.addEventListener('click', (event) => {

    if (search_bar.style.height === '0px') {

        event.stopPropagation();
        document.getElementById('search-bar').style.height = 'fit-content';
    }
    else {
        document.getElementById('search-bar').style.height = '0px';
    }

})

document.addEventListener('click', (event) => {
    if (!search_bar.contains(event.target)) {
        search_bar.style.height = '0px';
        document.getElementById('bar').value = '';
    }
})


// play button on all cards
function play(song_url) {
    let audio = document.getElementById('audio');
    audio.src = song_url;
    audio.play()
    let pause_play = document.getElementById('pause-play')
    pause_play.innerHTML = '<i class="fa-solid fa-pause"></i>'

    clearInterval(audio.interval_id);

    audio.interval_id = setInterval(() => {
        let audio = document.getElementById('audio');
        let duration = document.getElementById('duration');
        let total_duration = audio.duration;
        let total_min = Math.trunc(total_duration / 60);
        let total_sec = Math.trunc((total_duration - total_min * 60));

        let current = audio.currentTime;
        let current_min = Math.trunc(current / 60);
        let current_sec = Math.trunc((current - current_min * 60));

        duration.innerHTML = `${current_min.toString().padStart(2, '0')}:${current_sec.toString().padStart(2, '0')}/${total_min.toString().padStart(2, '0')}:${total_sec.toString().padStart(2, '0')}`;


        let tracker = document.getElementById('tracker');
        tracker.style.left = `${(100 / total_duration) * current}%`;

    }, 100)
}


// fetching information from the query of search bar through api
async function search_fetch() {

    let img = document.getElementsByClassName('img-wrap');
    let art_name = document.getElementsByClassName('art-name');
    let card_desc = document.getElementsByClassName('card-desc');

    for (let i of img){
        i.style.backgroundImage = `url(img/loading.webp)`;
    }
    for (let i of art_name){
        i.innerText = "...";
    }
    for(let i of card_desc){
        i.innerText = '...';
    }
    

    let query = document.getElementById('bar').value;
    let card = document.getElementsByClassName('card');

    document.getElementById('new-head').innerText = `Top Searches for "${query}"`;
    document.getElementById('new-head').style.height = 'fit-content';

    const url_id = `https://spotify23.p.rapidapi.com/search/?q=${query}&type=multi&offset=0&limit=10&numberOfTopResults=5`;
    const options_id = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'fb3fd110b1msh4c25bdd19059bf2p1d2b14jsnbb4a27f8212d',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    const response = await fetch(url_id, options_id);
    const result = await response.json();

    document.getElementsByClassName('card-head')[0].children[0].innerText = "Songs";
    document.getElementsByClassName('card-head')[1].children[0].innerText = "Albums";
    document.getElementsByClassName('card-head')[2].children[0].innerText = "Playlists";

    for (let i = 0; i < 7; i++) {
        card[i].children[0].style.backgroundImage = `url(${result.tracks.items[i].data.albumOfTrack.coverArt.sources[0].url}`;
        card[i].children[1].innerText = `${result.tracks.items[i].data.name}`;
        card[i].children[2].innerText = `${result.tracks.items[i].data.artists.items[0].profile.name}`;
        card[i].setAttribute('data-id', `${result.tracks.items[i].data.id}`);
    }

    for (let i = 7; i < 14; i++) {
        card[i].children[0].style.backgroundImage = `url(${result.albums.items[i - 7].data.coverArt.sources[0].url})`;
        card[i].children[1].innerText = `${result.albums.items[i - 7].data.name}`;
        card[i].children[2].innerText = '';
        let id = result.albums.items[i - 7].data.uri.split(":")[2];
        card[i].setAttribute('data-id', `${id}`);
    }

    for (let i = 14; i < 21; i++) {
        card[i].children[0].style.backgroundImage = `url(${result.playlists.items[i - 14].data.images.items[0].sources[0].url})`;
        card[i].children[1].innerText = `${result.playlists.items[i - 14].data.name}`;
        if(!(result.playlists.items[i - 14].data.description.startsWith('<a'))){
            card[i].children[2].innerText = `${result.playlists.items[i - 14].data.description}`;
        }
        else{
            card[i].children[2].innerText = ``;
        }
        
        let id = result.albums.items[i - 14].data.uri.split(":")[2];
        card[i].setAttribute('data-id', `${id}`);
    }

}


search_btn.addEventListener('click', search_fetch);



// fetching songs through api
async function songs_play(e) {

    audio_list = [];

    let pause_play = document.getElementById('pause-play')
    pause_play.innerHTML = '<i class="fa-solid fa-spinner"></i>';

    let playing = document.getElementsByClassName('playing');
    for (let i of playing){
        i.style.display = 'none';
    }

    let id = e.currentTarget.closest(".card").getAttribute('data-id');
    let cur_ico = e.currentTarget.parentElement.children[0];

    const url = `https://spotify23.p.rapidapi.com/tracks/?ids=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'fb3fd110b1msh4c25bdd19059bf2p1d2b14jsnbb4a27f8212d',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    let response = await fetch(url, options);
    let result = await response.json();

    play(result.tracks[0].preview_url);

    cur_ico.style.display = 'block';
}


// fetching playlists through api
async function playlists_play(e) {

    let pause_play = document.getElementById('pause-play')
    pause_play.innerHTML = '<i class="fa-solid fa-spinner"></i>';

    let playing = document.getElementsByClassName('playing');
    for (let i of playing){
        i.style.display = 'none';
    }

    let id = e.currentTarget.closest(".card").getAttribute('data-id');
    let cur_ico = e.currentTarget.parentElement.children[0];

    const url = `https://spotify23.p.rapidapi.com/playlist_tracks/?id=${id}&offset=0&limit=100`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'fb3fd110b1msh4c25bdd19059bf2p1d2b14jsnbb4a27f8212d',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    let response = await fetch(url, options);
    let result = await response.json();

    console.log(result);

    audio_list = [];

    for (let i = 0; i < result.items.length; i++) {
        audio_list.push([result.items[i].track.preview_url, result.items[i].track.id]);
    }

    play(audio_list[0][0]);
    cur_aud++;

    cur_ico.style.display = 'block';
}


// fetching album info and songs through api
async function album_play(e) {

    let pause_play = document.getElementById('pause-play')
    pause_play.innerHTML = '<i class="fa-solid fa-spinner"></i>';

    let playing = document.getElementsByClassName('playing');
    for (let i of playing){
        i.style.display = 'none';
    }


    let id = e.currentTarget.closest(".card").getAttribute('data-id');
    let cur_ico = e.currentTarget.parentElement.children[0];

    const url = `https://spotify23.p.rapidapi.com/album_tracks/?id=${id}&offset=0&limit=300`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'fb3fd110b1msh4c25bdd19059bf2p1d2b14jsnbb4a27f8212d',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    let response = await fetch(url, options);
    let result = await response.json();

    console.log(result);

    audio_list = [];

    for (let i = 0; i < (result.data.album.tracks.items.length); i++) {
        audio_list.push(result.data.album.tracks.items[i].track.uri.split(":")[2]);
    }

    album_song_play(audio_list[0]);
    cur_aud++;

    cur_ico.style.display = 'block';

}

async function album_song_play(id) {

    let pause_play = document.getElementById('pause-play')
    pause_play.innerHTML = '<i class="fa-solid fa-spinner"></i>';

    const url = `https://spotify23.p.rapidapi.com/tracks/?ids=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'fb3fd110b1msh4c25bdd19059bf2p1d2b14jsnbb4a27f8212d',
            'x-rapidapi-host': 'spotify23.p.rapidapi.com'
        }
    };

    let response = await fetch(url, options);
    let result = await response.json();

    play(result.tracks[0].preview_url);
}


// attaching event handlers for all cards
for (let i = 0; i < 7; i++) {
    card_play[i].addEventListener('click', songs_play);
}

for (let i = 7; i < 14; i++) {
    card_play[i].addEventListener('click', album_play);
}

for (let i = 14; i < 21; i++) {
    card_play[i].addEventListener('click', playlists_play);
}


// handling the audio player when ended and play if playlists or album has next
audio.addEventListener('ended', () => {

    let playing = document.getElementsByClassName('playing');
    for (let i of playing){
        i.style.display = 'none';
    }
    
    clearInterval(audio.intervalId);
    pause_play.innerHTML = '<i class="fa-solid fa-play"></i>';



    if (audio_list.length > cur_aud + 1) {
        cur_aud++;
        if (Array.isArray(audio_list[0])) {
            console.log(audio_list[cur_aud][1]);
            play(audio_list[cur_aud][0]);
        }
        else {
            console.log(audio_list[cur_aud]);
            album_song_play(audio_list[cur_aud]);
        }
    }
});


// handling pause-play button of audio player
let pause_play = document.getElementById('pause-play')
pause_play.addEventListener('click', () => {

    let myAudio = document.getElementById('audio')

    if (myAudio.paused && myAudio.currentTime > 0 && !myAudio.ended) {
        pause_play.innerHTML = '<i class="fa-solid fa-pause"></i>'
        document.getElementById('audio').play();
    }
    else {
        document.getElementById('audio').pause()
        pause_play.innerHTML = '<i class="fa-solid fa-play"></i>'
    }
})


// handling seekbar movement
let seekbar = document.getElementById("length");
seekbar.addEventListener('click', (e) => {

    let rect = seekbar.getBoundingClientRect();
    let clickPositionX = e.clientX - rect.left;
    let totalWidth = rect.width;
    let clickPercentage = (clickPositionX / totalWidth);

    let tracker = document.getElementById('tracker');
    tracker.style.left = `${clickPercentage * 100}%`;
    audio.currentTime = clickPercentage * audio.duration;

})
