"use client";
import React, { useEffect, useState } from 'react'

const page = () => {
  const [jokes, setJokes] = useState({joke: ''});

  const consultJokes = async ()=> {
    const response = await fetch("https://icanhazdadjoke.com", {
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();
    setJokes(result);
  }

  useEffect(()=> {
    consultJokes();
  },[]);

  return (
    <div className='joke-modal'>
     <p>{jokes.joke}</p>
    </div>
  )
}

export default page