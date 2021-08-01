import React from 'react';
import {
    ThemeProvider,
    makeStyles,
    createMuiTheme,
} from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(0),
        // border: '1px solid #3ECCCD',
        // borderRadius: '8px',
        // boxShadow: '4px 5px 8px 2px rgba(15,132,169,0.15)',
        // margin: '10px 20px'
    },

    content: {
        textAlign: 'center',
        padding: 0
    },
    colorGray: {
        color: '#9B9B9B !important'
    },
    buttonRed: {
        color: '#DD2525 !important',
        borderColor: '#DD2525 !important',
    },
    actionButtonRow: {
        display: 'flex',
        justifyContent: 'space-around'
    }

}));


const theme = createMuiTheme({
    root: {
        width: '100%',
    },
    palette: {
        primary: {
            main: '#0F84A9',
        },
    },
    overrides: {
        MuiSelect: {
            select: {
                color: '#9B9B9B',
                minWidth: 120,
                "&:focus": {
                    borderColor: '#0F84A9',
                },
                '&:before': {
                    borderColor: '#0F84A9'
                },
                '&:after': {
                    borderColor: '#0F84A9',
                }
            },

            iconOutlined: {
                color: '#FFFFFF',
                width: 40,
                marginLeft: 10,
                height: '100%',
                top: 0,
                right: 0,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                backgroundColor: '#0F84A9',
                // backgroundColor:'#0F84A9'
            }
        }

    }
});
export default function SelectBox(props) {
    const { selectedValue, setSelectedValue } = props;
    const classes = useStyles();
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <div className={classes.root} >
            <ThemeProvider theme={theme}>
                <FormControl variant="outlined" className={classes.locationName}>
                    <Select
                        id="schedule-department"
                        value={selectedValue}
                        onChange={handleChange}
                    >
                        {props.data.map((item, index) => {
                            return (<MenuItem value={item.value} key={index}>{item.value}</MenuItem>)
                        })}
                    </Select>
                </FormControl>
            </ThemeProvider>
        </div>
    );
}