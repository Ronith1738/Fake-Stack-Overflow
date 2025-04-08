import React, { useState, useEffect } from "react";
import SearchBar from './SearchBar.js';

export default function Header({handleSearch, ...props}) { 
  const handleButtonClick = () =>{
    if(props.acc != null){
      props.handleLogOut();
    }
    props.goBack();
  } 

  const handleButtonClickProfile = () =>{
    console.log(props);
    props.setCurrentPageIndex(7);
  } 

  return (
    <>
      <div id="header" className="header">
        {props.acc != null && <button id="profile" onClick={handleButtonClickProfile}>User Profile</button>}
        <div id="header-text">
          <strong>Fake Stack Overflow</strong>
        </div>
        <SearchBar onEnter={handleSearch} {...props} />
        {console.log(props.acc)}
        {props.acc == null && <button id="home" onClick={handleButtonClick}>Home</button>}
        {props.acc != null && <button id="logout" onClick={handleButtonClick}>Log Out</button>}
      </div>     
    </>
  );
}