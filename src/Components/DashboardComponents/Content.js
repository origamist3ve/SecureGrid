import React, { useEffect, useState } from "react";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
    Button,
    Box,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (!currentUser) {
                    throw new Error("No user is logged in.");
                }

                const userDoc = await getDoc(doc(db, "Users", currentUser.uid));

                if (userDoc.exists()) {
                    setUserData({ ...userDoc.data(), uid: currentUser.uid });
                } else {
                    console.error("No user data found!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!userData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h6">No user data available</Typography>
            </Box>
        );
    }

    const homePage = () => {
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("You have been logged out.");
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error.message);
            alert("Error logging out. Please try again.");
        }
    };

    const navigateToVendorForm = () => {
        navigate(`/vendor-registration/${userData.uid}`);
    };

    const navigateToVendorSearch = () => {
        navigate("/vendor-search");
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
            <Button onClick={homePage} sx={{ mb: 2, fontSize: 24, color: "black" }}>SecureGrid</Button>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Welcome, {userData.firstName} {userData.lastName}!
                    </Typography>
                    <Typography variant="body1" gutterBottom>Email: {userData.email}</Typography>

                    <Box mt={4}>
                        <Typography variant="h6">Haven't filled out the form yet?</Typography>
                        <Link to="/form" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="primary" sx={{ mt: 1 }}>
                                Go to Form
                            </Button>
                        </Link>
                    </Box>

                    <Box mt={4}>
                        <Typography variant="h6">Your Uploaded Files</Typography>
                        {userData.files?.length > 0 ? (
                            userData.files.map((file, index) => (
                                <Box key={index} mt={1}>
                                    <Typography>{file.fileName}</Typography>
                                    <a
                                        href={`https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/${encodeURIComponent(file.filePath)}?alt=media`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </a>
                                </Box>
                            ))
                        ) : (
                            <Typography>No files uploaded yet.</Typography>
                        )}
                    </Box>

                    <Box mt={4}>
                        <Typography variant="h6">Ready to register as a vendor?</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={navigateToVendorForm}
                        >
                            Fill Vendor Registration Form
                        </Button>
                    </Box>

                    <Box mt={4}>
                        <Typography variant="h6">Looking for vendors?</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 1 }}
                            onClick={navigateToVendorSearch}
                        >
                            Go to Vendor Search
                        </Button>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button variant="outlined" color="error" onClick={handleLogout}>
                        Log Out
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default Dashboard;
