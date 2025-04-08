import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function TagsCard(props) {
  const [numberQuestions, setNumberQuestions] = useState(0);

  let tagID = props.t._id;
  let tagName = props.t.name;

  useEffect(() => { 
    const fetchNumberQuestions = async () => {
      try {
        const response = await api.numberQuestionsWithTag(tagID);
        console.log("Response from API:", response); 
        const numberQuestionsWithTagData = response.data;
        setNumberQuestions(numberQuestionsWithTagData.count);
      } catch (error) {
        console.error("Error fetching number questions with tag:", error);
      }
    };

    fetchNumberQuestions();
  }, [tagID]);

  console.log("This is tagID:", tagID)
  console.log("The numberQuestions is: ", numberQuestions)

  const handleClickTag = (event) => {
    console.log("Clicked handleClickTag in TagCard")
    console.log(event)

    console.log("The event id we have in handleClickTag is: ", event.target.id)

    const idString = `[${tagName}]`;
    console.log("This is what we will be passing to the searchQuery: ", idString)
    props.setSearchQuery(idString);

    props.setCurrentPageIndex(3)
  };
  
  return (
    <>
    <div id={props.t._id} className="tag-card" onClick={handleClickTag}>
      <p id={props.t._id} className="tag-name-link">{tagName}</p>
      <p id={props.t._id} className="tag-num-questions">{numberQuestions} question(s)</p>
    </div>
    </>
  );
} 