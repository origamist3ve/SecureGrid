import React from "react";
import { useNavigate } from "react-router-dom";
import arrow from '../../Assets/arrow.svg';
import shield from '../../Assets/shield.png';
import chart from '../../Assets/chart.png';
import vendors from '../../Assets/vendors.png';
import { Box, Button, Typography } from '@mui/material';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Config/firebase";

const Content = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/get-started');
    };

    const companyLogin = () => {
        console.log('Company Login clicked');
        navigate('/login');
    };

    const vendorLogin = () => {
        console.log('Vendor Login clicked');
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Redirect to the dashboard if the user is logged in
                navigate('/dashboard');
            } else {
                // Navigate to login page if not logged in
                navigate('/login');
            }
        });
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: '30px',
                    justifyContent: 'flex-start',
                    mb: 2,
                    padding: '10px 50px',
                    alignSelf: 'flex-end',
                }}
            >
                <img src={shield} alt="shield" style={{ width: 50, height: 50, position: 'absolute', left: 20 }} />
                <Typography variant="h5"
                            sx={{
                                display: 'flex',
                                position: 'absolute',
                                left: '100px',
                                top: '22px'
                            }}
                >
                    SecureGrid
                </Typography>
                <Button onClick={vendorLogin}
                        sx={{
                            display: 'flex',
                            fontFamily: 'Lao Muang Don, serif',
                            width: 178,
                            height: 44,
                            backgroundColor: '#284CEA',
                            color: '#FFF',
                            fontSize: '20px',
                            borderRadius: '5px',
                            '&:hover': { backgroundColor: '#1c3ca6' },
                        }}
                >
                    Vendor Login
                </Button>
                <Button onClick={companyLogin}
                        sx={{
                            width: 178,
                            height: 44,
                            fontFamily: 'Lao Muang Don, serif',
                            backgroundColor: '#284CEA',
                            color: '#FFF',
                            fontSize: '20px',
                            borderRadius: '5px',
                            '&:hover': { backgroundColor: '#1c3ca6' },
                        }}
                >
                    Company Login
                </Button>
            </Box>

            <Box
                sx={{
                    width: '100%',
                    backgroundColor: '#E5F1F8',
                    padding: '100px',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }}
            >
                <Typography variant="h1"
                            sx={{
                                fontSize: '46px',
                                fontWeight: 700,
                                color: '#000',
                                mb: 2,
                                fontFamily: 'Lao Muang Don, serif',
                            }}
                >
                    AI-Powered Vendor Intelligence Platform
                </Typography>

                <Typography variant="body1"
                            sx={{
                                fontSize: '20px',
                                color: '#000',
                                fontFamily: 'Inter, sans-serif',
                                mb: 4,
                            }}
                >
                    Streamline vendor management and reduce supply chain risks with our intelligence platform
                </Typography>
                <Button onClick={handleClick}
                        sx={{
                            width: 350,
                            height: 67,
                            backgroundColor: '#284CEA',
                            fontFamily: 'Lao Muang Don, serif',
                            color: '#FFF',
                            fontSize: '25px',
                            borderRadius: '5px',
                            '&:hover': { backgroundColor: '#1c3ca6' },
                        }}
                >
                    Get Started <img src={arrow} alt="arrow" style={{ marginLeft: '10px' }} />
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    width: '100%',
                    padding: '100px',
                    flexDirection: 'column'
                }}
            >
                {[
                    {
                        imgSrc: chart,
                        title: "AI Powered Insights",
                        description: "Get real-time risk assessments and predictive analytics for your vendor network."
                    },
                    {
                        imgSrc: vendors,
                        title: "Vendor Self-Service",
                        description: "Enable vendors to manage their profiles independently and stay up-to-date."
                    },
                    {
                        imgSrc: shield,
                        title: "Risk Management",
                        description: "Identify and mitigate supply chain risks before they impact your business."
                    }].map((box, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: '200px',
                            width: '100%',
                            backgroundColor: 'rgba(30, 30, 30, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: '30px',
                            borderRadius: '8px',
                            boxSizing: 'border-box',
                        }}
                    >
                        <img src={box.imgSrc} alt={box.title} style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>{box.title}</Typography>
                        <Typography variant="body2">{box.description}</Typography>
                    </Box>
                ))}
            </Box>

            <Box
                sx={{
                    width: '100%',
                    backgroundColor: '#E5F1F8',
                    padding: '60px',
                    textAlign: 'center',
                }}
            >
            </Box>
        </Box>
    );
};

export default Content;