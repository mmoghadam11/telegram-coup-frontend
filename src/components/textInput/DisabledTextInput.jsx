import {  Input, TextareaAutosize, TextField } from '@mui/material';


const DisabledTextInput = ({label, value, multiline=false, rtl=false,size="medium"}) => {

    if (!multiline){
        return (
            <TextField
                label={label}
                type="text"
                value={value}
                disabled={true}
                fullWidth
                size={size}
                inputProps={{style: {fontSize: 16}}} // font size of input text
                InputLabelProps={{style: {fontSize: 16} }}
                sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                        WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
                    },
                    "& .MuiInputBase-input" : rtl ? {direction:"rtl", textAlign:"left"} : {}
                }}
            />
        )
    }else{
        return (
            <TextField
                label={label}
                type="text"
                value={value}
                disabled={true}
                fullWidth
                multiline
                rows={6}
                sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
                    },
                    "& .MuiInputLabel-root.Mui-disabled": {
                        WebkitTextFillColor: (theme) => theme.palette.mode === 'light' ? "#000" : "#fff",
                    },
                    "& textarea": {
                        overflowY: "scroll !important",
                    }
                }}
            />
        )
    }
}

export default DisabledTextInput;