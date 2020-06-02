const express = require("express");
const shortid = require("shortid")

const server = express();

server.use(express.json());

const port = 4000;

server.listen(port, () => console.log(`\n == API running on port ${port} == \n`));

let users = [
  {
    id: "a",
    name: "Ben Kenobi",
    bio: "Only here because he's the Teacher's nephew"
  },
  {
    id: "b",
    name: "Ahsoka Tano",
    bio: "Has those weird skin lumps on her head instead of hair"
  }
];

server.post("/api/users", (req, res) => {
  const newUser = {
    ...req.body,
    id: shortid.generate()
  };

  if(!newUser.name || !newUser.bio){
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  } else {
    users.push(newUser);
    if (users.includes(newUser)){
      res.status(201).json(users)
    } else {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    }
  };
});


server.get("/api/users", (req, res) => {
  if(users === null || users === undefined){
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  } else {
    res.status(200).json(users)
  }
})


server.get("/api/users/:id", (req, res) => {
  const id = req.params.id

  function findID(item){
    if (item.id.toLowerCase() === id.toLowerCase()){
      return item
    }
  }
  const user = users.find(findID)

  if(user === null || user === undefined){
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  } else if(user){
    res.status(200).json(user)
  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})