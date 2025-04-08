import api from '../api/router.js'
import React, { useState, useEffect } from "react";
import WelcomePage from './WelcomePage.js';

export default function CreateAccountPage(props) {  
    const [accountUsernameInputValue, setAccountUsernameInputValue] = useState('');
    const [accountEmailInputValue, setAccountEmailInputValue] = useState('');
    const [accountPasswordInputValue, setAccountPasswordInputValue] = useState('');
    const [accountVerifyPasswordInputValue, setAccountVerifyPasswordInputValue] = useState('');

    const [accountUsernameWarning, setAccountUsernameWarning] = useState('');
    const [accountEmailWarning, setAccountEmailWarning] = useState('');
    const [accountPasswordWarning, setAccountPasswordWarning] = useState('');
    const [accountVerifyPasswordWarning, setAccountVerifyPasswordWarning] = useState('');

    const [emailExists, setEmailExists] = useState('');
    const [moveLogin, setMoveLogin] = useState(false);

    const handleAccountUsernameInputChange = (event) => {
        setAccountUsernameInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleAccountEmailInputChange = (event) => {
        setAccountEmailInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleAccountPasswordInputChange = (event) => {
        setAccountPasswordInputValue(event.target.value);
        console.log(event.target.value)
    };

    const handleAccountVerifyPasswordInputChange = (event) => {
        setAccountVerifyPasswordInputValue(event.target.value);
        console.log(event.target.value)
    };

    useEffect(() => {
        const fetchUserEmails = async () => {
            if (accountEmailInputValue) {
              try {
                const eresponse = await api.getAllAccountsEmail();

                const emailsData = eresponse.data;
                if (emailsData.some(user => user.email === accountEmailInputValue)) {
                    setEmailExists('exists in database');
                }
                else {
                    setEmailExists('does not exist in database');
                }
              } catch (error) {
                console.error('Error retrieving user emails:', error);
              }
            }
          };

        fetchUserEmails();
    }, [accountEmailInputValue]);

    async function handleCreateAccount() {
        var flag = 0;
        if (accountUsernameInputValue.length === 0) {
            setAccountUsernameWarning('Username cannot be empty');
            flag++;
        }else {
            setAccountUsernameWarning('');
        }
        if (accountEmailInputValue.length === 0) {
            setAccountEmailWarning('Email cannot be empty');
            flag++;
        }else if (emailExists === 'exists in database') {
            setAccountEmailWarning('Email already taken');
            flag++;
        }else if (!(/^[^@\s]+@[^@\s]+\.[^@\s.]+$/).test(accountEmailInputValue)) {
            setAccountEmailWarning('Not a valid email');
            flag++;
        }
        else if(emailExists === ''){
            setAccountEmailWarning('not rendered correctly');
        }
        
        else {
            setAccountEmailWarning('');
        }
        if(accountPasswordInputValue.length === 0){
            setAccountPasswordWarning('Password cannot be empty');
            flag++;
        }else if (new RegExp(`${accountEmailInputValue}|${accountUsernameInputValue}`).test(accountPasswordInputValue)) { 
            setAccountPasswordWarning('Password cannot contain username or email');
            flag++;
        }else {
            setAccountPasswordWarning('');
        } 
        if (accountVerifyPasswordInputValue !== accountPasswordInputValue) {
            setAccountVerifyPasswordWarning('Passwords do not match');
            flag++;
        }else if(accountVerifyPasswordInputValue.length === 0){
            setAccountVerifyPasswordWarning('Cannot be empty');
            flag++;
        }
        else {
            setAccountVerifyPasswordWarning('');
        } 
        if (flag === 0) {
            try {
                console.log("Trying to create")
                await api.createAccount({
                    username: accountUsernameInputValue,
                    email: accountEmailInputValue,
                    password: accountPasswordInputValue,
                });
                console.log("Account created successfully") 
                setMoveLogin(true);
                console.log("Account created successfully");
            } catch (error) {
                console.error("Error handling click create account: ", error);
            }

            
        }
    }

    return (
        <>
            {moveLogin ? 
            (
                <WelcomePage {...props} />
            ) :  
            (
                <div id ="account-page">
                    <div id="create">
                        <div id="create-account">Create Your Account</div>
                        <div id="account-username">Username</div>
                        <div id="account-username-warning"><pre>{accountUsernameWarning}</pre></div>
                        <div id="account-username-searchbar">
                            <input 
                                type="text" 
                                id="user-search" 
                                name="search-form" 
                                value={accountUsernameInputValue}
                                onChange={handleAccountUsernameInputChange}
                            />
                        </div>
                
                        <div id="account-email">Email</div>
                        <div id="account-email-warning"><pre>{accountEmailWarning}</pre></div>
                        <div id="account-email-searchbar">
                            <input 
                                type="text" 
                                id="email-search" 
                                name="search-form" 
                                value={accountEmailInputValue}
                                onChange={handleAccountEmailInputChange}
                            />
                        </div>
                        
                
                        <div id="account-password">Password</div>
                        <div id="account-password-warning"><pre>{accountPasswordWarning}</pre></div>
                        <div id="account-password-searchbar">
                            <input 
                                type="text" 
                                id="password-search" 
                                name="search-form"  
                                value={accountPasswordInputValue}
                                onChange={handleAccountPasswordInputChange}
                            />
                        </div>
                
                        <div id="account-verify-password">Verify Password</div>
                        <div id="account-verify-password-warning"><pre>{accountVerifyPasswordWarning}</pre></div>
                        <div id="account-verify-password-searchbar">
                            <input 
                                type="text" 
                                id="verify-search" 
                                name="search-form" 
                                value={accountVerifyPasswordInputValue}
                                onChange={handleAccountVerifyPasswordInputChange}
                            />
                        </div>

                        <div id="signup-button">
                            <button 
                                id="signup" 
                                onClick={handleCreateAccount}
                                >Sign up
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}