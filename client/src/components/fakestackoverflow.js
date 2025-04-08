import React, { useState, useEffect } from "react";
import WelcomePage from './WelcomePage.js';

export default function FakeStackOverflow() {
  const[currentPageIndex, setCurrentPageIndex] = useState(0)
  const[selectedModelCopy, setSelectedModelCopy] = useState([])
  const[clone2, setClone2] = useState([])
  const[selectedQuestion, setSelectedQuestion] = useState("")
  const[searchQuery, setSearchQuery] = useState("")


  return (
    <div id="app-root">
      <WelcomePage currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex} selectedModelCopy={selectedModelCopy} setSelectedModelCopy={setSelectedModelCopy} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} clone2={clone2} setClone2={setClone2} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
}
