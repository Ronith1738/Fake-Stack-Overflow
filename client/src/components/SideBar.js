import api from '../api/router.js'
import React, { useState, useEffect } from "react";
import Header from './Header.js';
import MainPage from './MainPage.js';

export default function SideBar(props) {
  function handleSearch(query) {
    console.log(`Searching for "${query}"...`);
  }
  if(props.acc != null){
    console.log("Current user: ", props.acc.account);
  }else{
    console.log("Current user: Guest");
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getAllQuestions();
        const questions = response.data;
        console.log(props.acc);
        props.setSelectedModelCopy(questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };


    fetchData();
  }, []);

  const handleSideBarSelectQuestions = (event) => {
    console.log("Clicked SideBar Questions")
    console.log(event)
    props.setCurrentPageIndex(0)
    props.setSelectedQuestion(-1)
    console.log("fakestackoverflow.js is aware that option === 0")
  }

  const handleSideBarSelectTags = (event) => {
    console.log("Clicked SideBar Tags")
    console.log(event)
    props.setCurrentPageIndex(1)
    props.setSelectedQuestion(-1)
    console.log("fakestackoverflow.js is aware that option === 1")
  }

  return (
    <>
      <Header handleSearch={handleSearch} {...props} />
      <div id="main" className="main">
        <div id="sidebar">
          <button
            id = "sidebar-option-questions"
            className={ props.currentPageIndex === 0 || props.currentPageIndex === 3 ? "sidebar-option-item active" : "sidebar-option-item" }
            onClick={handleSideBarSelectQuestions}
          >Questions</button>
          <button
            id = "sidebar-options-tags"
            className={ props.currentPageIndex === 1 ? "sidebar-option-item active" : "sidebar-option-item" }
            onClick={handleSideBarSelectTags}
          >Tags</button>
        </div>
        <MainPage {...props} />
      </div>
    </>
  );
}
