// backend.js
import cors from "cors";
import express from "express";

const app = express();
const port = 8000;
app.use(express.json());

const users = {
    "users_list": [ //used Boomerang to POST to http://localhost:8000/users Cindy, then used get to GET this list from there, and pasted it into here to make it permanent
      {
        "id": "xyz789",
        "name": "Charlie",
        "job": "Janitor"
      },
      {
        "id": "abc123",
        "name": "Mac",
        "job": "Bouncer"
      },
      {
        "id": "ppp222",
        "name": "Mac",
        "job": "Professor"
      },
      {
        "id": "yat999",
        "name": "Dee",
        "job": "Aspring actress"
      },
      {
        "id": "zap555",
        "name": "Dennis",
        "job": "Bartender"
      },
      {
        "id": "qwe123",
        "job": "Zookeeper",
        "name": "Cindy"
      }
    ]
  }

  app.use(cors());


  const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
  };

  const findUserByJobandName = (name, job) => {
    return users["users_list"].filter((user) => user["name"] === name && user["job"] == job);
}

  app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    if (name != undefined && job == undefined) {
      let result = findUserByName(name);
      result = { users_list: result };
      res.send(result);
    } else if (name != undefined && job != undefined){
        let result = findUserByJobandName(name, job);
        result = { users_list: result};
        res.send(result);
     } else {
      res.send(users);
    }
  });

  const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

 
  app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  });

  const addUser = (user) => {
    users["users_list"].push(user);
    return user;
  };
  
  app.delete("/users/:id", (req,res) =>{
    const id = req.params["id"];
    const index = users["users_list"].findIndex((users) => users["id"] === id);
    if (index==-1){
        res.status(404).send("ID Not Found");
    }else{
        users["users_list"].splice(index,1);
        res.status(201).send();
    }
  })

  app.post("/users", (req, res) => {

    //console.log("Received Content-Type:", req.headers["content-type"]);
    //console.log("Received body:", req.body);
    const userToAdd = req.body;
    if (!userToAdd.id || !userToAdd.name || !userToAdd.job) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    
    addUser(userToAdd);
    res.status(201).json(userToAdd);
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});