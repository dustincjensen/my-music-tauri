import { convertFileSrc } from '@tauri-apps/api/tauri';
import React, { useCallback } from 'react';

export const usePlayerControls = (
    songList: string[],
    setAudioSrc: React.Dispatch<React.SetStateAction<string>>,
    audioRef: React.RefObject<HTMLAudioElement>
) => {
    const previousTrack = useCallback(() => {
        const index = songList.findIndex(v => convertFileSrc(v) === audioRef.current?.currentSrc);
        if (index > 0) {
            setAudioSrc(convertFileSrc(songList[index - 1]));
        }
    }, [songList]);

    const nextTrack = useCallback(() => {
        const index = songList.findIndex(v => convertFileSrc(v) === audioRef.current?.currentSrc);
        if (index < songList.length - 1) {
            setAudioSrc(convertFileSrc(songList[index + 1]));
        }
    }, [songList]);

    const playPause = useCallback(() => {
        if (audioRef.current?.paused) {
            audioRef.current?.play();
        } else {
            audioRef.current?.pause();
        }
    }, []);

    return {
        isPaused: audioRef.current?.paused ?? true,
        previousTrack,
        nextTrack,
        playPause,
    };
};
