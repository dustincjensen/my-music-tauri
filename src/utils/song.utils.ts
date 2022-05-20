/**
 * Returns a formatted time string of the format (m:ss)
 *
 * @param seconds   The number of seconds.
 */
 export const formatSongTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes || 0}:${remainingSeconds > 9 ? remainingSeconds.toFixed(0) : '0' + remainingSeconds.toFixed(0)}`;
  };


  /**
 * Returns the short file name.
 *
 * @param songFullFileName  The song filename.
 */
export const getFileName = (songFullFileName: string) => {
    const parts = songFullFileName?.split('\\');
  
    if (parts) {
      const last = parts[parts.length - 1];
      const lastDot = last.lastIndexOf('.');
      return last.slice(0, lastDot);
    }
  
    return songFullFileName;
  };