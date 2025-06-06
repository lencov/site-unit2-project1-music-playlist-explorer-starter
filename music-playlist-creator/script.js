import { defaultImage } from './constants/constants.js';
import { handleLikeButtonAndCount } from './utils/utils.js';

const span = document.getElementsByClassName("close")[0];

document.addEventListener("DOMContentLoaded", () => {
  displayPlaylists();
});

const createButton = document.getElementById("createButton");
createButton.addEventListener('click', () => {
    document.getElementById("playlistFormModal").style.display = "block";
})

// close modals
span.onclick = function() {
   document.getElementById("playlistModal").style.display = "none";
}
window.onclick = function(event) {
   if (event.target == document.getElementById("playlistModal")) {
      document.getElementById("playlistModal").style.display = "none";
   }
}
const formCloseButton = document.getElementById("formClose");
formCloseButton.onclick = function() {
   document.getElementById("playlistFormModal").style.display = "none";
}


function openModal(playlist) {
   console.log('openModal is being called');
   console.log(playlist)
   document.getElementById('modalTitle').innerText = playlist.name;
   document.getElementById('modalImage').src = playlist.imageUrl || defaultImage;
   document.getElementById('modalAuthor').innerText = `By: ${playlist.author}`;
   
   const songList = document.getElementById('modalSongList');
   songList.innerHTML = "";

    const likeButton = document.getElementById('modalLikeButton');
    const likeCount = document.getElementById('modalLikeCount');

    handleLikeButtonAndCount(likeButton, likeCount, playlist);

    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener("click", () => {
        shuffleSongsinModal();
    })

   playlist.songs.forEach(song => {
    const li = document.createElement('li');
    
    const titleSpan = document.createElement("span");
    titleSpan.className = "song-title";
    titleSpan.textContent = song.title;

    const artistSpan = document.createElement("span");
    artistSpan.className = "song-artist";
    artistSpan.textContent = ` By: ${song.artist}`;

    const durationSpan = document.createElement("span");
    durationSpan.className = "song-duration";
    durationSpan.textContent = ` (${song.duration})`;

    li.append(titleSpan);
    li.append(artistSpan);
    li.append(durationSpan);

    songList.append(li);
   });

   document.getElementById("playlistModal").style.display = "block";
}

function displayPlaylists(){
    const container = document.querySelector('.playlist-cards');
    container.innerHTML = "";

    playlists.forEach( playlist => {
        const card = document.createElement('div');
        card.className = 'card'
        card.dataset.playlistId= playlist.id;

        card.innerHTML = `
            <img src="${playlist.imageUrl || defaultImage}" alt="Playlist Cover" onerror="this.onerror=null; this.src='assets/img/playlist.png';" class="card-img" class="card-img">
            <h3 class="card-title">${playlist.name}</h3>
            <p class="card-author">by ${playlist.author}</p>
            <p class="card-likes">42 likes</p>
        `;
    
        card.addEventListener('click', () => {
            openModal(playlist);
        });

        container.appendChild(card);
    });
}

function shuffleSongsinModal(){
    const songList = document.getElementById("modalSongList");
    const songs = Array.from(songList.children);
    const shuffledSongs = songs.map( song => [Math.random(), song]).sort((a,b) => a[0] - b[0]);
    const clenaedSongs = shuffledSongs.map(pair => pair[1]);
    songList.innerHTML = '';
    clenaedSongs.forEach(li => songList.appendChild(li));
}

function createNewPlaylist(name, author, imageUrl, songs){
    const id = playlistCount
    playlistCount += 1;

    const newPlaylist = {
        id: id,
        name: name,
        imageUrl: imageUrl,
        author: author,
        likeCount: 0,
        likedByUser: false,
        songs: songs
    }

    playlists.push(newPlaylist);

    displayPlaylists();
    document.getElementById("playlistFormModal").style.display = "none";
}

document.getElementById("addSongButton").addEventListener("click", () => {
  const container = document.getElementById("songListFields");

  const songDiv = document.createElement("div");
  songDiv.classList.add("song-entry");

  songDiv.innerHTML = `
    <input type="text" name="songTitle" placeholder="Song Title" required />
    <input type="text" name="songArtist" placeholder="Artist" required />
    <input type="text" name="songDuration" placeholder="Duration (e.g. 3:30)" required />
  `;

  container.appendChild(songDiv);
});

document.getElementById("playlistForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const playlistName = e.target.playlistName.value;
    const author = e.target.author.value;
    const image = e.target.imageUrl.value
  
    const songEntries = document.querySelectorAll(".song-entry");
    const songs = [];
  
    songEntries.forEach(entry => {
      const title = entry.querySelector('[name="songTitle"]').value.trim;
      const artist = entry.querySelector('[name="songArtist"]').value.trim;
      const duration = entry.querySelector('[name="songDuration"]').value.trim;
  
      songs.push({ title, artist, duration });
    });

    createNewPlaylist(playlistName, author, image, songs);

    document.getElementById("playlistFormModal").style.display = "none";
});

