import { useEffect, useRef, useState } from 'react'
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { dialog } from '@tauri-apps/api';

import './App.css'

// Interesting tauri commands
//
// appWindow.setDecorations(false);
// appWindow.toggleMaximize();
// setTimeout(() => {
//   appWindow.requestUserAttention(UserAttentionType.Informational);
// }, 2000);

type AudioProps = {
  /**
   * Current time of the song.
   */
  currentTime: number;

  /**
   * Total duration of the song.
   */
  duration: number;
}

/**
 * Returns a formatted time string of the format (m:ss)
 * 
 * @param seconds   The number of seconds.
 */
const formatSongTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes || 0}:${remainingSeconds > 9 ? remainingSeconds.toFixed(0) : '0' + remainingSeconds.toFixed(0)}`;
}

/**
 * Returns the short file name.
 * 
 * @param songFullFileName  The song filename.
 */
const fileName = (songFullFileName: string) => {
  const parts = songFullFileName?.split('\\');

  if (parts) {
    const last = parts[parts.length - 1];
    const lastDot = last.lastIndexOf('.');
    return last.slice(0, lastDot);
  }

  return songFullFileName;
}

function App() {
  const [audioSrc, setAudioSrc] = useState('');
  const [audioMeta, setAudioMeta] = useState<AudioProps>({ currentTime: 0, duration: 0 });
  const [songList, setSongList] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  const audioRef = useRef<any>();
  const sliderRef = useRef<any>();

  // Listen to file drop in tauri
  useEffect(() => {
    let unlisten: UnlistenFn;

    (async () => {
      unlisten = await listen<string[]>('tauri://file-drop', event => {
        setSongList(l => [...l, ...event.payload]);
      });
    })();

    return () => {
      unlisten();
    }
  }, []);

  // Setup an interval to update the slider and current time / duration.
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const interval = setInterval(() => {
      const currentTime = audioRef.current.currentTime ?? 0;
      const duration = audioRef.current.duration || 0

      setAudioMeta({ currentTime, duration });
      const valPercent = currentTime / duration;
      sliderRef.current.style.backgroundImage = `linear-gradient(to right, #0d6efd ${+valPercent * 100}%, #fff ${+valPercent * 100}%)`;
    }, 300);

    return () => {
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <audio src={audioSrc} autoPlay ref={audioRef}/>

        <div>
          <input ref={sliderRef} type="range" min="0" max={audioMeta.duration} value={audioMeta.currentTime} className='slider' readOnly />
          <div>{formatSongTime(audioMeta.currentTime)}/{formatSongTime(audioMeta.duration)}</div>
        </div>
        <div className='songs_container'>
          <h1>Songs</h1>
          <input type="text" value={filter} onChange={e => setFilter(e.currentTarget.value)} />
          <ul className='song_list'>
          {songList
            .filter(s => s.toLowerCase().indexOf(filter.toLowerCase()) >= 0)
            .map(s => {
              // TODO don't convert S on each render cycle lol
              return <li key={s}>
                <button onClick={() => setAudioSrc(convertFileSrc(s))} className={`song ${audioSrc === convertFileSrc(s) ? 'active' : ''}`}>{fileName(s)}</button>
              </li>
            })}
          </ul>
        </div>

        {/* Add a single file to the song list. */}
        <button onClick={async () => {
          // Access file system file dialog.
          const file = await dialog.open();

          if (file) {
            setSongList(l => [...l, file as string]);
            if (!audioSrc) {
              setAudioSrc(convertFileSrc(file as string));
            }
          }

        }}>Open File</button>

        {/* Clear the song list */}
        <button onClick={() => setSongList([])}>Clear</button>
      </header>
    </div>
  )
}

export default App
