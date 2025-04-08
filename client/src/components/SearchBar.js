import React, { useState } from "react";

export default function SearchBar(props) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    console.log(event.target.value)
    console.log('handleInputChange: Detected input change in SearchBar')
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('received enter')

      console.log("The search will be done on: ", inputValue)
      props.setSearchQuery(inputValue);
      props.setCurrentPageIndex(3)
    }

    else if (event.key === 'Backspace') {
      props.setCurrentPageIndex(0)
      props.setSelectedQuestion(-1)
    }
    console.log('handleKeyPress: Detected key press in SearchBar') 
  };


  return (
    <div id="search-box">
      <input 
        type="text" 
        id="search-form" 
        name="search-form" 
        placeholder="Search..." 
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}