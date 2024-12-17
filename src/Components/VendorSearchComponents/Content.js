import React, { useState, useEffect  } from 'react';
import { useNavigate } from "react-router-dom";
import {Box, Typography, Button, TextField, Checkbox, FormControlLabel, MenuItem, Select, Container, Card, CardContent, Grid2} from '@mui/material';
import { db } from '../../Config/firebase';
import { collection, getDocs, where, query, doc, getDoc } from "firebase/firestore";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';




const VendorSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All Categories');
    const [infrastructureType, setInfrastructureType] = useState('All Types');
    const [certification, setCertification] = useState('All Types');
    const [results, setResults] = useState([]);

    const categoryOptions = ['Technology', 'Construction', 'Health', 'Finance'];
    const infrastructureTypeOptions = ['Hardware', 'Software', 'Networking'];
    const certificationOptions = ['ISO Certified', 'Non-Certified'];

    const navigate = useNavigate();




    const fetchCompanies = async () => {
        if (searchTerm.trim() === "") {
            setResults([]);
            return;
        }

        try {
            // Fetch vendors
            let q = query(
                collection(db, "vendors"),
                where("companyName", ">=", searchTerm),
                where("companyName", "<", searchTerm + "\uf8ff")
            );

            if (category && category !== "All Categories") {
                q = query(q, where("category", "==", category));
            }
            if (infrastructureType && infrastructureType !== "All Types") {
                q = query(q, where("infrastructureType", "==", infrastructureType));
            }
            if (certification && certification !== "All Types") {
                q = query(q, where("certification", "==", certification));
            }

            const querySnapshot = await getDocs(q);

            // Fetch vendor data
            const vendors = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const enrichedVendors = await Promise.all(
                vendors.map(async (vendor) => {
                    if (vendor.userId) {
                        const userDoc = await getDoc(doc(db, "Users", vendor.userId));
                        return {
                            ...vendor,
                            score: userDoc.exists() ? userDoc.data().score : "Not available",
                        };
                    }
                    return { ...vendor, score: "Not available" };
                })
            );

            setResults(enrichedVendors);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };






    function handleClick() {
        fetchCompanies();
    }

    useEffect(() => {
        fetchCompanies();
    }, [searchTerm, category, infrastructureType, certification]);

    const handleViewProfile = (vendorId) => {
        navigate(`/vendor-profile/${vendorId}`); // Navigate to profile page
    };



    return (
        <Grid2 item xs={12} sm={6} md={4}
            sx = {{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                height:'100%',
            }}
        >
            <Box
                sx = {{
                    display: 'flex',
                    width:'100%',
                    height: '161px',
                    backgroundColor: '#E5F1F8',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h4" component="div" sx = {{fontWeight: 700, fontFamily: 'Roboto', mt: 3, padding: '15px'}}>
                    Critical Infrastructure Marketplace
                </Typography>
                <Typography variant = "h5" sx = {{mb: 4, fontWeight: 400}}>
                    Find your perfect vendor
                </Typography>
            </Box>


            <Box
                sx = {{display: 'flex', alignItems: 'center', mt: 7}}>
                <TextField sx = {{width:1131}}
                           search label="Search Vendors..."
                           id="search"
                           value = {searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                />

                    <Button onClick={handleClick}
                    sx = {{fontSize: '20px',
                        display: 'flex',
                        backgroundColor: '#284CEA',
                        '&:hover': { backgroundColor: '#1c3ca6' },
                        borderRadius: '5px',
                        width: 150,
                        color: '#FFF',
                        ml: 4
                    }}
                >
                    Search
                </Button>
            </Box>
            <Box
                sx = {{
                    display:'flex',
                    mt: 7,
                    ml:90

                }}
            >
                <Container maxWidth = "sm"
                           sx={{
                               display: 'flex',
                               flexDirection: 'column',
                               boxSizing: 'border-box',
                               position:'absolute',
                               borderRadius: '10px',
                               border: '1px solid rgba(0, 0, 0, 0.55)',
                               width: { xs: '90%', sm: '280px' },
                               padding: 2,
                               left:'15%',


                           }}
                >
                    <Typography variant = "h4" sx = {{mt: 3}}>Filters</Typography>
                    <Typography variant = "h5" sx = {{mt:3}}>Category</Typography>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 3, mt: 2,
                            width: 200,
                            height: 50,
                            border: 2,
                            borderRadius:'5px',


                    }}
                    >
                        <MenuItem value="">All Categories</MenuItem>
                        {categoryOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant = "h5" sx = {{mt:3}}>Infrastructure Type</Typography>
                    <Select
                        value={infrastructureType}
                        onChange={(e) => setInfrastructureType(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 3, mt: 2,
                            width: 200,
                            height: 50,
                            border: 2
                        }}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {infrastructureTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                    <Typography variant = "h5" sx = {{mt:3}}>Certification</Typography>
                    <Select
                        value={certification}
                        onChange={(e) => setCertification(e.target.value)}
                        displayEmpty
                        fullWidth
                        sx={{ mb: 3, mt: 2,
                            width: 200,
                            height: 50,
                            border: 2
                        }}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {certificationOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </Container>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 4,
                    }}
                >
                    {results.length > 0 ? (
                        results.map((item) => (
                            <Container
                                key={item.id}
                                maxWidth="sm"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    boxSizing: 'border-box',
                                    borderRadius: '10px',
                                    border: '1px solid rgba(0, 0, 0, 0.55)',
                                    width: '100%',
                                    height: '70vh',
                                    padding: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h4">{item.companyName}</Typography>
                                    <Typography
                                        sx={{
                                            color: 'rgba(0, 0, 0, 0.55)',
                                            fontSize: 25,
                                            marginTop: 1,
                                        }}
                                    >
                                        {item.companyDescription}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            width: '151px',
                                            height: '38px',
                                            fontSize: 25,
                                            marginTop: 2,
                                            color: 'rgba(0, 0, 0, 0.45)',

                                        }}
                                    >
                                        {item.industry}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            color: "green",
                                            marginTop: 4,
                                        }}
                                    >
                                        Score: {item.score}%
                                    </Typography>
                                    <Box sx={{ marginTop: 2 }}>
                                        <Typography variant="h5"
                                                    sx = {{mb:2}}
                                        >
                                            Certifications:
                                        </Typography>
                                        {Object.entries(item)
                                            .filter(([key, value]) => value === true)
                                            .map(([key]) => (
                                                <Typography
                                                    key={key}
                                                    sx={{
                                                        fontSize: 17,
                                                        color: 'rgba(0, 0, 0, 0.7)',
                                                        marginLeft: 4,
                                                        backgroundColor: '#E5F1F8',
                                                    }}
                                                >
                                                    •{key}
                                                </Typography>
                                            ))}
                                        <Button onClick={() => handleViewProfile(item.id)}
                                                sx = {{fontSize: '20px',
                                                    display: 'flex',
                                                    backgroundColor: '#284CEA',
                                                    '&:hover': { backgroundColor: '#1c3ca6' },
                                                    borderRadius: '5px',
                                                    width: 150,
                                                    color: '#FFF',
                                                    ml: 4,
                                                    mt: 4
                                                }}
                                        >
                                            View Profile
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Container>
                        ))
                    ) : (
                        <Typography variant="body1">
                            {searchTerm ? "No results found for your search." : "Enter a search term to find vendors."}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Grid2>
    );
}

export default VendorSearch;