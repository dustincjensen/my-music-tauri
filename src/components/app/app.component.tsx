import { BackgroundImage, ScrollArea, Slider } from '@mantine/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useEffect, useRef, useState } from 'react';
import geo from '../../assets/img/geo.jpg';
import { formatSongTime } from '../../utils/song.utils';
import { SongList } from '../song-list/song-list.component';
import { useStyles } from './app.styles';

type AudioProps = {
  /**
   * Current time of the song.
   */
  currentTime: number;

  /**
   * Total duration of the song.
   */
  duration: number;
};





export const App = () => {
  const [audioSrc, setAudioSrc] = useState('');
  const [audioMeta, setAudioMeta] = useState<AudioProps>({ currentTime: 0, duration: 0 });
  const [songList, setSongList] = useState<string[]>([]);
  // const [filter, setFilter] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);

  const [sliderDragValue, setSliderDragValue] = useState<number | null>(null);
  const styles = useStyles();

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
    };
  }, []);

  // Setup an interval to update the slider and current time / duration.
  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    const interval = setInterval(() => {
      if (!audioRef.current) {
        return;
      }
      const currentTime = audioRef.current.currentTime ?? 0;
      const duration = audioRef.current.duration || 0;
      setAudioMeta({ currentTime, duration });
    }, 300);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <BackgroundImage src={geo}>
      <div className={styles.classes.backdrop}>
        <audio src={audioSrc} autoPlay ref={audioRef} />

        {/* TODO fix */}
        <ScrollArea style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
          <SongList songs={songList} setActiveSong={(song: string) => setAudioSrc(convertFileSrc(song))} />
        </ScrollArea>
        <div className={styles.classes.controls} style={{ height: 60 }}>
          <Slider
            min={0}
            max={audioMeta.duration}
            value={(sliderDragValue as number) ?? audioMeta.currentTime}
            showLabelOnHover={false}
            label={formatSongTime((sliderDragValue as number) ?? audioMeta.currentTime)}
            onChange={(value: number) => setSliderDragValue(value)}
            onChangeEnd={(value: number) => {
              if (audioRef.current) {
                audioRef.current.currentTime = value;
                setAudioMeta(m => ({ ...m, currentTime: value }));
              }
              setSliderDragValue(null);
            }}
            className={styles.classes.song_progress}
          />

          <div>
            {formatSongTime(audioMeta.currentTime)}/{formatSongTime(audioMeta.duration)}
          </div>
        </div>
        

        {/* Add a single file to the song list. */}
        {/* <Button
          onClick={async () => {
            // Access file system file dialog.
            const file = await dialog.open();

            if (file) {
              setSongList(l => [...l, file as string]);
              if (!audioSrc) {
                setAudioSrc(convertFileSrc(file as string));
              }
            }
          }}
        >
          Open File
        </Button> */}

        {/* Clear the song list */}
        {/* <Button onClick={() => setSongList([])}>Clear</Button> */}
      </div>
    </BackgroundImage>
  );
};
