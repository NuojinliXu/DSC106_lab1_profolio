import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
console.log(d3)
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const project_count = projects.length
const title = document.querySelector('h1')
title.innerHTML = `${project_count} Projects`
console.log(projects)

let selectedIndex = -1;
let query = '';

function renderPieChart(projectsGiven) {
    let newsvg = d3.select('svg')
    newsvg.selectAll('path').remove()
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    let data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });


    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let arcs = arcData.map((d) => arcGenerator(d));
    
    let colors = d3.scaleOrdinal(d3.schemeObservable10);
    arcs.forEach((arc, idx) => {
        d3.select('svg')
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(idx))
            .on('click', () => {
                selectedIndex = selectedIndex === idx ? -1 : idx;
                d3.select('svg')
                    .selectAll('path')
                    .attr('class', (_, idx) => (
                    idx === selectedIndex ? 'selected' : ''
                ));
                
                if (selectedIndex === -1){
                    renderProjects(projects, projectsContainer, 'h2')
                }else{
                    let filtered = projects.filter(item => 
                        item.year.toLowerCase().includes(data[idx].label)
                    );
                    renderProjects(filtered, projectsContainer, 'h2')
                }
                d3.selectAll('.swatch')
                    .style('background-color', (_, i) => (i === selectedIndex ? 'rgb(237, 16, 245)' : colors(i)));
                
            });
    })
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();
    data.forEach((d, idx) => {
        legend.append('li')
            .attr('class', 'legend_item')
            .attr('style', `--color:${colors(idx)}`)
            .attr('background-color', `var(--color)`)
            .attr('aspect-ratio', '1/1')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    })
}




let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    // update query value
    query = event.target.value.toLowerCase();
    const filtered = projects.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.year.toLowerCase().includes(query)
    );
    renderProjects(filtered, projectsContainer, 'h2')
    renderPieChart(filtered)

});

renderPieChart(projects)


