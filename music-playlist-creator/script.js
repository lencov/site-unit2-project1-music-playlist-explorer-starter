import { defaultImage } from './constants/constants.js';
import { addLike, removeLike, syncLikeOnCard, deletePlaylist, applyEdit } from './utils/utils.js';

const span = document.getElementsByClassName("close")[0];

const playlistFormModal = document.getElementById('playlistFormModal');
const formTitle         = document.getElementById('formTitle');
const playlistNameInp   = document.getElementById('playlistName');
const playlistAuthorInp = document.getElementById('playlistAuthor');
const playlistImageInp  = document.getElementById('playlistImage');

document.addEventListener("DOMContentLoaded", () => {
  displayPlaylists();
});

const createButton = document.getElementById("createButton");
createButton.addEventListener('click', () => {
    document.getElementById("playlistFormModal").style.display = "flex";
})

// close modal listeners
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

// current playlist opened in modal
let currentPlaylist = null;

function openModal(playlist) {
    currentPlaylist = playlist;
    console.log('openModal is being called');
    console.log(playlist)
    document.getElementById('modalTitle').innerText = playlist.name;
    const img = document.getElementById('modalImage');
    img.onerror = () => {
        img.onerror = null;
        img.src = 'assets/img/playlist.png';
    };
    img.src = playlist.imageUrl || defaultImage;

    document.getElementById('modalAuthor').innerText = `By: ${playlist.author}`;
    
    const songList = document.getElementById('modalSongList');
    songList.innerHTML = "";

    const likeButton = document.getElementById('modalLikeButton');
    const likeCount = document.getElementById('modalLikeCount');

    handleLike(likeButton, likeCount, playlist);

    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.addEventListener("click", () => {
        shuffleSongsinModal();
    });

    const editButton = document.getElementById("modalEditButton");
    editButton.addEventListener("click", () => {
        openEditForm(playlist);
    });

    const deleteButton = document.getElementById("modalDeleteButton");
    deleteButton.addEventListener("click", () => {
        const playlistId = playlist.id;
        deletePlaylist(playlistId, playlists);
    });

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

   document.getElementById("playlistModal").style.display = "flex";
}

function displayPlaylists(){
    const container = document.querySelector('.playlist-cards');
    container.innerHTML = "";

    playlists.forEach( playlist => {
        const card = buildCard(playlist);
        container.appendChild(card);
    });
}

function buildCard(playlist){
    const card = document.createElement('div');
    card.className = 'card'
    card.dataset.id= playlist.id;
    card.innerHTML = `
      <img src="${playlist.imageUrl || defaultImage}" class="card-img">
      <h3>${playlist.name}</h3>
      <p class="card-author">by ${playlist.author}</p>
      <p class="card-likes">${playlist.likeCount} likes</p>
      <span class="likeButton ${playlist.likedByUser ? 'liked' : ''}"></span>
      <button class="edit-btn">Edit</button>
      <button class="del-btn">Delete</button>`;

    const img = card.querySelector('.card-img');
        img.onerror = () => {
            img.onerror = null;                 // avoid loop if default also fails
            img.src = defaultImage;
        };

    card.addEventListener('click', () => {
        openModal(playlist);
    });

    card.querySelector('.likeButton').addEventListener('click', ev => {
        ev.stopPropagation();
        if (playlist.likedByUser){
            removeLike(playlist);
        } else{
            addLike(playlist);
        }
        syncLikeOnCard(playlist);
  });

    card.querySelector('.del-btn').addEventListener('click', e => {
        e.stopPropagation();
        deletePlaylist(playlist.id, playlists);
        displayPlaylists();
    });

    card.querySelector('.edit-btn').addEventListener('click', e => {
        e.stopPropagation();
        openEditForm(playlist);
    });

    return card;
}

function handleLike(button, countElement, playlist){
    const newButton = button.cloneNode(true);
    button.replaceWith(newButton);

    newButton.addEventListener("click", event => {
        if(playlist.likedByUser){
            removeLike(playlist);
        }else{
            addLike(playlist);
        }
        updateUI();
        syncLikeOnCard(playlist);
        event.stopPropagation();
    });

    function updateUI() {
        newButton.classList.toggle('liked', playlist.likedByUser);
        countElement.textContent = `${playlist.likeCount} Likes`;
    }
}

function shuffleSongsinModal(){
    const songList = document.getElementById("modalSongList");
    const songs = Array.from(songList.children);
    const shuffled = songs
         .map(el => [Math.random(), el])
         .sort((a,b)=>a[0]-b[0])
         .map(pair=>pair[1]);

   songList.innerHTML = '';
   shuffled.forEach(li => songList.appendChild(li));

    currentPlaylist.songs = shuffled.map(li => ({
        title : li.querySelector('.song-title').textContent,
        artist : li.querySelector('.song-artist').textContent.slice(4),
        duration : li.querySelector('.song-duration').textContent.slice(2,-1)
    }));
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

function openEditForm(playlist) {
    
    editingId = playlist.id;
    formTitle.textContent = 'Edit Playlist';
    playlistNameInp.value = playlist.name;
    playlistAuthorInp.value = playlist.author;
    playlistImageInp.value = playlist.imageUrl || '';

    rebuildSongRows(playlist.songs);
    playlistFormModal.style.display = 'flex';
}

function rebuildSongRows(songs) {
    const container = document.getElementById('songListFields');
    container.innerHTML = '';
    songs.forEach(({title,artist,duration}) => {
       const row = document.createElement('div');
       row.className = 'song-entry';
       row.innerHTML = `
          <input type="text" name="songTitle"  value="${title}"   required>
          <input type="text" name="songArtist" value="${artist}"  required>
          <input type="text" name="songDuration" value="${duration}" required>`;
       container.appendChild(row);
    });
}

let editingId = null; 

document.getElementById("playlistForm").addEventListener("submit", e => {
    e.preventDefault();

    const data = collectFormData();

    if (editingId === null) {
        createNewPlaylist(data.name, data.author, data.imageUrl, data.songs);
    } else {
        applyEdit(editingId, data, playlists);
        editingId = null;
        formTitle.textContent = 'Create Playlist';
    }

    playlistFormModal.style.display = 'none';
    displayPlaylists();

    playlistNameInp.value   = '';
    playlistAuthorInp.value = '';
    playlistImageInp.value  = '';
    document.getElementById('songListFields').innerHTML =
        `<div class="song-entry">
           <input type="text" name="songTitle" placeholder="Song Title" required/>
           <input type="text" name="songArtist" placeholder="Artist" required/>
           <input type="text" name="songDuration" placeholder="Duration (e.g. 3:30)" required/>
         </div>`;
});

function collectFormData() {
    const title = playlistNameInp.value.trim();
    const author = playlistAuthorInp.value.trim();
    const imgUrl = playlistImageInp.value.trim();

    const songs = Array.from(
        document.querySelectorAll('.song-entry')
    ).map(entry => ({
        title : entry.querySelector('[name="songTitle"]').value.trim(),
        artist : entry.querySelector('[name="songArtist"]').value.trim(),
        duration : entry.querySelector('[name="songDuration"]').value.trim()
    }));

    return { name: title, author, imageUrl: imgUrl, songs };
}

const modalDeleteBtn = document.getElementById("modalDeleteButton");
modalDeleteBtn.addEventListener("click", () => {
    deletePlaylist(currentPlaylist.id, playlists);
    displayPlaylists();
});
