import { ActionIcon } from '@mantine/core';
import { PauseIcon, PlayIcon, TrackNextIcon, TrackPreviousIcon } from '@radix-ui/react-icons';
import { useStyles } from './player-controls.styles';

interface IPlayerControlsProps {
    isPaused: boolean;
    previousTrack: () => void;
    playPause: () => void;
    nextTrack: () => void;
}

export const PlayerControls = ({ isPaused, previousTrack, playPause, nextTrack }: IPlayerControlsProps) => {
    const styles = useStyles();

    return (
        <div className={styles.classes.action_buttons}>
            <ActionIcon size={48} variant='hover' color='cyan' onClick={previousTrack}>
                <TrackPreviousIcon width={36} height={36} />
            </ActionIcon>
            <ActionIcon size={48} variant='hover' color='cyan' onClick={playPause}>
                {isPaused && <PlayIcon width={36} height={36} />}
                {!isPaused && <PauseIcon width={36} height={36} />}
            </ActionIcon>
            <ActionIcon size={48} variant='hover' color='cyan' onClick={nextTrack}>
                <TrackNextIcon width={36} height={36} />
            </ActionIcon>
        </div>
    );
};
