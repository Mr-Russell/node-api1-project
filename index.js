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
  if(users === null || users === undefined || users.length === 0){
  res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  } else {
    res.status(200).json(users)
  }
})


server.get("/api/users/:id", (req, res) => {
  const id = req.params.id

  let user = users.filter(item => item.id === id)

  if(user === null || user === undefined){
    res.status(500).json({ errorMessage: "The users information could not be retrieved." })
  } else if(user.length === 0){
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  } else {
    res.status(200).json(user)
  }
})


server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id

  function findID(item){
    if (item.id.toLowerCase() === id.toLowerCase()){
      return item
    }
  }
  const user = users.find(findID)

  if(user){
    users = users.filter(item => item !== user)
    res.status(200).json(users)
  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  }
})


server.put("/api/users/:id", (req, res) => {
  const id = req.params.id
  const filtered = users.filter(item => item.id === id)
  const updateUser = req.body

  if(filtered.length === 0){
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  } else if(!updateUser.name || !updateUser.bio){
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }else if(updateUser.name && updateUser.bio){
    const updated = users.map(item => {
      if(item.id === id){
        return {
          ...item,
          name: updateUser.name,
          bio: updateUser.bio
        }
      } else {
        return item
      }
    })
    users = updated
    res.status(200).json(users)
  } else {
    res.status(500).json({ errorMessage: "The user information could not be modified." })
  }
})