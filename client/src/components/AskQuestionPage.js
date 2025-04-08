import api from '../api/router.js'
import React, { useState, } from "react";

export default function AskQuestionPage(props) { 
  const [questionTitleInputValue, setQuestionTitleInputValue] = useState('');
  const [questionTextInputValue, setQuestionTextInputValue] = useState('');
  const [questionSummaryInputValue, setQuestionSummaryInputValue] = useState('');
  const [tagsInputValue, setTagsInputValue] = useState('');

  const [questionTitleWarning, setQuestionTitleWarning] = useState('');
  const [questionTextWarning, setQuestionTextWarning] = useState('');
  const [questionSummaryWarning, setQuestionSummaryWarning] = useState('');
  const [tagsWarning, setTagsWarning] = useState('');

  const [link, setLink] = useState('');
  const [word, setWord] = useState('');
 
  const handleQuestionTitleInputChange = (event) => {
    setQuestionTitleInputValue(event.target.value);
    console.log(event.target.value)
  };

  const handleQuestionTextInputChange = (event) => {
    setQuestionTextInputValue(event.target.value);
    console.log(event.target.value)
  };

  const handleQuestionSummaryInputChange = (event) => {
    setQuestionSummaryInputValue(event.target.value);
    console.log(event.target.value)
  };

  const handleTagsInputChange = (event) => {
    setTagsInputValue(event.target.value);
    console.log(event.target.value)
  };

  async function handlePostQuestion() {
    var flag = 0;
    if (questionTitleInputValue.length > 50) {
      setQuestionTitleWarning('Question Title too long');
      flag++;
    }else if (questionTitleInputValue.length === 0) {
      setQuestionTitleWarning('Question Title cannot be empty');
      flag++;
    }else {
      setQuestionTitleWarning('');
    }  
    if (questionTextInputValue.length === 0) {
      setQuestionTextWarning('Question Text cannot be empty');
      flag++;
    }else if (questionTextInputValue.match(/\[.+?\]\((?!https?:\/\/)(?!http?:\/\/)(\S*?)\)/g)) {
      setQuestionTextWarning('Bad hyperlink format');
      flag++;
    }else {
      setQuestionTextWarning('');
    }
    if (questionSummaryInputValue.length === 0) {
      setQuestionSummaryWarning('Question Summary cannot be empty');
      flag++;
    }else if (questionSummaryInputValue.length > 140) {
      setQuestionSummaryWarning('Question Summary too long');
      flag++;
    }else {
      setQuestionSummaryWarning('');
    }

    const tresponse = await api.getAllTags();
    const tagsData = tresponse.data;

    if (tagsInputValue.length === 0) {
      setTagsWarning('Tags cannot be empty');
      flag++;
    }
    else if (tagsInputValue.split(" ").length > 5) {
      setTagsWarning('Too many tags');
      flag++;
    }else if (tagsInputValue.split(" ").some(str => str.length > 10)) {
      setTagsWarning('Tags too long');
      flag++;
    }else if(!tagsData.some(tag => tag.name === tagsInputValue) && props.acc.account.reputation < 50){
      setTagsWarning('Cannot create new tag');
      flag++;
    }else {
      setTagsWarning('');
    }  
    
    if (flag === 0) {
      if (questionTextInputValue.match(/\[(.+?)\]\((https?:\/\/\S+?)\)/g)) {
        setLink(questionTextInputValue.match(/(?<=\().+?(?=\))/g));
        setWord(questionTextInputValue.match(/(?<=\[).+?(?=\])/g));

        console.log(link)
        console.log(word)
      }
  
      try {
        await api.createQuestion({
          title: questionTitleInputValue,
          text: questionTextInputValue,
          tags: tagsInputValue,
          asked_by: props.acc.account._id,
          summary: questionSummaryInputValue,
        });
        console.log("Question created successfully");
      } catch (error) {
        console.error("Error handling click post question:", error);
      }
  
      props.setCurrentPageIndex(0);
      props.setSelectedQuestion(-1);
    }
  }
  
  return (
    <>
      <div id="question-title"><strong>Question Title*</strong></div>
      <div id="question-title-warning"><pre>{questionTitleWarning}</pre></div>
      <div id="question-title-caption"><pre>Limit Title to 50 characters or less</pre></div>
      <div id="question-title-searchbar">
      <input 
          type="text" 
          id="qstnTitle" 
          name="search-form"  
          value={questionTitleInputValue}
          onChange={handleQuestionTitleInputChange}
        />
      </div>
      

      <div id="question-text"><strong>Question Text*</strong></div>
      <div id="question-text-warning"><pre>{questionTextWarning}</pre></div>
      <div id="question-text-caption"><pre> Add details</pre></div>
      <div id="question-text-searchbar">
      <textarea 
          type="text" 
          id="qstnText" 
          name="search-form" 
          value={questionTextInputValue}
          onChange={handleQuestionTextInputChange}
        />
      </div>

      <div id="question-summary"><strong>Question Summary*</strong></div>
      <div id="question-summary-warning"><pre>{questionSummaryWarning}</pre></div>
      <div id="question-summary-caption"><pre>Summarize Question Text in 140 characters or less</pre></div>
      <div id="question-summary-searchbar">
      <textarea 
          type="text" 
          id="qstnSummary" 
          name="search-form"  
          value={questionSummaryInputValue}
          onChange={handleQuestionSummaryInputChange}
        />
      </div>

      <div id="tags-title"><strong>Tags*</strong></div>
      <div id="tags-warning" ><pre>{tagsWarning}</pre></div>
      <div id="tags-caption"><pre>    Add max 5 keywords of max length 10 seperated by whitespace</pre></div>
      <div id="tags-searchbar">
      <input 
          type="text" 
          id="qstnTags" 
          name="search-form" 
          value={tagsInputValue}
          onChange={handleTagsInputChange}
        />
      </div>
      
      <div id="post-question-button">
      <button 
          id="post-question" 
          onClick={handlePostQuestion}
          >Post Question
      </button>
      </div>

      <div id="warning">* indicates mandatory field</div>
    </>
  );
}