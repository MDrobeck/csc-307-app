// src/Form.jsx
import React, { useState } from "react";



  function Form(props) {
  const [person, setPerson] = useState({
    name: "",
    job: ""
  });
  
  async function submitForm() {
    if (person.name && person.job) {
      props.handleSubmit(person);
      setPerson({ name: "", job: "" });
    }
  //   try {
  //     const response = await fetch("http://localhost:8000/users", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(person),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to submit data");
  //     }
  //     const newUser = await response.json();
  //   props.handleSubmit(newUser);
  //   setPerson({ name: "", job: ""});
    
  // } catch (error){
  //   console.error("Error submitting form");
  // }
}

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "job")
      setPerson({ name: person["name"], job: value });
    else setPerson({ name: value, job: person["job"] });
  }
  
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        _id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        _id="job"
        value={person.job}
        onChange={handleChange}
      />x
      <input type="button" value="Submit" onClick={submitForm} />
    </form>
  );
}
export default Form;