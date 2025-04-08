import React, { useState, useEffect } from "react";
import api from '../api/router.js'

export default function UserProfile({...props}) {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestionsFromAccount = async () => {
      try {
        console.log(props.acc.account._id);
        const qresponse = await api.getAllQuestionsFromAccount(props.acc.account._id);
        const questionsData = qresponse.data;
        console.log(questionsData);
        setQuestions(questionsData);
      } 
      catch (error) {
        console.error("Error fetching questions from account", error);
      }
    };
    fetchQuestionsFromAccount();
  });

  const handleClick = (data) => {
    props.setQuestionData(data);
    props.setCurrentPageIndex(8);
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
          timeString = "" + Math.floor(timeDiff / periods.month) + " month(s)";
        }
        else if (timeDiff > periods.week) {
          timeString = "" + Math.floor(timeDiff / periods.week) + " week(s)";
        }
        else if (timeDiff > periods.day) {
          timeString = "" + Math.floor(timeDiff / periods.day) + " day(s)";
        }
        else if (timeDiff > periods.hour) {
          timeString = "" + Math.floor(timeDiff / periods.hour) + " hour(s)";
        }
        else if (timeDiff > periods.minute) {
          timeString = "" + Math.floor(timeDiff / periods.minute) + " minute(s)";
        }
        else {
          timeString = "" + Math.floor(timeDiff / periods.second) + " second(s)";
        }
    
        return timeString;
      }

    return (
        <>
        <div id="user-profile" className="user-profile">
            <div id="user-profile-text">
                <strong>User Profile</strong>
                <p>Account Age: {timeSince(props.acc.account.created_date_time)}</p>
                <p>Account Reputation: {props.acc.account.reputation}</p>
            </div>
            <div id="questions-list" className="questions-list">
              {questions.length === 0 ? (
                <div id="noquestionsfound">No Questions Found</div>
              ) : (
                <div id="nothing">Questions Asked:</div>
              )}
              {questions.map((question, index) => (
                <p onClick={() => handleClick(question)} key={index}>{question.title}</p>
              ))}
            </div>
        </div>       
        </>
    );
}