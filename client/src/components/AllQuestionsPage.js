import api from '../api/router.js'
import React, { useState, useEffect } from "react";
import QuestionsCard from './QuestionsCard.js'

export default function AllQuestionsPage(props) { 
  console.log("In AllQuestionsPage.js")
  const[sortBy, setSortBy] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const questionsPerPage = 5;
  useEffect(() => {
    const fetchQuestionsAndTags = async () => {
      try {
        const qresponse = await api.getAllQuestionsNewest();
        console.log("qresponse",qresponse);
        const questionsData = qresponse.data;
        setQuestions(questionsData);
        const tresponse = await api.getAllTags();
        const tagsData = tresponse.data;
        setTags(tagsData);
      } catch (error) {
        console.error("Error fetching questions and tags:", error);
      }
    };

    fetchQuestionsAndTags();
  }, []);

  console.log("AllQuestionsPage testing")

  const handleAskQuestion = (event) => {
    console.log("Clicked handleAskQuestion in AllQuestionsPage")
    console.log(event)
    props.setCurrentPageIndex(2)
    props.setSelectedQuestion(-1)
  }

  const handleSortNewest = async (event) => {
    console.log("Clicked sortByNewest")
    console.log(event)
    setSortBy(0)
    setStartIndex(0);

    try {
      const questionsData = await api.getAllQuestionsNewest();
      console.log("The questionsData is: ", questionsData.data)
      setQuestions(questionsData.data);

    } catch (error) {
      console.error("Error handling sort newest:", error);
    }
    props.setSelectedQuestion(-1)
  }

  const handleSortActive = async (event) => {
    console.log("Clicked sortByActive")
    console.log(event)
    setSortBy(1)
    setStartIndex(0);

    try {
      const questionsData = await api.getAllQuestionsActive();
      console.log("The questionsData is: ", questionsData.data)
      setQuestions(questionsData.data);
    } catch (error) {
      console.error("Error handling sort active:", error);
    }

    props.setSelectedQuestion(-1)
  }

  const handleSortUnanswered = async (event) => {
    console.log("Clicked sortByUnanswered")
    console.log(event)
    setSortBy(2)
    setStartIndex(0);

    try {
      const questionsData = await api.getAllQuestionsUnanswered();
      console.log("The questionsData is: ", questionsData.data)
      setQuestions(questionsData.data);
    } catch (error) {
      console.error("Error handling sort unanswered:", error);
    }
    
    props.setSelectedQuestion(-1)
  }
  const handleNext = () => {
    if(startIndex + questionsPerPage < questions.length){
      setStartIndex(startIndex + questionsPerPage);
    }
  }

  const handlePrev = () => {
    if(startIndex - questionsPerPage >= 0){
      setStartIndex(startIndex - questionsPerPage);
    }
  }
  
  return (
    <>
    <div id="questions-answers-tags-page" className="questions-answers-tags-page">
      <div id="qat-header" className="qat-header">
        <div id="questionsPageType" className="questionsPageType">All Questions</div>
        {props.acc != null && <button id="askQuestion" onClick={handleAskQuestion} >Ask Question</button>}
        <div id="numQuestions" className="numQuestions">{questions.length} question(s)</div>
        <div id="sortButtons" className="sortButtons">
          <button 
            id="newest" 
            className={ sortBy === 0 ? "sort-by-buttons active" : "sort-by-buttons" }
            onClick={handleSortNewest}
          >Newest</button>
          <button 
            id="active" 
            className={ sortBy === 1 ? "sort-by-buttons active" : "sort-by-buttons" }
            onClick={handleSortActive}
          >Active</button>
          <button 
            id="unanswered" 
            className={ sortBy === 2 ? "sort-by-buttons active" : "sort-by-buttons" }
            onClick={handleSortUnanswered}
          >Unanswered</button>
          
        </div>
        <button id="previous-questions" className="disabled-button" onClick={handlePrev} disabled={startIndex === 0}>Previous</button>
        <button id="next-questions" className="disabled-button" onClick={handleNext} disabled={questions.length <= startIndex+questionsPerPage}>Next</button>
      </div>
      <div id="questions-list" className="questions-list">
        {/* <QuestionsCard /> */}
        {questions.length === 0 ? (
          <div id="noquestionsfound">No Questions Found</div>
        ) : <div id="nothing"></div>}
        {questions.slice(startIndex, startIndex + questionsPerPage).map((question) => <QuestionsCard key={question._id} q={question} t={tags} {...props} />)}
       
      </div>
    </div>
    </>
  );
}
