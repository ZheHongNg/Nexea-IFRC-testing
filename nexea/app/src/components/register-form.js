import AuthService from '../services/auth-service'
import { Container, TextField, CssBaseline, Typography, Grid, Box, Button, Link, Select, MenuItem, InputLabel, Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, Link as ReactRouterLink } from "react-router-dom";



let departmentOptions = ['IT', 'Marketing', 'Accounting']

function usePasswordConfirmation(password, confirmPassword) {
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmPasswordError('Password not match')

        } else if (confirmPassword === '') {
            setConfirmPasswordError('Confirm Password is required!')

        } else {
            setConfirmPasswordError('')

        }
    }, [password, confirmPassword])
    return confirmPasswordError
}



export default function RegisterForm() {
    const navigate = useNavigate()

    const [fname, setFName] = useState('')
    const [lname, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [department, setDepartment] = useState('')

    const [fnameError, setFNameError] = useState('')
    const [lnameError, setLNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState('')
    const [departmentError, setDepartmentError] = useState('')

    const [successful, setSuccessful] = useState(false)
    const [message, setMessage] = useState('')

    const confirmPasswordError = usePasswordConfirmation(password, confirmPassword);

    function registerUser(e) {
        e.preventDefault()

        let isValid = true

        if (fname.trim() === "") {
            setFNameError('First name is required');
            isValid = false
        }

        if (lname.trim() === "") {
            setLNameError('Last name is required');
            isValid = false
        }

        if (email.trim() === '') {
            setEmailError('Email address is required')
            isValid = false
        } else if (!email.endsWith("@IFRC.my")) {
            setEmailError('Email address must end with @IFRC.my');
            isValid = false
        }

        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/
        if (password.trim() === '') {
            setPasswordError('Password is required')
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            setPasswordError('Password must contain at least 8 characters, including uppercase, lowercase, digits, and special symbol')
            isValid = false
        }

        if (confirmPasswordError) {
            isValid = false
        }

        if (phoneNumber.trim() === "") {
            setPhoneNumberError('Phone Number is required')
            isValid = false;
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            setPhoneNumberError('Invalid phone number')
            isValid = false
        }

        if (department.trim() === "") {
            setDepartmentError('Select a department')
            isValid = false;
        }

        setSuccessful(false)
        setMessage('')

        if (isValid) {
            AuthService.register(fname, lname, email, password, phoneNumber, department)
            .then(
                (response) => {
                    setMessage(response.data.message)
                    setSuccessful(true)
                },
                (error) => {
                    const resMessage = (
                        error.response &&
                        error.response.data &&
                        error.response.data.message
                        )   
                        || error.message
                        || error.toString()

                    setMessage(resMessage)
                    setSuccessful(false)
                }
            )

        }
    }


    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 5 }}  >
            <CssBaseline />
            <Typography component="h1" variant='h5' align='center'>Registration Form</Typography>
            <Box component='form' action='POST'>
                <Grid item >
                    <TextField
                        autoComplete="given-name"
                        type='text'
                        name='firstname'
                        required
                        fullWidth
                        id='fnameInput'
                        label='First Name'
                        sx={{ mt: 3 }}
                        value={fname}
                        onChange={(e) => { setFName(e.target.value) }}
                        error={Boolean(fnameError)}
                        helperText={fnameError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <TextField
                        autoComplete="family-name"
                        type='text'
                        name='lastname'
                        required
                        fullWidth
                        id='lnameInput'
                        label='Last Name'
                        sx={{ mt: 3 }}
                        value={lname}
                        onChange={(e) => { setLName(e.target.value) }}
                        error={Boolean(lnameError)}
                        helperText={lnameError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <TextField
                        autoComplete="email"
                        type='email'
                        name='email'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        sx={{ mt: 3 }}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        error={Boolean(emailError)}
                        helperText={emailError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <TextField
                        autoComplete="password"
                        type='password'
                        name='password'
                        required
                        fullWidth
                        id='passwordInput'
                        label='Password'
                        sx={{ mt: 3 }}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        error={Boolean(passwordError)}
                        helperText={passwordError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <TextField
                        autoComplete="Confirm-Password"
                        type='password'
                        name='confirmPassword'
                        required
                        fullWidth
                        id='cPasswordInput'
                        label='Confirm Password'
                        sx={{ mt: 3 }}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        error={Boolean(confirmPasswordError)}
                        helperText={confirmPasswordError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <TextField
                        autoComplete="phone-number"
                        type='tel'
                        name='phone'
                        required
                        fullWidth
                        id='phoneInput'
                        label='Phone Number'
                        sx={{ mt: 3 }}
                        value={phoneNumber}
                        onChange={(e) => { setPhoneNumber(e.target.value) }}
                        error={Boolean(phoneNumberError)}
                        helperText={phoneNumberError}
                        autoFocus />
                </Grid>
                <Grid item >
                    <InputLabel id="multiple-department-label">Department</InputLabel>
                    <Select
                        labelId="multiple-department-label"
                        id="departmentSelect"
                        value={department}
                        label="Age *"
                        onChange={(e) => { setDepartment(e.target.value) }}
                        fullWidth
                        required
                        error={Boolean(departmentError)}
                        helperText={departmentError}
                    >
                        {departmentOptions.map((options) => (
                            <MenuItem value={options} key={options}>
                                {options}
                            </MenuItem>

                        ))}
                    </Select>

                </Grid>

                <Button type="submit" onClick={registerUser} variant="contained" sx={{ mt: 3 }} fullWidth>Add User</Button>
                <Grid item justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Typography>Already have an account?<Link to="/login" variant='body2' component={ReactRouterLink}>Sign in</Link></Typography>
                </Grid>
                {message && (
                    <Alert severity={successful ? "success" : "error"}>{message}</Alert>
                )}

            </Box>

        </Container>
    )
}               