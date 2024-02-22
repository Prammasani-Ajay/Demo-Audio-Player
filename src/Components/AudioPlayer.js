import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio] = useState(new Audio());

  useEffect(() => {
    const storedIndex = localStorage.getItem('currentTrackIndex');
    const storedPlaylist = localStorage.getItem('playlist');

    if (storedIndex && storedPlaylist) {
      setCurrentTrackIndex(parseInt(storedIndex));
      setPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentTrackIndex', currentTrackIndex.toString());
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [currentTrackIndex, playlist]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newPlaylist = [...playlist];

    for (let i = 0; i < files.length; i++) {
      newPlaylist.push(files[i]);
    }

    setPlaylist(newPlaylist);
  };

  const playTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentTrackIndex(index);
      audio.src = URL.createObjectURL(playlist[index]);
      audio.load(); // Load the new audio source

      audio.addEventListener('canplaythrough', () => {
        audio.play(); // Play the audio once it's fully loaded
      }, { once: true }); // Remove the event listener after it's fired once
    }
  };

  const playNextTrack = () => {
    playTrack(currentTrackIndex + 1);
  };

  useEffect(() => {
    audio.addEventListener('ended', playNextTrack);

    return () => {
      audio.removeEventListener('ended', playNextTrack);
    };
  }, [audio]);

  useEffect(() => {
    playTrack(currentTrackIndex);
  }, [currentTrackIndex]);

  return (
    <div className="audio-player">
        <label>Upload Mp3 From Here</label>
      <input type="file" accept="audio/*" onChange={handleFileUpload} multiple />
      <div className="playlist">
        <h2>Playlist</h2>
        <ul>
          {playlist.map((track, index) => (
            <li key={index} onClick={() => playTrack(index)}>
              {track.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="now-playing">
        <h2>Now Playing</h2>
        <p>{playlist[currentTrackIndex] ? playlist[currentTrackIndex].name : 'No track playing'}</p>
      </div>
    </div>
  );
};

export default AudioPlayer;
