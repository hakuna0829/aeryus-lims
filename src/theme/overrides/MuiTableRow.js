import palette from '../palette';

export default {
  root: {
    // '&:nth-of-type(odd)': {
    //   backgroundColor: '#DAECF2',
    // },
    '&$selected': {
      backgroundColor: palette.background.default
    },
    '&$hover': {
      '&:hover': {
        backgroundColor: palette.background.default
      }
    }
  }
};
