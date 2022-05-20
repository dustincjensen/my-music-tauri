import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    backdrop: {
      backdropFilter: 'blur(20px) brightness(50%)',
      minHeight: '100vh',
      position: 'relative'
    },
  
    controls: {
      background: theme.black,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    },

    song_progress: {
      width: 400
    }
  }));