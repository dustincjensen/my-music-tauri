import { createStyles } from '@mantine/core';

export const useStyles = createStyles(theme => ({
    table: {
        'tr:hover': {
            backgroundColor: theme.colors[theme.primaryColor][9],
        },
    },

    row: {
        cursor: 'pointer',
    },

    active: {
        background: theme.primaryColor,
        color: theme.black,
    },
}));
