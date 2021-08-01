import palette from '../palette';

export default {
  root: {
    '& .MuiChip-root': {
      color: palette.brandDark,
      backgroundColor: 'rgba(15,132,169,0.1)',
    }
  },
  popper: {
    '& .MuiAutocomplete-option': {
      color: palette.brandDark,
      border: `1px solid rgba(15,132,169,0.15)`
    },
    '& .MuiAutocomplete-option[aria-selected="true"]': {
      backgroundColor: 'rgba(15,132,169,0.1)',
    },
    '& .MuiAutocomplete-option[data-focus="true"]': {
      backgroundColor: 'rgba(15,132,169,0.1)',
    }
  }
};
