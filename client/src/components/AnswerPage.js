import api from '../api/router.js'
import React, { useState, useEffect, useRef } from "react";
import AnswersCard from './AnswersCard.js';
import CommentsCard from './CommentsCard.js';

export default function AnswerPage(props) {
  const questionID = props.selectedQuestion;
  
  const [question, setQuestion] = useState(null);
  const [commentInputValue, setCommentInputValue] = useState('');
  const [answerIds, setAnswerIds] = useState([]);
  const [commentIds, setCommentIds] = useState([]);
  
  const [startIndexComments, setStartIndexComments] = useState(0);
  const commentsPerPage = 3;

  const[startIndexAnswers, setStartIndexAnswers] = useState(0);
  const answersPerPage = 5;
  const [username, setUsername] = useState('');

  const [updateCount, setUpdateCount] = useState(false);

  const [upVoteClickedOn, setUpVoteClickedOn] = useState(false);
  const [colorChange, setColorChange] = useState('black');
  const [arrowUpColorChange, setArrowUpColorChange] = useState('gray');
  const [arrowDownColorChange, setArrowDownColorChange] = useState('gray');
  const [downVoteClickedOn, setDownVoteClickedOn] = useState(false);

  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      console.log(colorChange);
      console.log("UP",upVoteClickedOn);
      console.log("DOWN",downVoteClickedOn);
      try {  
        const qresponse = await api.getQuestionById(questionID);
        const questionData = qresponse.data;
        setQuestion(questionData);

        const aIdsresponse = await api.getAllAnswerIdsForQuestionNewest(questionID);
        const answerIdsData = aIdsresponse.data;
        setAnswerIds(answerIdsData);

        const cIdsresponse = await api.getAllCommentIdsForQuestionNewest(questionID);
        const commentIdsData = cIdsresponse.data;
        setCommentIds(commentIdsData);

        if(questionData){
          const uresponse = await api.getAccountById(questionData.asked_by);
          const usernameData = uresponse.data;
          setUsername(usernameData.username);
        }

      } catch (error) {
        console.error("Error fetching question and answers by newest order:", error);
      }
    };
  
    fetchQuestion();
  }, [questionID,updateCount,colorChange,downVoteClickedOn,upVoteClickedOn]);

  const handleAskQuestion = (event) => {
    console.log("Clicked handleAskQuestion in AllQuestionsPage")
    console.log(event)
    props.setCurrentPageIndex(2)
    props.setSelectedQuestion(-1)
  }
  
  const handleAnswerQuestion = (event) => {
    console.log("Clicked handleAnswerQuestion in AllQuestionsPage")
    console.log(event)
    props.setCurrentPageIndex(5)
  }

  const handleNextComments = () => {
    if(startIndexComments + commentsPerPage < commentIds.length){
      setStartIndexComments(startIndexComments + commentsPerPage);
    }
  }

  const handlePrevComments = () => {
    if(startIndexComments - commentsPerPage >= 0){
      setStartIndexComments(startIndexComments - commentsPerPage);
    }
  }
  const handleNextAnswers = () => {
    if(startIndexAnswers + answersPerPage < answerIds.length){
      setStartIndexAnswers(startIndexAnswers + answersPerPage);
    }
  }
  const handlePrevAnswers = () => {
    if(startIndexAnswers - answersPerPage >= 0){
      setStartIndexAnswers(startIndexAnswers - answersPerPage);
    }
  }
  const handleAddComment = (event) => {
    console.log("Clicked handleAddComment in AllQuestionsPage")
    console.log(event)
    setCommentInputValue(event.target.value);
    
  }

  async function handleUpVote(){
    try{
      let upVoted = false;
      let downVoted = downVoteClickedOn;
      if(upVoteClickedOn){
        upVoted = !upVoteClickedOn;
        setColorChange('black');
        setArrowUpColorChange('gray');
        setUpVoteClickedOn(!upVoteClickedOn);
        
      }else{
        upVoted = !upVoteClickedOn;
        
        setColorChange('red');
        setArrowUpColorChange('red');
        setArrowDownColorChange('gray');
        setUpVoteClickedOn(!upVoteClickedOn);
        setDownVoteClickedOn(false);
        
      }
      await api.increaseQuestionVoteCountAndUserReputationById(questionID,
        {
          loggedInString: props.acc.account._id,
          upVoted: upVoted,
          downVoted: downVoted
        });
      setUpdateCount(!updateCount);
      console.log("Upvote Question Successfully");
    }catch(error){
      console.log("Error handling upvotes");
    }

  }
  async function handleDownVote(){
    try{
      let upVoted = upVoteClickedOn;
      let downVoted = true;
      if(downVoteClickedOn){
        downVoted = !downVoteClickedOn;
        setColorChange('black');
        setArrowDownColorChange('gray');
        setDownVoteClickedOn(!downVoteClickedOn);
        
      }else{
        downVoted = !downVoteClickedOn;
        setColorChange('blue');
        setArrowDownColorChange('blue');
        setArrowUpColorChange('gray');
        setDownVoteClickedOn(!downVoteClickedOn);
        setUpVoteClickedOn(false);
        
      }
      await api.decreaseQuestionVoteCountAndUserReputationById(questionID,
        {
          loggedInString: props.acc.account._id,
          downVoted: downVoted,
          upVoted: upVoted
        });
      setUpdateCount(!updateCount);
      console.log("Downvote Question Successfully");
    }catch(error){
      console.log("Error handling downvotes");
    }
  }

  async function handlePostComment(event) {
    console.log("Clicked handleAddComment in AllQuestionsPage")
    console.log(event)
    if(props.acc.account.reputation >= 50) {
      try {
        await api.postCommentToQuestion(props.selectedQuestion, {
          text: commentInputValue,
          comment_by: props.acc.account._id,
        });
        if (textAreaRef.current) {
          textAreaRef.current.value = '';
        }
        setUpdateCount(!updateCount);
        console.log("Comment created successfully");
        props.setCurrentPageIndex(4)
      }
      catch (error) {
        console.error("Error handling click post comment:", error);
      }
    }
    else {
      textAreaRef.current.value = 'Cannot Add Comment';
    }
  };

    const handleKeyDown = (event) =>{
      if(event.key === 'Enter' && !event.shiftKey){
        event.preventDefault();
        handlePostComment();
      }
    }
  
  function timeSince(date) {
    date = new Date(date)

    let timeString = ""; // var timeString = "";
    let timeDiff = new Date() - new Date(date);
    let periods = {
      year: 12 * 30 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000, //(sec * 1/milliseconds)
      second: 1000,
    };
    let month_names = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    if (timeDiff > periods.year) {
      timeString = "" + month_names[(date.getMonth())] + " " + date.getDate() + " " + date.getFullYear() + " at " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    }
    else if (timeDiff > periods.month) {
      timeString = "" + Math.floor(timeDiff / periods.month) + " month(s) ago";
    }
    else if (timeDiff > periods.week) {
      timeString = "" + Math.floor(timeDiff / periods.week) + " week(s) ago";
    }
    else if (timeDiff > periods.day) {
      timeString = "" + Math.floor(timeDiff / periods.day) + " day(s) ago";
    }
    else if (timeDiff > periods.hour) {
      timeString = "" + Math.floor(timeDiff / periods.hour) + " hour(s) ago";
    }
    else if (timeDiff > periods.minute) {
      timeString = "" + Math.floor(timeDiff / periods.minute) + " minute(s) ago";
    }
    else {
      timeString = "" + Math.floor(timeDiff / periods.second) + " second(s) ago";
    }

    return timeString;
  }

  return (
    <>
    <div id="questions-answers-tags-page" className="questions-answers-tags-page">
      <div id="qat-header" className="qat-header">
        <div id="answer-page-num-answers" className="answer-page-num-answers">{question?.answers.length} answer(s)</div>
        <div id="answer-page-question-title" className="answer-page-question-title">{question?.title}</div>
        {props.acc != null && <button id="askQuestion" onClick={handleAskQuestion} >Ask Question</button>}
        <div id="answer-page-num-views" className="answer-page-num-views">{question?.views} view(s)</div>
        <div id="answer-page-question-content" className="answer-page-question-content" 
        dangerouslySetInnerHTML={{
          __html: question?.text.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
          ),
        }}> 
        </div>
        <div id="answer-page-asker-details" className="answer-page-asker-details">{username} asked {timeSince(question?.ask_date_time)}</div>
        
        <div id="answer-page-num-votes" className="answer-page-num-votes">
          {props.acc != null && props.acc.account.reputation >= 50 && <button style={{color:arrowUpColorChange}} id="upvote" onClick={handleUpVote}>▲</button>}
          <p style={{color:colorChange}}>{question?.votes} vote(s)</p> 
          {props.acc != null && props.acc.account.reputation >= 50 && <button disabled={question?.votes === 0 || (question?.votes === 1 && colorChange==='red')}style={{color:arrowDownColorChange}} id="downvote" onClick={handleDownVote}>▼</button>}  
        </div>
        
        <div id="comments-list" className="comments-list">
        {commentIds.slice(startIndexComments, startIndexComments + commentsPerPage).map((id) => <CommentsCard key={question?._id + id} id={id} accId={props.acc?.account._id} acc={props.acc}/>)}
        <div id = "comments-answers-searchbar">
        {props.acc != null && <textarea
            type="text" 
            id="add-comment-searchbar" 
            name="search-form" 
            ref={textAreaRef}
            placeholder="Add a comment" 
            onChange={handleAddComment}
            onKeyDown={handleKeyDown}
            
          />}
        </div>
        <button id ="previous-comments" className="disabled-button" onClick={handlePrevComments} disabled={startIndexComments === 0}>Previous</button>
        <button id="next-comments" className="disabled-button" onClick={handleNextComments} disabled={commentIds.length <= startIndexComments+commentsPerPage}>Next</button>
        
        </div>
      </div>

      <div id="answers-list" className="answers-list">
        {/* <AnswersCard /> */}
        {answerIds.slice(startIndexAnswers, startIndexAnswers + answersPerPage).map((id) => <AnswersCard key={question?._id + id} id={id} {...props}/>)}
        <button id= "previous-answers" className="disabled-button" onClick={handlePrevAnswers} disabled={startIndexAnswers === 0}>Previous</button>
        <button id= "next-answers" className="disabled-button" onClick={handleNextAnswers} disabled={answerIds.length <= startIndexAnswers+answersPerPage}>Next</button>
        {props.acc != null && <button 
        id="answer-question-button"
        className="answer-question-button"
        onClick={handleAnswerQuestion}
        >Answer Question</button>}
        
      </div>
    </div>
    </>
  );
}