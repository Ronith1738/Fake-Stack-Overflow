import api from '../api/router.js'
import React, { useState, } from "react";

export default function PostAnswerPage(props) {
  const [answerTextInputValue, setAnswerTextInputValue] = useState('');
  const [answerTextWarning, setAnswerTextWarning] = useState('');

  const [link, setLink] = useState('');
  const [word, setWord] = useState('');

  const handleAnswerTextInputChange = (event) => {
    setAnswerTextInputValue(event.target.value);
  };
 
  async function handlePostAnswer() {
    var flag = 0;
    if (answerTextInputValue.length === 0) {
      setAnswerTextWarning('Answer Text cannot be empty');
      flag++;
    }else if (answerTextInputValue.match(/\[.+?\]\((?!https?:\/\/)(?!http?:\/\/)(\S*?)\)/g)) {
      setAnswerTextWarning('Bad hyperlink format');
      flag++
    }
    else {
      setAnswerTextWarning('');
    }
    
    if (flag === 0) {
      if (answerTextInputValue.match(/\[(.+?)\]\((https?:\/\/\S+?)\)/g)) {
        setLink(answerTextInputValue.match(/(?<=\().+?(?=\))/g));
        setWord(answerTextInputValue.match(/(?<=\[).+?(?=\])/g));
        
        console.log(link)
        console.log(word)
      }

      setAnswerTextWarning('');

      try {
        await api.postAnswerToQuestion(props.selectedQuestion, {
          text: answerTextInputValue,
          ans_by: props.acc.account._id,
        });
        console.log("Answer created successfully");

      } catch (error) {
        console.error("Error handling click post answer:", error);
      }

      props.setCurrentPageIndex(4);
    }
  }

  return (
    <>
      <div id="answer-text">Your Answer*</div>
      <div id="answer-text-warning"><pre>{answerTextWarning}</pre></div>
      <div id="answer-text-searchbar">
      <input 
          type="text" 
          id="answerSearch" 
          name="search-form" 
          value={answerTextInputValue}
          onChange={handleAnswerTextInputChange}
        />
      </div>
      
      <div id="post-answer-button">
      <button 
          id="post-answer" 
          onClick={handlePostAnswer}
          >Post Answer
      </button>
      </div>

      <div id="warning">* indicates mandatory field</div>
    </>
  );
}