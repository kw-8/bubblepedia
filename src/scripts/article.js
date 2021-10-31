require("./related_articles");





/* ----------------------------
 *
 *  ARTICLE DISPLAY FUNCTIONALITY
*
---------------------------- */
let articleName = "Bubble tea";
let articleURL;
let articleHTML;
let articleSections;
loadArticleContent(articleURL);

async function loadArticleContent(articleURL) {

  // set up articleURL and articleHTML
  articleURL = `http://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${articleName.split(' ').join('_')}&format=json&origin=*`;

  await fetch(articleURL)
    .then(response => response.json())
    .then(data => {
      articleHTML = data.parse.text["*"];//.replace(`\n`, '').replace('\', '')
      console.log('THIS IS THE ARTICLE', articleHTML);
    });


  // find elements to put things in
  let pictureBox = document.querySelector('.pictures');
  let sectionBox = document.querySelector('.article-section');
  let title = document.querySelector('h1');
  title.innerHTML = articleName;

  // articleSections = articleHTML.split()
  
  // put things into the elements
  
}





/* ----------------------------
 *
 *  SEARCH FUNCTIONALITY
 *
---------------------------- */
document.addEventListener('DOMContentLoaded', addSubmitEventListener); //wait to load before listeners

function addSubmitEventListener() {
  const searchForm = document.querySelector('.wiki-form');
  searchForm.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  //prevent reload
  e.preventDefault();
  // trim the search input from wiki pinput and save to searchTerm
  const searchTerm = document.querySelector('.wiki-input').value.trim();
  try {
    const results = await searchWikipedia(searchTerm);
    console.log(results);
  } catch (err) {
    console.log(err);
    alert('Failed to search wikipedia');
  }
}

async function searchWikipedia(searchTerm) {
  //format: json, origin: no cors restriction, srlimit: max 20 results
  const searchURL = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=12&srsearch=${searchTerm}`;
  const response = await fetch(searchURL);
  if (!response) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  console.log(json);
  setUpResults(json);
  return json;
}

async function setUpResults(results) {
  const resultBox = document.querySelector('.search-results');
  resultBox.addEventListener('submit-result', handleSubmitResult.bind(this));
  
  while(resultBox.firstChild) {resultBox.removeChild(resultBox.firstChild)};

  results.query.search.forEach((entry) => {
    let searchResult = document.createElement("button");
    //must use = b/c js not jquery
    searchResult.innerHTML = `${entry['title']}`;
    searchResult.setAttribute(`title`, entry['title']);

    resultBox.appendChild(searchResult);
    resultBox.appendChild(document.createElement("br"));
  });
  // console.log(resultBox);
}

async function handleSubmitResult(e) {
  e.preventDefault();
  articleTitle = this['page-title'];
  // sections = content.split('<h2>WILDCARD REGEX</h2>')      remove last 2: citations, external links
}