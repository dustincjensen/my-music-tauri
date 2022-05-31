import { Table } from '@mantine/core';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { getFileName } from '../../utils/song.utils';
import { useStyles } from './song-list.styles';

interface ISongListProps {
    songs: string[];
    activeSong: string;
    setActiveSong: (song: string) => void;
}

export const SongList = ({ songs, activeSong, setActiveSong }: ISongListProps) => {
    const { classes, cx } = useStyles();

    return (
        <Table className={classes.table}>
            <tbody>
                {songs.map((s: string) => {
                    return (
                        // TODO active state...
                        <tr
                            key={s}
                            onClick={() => setActiveSong(s)}
                            className={cx(classes.row, { [classes.active]: activeSong === convertFileSrc(s) })}
                        >
                            <td>{getFileName(s)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
