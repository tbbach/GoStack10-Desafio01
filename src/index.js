const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

server.use((req, res, next) => {
  console.count("Request number");

  next();
});

function checkIfProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.filter(project => (project.id === id)).length;

  if(!project){
    return res.status(400).json({ "error": "Project does not exists!" });
  };

  return next();
}

server.get('/projects', (req, res) => {
  return res.json({ projects });
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  
  return res.status(201).send();
});

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.send();
});

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.tasks.push(title);

  return res.send();
});

server.listen(3000);