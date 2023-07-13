import { Container, TextField, CssBaseline, Typography, Grid, Box, Button, Link } from '@mui/material';
import jwt from 'jsonwebtoken'
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import axios from "axios"

export default function Homepage() {

    const navigate = useNavigate()

    async function testQuote(){
        const req =  await axios.get('/api/quote', {
            headers:{
                'x-access-token' : localStorage.getItem('token')
            }
        })
        const data = req.json()
        console.log(data)
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        
        if (token) {
            const user = jwt.decode(token)
            if (!user) {
                localStorage.removeItem(token)
                navigate.replace('/')
            }else{
                alert('login successful')
                testQuote()
            }
        }
    }, [])
    return (
        <Container component="main" >
            <Typography>This is homepage</Typography>
        </Container>
    )
}