// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

/*const characters = [
  {
    name: "Charlie",
    job: "Janitor"
  },
  {
    name: "Mac",
    job: "Bouncer"
  },
  {
    name: "Dee",
    job: "Aspring actress"
  },
  {
    name: "Dennis",
    job: "Bartender"
  }
];*/


function MyApp() {
  const [characters, setCharacters] = useState([]);

  // function removeOneCharacter(index) {
  //   const updated = characters.filter((character, i) => {
  //     return i !== index;
  //   });
  //   setCharacters(updated);
  // }

  function removeOneCharacter(id){
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });
    promise
      .then((res) => {
          if(res.status === 204){
            const updatedCharacters = characters.filter((character) => character.id !== id);
            setCharacters(updatedCharacters);
          } else if (res.status === 404){
            throw new Error("invalid ID");
          }
      })
      .catch((error) => {
        console.error("Error deleting user")
      });

  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  
  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  
  function updateList(person) {
    postUser(person)
      .then((res) =>{
      if(res.status === 201){
        return res.json();
      } else {
        throw new Error("Failed to create user");
      }
    })
      .then((newUser) => setCharacters([...characters, newUser]))
      .catch((error) => {
        console.log(error);
      });
  }

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }
  

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
        
      />
      <Form handleSubmit={updateList} />
      
    </div>
  );
}


export default MyApp;