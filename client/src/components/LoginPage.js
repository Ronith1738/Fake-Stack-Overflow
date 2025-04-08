import React, {useState, useEffect} from "react";
import SideBar from './SideBar.js';
import api from '../api/router.js';

export default function LoginPage(props) {  
  const [loginEmailInputValue, setLoginEmailInputValue] = useState('');
  const [loginPasswordInputValue, setLoginPasswordInputValue] = useState('');

  const [loginEmailWarning, setLoginEmailWarning] = useState('');
  const [loginPasswordWarning, setLoginPasswordWarning] = useState('');

  const [emailExist, setEmailExists] = useState('');
  const [moveLogin, setMoveLogin] = useState(false);

  const [account, setAccount] = useState(null);
  
  const handleLoginEmailInputChange = (event) => {
    setLoginEmailInputValue(event.target.value);
  };
  
  const handleLoginPasswordInputChange = (event) =>{
    setLoginPasswordInputValue(event.target.value);
  };
  const handleLogOut = () => {
    setAccount(null);
  }
  useEffect(() => {
    const fetchUserEmails = async () => {
        if (loginEmailInputValue) {
          try {
            const eresponse = await api.getAllAccountsEmail();

            const emailsData = eresponse.data;
            if (emailsData.some(user => user.email === loginEmailInputValue)) {
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
}, [loginEmailInputValue]);

  async function handleLogin(){
    var flag = 0;
    
    if(loginEmailInputValue.length === 0){
      setLoginEmailWarning('Email cannot be empty');
      flag++;
    }else if(emailExist === 'does not exist in database'){
      setLoginEmailWarning('Email not found');
      flag++;
    }else if (!(/^[^@\s]+@[^@\s]+\.[^@\s.]+$/).test(loginEmailInputValue) && loginEmailInputValue != 'admin') {
      setLoginEmailWarning('Not a valid email');
      flag++;
    }else{
      // setLoginEmailWarning('email found');
      setLoginEmailWarning('');
    }

    if(loginPasswordInputValue.length === 0){
      setLoginPasswordWarning('Password cannot be empty');
      flag++;
    }else{
      setLoginPasswordWarning('');
    }
    if(flag === 0){
      try{
        const aresponse = await api.matchPassword(
          {
            email: loginEmailInputValue,
            password: loginPasswordInputValue,
          });
        const accountData = aresponse.data;
        if(!accountData.passwordFound){
          setLoginPasswordWarning('Password is incorrect');
          flag++;
        }else{
          setAccount(accountData);
          setMoveLogin(true);
        }
        

      }catch(error){
        console.error('Error retrieving account', error);
      }
    }
    
  }


  return (
    <>
      {moveLogin ? (
       
       <SideBar {...props} handleLogOut={handleLogOut} acc={account}/>
      ):
      (
        <div id="login-page">
          <div id="login">
            <div id="login-account">Login to Your Account</div>
            <div id="login-email">Email</div>
            <div id="login-email-warning"><pre>{loginEmailWarning}</pre></div>
            <div id="login-email-searchbar">
              <input
                  type="text"
                  id="login-email-search"
                  name="search-form"
                  value={loginEmailInputValue}
                  onChange={handleLoginEmailInputChange}
                                    
              />
            </div>
            <div id="login-password">Password</div>
            <div id="login-password-warning"><pre>{loginPasswordWarning}</pre></div>
            <div id="login-password-searchbar">
              <input
                  type="text"
                  id="login-password-search"
                  name="search-form"
                  value={loginPasswordInputValue}
                  onChange={handleLoginPasswordInputChange}
              
              />
            </div>
            <div id="login-button">
              <button id="button-login" onClick={handleLogin}>Login</button>
            </div>

          </div>

        </div>
      )}
        
    </>
  );
} 