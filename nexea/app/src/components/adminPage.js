import { Container, TextField, CssBaseline, Typography, Grid, Box, Button, Link } from '@mui/material';
import {useEffect, useState} from 'react';
import UserService from "../services/user-service";

export default function Homepage() {

  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getAdminBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

    return (
        <Container component="main" >
            <Typography>This is homepage</Typography>
        </Container>
    )
}