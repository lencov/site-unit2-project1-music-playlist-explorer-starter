function addLike(playlistId){
    const playlist = playlists.find( p => playlistId === p.id);
    if(playlist.likedByUser === true){
        throw new Error('Playlist is already liked by this user. Cannot add new like');
    }
    playlist.likeCount += 1;
    playlist.likedByUser = true;
}

function removeLike(playlistId){
    const playlist = playlists.find( p => playlistId === p.id);
    if(playlist.likedByUser === false){
        throw new Error('Playlist is not already liked by this user. Cannot remove like');
    }
    playlist.likeCount -= 1;
    playlist.likedByUser = false;
}

export function handleLikeButtonAndCount(likeButton, likeCount, playlist){
    const newButton = likeButton.cloneNode(true);
    likeButton.parentNode.replaceChild(newButton, likeButton);
    newButton.classList.toggle("liked", playlist.likedByUser);
    likeCount.textContent = `${playlist.likeCount} Likes`;

    newButton.addEventListener("click", () => {
        console.log('pressed like button', playlist);
        if (playlist.likedByUser) {
            removeLike(playlist.id);
        } else {
            addLike(playlist.id);
        }
        newButton.classList.toggle("liked", playlist.likedByUser);
        likeCount.textContent = `${playlist.likeCount} Likes`;
    });
}