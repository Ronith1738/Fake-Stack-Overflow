import api from '../api/router.js'
import React, { useState, useEffect, useRef } from "react";
import CommentsCard from './CommentsCard.js';

export default function AnswersCard(props) {
  const [answer, setAnswer] = useState(null);
  const [commentInputValue, setCommentInputValue] = useState('');
  const [commentIds, setCommentIds] = useState([]);

  const [startIndex, setStartIndex] = useState(0);
  const commentsPerPage = 3;

  const [username, setUsername] = useState('');
  const [updateCount, setUpdateCount] = useState(false);
  const [upVoteClickedOn, setUpVoteClickedOn] = useState(false);
  const [colorChange, setColorChange] = useState('black');
  const [arrowUpColorChange, setArrowUpColorChange] = useState('gray');
  const [arrowDownColorChange, setArrowDownColorChange] = useState('gray');
  const [downVoteClickedOn, setDownVoteClickedOn] = useState(false);

  const textAreaRef = useRef(null);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const response = await api.getAnswerById(props.id);
        const answerData = response.data;
        setAnswer(answerData);
        
        const cIdsresponse = await api.getAllCommentIdsForAnswerNewest(props.id);
        const commentIdsData = cIdsresponse.data;
        setCommentIds(commentIdsData);

        if(answerData){
          const uresponse = await api.getAccountById(answerData.ans_by);
          const usernameData = uresponse.data;
          setUsername(usernameData.username);
        }
        

      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchAnswer();
  }, [props.id,updateCount]);

  const handleAddComment = (event) => {
    console.log("Clicked handleAddComment in AllQuestionsPage")
    console.log(event)
    setCommentInputValue(event.target.value);
  }

  const handleNext = () => {
    if(startIndex + commentsPerPage < commentIds.length){
      setStartIndex(startIndex + commentsPerPage);
    }
  }

  const handlePrev = () => {
    if(startIndex - commentsPerPage >= 0){
      setStartIndex(startIndex - commentsPerPage);
    }
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
      await api.increaseAnswerVoteCountAndUserReputationById(props.id,
        {
          loggedInString: props.acc.account._id,
          upVoted: upVoted,
          downVoted: downVoted
        });
      setUpdateCount(!updateCount);
      console.log("Upvote Answer Successfully");
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
      await api.decreaseAnswerVoteCountAndUserReputationById(props.id,
        {
          loggedInString: props.acc.account._id,
          downVoted: downVoted,
          upVoted: upVoted
        });
      setUpdateCount(!updateCount);
      console.log("Downvote Answer Successfully");
    }catch(error){
      console.log("Error handling downvotes");
    }

  }
  async function handlePostComment(event) {
    console.log("Clicked handleAddComment in AllQuestionsPage")
    console.log(event)
    if(props.acc.account.reputation >= 50) {
      try {
          await api.postCommentToAnswer(props.id, {
            text: commentInputValue,
            comment_by: props.acc.account._id,
          });
          if (textAreaRef.current) {
            textAreaRef.current.value = '';
          }
          setUpdateCount(!updateCount);
          console.log("Comment created successfully");
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

    let timeString = ""; 
    let timeDiff = new Date() - new Date(date);
    
    let periods = {
      year: 12 * 30 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      hour: 60 * 60 * 1000,
      minute: 60 * 1000, 
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
    <div className="answer-card">
      <div
        className="answer-text"
        dangerouslySetInnerHTML={{
          __html: answer?.text.replace(
            /\[(.*?)\]\((.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
          ),
        }}
      ></div>
      <div className="answerer-details">
        {username} answered {timeSince(answer?.ans_date_time)}
      </div>
      <div id="comments-answers-list" className="comments-answers-list">
        
        {commentIds.slice(startIndex, startIndex + commentsPerPage).map((id) => <CommentsCard key={answer?._id+id} id={id} accId={props.acc?.account._id} acc={props.acc} />)}
        
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
          <button id="previous-comments" className="disabled-button" onClick={handlePrev} disabled={startIndex === 0}>Previous</button>
          <button id="next-comments" className="disabled-button" onClick={handleNext} disabled={commentIds.length <= startIndex+commentsPerPage}>Next</button>
          

      </div>
      <div id="answer-card-num-votes">
        {props.acc != null && props.acc.account.reputation >= 50 && <button style={{color:arrowUpColorChange}} id="upvote" onClick={handleUpVote}>▲</button>}
        <p style={{color:colorChange}}>{answer?.votes}  vote(s)</p> 
        {props.acc != null && props.acc.account.reputation >= 50 && <button disabled={answer?.votes === 0 ||(answer?.votes === 1 && colorChange === 'red')}style={{color:arrowDownColorChange}} id="downvote" onClick={handleDownVote}>▼</button>  }
      </div>
    </div>

    </>
  );
}
