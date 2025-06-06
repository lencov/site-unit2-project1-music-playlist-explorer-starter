import { handleLikeButtonAndCount } from './utils/utils.js';
import { defaultImage } from './constants/constants.js';


document.addEventListener("DOMContentLoaded", () => {
            displayFeaturedPlaylist();
        });

function displayFeaturedPlaylist(){

    const randIndex = Math.floor(Math.random() * playlists.length);
    const featuredPlaylist = playlists[randIndex];

    document.getElementById('featuredTitle').innerText = featuredPlaylist.name;
    document.getElementById('featuredImage').src = featuredPlaylist.imageUrl || defaultImage;
    document.getElementById('featuredAuthor').innerText = `By: ${featuredPlaylist.author}`;
    
    const songList = document.getElementById('featuredSongList');
    songList.innerHTML = "";

    const likeButton = document.getElementById('featuredLikeButton');
    const likeCount = document.getElementById('featuredLikeCount');

    handleLikeButtonAndCount(likeButton, likeCount, featuredPlaylist);

    featuredPlaylist.songs.forEach(song => {
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

}
