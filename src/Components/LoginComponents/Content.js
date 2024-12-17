import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Stack, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Config/firebase";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const homePage = () => {
        navigate("/");
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in Successfully");
            alert("User logged in Successfully");

            navigate("/dashboard");
        } catch (error) {
            console.log(error.message);
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                minHeight: "100vh",
                alignItems: "center",
                alignContent: "center",
                boxSizing: "border-box",
                backgroundColor: "#E5F1F8",
            }}
        >
            <Button onClick={homePage}
                    sx = {{
                        display:'flex',
                        position: 'absolute',
                        left: '80px',
                        top: '22px',
                        fontSize: 23,
                        color: 'black'

                    }}
            >
                SecureGrid
            </Button>
            <Container
                maxWidth="sm"
                sx={{
                    mt: 10,
                    width: 500,
                    height: "70vh",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: 2,
                    boxShadow: 3,
                }}
            >
                <Box
                    component="form"
                    noValidate
                    sx={{
                        display: "column",
                        padding: "50px 30px",
                    }}
                    onSubmit={submit}
                >
                    <Typography variant="h5" sx={{ mb: 3 }}>
                        Sign in
                    </Typography>

                    <Typography sx={{ mb: 1 }}> Email</Typography>
                    <TextField
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        required
                        fullWidth
                        id="email"
                        label="your@email.com"
                        autoFocus
                    />
                    <Typography sx={{ mb: 1, mt: 1 }}> Password</Typography>
                    <TextField
                        required
                        fullWidth
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign in
                    </Button>
                    <Divider textAlign="center">or</Divider>
                    <Typography sx={{ mt: 2 }}> Don't have an account?</Typography>
                    <Link to="/register"> Register</Link>
                </Box>
            </Container>
        </Box>
    );
}

export default LoginPage;
