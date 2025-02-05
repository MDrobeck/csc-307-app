// backend.js
import cors from "cors";
import express from "express";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;
app.use(express.json());
app.use(cors());

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
  const generateID  = () => {
    return Math.random().toString(36).substring(2,8);
  }


  app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
  
    userService.getUsers(name, job)
      .then(result => {
        res.json({ users_list: result });
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
      });
    }); 

  const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

 
  app.get("/users/:id", (req, res) => {
    const id = req.params.id;
    
    userService.findUserById(id)
      .then(result => {
        if (!result) {
          res.status(404).send("Resource not found.");
        } else {
          res.json(result);
        }
      })
      .catch(error => {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });

  const addUser = (user) => {
    const newUser = {id : generateID(), ...user}
    users["users_list"].push(newUser);
    return newUser;
  };
  
  app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    
    userService.findUserById(id)
      .then(user => {
        if (!user) {
          res.status(404).send("ID Not Found");
        } else {
          return user.deleteOne()
            .then(() => {
              res.status(204).send();
            });
        }
      })
      .catch(error => {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });

  app.post("/users", (req, res) => {
    const userToAdd = req.body;
    
    if (!userToAdd.name || !userToAdd.job) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    userService.addUser(userToAdd)
      .then(newUser => {
        res.status(201).json(newUser);
      })
      .catch(error => {
        console.error("Error adding user:", error);
        if (error.name === 'ValidationError') {
          res.status(400).json({ error: error.message });
        } else {
          res.status(500).json({ error: "Internal server error" });
        }
      });
  });

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});