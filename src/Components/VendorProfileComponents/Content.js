import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../Config/firebase';
import { doc, getDoc } from "firebase/firestore";
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

const VendorProfile = () => {
    const { vendorId } = useParams();
    const [vendor, setVendor] = useState(null);
    const [score, setScore] = useState(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                // Fetch the vendor data
                const vendorDoc = await getDoc(doc(db, "vendors", vendorId));
                if (vendorDoc.exists()) {
                    const vendorData = { id: vendorDoc.id, ...vendorDoc.data() };
                    setVendor(vendorData);

                    // If userId exists, fetch the score
                    if (vendorData.userId) {
                        const userDoc = await getDoc(doc(db, "Users", vendorData.userId));
                        setScore(userDoc.exists() ? userDoc.data().score : "Not available");
                    } else {
                        setScore("Not available");
                    }
                } else {
                    console.error("Vendor not found");
                }
            } catch (error) {
                console.error("Error fetching vendor:", error);
            }
        };
        fetchVendor();
    }, [vendorId]);

    if (!vendor) {
        return (
            <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h5">Loading vendor information...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card
                sx={{
                    maxWidth: 600,
                    padding: 4,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    backgroundColor: '#F9FAFB',
                }}
            >
                <CardContent>
                    <Typography variant="h3" sx={{ fontWeight: 700, textAlign: 'center', marginBottom: 3 }}>
                        {vendor.companyName}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: 16,
                            color: 'rgba(0, 0, 0, 0.7)',
                            textAlign: 'center',
                            marginBottom: 4,
                        }}
                    >
                        {vendor.companyDescription || 'No description provided.'}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            marginBottom: 4,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF',
                                padding: 2,
                                borderRadius: '10px',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6">Industry:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {vendor.industry || 'N/A'}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                backgroundColor: '#FFFFFF',
                                padding: 2,
                                borderRadius: '10px',
                                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6">Score:</Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'bold',
                                    color: score ? 'green' : 'rgba(0, 0, 0, 0.6)',
                                }}
                            >
                                {score !== null ? `${score}%` : 'Loading...'}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#284CEA',
                                color: '#FFF',
                                '&:hover': { backgroundColor: '#1c3ca6' },
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontSize: 16,
                            }}
                        >
                            Contact Vendor
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VendorProfile;
