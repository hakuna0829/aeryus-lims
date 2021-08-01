import palette from './palette';
import { createMuiTheme } from "@material-ui/core";
const defaultTheme = createMuiTheme()
const { breakpoints } = defaultTheme

export default {
  fontFamily: 'Montserrat',
  h1: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '35px',
    letterSpacing: '-0.24px',
    lineHeight: '40px',
    [breakpoints.up('lg')]: {
      fontSize: '35px',
    },
    [breakpoints.between('md', 'lg')]: {
      fontSize: '32px',
    },
    [breakpoints.down('sm')]: {
      fontSize: '28px',
    },
  },
  h2: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '29px',
    letterSpacing: '-0.24px',
    lineHeight: '32px',
    [breakpoints.down('md')]: {
      fontSize: '24px',
    },
  },
  h3: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '24px',
    letterSpacing: '-0.06px',
    lineHeight: '28px',
    [breakpoints.down('md')]: {
      fontSize: '18px',
    },
  },
  h4: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '20px',
    letterSpacing: '-0.06px',
    lineHeight: '24px',
    [breakpoints.down('md')]: {
      fontSize: '16px',
    },
  },
  h5: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '16px',
    letterSpacing: '-0.05px',
    lineHeight: '20px',
    [breakpoints.down('md')]: {
      fontSize: '12px',
    },
  },
  h6: {
    color: palette.text.primary,
    fontWeight: 500,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '20px',
    [breakpoints.down('md')]: {
      fontSize: '10px',
    },
  },
  subtitle1: {
    color: palette.text.primary,
    fontSize: '16px',
    letterSpacing: '-0.05px',
    lineHeight: '25px',
    [breakpoints.down('md')]: {
      fontSize: '12px',
    },
  },
  subtitle2: {
    color: palette.text.secondary,
    fontWeight: 400,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '21px'
  },
  body1: {
    color: palette.text.primary,
    fontSize: '14px',
    letterSpacing: '-0.05px',
    lineHeight: '21px'
  },
  body2: {
    color: palette.text.secondary,
    fontSize: '12px',
    letterSpacing: '-0.04px',
    lineHeight: '18px'
  },
  button: {
    color: palette.text.primary,
    fontSize: '14px'
  },
  caption: {
    color: palette.text.secondary,
    fontSize: '11px',
    letterSpacing: '0.33px',
    lineHeight: '13px'
  },
  overline: {
    color: palette.text.secondary,
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.33px',
    lineHeight: '13px',
    textTransform: 'uppercase'
  }
};
