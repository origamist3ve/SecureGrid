import React, { useState } from "react";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { Container, Box, TextField, Button, Typography, Stack } from "@mui/material";
import { auth, db } from "../../Config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const navigate = useNavigate();

    const homePage = () => {
        navigate("/");
    }

    const submit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                alert("The email address is already in use. Please use a different email.");
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;


            await setDoc(doc(db, "Users", user.uid), {
                email: user.email,
                firstName: firstname,
                lastName: lastName,
            });

            alert("User Registered Successfully!");

            // Redirect to dashboard or another page
            navigate("/Dashboard");
        } catch (error) {
            console.error("Error:", error.message);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <Container maxWidth="sm">
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
            <Box
                sx={{
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    Register
                </Typography>

                <Box component="form" noValidate sx={{ mt: 3 }}>
                    <Stack spacing={2}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                value={firstname}
                                onChange={(e) => setFirstName(e.target.value)}
                                label="First Name"
                                autoFocus
                            />
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                            />
                        </Box>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                        <TextField
                            required
                            fullWidth
                            name="confirmPassword"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                        />
                    </Stack>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={submit}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default RegistrationPage;
