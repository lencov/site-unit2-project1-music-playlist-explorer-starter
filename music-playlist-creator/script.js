
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
    artistSpan.textContent = ` - ${song.artist}`;

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

// create event listener for all playlist cards
const cards = document.querySelectorAll('.card');
cards.forEach( card => {
    const index = parseInt(card.dataset.playlistIndex);
    card.addEventListener('click', () => {
        console.log(`opening modal with playlist at index ${index}`)
        openModal(playlists[index]);
    })

});

