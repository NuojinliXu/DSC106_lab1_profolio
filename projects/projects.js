import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const project_count = projects.length
const title = document.querySelector('h1')
title.innerHTML = `${project_count} Projects`