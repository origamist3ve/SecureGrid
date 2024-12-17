import React, { useEffect, useState } from "react";
import { auth, db } from "../../Config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Typography, Button, Box, FormControl, FormControlLabel, RadioGroup, Radio } from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import { useNavigate } from "react-router-dom";


const questions = [
    { category: "2", title: "Do you have policies to ensure timely notification of updated risk management information previously provided to us?" },
    { category: "2", title: "Do you have a documented Quality Management System (QMS) for your ICT supply chain operation based on an industry standard or framework?" },
    { category: "2", title: "Do you have an organization-wide strategy for managing end-to-end supply chain risks (from development, acquisition, life cycle support, and disposal of systems, system components, and to system services)?" },
    { category: "3", title: "Do you provide a bill of materials (BOM) for your products, services, and components which includes all logic-bearing (e.g., readable/writable/programmable) hardware, firmware, and software?" },
    { category: "3", title: "Do you have a process for tracking and tracing your product while in development and manufacturing?" },
    { category: "3", title: "Do you have written Supply Chain Risk Management (SCRM) requirements in your contracts with your suppliers?" },
    { category: "3", title: "Do you revise your written SCRM requirements regularly to include needed provisions?" },
    { category: "3", title: "Do you have policies for your suppliers to notify you when there are changes to their subcontractors or their offerings (components, products, services, or support activities)?" },
    { category: "3", title: "Do you implement formal organizational roles and governance responsible for the implementation and oversight of Secure Engineering across the development or manufacturing process for product offerings?" },
    { category: "3", title: "What security control framework (industry or customized) is used to define product offering security capabilities?" },
    { category: "3", title: "Does your organization document and communicate security control requirements for your hardware, software, or solution offering?" },
    { category: "3", title: "How does your organization implement development and manufacturing automation to enforce lifecycle processes and practices?" },
    { category: "3", title: " Does your organization protect all forms of code from unauthorized access and tampering, including patch updates?" },
    { category: "3", title: "Does your organization provide a mechanism for verifying software release integrity, including patch updates for your software product offering?" },
    { category: "3", title: "How does your organization prevent malicious and/or counterfeit IP components within your product offering or solution?" },
    { category: "3", title: "Does your organization manage the integrity of IP for its product offering?" },
    { category: "3", title: "Does your organization define, follow, and validate secure coding and manufacturing practices to mitigate security risks?" },
    { category: "3", title: "Does your organization reuse existing, well-secured software and hardware components, when feasible, instead of duplicating functionality?" },
    { category: "3", title: "Does your organization configure the compilation and build processes to improve executable security?" },
    { category: "3", title: "Does your organization implement formal vulnerability and weakness analysis practices?" },
    { category: "3", title: "Does your organization configure offerings to implement secure settings by default?" },
    { category: "3", title: "Does your organization maintain and manage a Product Security Incident Reporting and Response program (PSRT)?" },
    { category: "3", title: "Does your organization analyze vulnerabilities to identify root cause?" },
    { category: "3", title: "Do you follow operational standards or frameworks for managing Information Security/Cyber security?" },
    { category: "3", title: "Do you have company-wide, publicly available information security policies in place covering privacy policies?" },
    { category: "3", title: "Do you inventory and audit back-up and/or replacement hardware and software assets to ensure their accountability and integrity?" },
    { category: "3", title: "Do you have a defined governance scope for asset management, including line of business technology, facilities, devices, and all other data- generating hardware (like Internet of Things devices)?" },
    { category: "3", title: "Do you have processes or procedures in place to ensure that devices and software installed by users external to your IT department (e.g., line of business personnel) are being discovered, properly secured, and managed?" },
    { category: "3", title: "Do you have an asset management program approved by management for your IT assets that is regularly maintained?" },
    { category: "3", title: "Do you have documented policies or procedures to manage enterprise network-connectable assets throughout their lifecycle?" },
    { category: "3", title: "Do you ensure that you are not sourcing assets on a banned list to customers (e.g., ITAR, NDAA Section 889)?" },
    { category: "3", title: "Do you have documented hardware and software policies and practices in place to ensure asset integrity?" },
    { category: "3", title: "Do you have documented policies or procedures for identification and detection of cyber threats?" },
    { category: "3", title: "Do you address the interaction of cybersecurity operational elements (e.g., SOC, CSIRT, etc.) with the physical security operational elements protecting the organization’s physical assets?" },
    { category: "3", title: "Do you have a policy or procedure for the handling of information that is consistent with its classification?" },
    { category: "3", title: "Do you have documented policies or procedures for internal identification and management of vulnerabilities within your networks and enterprise systems?" },
    { category: "3", title: "Do you have network access control policies and procedures in place for your information systems that are aligned with industry standards or control frameworks?" },
    { category: "3", title: "Is cybersecurity training required for personnel who have administrative rights to your enterprise computing resources?" },
    { category: "3", title: "Do you include contractual obligations to protect information and information systems handled by your suppliers?" },
    { category: "3", title: "Do you have an organizational policy on the use of encryption that conforms with industry standards or control frameworks?" },
    { category: "3", title: "Does your organization have hardening standards in place for network devices (e.g., wireless access points, firewalls, etc.)?" },
    { category: "3", title: "Do you follow an industry standard or framework for your internal or third-party cloud deployments, if applicable?" },
    { category: "3", title: "Do you have defined and documented incident detection practices that outline which actions should be taken in the case of an information security or cybersecurity event?" },
    { category: "3", title: "Do you require vulnerability scanning of software running within your enterprise prior to acceptance?" },
    { category: "3", title: "Do you manage updates, version tracking of new releases, and patches (including patching history) for your software and software services offerings?" },
    { category: "3", title: "Do you deploy anti-malware software?" },
    { category: "3", title: "Do you have a documented incident response process and a dedicated incident response team (CSIRT - Computer Security Incident Response Team)?" },
    { category: "3", title: "Do you have processes or procedures to recover full functionality, including integrity verification, following a major cybersecurity incident?" },
    { category: "3", title: "Do you insure for financial harm from a major cybersecurity incident (e.g., self-insure, third-party, parent company, etc.)?" },



    // Add other questions here
];

