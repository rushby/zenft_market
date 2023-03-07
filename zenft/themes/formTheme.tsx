import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
        components: {
            MuiSelect: {
                styleOverrides: {
                    select: {
                        backgroundColor: 'white', // Change the background color
                        color: 'black', // Change the text color
                        borderRadius: '4px', // Add a border radius to the select element
                        border: '1px solid #BDBDBD', // Add a border to the select element
                        '&:hover': {
                            backgroundColor: 'grey' // Change the background color on hover
                        },
                        '&:focus': {
                            borderRadius: '4px', // Change the border radius on focus
                            border: '1px solid #26db8d', // Change the border color on focus
                            '& ~ .MuiInputLabel-root': {
                                color: '#2196F3' // Change the label color on focus
                            }
                        }
                    }
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        color: 'white', // Change the label color
                        '&.Mui-focused': {
                            color: 'green' // Change the label color on focus
                        }
                    }
                }
            },
            MuiMenu: {
                styleOverrides: {
                        root: {
                            "& .MuiMenu-paper": {
                                backgroundColor: 'grey',
                                color: 'white',
                                borderColor: 'pink' // change the border color here
                            },
                            "& .MuiMenuItem-root:hover": {
                                backgroundColor: '#26db8d',
                                color: 'text.white'
                            },
                            "& .Mui-selected": {
                                backgroundColor: 'white',
                                color: 'text.white'
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                border: "green"
                            },

                        }
                    }
                },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        "& .MuiInputLabel-root": {color: 'white'}, //styles the label
                        "& .MuiInputBase-input": {
                            color: "white", //styles the input text
                        },
                        "& .MuiOutlinedInput-root": {
                            "& > fieldset": { borderColor: "#0e9de5" },
                        },
                        "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                                borderColor: "#26db8d"
                            }
                        },
                        "& .MuiOutlinedInput-root:hover": {
                            "& > fieldset": {
                                borderColor: "#26db8d"
                            }
                        },
                    },
                },
            },
        },
});