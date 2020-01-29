const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let contador = 0;

server.use((req, res, next) => {
  contador += 1;
  console.log(`Request number: ${contador}`);

  next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  if(!projects.filter(project => (project.id === id)).length){
    return res.status(400).json({ "error": "Project does not exists!" });
  };

  return next();
}

server.get('/projects', (req, res) => {
  res.json({ projects });
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({ "id": id, "title": title, "tasks": [] });
  res.status(201).send();
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach((element, index, array) => {
    if (projects[index].id === id) {
      projects[index].title = title;
    }
  })

  return res.send();
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  projects.forEach((element, index, array) => {
    if (projects[index].id === id) {
      projects.splice(index, 1);
    }
  })

  return res.send();
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.forEach((element, index, array) => {
    if (projects[index].id === id) {
      projects[index].tasks.push(title);
    }
  })

  return res.send();
});

server.listen(3000);