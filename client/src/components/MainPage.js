import React, { useState } from "react";
import AllQuestionsPage from './AllQuestionsPage.js';
import AskQuestionPage from './AskQuestionPage.js';
import AnswerPage from './AnswerPage.js';
import PostAnswerPage from './PostAnswerPage.js';
import AllTagsPage from './AllTagsPage.js';
import SearchQuestionsPage from './SearchQuestionsPage.js'
import WelcomePage from "./WelcomePage.js";
import UserProfile from "./UserProfile.js";
import EditQuestionPage from "./EditQuestionPage.js";

export default function MainPage(props) {
  const [questionData, setQuestionData] = useState([]);
  
  console.log("This is current page.", props.currentPageIndex);
  console.log("This is set current page.", props.currentPageIndex);
  
  return (
    <div id="mainpage" className="mainPage">
      {/* Have to add a Welcome Page, Create Account, and Login Page */}
      {props.currentPageIndex === 0 ? <AllQuestionsPage {...props} /> : 
      (props.currentPageIndex === 1) ? <AllTagsPage {...props} /> : 
      (props.currentPageIndex === 2) ? <AskQuestionPage {...props} /> : 
      (props.currentPageIndex === 3) ? <SearchQuestionsPage {...props} /> : 
      (props.currentPageIndex === 4) ? <AnswerPage {...props} /> : 
      (props.currentPageIndex === 5) ? <PostAnswerPage {...props} /> : 
      (props.currentPageIndex === 6) ? <WelcomePage {...props} /> : 
      (props.currentPageIndex === 7) ? <UserProfile {...props} setQuestionData ={setQuestionData}/> : 
      (props.currentPageIndex === 8) ? <EditQuestionPage {...props} questionData = {questionData}/> :
      <p>Error Warning</p> }
    </div>
  );
}
