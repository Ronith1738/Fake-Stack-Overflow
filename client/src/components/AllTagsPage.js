import api from '../api/router.js'
import React, { useState, useEffect } from "react";
import TagsCard from './TagsCard.js';

export default function AllTagsPage(props) { 
  const [tags, setTags] = useState([]);

  const handleAskQuestion = (event) => {
    console.log("Clicked handleAskQuestion in AllQuestionsPage")
    console.log(event)
    props.setCurrentPageIndex(2)
    props.setSelectedQuestion(-1)
  }

  useEffect(() => {
    console.log('USE EFFECT FOR TAGS IS WORKING')
    const fetchTags = async () => {
      console.log('USE EFFECT FOR TAGS IS WORKING EVEN MORE')
      try {
        const response = await api.getAllTags();
        console.log(response)
        const tagsData = response.data;
        console.log(tagsData)
        setTags(tagsData);
      } catch (error) { 
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  console.log("The tags after the useEffect in AllTagsPage is: ", tags)

  return (
    <>
    <div id="questions-answers-tags-page" className="questions-answers-tags-page">
      <div id="qat-header" className="qat-header">
        <div id="numTags" className="numTags">{tags.length} Tags</div>
        <div id="tagsPageType" className="tagsPageType">All Tags</div>
        {props.acc != null && <button id="askQuestion" onClick={handleAskQuestion} >Ask Question</button>}
      </div>  
      <div id="tags-list" className="tags-list">
        {/* <TagsCard /> */}
        {tags.length === 0 ? (
          <div id="noquestionsfound">No Tags Found</div>
        ) : <div id="nothing"></div>}
        {tags.map((tag) => <TagsCard key={tag._id} t={tag} {...props}/>)}
      </div>
    </div>
    </>
  );
}