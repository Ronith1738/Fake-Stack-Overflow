import React, { useState, useEffect } from "react";
import CreateAccountPage from './CreateAccountPage.js';
import LoginPage from './LoginPage.js';
import GuestLogin from "./GuestLogin.js";

export default function WelcomePage(props) {
    const [isExisting, setIsExisting] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    const handleExisting = (event) => {
        setIsExisting(true);
    };

    const handleNew = (event) => {
        setIsNew(true);
    };

    const handleGuest = (event) => {
        setIsGuest(true);
    };
    const handleGoBack = () =>{
        setIsExisting(false);
        setIsGuest(false)
    }

    return (
        <>
            {isExisting ? 
            (
                <LoginPage {...props} goBack={handleGoBack}/>
            ) : 
            isNew ? (
                <CreateAccountPage {...props} />
            ) : 
            isGuest ? (
                <GuestLogin {...props} goBack={handleGoBack}/>
            ) : 
            (
                <div id="welcome">
                    <div id="welcome-title">
                        <strong>Welcome to Fake Stack Overflow</strong>
                    </div>
                    <div id="existing-user-button">
                        <button id="existing" onClick={handleExisting}>Login as Existing User</button>
                    </div>
                    <div id="new-user-button">
                        <button id="new" onClick={handleNew}>Register as New User</button>
                    </div>
                    <div id="guest-user-button">
                        <button id="guest" onClick={handleGuest}>Continue as Guest</button>
                    </div>
                </div>
            )}
        </>
    );
    
}
