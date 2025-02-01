console.log('IT’S ALIVE!');
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
let navLinks = $$("nav a")
let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname
);
if (currentLink) {
    currentLink.classList.add('current');
  }
let pages = [
    { url: './index.html', title: 'Home' },
    { url: './projects/index.html', title: 'Projects' },
    { url: './resume/index.html', title: 'Resume' },
    { url: './contact/index.html', title: 'Contact' },
    {url: 'https://github.com/NuojinliXu', title :"Github Profile"}
  ];
let nav = document.createElement('nav');
        document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
        let title = p.title;
            let link = document.createElement('a');
                //nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
                const ARE_WE_HOME = document.documentElement.classList.contains('home');
                if (!ARE_WE_HOME && !url.startsWith('http')) {
                    url = '../' + url;
                }
                
                link.href = url;
                link.textContent = title;
                if (link.host === location.host && link.pathname === location.pathname) {
                    link.classList.add('current');
                }
                if(link.host !== location.host){
                    link.target = "_blank"
                }
                nav.appendChild(link)
    }

document.body.insertAdjacentHTML(
        'afterbegin',
        `
          <label class="color-scheme">
              Theme:
              <select>
                  <option value='light dark'> Automatic </option>
                  <option value='light'> Light </option>
                  <option value='dark'> Dark </option>
                
              </select>
	</label>`
);
var select = document.querySelector("select")
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value
  });

if ("colorScheme" in localStorage){
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme
}

var form = document.querySelector("form")
form?.addEventListener('submit', function(event){
    event.preventDefault();
    var data = new FormData(form)
    var url = form.action + "?"
    console.log(url)
    for (let [name, value] of data) {
        // TODO build URL parameters here
        console.log(name, encodeURIComponent(value));
        url += `${name}=${encodeURIComponent(value)}&`
      }
      location.href = url.slice(0,url.length-1);
}
)
export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        console.log(response)
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data)
        return data; 
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
    if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.statusText}`);
}
}
//fetchJSON('./lib/projects.json')
/*
export function renderProjects(project, containerElement) {
    containerElement.innerHTML = '';
    const article = document.createElement('article');
    article.innerHTML = `
    <h3>${project.title}</h3>
    <img src="${project.image}" alt="${project.title}">
    <p>${project.description}</p>`;
    containerElement.appendChild(article);

}*/
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    for (let project of projects){
        const article = document.createElement('article');
        article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>`;
        containerElement.appendChild(article);
    }
}
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
  }



