
const span = document.getElementsByClassName("close")[0];

function openModal(playlist) {
   console.log('openModal is being called');
   console.log(playlist)
   document.getElementById('modalTitle').innerText = playlist.name;
   document.getElementById('modalImage').src = playlist.imageUrl;
   document.getElementById('modalAuthor').innerText = `By: ${playlist.author}`;
   
   const songList = document.getElementById('modalSongList');
   songList.innerHTML = "";
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

// close modal
span.onclick = function() {
   document.getElementById("playlistModal").style.display = "none";
}
window.onclick = function(event) {
   if (event.target == document.getElementById("playlistModal")) {
      document.getElementById("playlistModal").style.display = "none";
   }
}

function displayPlaylists(){
    const container = document.querySelector('.playlist-cards');
    container.innerHTML = "";

    playlists.forEach( playlist => {
        const card = document.createElement('div');
        card.className = 'card'
        card.dataset.playlistId= playlist.id;

        card.innerHTML = `
            <img src="${playlist.imageUrl}" alt="Playlist Cover" class="card-img">
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

document.addEventListener("DOMContentLoaded", () => {
  displayPlaylists();
});

// create event listener for all playlist cards
const cards = document.querySelectorAll('.card');
cards.forEach( card => {
    const id = parseInt(card.dataset.playlistId);
    card.addEventListener('click', () => {
        console.log(`opening modal with playlist at index ${id}`)
        playlists.find(id )
        openModal(playlists[index]);
    })

});

