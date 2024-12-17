import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import company from '../../Assets/company.png';
import compliance from '../../Assets/compliance.png';
import services from '../../Assets/services.png';
import documentation from '../../Assets/documentation.png';
import done from '../../Assets/done.png';
import { db, storage } from '../../Config/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { getAuth } from "firebase/auth";



// Step icons data
const steps = [
    { icon: company, title: 'Company Information', step: 'Step 1 of 4', completed: false },
    { icon: services, title: 'Services & Capabilities', step: 'Step 2 of 4', completed: false },
    { icon: compliance, title: 'Compliance & Security', step: 'Step 3 of 4', completed: false },
    { icon: documentation, title: 'Documentation', step: 'Step 4 of 4', completed: false },
];

// Reusable StepContainer Component
const StepContainer = ({ children, page, handleNext, handlePrevious }) => (
    <Box sx={{ width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h3" gutterBottom sx={{ fontFamily: 'Lao Muang Don', fontSize: 40, fontWeight: 600 }}>
                Vendor Onboarding
            </Typography>
            <Typography variant="subtitle1" sx={{ fontSize: 25, color: '#000', mt: -2 }}>
                Complete your profile to join our vendor marketplace
            </Typography>
        </Box>

        {/* Icons Container */}
        <Box sx={{ display: 'flex', gap: '80px', justifyContent: 'center', alignItems: 'center', mb: 5 }}>
            {steps.map((step, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                    {index < page - 1 ? ( // Mark previous steps as completed
                        <img src={done} alt={done} style ={{ color: 'green', fontSize: 50 }} /> // Use a green check icon for completed steps
                    ) : (
                        <img src={step.icon} alt={step.title} style={{ width: 50, height: 50, opacity: index === page - 1 ? 1 : 0.3 }} />
                    )}
                    <Typography sx={{ fontFamily: 'Inter, serif', fontSize: 20, fontWeight: 'bold' }}>{step.title}</Typography>
                    <Typography variant="body2" sx={{ mt: 1, fontSize: 15, fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.45)' }}>{step.step}</Typography>
                </Box>
            ))}
        </Box>

        {/* Content specific to each page */}
        <Box sx={{ width: '100%', maxWidth: '1300px', backgroundColor: '#FFF', borderRadius: '35px', border: '1px solid rgba(0, 0, 0, 0.55)', padding: '50px', boxSizing: 'border-box', mb: 5 }}>
            {children}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, width: '100%', maxWidth: '1300px' }}>
            <Button variant="outlined" onClick={handlePrevious} disabled={page === 1}>
                Previous
            </Button>
            <Button variant="contained" onClick={handleNext}>
                {page === 4 ? "Submit" : "Next"}
            </Button>
        </Box>
    </Box>
);

const VendorRegistration = () => {
    const [page, setPage] = useState(1);

    // Form states
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [industry, setIndustry] = useState("");
    const [companyDescription, setCompanyDescription] = useState("");
    const [contactName, setContactName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [CloudInfrastructure1, setCloudInfrastructure1] = useState(false);
    const [CloudInfrastructure2, setCloudInfrastructure2] = useState(false);
    const [CloudInfrastructure3, setCloudInfrastructure3] = useState(false);
    const [CloudInfrastructure4, setCloudInfrastructure4] = useState(false);
    const [securityServices, setSecurityServices] = useState(false);
    const [dataAnalyses, setDataAnalyses] = useState(false);
    const [ISOIEC1,setISOIEC1] = useState(false);
    const [NIST, setNIST] = useState(false);
    const [SOC2, setSOC2] = useState(false);
    const [FEDRAMP, setFEDRAMP] = useState(false);
    const [ISOIEC2, setISOIEC2] = useState(false);
    const [GDPR , setGDPR] = useState(false);
    const [IEC , setIEC] = useState(false);
    const [FIPS, setFIPS] = useState(false);
    const [CREST, setCREST] = useState(false);
    const [CommonCriteria, setCommonCriteria] = useState(false);
    const [NERC , setNERC ] = useState(false);
    const [PCI  , setPCI ] = useState(false);
   // const [BusinessLicense, setBusinessLicense] = useState(false);
//    const [businessLicense, setBusinessLicense] = useState(null);
//    const[insuranceCertificate, setInsuranceCertificate] = useState(null);
//    const[financialStatement, setFinancialStatement] = useState(null);

    const [fileUpload, setFileUpload] = useState(null);

    const navigate = useNavigate();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const auth = getAuth();
    const currentUser = auth.currentUser;


    const vendorCollectionRef = collection(db, "vendors");

    // const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         console.log("File selected:", file.name);
    //     }
    // };

    useEffect(() => {
        // Check if the user has already submitted the form
        const checkSubmissionStatus = async () => {
            const userDoc = await getDoc(doc(db, "Users", currentUser.uid));

            if (userDoc.exists() && userDoc.data().formSubmitted) {
                setFormSubmitted(true);
            }
        };

        checkSubmissionStatus();
    }, [currentUser, navigate]);

    const onSubmitData = async () => {
        if (!currentUser) {
            alert("User not logged in.");
            return;
        }

        try {
            console.log("Submitting data...");

            // Save form data to Firestore
            const vendorData = {
                companyName, website, industry, companyDescription,
                contactName, contactEmail, contactPhone,
                CloudInfrastructure1, CloudInfrastructure2,
                CloudInfrastructure3, CloudInfrastructure4,
                securityServices, dataAnalyses,
                ISOIEC1, NIST, SOC2, FEDRAMP,
                ISOIEC2, GDPR, IEC, FIPS,
                CREST, CommonCriteria, NERC, PCI,
            };

            const docRef = await addDoc(vendorCollectionRef, {
                ...vendorData,
                userId: currentUser.uid,
            });


            // Save file metadata to Firestore if files are uploaded
            if (fileUpload) {
                const uploadedFileRef = ref(storage, `Files/${currentUser.uid}/${fileUpload.name}`);
                await uploadBytes(uploadedFileRef, fileUpload);
                const fileUrl = await getDownloadURL(uploadedFileRef);

                await updateDoc(doc(db, "vendors", docRef.id), {
                    documents: [{ name: fileUpload.name, url: fileUrl }],
                });
            }

            const userDocRef = doc(db, "Users", currentUser.uid);
            await updateDoc(userDocRef, { formSubmitted: true });

            alert("Form submitted successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Error in onSubmitData:", err.message);
        }
    };





    const uploadFile = async () => {
        if (!fileUpload) return;
        const uploadedFileRef = ref(storage, `Files/${fileUpload.name}`);
        const snapshot = await uploadBytes(uploadedFileRef, fileUpload);
        const fileUrl = await getDownloadURL(snapshot.ref); // Get downloadable URL for the uploaded file


        try {
          await uploadBytes(filesFolderRef, fileUpload);


        } catch (err) {
          console.error(err);
          alert("press upload button again");
        }
      };


    const handleNext = () => {
        if (page === 4) {
            onSubmitData();
        } else {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevious = () => {
        if (page > 1) setPage((prevPage) => prevPage - 1);
    };

    if (formSubmitted) {
        return (
            <Typography variant="h6" sx={{ textAlign: "center", mt: 5 }}>
                You have already submitted this form. Thank you!
            </Typography>
        );
    }


    const renderPageContent = () => {
        switch (page) {
            case 1:
                return (
                    <>
                        <Typography variant="h5" sx={{ fontFamily: 'Roboto, serif', fontSize: 30, fontWeight: 600, mb: 3 }}>
                            Company Information
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, color: '#0000008C', mb: 5 }}>
                            Provide your basic company information
                        </Typography>
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Company Name
                        </Typography>
                        <TextField
                            fullWidth
                            label="Company Name"
                            placeholder="Enter your company name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            sx={{ mb: 5, fontSize: 20 }}
                        />
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Website
                        </Typography>

                        <Box sx={{ display: 'flex', gap: '20px', mb: 5 }}>
                            <TextField
                                fullWidth
                                label="Website"
                                placeholder="www.example.com"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                sx={{ fontSize: 20 }}
                            />
                            <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, justifyContent: "center", position: "relative", bottom: '50px', left:'100px' }}>
                                Industry
                            </Typography>
                            <TextField
                                fullWidth
                                label="Industry"
                                placeholder="Select your industry"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                sx={{ fontSize: 20 }}
                            />
                        </Box>
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Company Description
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Company Description"
                            placeholder="Describe your company and its key offerings"
                            value={companyDescription}
                            onChange={(e) => setCompanyDescription(e.target.value)}
                            sx={{ mb: 3, fontSize: 20 }}
                        />
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Contact Name
                        </Typography>
                        <TextField
                            fullWidth
                            label="Contact Name"
                            placeholder="Full Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            sx={{ mb: 3, fontSize: 20 }}
                        />
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Email
                        </Typography>
                        <TextField
                            fullWidth
                            label="Contact email"
                            placeholder="email@company.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            sx={{ mb: 3, fontSize: 20 }}
                        />
                        <Typography variant="h2" sx={{ fontFamily: 'Roboto, serif', fontSize: 22, fontWeight: 600, mb: 3 }}>
                            Phone
                        </Typography>
                        <TextField
                            fullWidth
                            label="Phone number"
                            placeholder= "+1 (123 456-7890)"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            sx={{ mb: 3, fontSize: 20 }}
                        />

                    </>
                );
            case 2:
                return (
                    <>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Services and Capabilities
                        </Typography>
                        <Typography  sx={{fontFamily: 'Roboto, serif', fontSize: 22, color: '#0000008C', mb: 5 }}>
                            Tell us about your service and expertise
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Primary Services
                        </Typography>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={CloudInfrastructure1} onChange={(e) => setCloudInfrastructure1(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Cloud Infrastructure 1</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={CloudInfrastructure2} onChange={(e) => setCloudInfrastructure2(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Cloud Infrastructure 2</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={dataAnalyses} onChange={(e) => setDataAnalyses(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Data Analysis</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={CloudInfrastructure3} onChange={(e) => setCloudInfrastructure3(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Cloud Infrastructure 3</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={securityServices} onChange={(e) => setSecurityServices(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Security Services</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={CloudInfrastructure4} onChange={(e) => setCloudInfrastructure4(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 177, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Cloud Infrastructure 4</Typography>}
                            />
                        </Box>
                    </>
                );
            case 3:
                return (
                    <>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Compliance & Security
                        </Typography>
                        <Typography  sx={{fontFamily: 'Roboto, serif', fontSize: 22, color: '#0000008C', mb: 5 }}>
                            Provide Information about security certification and compliance
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Security Certification
                        </Typography>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={ISOIEC1} onChange={(e) => setISOIEC1(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>ISO/IEC 27001</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={NIST} onChange={(e) => setNIST(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>NIST 800-53/FISMA</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={SOC2} onChange={(e) => setSOC2(e.target.checked)} />}
                                label={<Typography sx={{padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>SOC 2 Type II</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={FEDRAMP} onChange={(e) => setFEDRAMP(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>FedRAMP</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={ISOIEC2} onChange={(e) => setISOIEC2(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>ISO/IEC 27017</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={GDPR} onChange={(e) => setGDPR(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>GDPR Compliance</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={IEC} onChange={(e) => setIEC(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>IEC 62443</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={FIPS} onChange={(e) => setFIPS(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>FIPS 140-2/FIPS 140-3</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={securityServices} onChange={(e) => setSecurityServices(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>CREST Certification</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={CREST} onChange={(e) => setCREST(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>Common Criteria (CC) Certification</Typography>}
                            />
                        </Box>
                        <Box sx={{display: 'flex', gap: '60px', justifyContent: 'flex-start', mb: 2, alignSelf: 'flex-end',}}>
                            <FormControlLabel
                                control={<Checkbox checked={CommonCriteria} onChange={(e) => setCommonCriteria(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>NERC CIP</Typography>}
                            />
                            <FormControlLabel
                                control={<Checkbox checked={PCI} onChange={(e) => setPCI(e.target.checked)} />}
                                label={<Typography sx={{ padding: '10px', boxSizing :'border-box',  fontSize: '15px', width: 260, height: 44, flexShrink: 0, borderRadius: '5px', border: '1px solid rgba(0, 0, 0, 0.30)', background: 'rgba(217, 217, 217, 0.01)'}}>PCI DSS</Typography>}
                            />
                        </Box>
                    </>
                );
            case 4:
                return (
                    <>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Required Documentation
                        </Typography>
                        <Typography  sx={{fontFamily: 'Roboto, serif', fontSize: 22, color: '#0000008C', mb: 5 }}>
                            Upload necessary documents to complete your registration
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                mb: 5,
                                boxSizing: 'border-box',
                                fontSize: '15px', width: 856,
                                height: 138,
                                flexShrink: 0,
                                borderRadius: '5px',
                                border: '1px solid rgba(0, 0, 0, 0.30)',
                                background: 'rgba(217, 217, 217, 0.01)'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    width: '216px',
                                    height: '23px',
                                    fontFamily: 'Roboto',
                                    fontSize: '20px',
                                    ml: '15px'
                                }}>
                                Business License
                            </Typography>
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    ml: 2,
                                    mt: 10,
                                    color: '#0000008C',
                                    fontSize: '18px'
                                }}>
                                PDF or JPG format, max 10MB
                            </Typography>
                            <input
                                accept="image/*,application/pdf"
                                id="upload-button-file"
                                type="file"
                                style={{display: 'none'}}
                                onChange={(e) => setFileUpload(e.target.files[0])}
                            />
                            <label htmlFor="upload-button-file">
                                <Button onClick={uploadFile}
                                    component="span"
                                        sx={{
                                            marginLeft: 'auto',
                                            flexShrink: 0,
                                            width: 106,
                                            mb: 2,
                                            height: 26,
                                            color: '#000',
                                            fontSize: '15px',
                                            borderRadius: '10px',
                                            fontWeight: 'bold',
                                            border: '1px solid rgba(0, 0, 0, 0.30)',
                                        }}
                                >
                                    Upload
                                </Button>
                            </label>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                mb: 5,
                                boxSizing: 'border-box',
                                fontSize: '15px', width: 856,
                                height: 138,
                                flexShrink: 0,
                                borderRadius: '5px',
                                border: '1px solid rgba(0, 0, 0, 0.30)',
                                background: 'rgba(217, 217, 217, 0.01)'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    width: '216px',
                                    height: '23px',
                                    fontFamily: 'Roboto',
                                    fontSize: '20px',
                                    ml: '15px'
                                }}>
                                Insurance Certificate
                            </Typography>
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    ml: 2,
                                    mt: 10,
                                    color: '#0000008C',
                                    fontSize: '18px'
                                }}>
                                PDF or JPG format, max 10MB
                            </Typography>
                            <input
                                accept="image/*,application/pdf"
                                id="upload-button-file"
                                type="file"
                                style={{display: 'none'}} // Hide the input
                                onChange={(e) => setFileUpload(e.target.files[0])}n
                            />
                            <label htmlFor="upload-button-file">
                                <Button onClick={uploadFile}
                                    component="span"
                                    sx={{
                                        marginLeft: 'auto',
                                        flexShrink: 0,
                                        width: 106,
                                        mb: 2,
                                        height: 26,
                                        color: '#000',
                                        fontSize: '15px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(0, 0, 0, 0.30)',
                                    }}
                                >
                                    Upload
                                </Button>
                            </label>
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px',
                                mb: 5,
                                boxSizing: 'border-box',
                                fontSize: '15px', width: 856,
                                height: 138,
                                flexShrink: 0,
                                borderRadius: '5px',
                                border: '1px solid rgba(0, 0, 0, 0.30)',
                                background: 'rgba(217, 217, 217, 0.01)'
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 3,
                                    width: '216px',
                                    height: '23px',
                                    fontFamily: 'Roboto',
                                    fontSize: '20px',
                                    ml: '15px'
                                }}>
                                Financial Statement
                            </Typography>
                            <Typography
                                sx={{
                                    position: 'absolute',
                                    ml: 2,
                                    mt: 10,
                                    color: '#0000008C',
                                    fontSize: '18px'
                                }}>
                                PDF or JPG format, max 10MB
                            </Typography>
                            <input
                                accept="image/*,application/pdf"
                                id="upload-button-file"
                                type="file"
                                style={{display: 'none'}} // Hide the input
                                onChange={(e) => setFileUpload(e.target.files[0])} // Handle file selection
                            />
                            <label htmlFor="upload-button-file">
                                <Button onClick={uploadFile}
                                    component="span"
                                    sx={{
                                        marginLeft: 'auto',
                                        flexShrink: 0,
                                        width: 106,
                                        mb: 2,
                                        height: 26,
                                        color: '#000',
                                        fontSize: '15px',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        border: '1px solid rgba(0, 0, 0, 0.30)',
                                    }}
                                >
                                    Upload
                                </Button>
                            </label>
                        </Box>
                    </>
            );
        default:
        return null;
        }
    };

    return (
        <StepContainer page={page} handleNext={handleNext} handlePrevious={handlePrevious}>
            {renderPageContent()}
        </StepContainer>
    );
};

    export default VendorRegistration;