import { Table } from "@mantine/core";
import { getFileName } from "../../utils/song.utils";
import { useStyles } from "./song-list.styles";

interface ISongListProps {
    songs: string[];
    setActiveSong: (song: string) => void;
}

export const SongList = ({ songs, setActiveSong }: ISongListProps) => {
    const styles = useStyles();

    return (
        <Table highlightOnHover>
            <tbody>
            {songs.map((s: string) => {
                return (
                    // TODO active state...
                    <tr key={s} onClick={() => setActiveSong(s)} className={styles.classes.row}>
                        <td>{getFileName(s)}</td>
                    </tr>
                );
            })}
            </tbody>
        </Table>
    );
};