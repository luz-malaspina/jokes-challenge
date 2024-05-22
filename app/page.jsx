"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';

const page = () => {
  const [ jokes, setJokes ] = useState({joke: ''});
  const [ listJokes , setListJokes ] = useState(false);
  const [ idToDelete, setIdToDelete ] = useState(null);
 
  const consultJokes =  useCallback(async ()=> {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json"
      }
    });

    const result = await response.json();
    setJokes(result);
  },[setJokes])

  let favorites = [];

  if(localStorage.getItem('favorites') == null) {
    favorites = [];
  } else {
    favorites = JSON.parse(localStorage.getItem('favorites'))
  }

  const filteredJokes = useMemo(()=> {
    const jokes = favorites.filter((fav)=> {
      return fav.id !== idToDelete
    })

    return jokes
  },[idToDelete, favorites]);

  const updateFavoritesInLocalStorage = ()=> {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }

  const addToFavorites =  useCallback((value)=> {
   const index = favorites.findIndex(
    element => element.id === value.id
   );

   if(index > -1) {
    favorites.splice(index, 1)
    localStorage.setItem('favorites', JSON.stringify(favorites))
   } else {
    favorites.push(value);
    localStorage.setItem('favorites', JSON.stringify(favorites))
   }
  },[favorites]);

  const removeFromFavorites = useCallback((value)=> {
    const index = favorites.findIndex(
      element => element.id === value.id
     );    
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites))
    setIdToDelete(value.id);
  },[favorites,setIdToDelete]);
  
  useEffect(()=> {
    consultJokes();
  },[]);

  if(listJokes && filteredJokes) {
    return (
      <div className='favorite-list'>
        <button onClick={()=> {setListJokes(false)}}>
          Back
        </button>
        {filteredJokes.map((fav)=> {
          return (
          <div key={fav.id}>
            <p>{fav.joke}</p>
            <button onClick={()=> removeFromFavorites(fav)} className='removeButton'>
              Remove
            </button>
          </div>
        )})}
      </div>
    )
  }

  return (
    <div className='joke-modal'>
     <p className='joke'>{jokes.joke}</p>
     <div className='buttons'>
      <button onClick={()=> consultJokes()} className='seeOtherButton'>
        see other joke
      </button>
      <button type='button' onClick={()=> addToFavorites(jokes)} className='addButton'>
        add to favorites
      </button>
     </div>
     <button type='button' onClick={()=> setListJokes(true)} className='seeButton'>
        see my jokes
      </button>
    </div>
  )
}

export default page