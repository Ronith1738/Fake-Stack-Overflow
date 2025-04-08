import api from '../api/router.js'
import React, { useState, useEffect } from "react";
export default function CommentsCard(props) {
  const defaultComment = {
    text: '',
    comment_by: '',
    comment_date_time: Date.now(),
    votes: 0,
  };
  
  const [comment, setComment] = useState(null);
  const [username, setUsername] = useState('');
  const [updateCount, setUpdateCount] = useState(false);
  const [upVoteClickedOn, setUpVoteClickedOn] = useState(false);
  const [colorChange, setColorChange] = useState('black');
  const [arrowUpColorChange, setArrowUpColorChange] = useState('gray');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        console.log(props.id);
        const response = await api.getCommentById(props.id);
        const commentData = response.data;
        setComment(commentData);
        
        if(commentData){
          const uresponse = await api.getAccountById(commentData.comment_by);
        
          const usernameData = uresponse.data;
      
          setUsername(usernameData.username);
        }

      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchComment();
  }, [props.id,updateCount]);
  async function handleUpVote(){
    try{
      let upVoted = false;
      
      if(upVoteClickedOn){
        upVoted = !upVoteClickedOn;
        setColorChange('black');
        setArrowUpColorChange('gray');
        setUpVoteClickedOn(!upVoteClickedOn);
        
      }else{
        upVoted = !upVoteClickedOn;
        setColorChange('red');
        setArrowUpColorChange('red');
        setUpVoteClickedOn(!upVoteClickedOn);
        
        
      }
      
      await api.increaseCommentVoteCountById(props.id,
        {
          loggedInString: props.accId,
          upVoted: upVoted,
        });
      console.log("yea");
      setUpdateCount(!updateCount);
      console.log("Upvote Comment Successfully");
    }catch(error){
      console.log("Error handling comment upvotes", error);
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
    <div id="comment-card">
      <div id="comment-text">
        {comment?.text} - {username} {timeSince(comment?.comment_date_time)} 
        <p style={{color:colorChange}}id="comment-votes">{comment?.votes}  vote(s)</p> 
        {props.acc != null && <button style={{color:arrowUpColorChange}}id="upvote-comment" onClick={handleUpVote}>▲</button>}
      </div>
    </div>
    </>
  );
}