const UserFormPage = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubmissionStatus = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) throw new Error("No user logged in.");

                const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
                if (userDoc.exists() && userDoc.data().formResponse) {
                    setIsFormSubmitted(true);
                }
            } catch (error) {
                console.error("Error checking form submission status:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissionStatus();
    }, []);

    // Redirect after 3 seconds if the form is already submitted
    useEffect(() => {
        if (isFormSubmitted) {
            const timer = setTimeout(() => {
                navigate("/dashboard");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isFormSubmitted, navigate]);

    const handleSubmit = async (values) => {
        if (isFormSubmitted) {
            alert("You have already submitted the form.");
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (!currentUser) throw new Error("No user logged in.");

            // Calculate score
            const totalQuestions = values.responses.length;
            const yesAnswers = values.responses.filter((response) => response === "Yes").length;
            const score = (yesAnswers / totalQuestions) * 100;

            // Update Firestore
            await updateDoc(doc(db, "Users", currentUser.uid), {
                formResponse: values,
                score: Math.round(score),
            });

            alert("Form submitted successfully!");

            // Set form as submitted
            setIsFormSubmitted(true);

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);
        } catch (error) {
            console.error("Error submitting form:", error.message);
            alert("Error submitting the form. Please try again.");
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            {!isFormSubmitted ? (
                <Formik
                    initialValues={{ responses: Array(questions.length).fill("") }}
                    onSubmit={handleSubmit}
                >
                    {({ values, handleChange }) => (
                        <Form>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Fill out the form:
                            </Typography>
                            <FieldArray name="responses">
                                {() =>
                                    questions.map((question, index) => (
                                        <Box key={index} sx={{ mb: 3 }}>
                                            <Typography>{`${index + 1}. ${question.title}`}</Typography>
                                            <FormControl component="fieldset" sx={{ mt: 1 }}>
                                                <RadioGroup
                                                    name={`responses[${index}]`}
                                                    value={values.responses[index]}
                                                    onChange={handleChange}
                                                    row
                                                >
                                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    ))
                                }
                            </FieldArray>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            ) : (
                <Box>
                    <Typography variant="h6" color="success.main">
                        You have already submitted the form. Thank you!
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Redirecting to the dashboard in 3 seconds...
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default UserFormPage;