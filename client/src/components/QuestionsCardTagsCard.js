import api from '../api/router.js'
import React, { useState, useEffect } from "react";

export default function QuestionsCardTagsCard(props) {
  const [tag, setTag] = useState([]);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        const response = await api.getTagById(props.id);
        const tagData = response.data;
        setTag(tagData);
      } catch (error) {
        console.error("Error fetching tag:", error);
      }
    };

    fetchTag();
  }, [props.id]);

  return (
    <>
    <div className="q-tag">{tag.name}</div>
    </>
  );
}

