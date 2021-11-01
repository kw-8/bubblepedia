require("./related_articles");





/* ----------------------------
 *
 *  ARTICLE DISPLAY FUNCTIONALITY
*
---------------------------- */
var articleName = "Bubble tea";
var articleURL;
var articleHTML;
var articleSections;
var articleImages;
loadArticleContent();

async function loadArticleContent() {
  console.log('loading');

  // set up articleURL and articleHTML
  articleURL = `http://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${articleName.split(' ').join('_')}&format=json&origin=*`;

  await fetch(articleURL)
    .then(response => response.json())
    .then(data => {
      setUpArticleSections(data);
    });


  // find elements to put things in
  let pictureBox = document.querySelector('.pictures');
  let sectionBox = document.querySelector('.article-section');
  let title = document.querySelector('h1');
  title.innerHTML = articleName;

  // articleSections = articleHTML.split()
  // console.log(articleHTML.querySelectorAll('h2, h2 + p'));
  
  // put things into the elements
}

async function setUpArticleSections(data) {
  let htmlAsText = data.parse.text["*"]; //json obj -> text
  articleHTML = new DOMParser().parseFromString(htmlAsText, 'text/html'); //text -> parseable html

  console.log('THIS IS THE ARTICLE', articleHTML);

  articleImages = Array.from(articleHTML.querySelectorAll('img'));
  console.log(articleImages.map(el=>el.alt));

  // retrieve sections we want to display
  let sections = Array.from(articleHTML.querySelectorAll('h2, h3, h4, p, ul'));
  let sectionStarts = [];
  sections.forEach((el, i) => {
    if (el.nodeName === "H2") sectionStarts.push(i)
  }); // remove the extra below
  sections.splice(sectionStarts[sectionStarts.length - 2]);
  sections.splice(0, sectionStarts[1]);
  sectionStarts = sectionStarts.slice(1, sectionStarts.length - 2).map(el => el - sectionStarts[1]);

  // console.log('SECTION STARTING INDEXES', sectionStarts);
  sections.forEach(el => console.log(el.textContent));

  // set up articleSections
  articleSections = [];
  sectionStarts.map((startIndex, i) => {
    if (i < sectionStarts.length-1) {
      articleSections.push(sections.slice(startIndex, sectionStarts[i + 1]));
    } else {
      articleSections.push(sections.slice(startIndex));
    }
  });

  let textArea = document.querySelector('.article-section');
  while (textArea.firstChild) { textArea.removeChild(textArea.firstChild) };
  articleSections[0].forEach(el => textArea.appendChild(el));
  console.log(articleSections);
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
  resultBox.addEventListener('click', handleClickResult.bind(this));
  
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

async function handleClickResult(e) {
  e.preventDefault();
  // console.log(e.target.title);
  articleName = e.target.title;
  console.log(articleName);
  loadArticleContent();
}