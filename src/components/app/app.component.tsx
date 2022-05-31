import { BackgroundImage, Group, Header, ScrollArea, Slider, Stack, Text } from '@mantine/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { useEffect, useRef, useState } from 'react';
import geo from '../../assets/img/geo.jpg';
import { formatSongTime } from '../../utils/song.utils';
import { PlayerControls } from '../player-controls/player-controls.component';
import { usePlayerControls } from '../player-controls/use-player-controls.hook';
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

    const playerControls = usePlayerControls(songList, setAudioSrc, audioRef);

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
        <>
            <audio src={audioSrc} autoPlay ref={audioRef} />
            <BackgroundImage src={geo}>
                <Stack className={styles.classes.backdrop} align='stretch' justify='space-between' sx={{ gap: 0 }}>
                    <Header height={60}>
                        <Group px={20} sx={{ height: '100%' }}>
                            <Text>My Music</Text>
                        </Group>
                    </Header>

                    {/* TODO fix */}
                    <div className={styles.classes.song_list}>
                        <ScrollArea sx={{ flex: 1 }}>
                            <SongList
                                songs={songList}
                                activeSong={audioSrc}
                                setActiveSong={(song: string) => setAudioSrc(convertFileSrc(song))}
                            />
                        </ScrollArea>
                    </div>

                    <div className={styles.classes.controls}>
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

                        <PlayerControls {...playerControls} />

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
                </Stack>
            </BackgroundImage>
        </>
    );
};
