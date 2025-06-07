export function addLike(playlist){
    playlist.likeCount += 1;
    playlist.likedByUser = true;
}

export function removeLike(playlist){
    playlist.likeCount -= 1;
    playlist.likedByUser = false;
}

export function syncLikeOnCard(playlist) {
  const card = document.querySelector(`.card[data-id="${playlist.id}"]`);
  if (card) {
    const text = card.querySelector('.card-likes');
    if(text){
        text.textContent = `${playlist.likeCount} likes`;
    }
    const heart = card.querySelector('.likeButton');
    if(heart){
        heart.classList.toggle('liked', playlist.likedByUser);
    }   
  }
}

export function deletePlaylist(id, playlists) {
  const index = playlists.findIndex(p => p.id === id);
  if (index !== -1) playlists.splice(index, 1);
}

export function applyEdit(id, data, playlists) {
  const index = playlists.findIndex(p => p.id === id);
  if (index !== -1){
    playlists[index] = { ...playlists[index], ...data };
  }
}

