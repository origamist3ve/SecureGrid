import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GetStarted.module.css";
import { Box, Button, Typography } from "@mui/material";
import { auth } from "../../Config/firebase";

const Content = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if the user is logged in
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user); // Set to true if user exists, false otherwise
        });

        // Cleanup the listener on unmount
        return () => unsubscribe();
    }, []);

    const handleVendorClick = () => {
        if (isLoggedIn) {
            navigate("/register");
        } else {
            alert("You must log in first!");
            navigate("/register"); // Redirect to login page if not logged in
        }
    };

    const homePage = () => {
        navigate("/");
    };

    return (
        <div className={styles["get-started-container"]}>
            <Button
                onClick={homePage}
                sx={{
                    display: "flex",
                    position: "absolute",
                    left: "80px",
                    top: "22px",
                    fontSize: 23,
                    color: "black",
                }}
            >
                SecureGrid
            </Button>
            <div>
                <h1 className={styles["header"]}>Welcome!</h1>
                <p className={styles["subtitle"]}>
                    Please select whether you are signing up as a vendor or a company.
                </p>
            </div>
            <div className={styles["button-container"]}>
                <button onClick={handleVendorClick} className={styles["vendor-button"]}>
                    Sign Up as Vendor
                </button>
                <button onClick={handleVendorClick} className={styles["company-button"]}>
                    Sign Up as Company
                </button>
            </div>
        </div>
    );
};

export default Content;
