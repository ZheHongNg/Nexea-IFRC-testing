import { Container, TextField, CssBaseline, Typography, Grid, Box, Button, Link } from '@mui/material';
import { useState } from 'react';
import { Link as ReactRouterLink, useNavigate } from "react-router-dom"
import axios from "axios";


export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const navigate = useNavigate()

    async function LoginUser(e) {
        e.preventDefault()

        let isValid = true

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
            isValid = false
        } else if (!passwordRegex.test(password)) {
            setPasswordError('Password must contain at least 8 characters, including uppercase, lowercase, digits, and special symbol')
            isValid = false
        }

        if (isValid) {
            const response = await axios.post('/api/login', {
                email,
                password
            })
            const data = response.data
            console.log({ data })

            if (data.user) {
                localStorage.setItem('token', data.user)
                navigate('/home page')
            } else {
                setEmailError('Please check your login credentials')
                setPasswordError('Please check your login credentials')
            }
        } else {
            return;
        }

    }

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 5 }}  >
            <CssBaseline />
            <Typography component="h1" variant='h5' align='center'>Sign In</Typography>
            <Box component='form' >
                <Grid item >
                    <TextField 
                    autoComplete='email' 
                    type='email' 
                    name='email' 
                    required 
                    fullWidth 
                    id='email' 
                    label='Email Address' 
                    value={email} 
                    onChange={(e) => { setEmail(e.target.value) }} 
                    sx={{ mt: 3 }} 
                    error = {Boolean(emailError)}
                    helperText ={emailError}
                    autoFocus />
                </Grid>
                <Grid item >
                    <TextField 
                    autoComplete='password' 
                    type='password' 
                    name='password' 
                    required 
                    fullWidth 
                    id='password' 
                    label='Password' 
                    value={password} 
                    onChange={(e) => { setPassword(e.target.value) }} 
                    sx={{ mt: 3 }} 
                    error = {Boolean(passwordError)}
                    helperText ={passwordError}
                    autoFocus />
                </Grid>
                <Button type="submit" onClick={LoginUser} variant="contained" sx={{ mt: 3 }} fullWidth>Sign In</Button>
                <Grid item justifyContent='flex-end' sx={{ mt: 2 }}>
                    <Typography>Have not join us? Click this link <Link to="/register" variant='body2' component={ReactRouterLink}>Sign Up</Link> to join us.</Typography>
                </Grid>

            </Box>

        </Container>
    )
}