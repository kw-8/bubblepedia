const { async } = require("regenerator-runtime");
import { addClearSearchListener, addClearRelatedListener, handleClearSearchClick, handleClearRelatedClick } from "./handlers"

document.addEventListener('DOMContentLoaded', addSubmitEventListener); //wait to load before listeners
document.addEventListener('DOMContentLoaded', addSeeAlsoListener);
document.addEventListener('DOMContentLoaded', addClearSearchListener);
document.addEventListener('DOMContentLoaded', addClearRelatedListener);





/* ----------------------------
 *
 * HANDLE CLICK -> LOAD ARTICLE
 *
---------------------------- */
async function handleClickResult(e) {
  e.preventDefault();
  
  articleName = e.target.title;
  
  loadArticleContent();
}





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
    .then(response => {
      console.log(response.parse);
      return response.json()
    })
    .then(data => {
      setUpArticleSections(data);
      setUpImages(data);
    });


  // find elements to put things in
  // let htmlBox = document.querySelector('body');
  let relatedBox = document.querySelector('.related-article-list');
  let pictureBox = document.querySelector('.pictures');
  let sectionBox = document.querySelector('.article-section');
  let title = document.querySelector('h1');
  title.innerHTML = articleName;

  // htmlBox.setAttribute('background-image', `url(${articleImages[0]['src']})`);

  // remove see also elements
  while (relatedBox.firstChild) { relatedBox.removeChild(relatedBox.firstChild) };
  document.querySelector('.fade-bg').setAttribute('show', 'false');

  // add content to article images
  while (pictureBox.firstChild) { pictureBox.removeChild(pictureBox.firstChild) };
  if (articleImages != []) {
    articleImages.forEach(el => pictureBox.appendChild(el));
  } else {
    pictureBox.appendChild( document.createElement('img')
      .setAttribute('src', './assets/chikadee.jpg'))
    }

  // add content to sectionBox
  while (sectionBox.firstChild) { sectionBox.removeChild(sectionBox.firstChild) };
  articleSections[0].forEach(el => sectionBox.appendChild(el));
}

async function setUpImages(data) {
  articleImages = Array.from(articleHTML.querySelectorAll('img')).filter((imgNode) => imgNode.width > 120 && imgNode.height > 120);
}

async function setUpArticleSections(data) {
  console.log(data);
  let htmlAsText = data.parse.text["*"]; //json obj -> text
  articleHTML = new DOMParser().parseFromString(htmlAsText, 'text/html'); //text -> parseable html

  // console.log('THIS IS THE ARTICLE', articleHTML);

  // retrieve sections we want to display
  let sections = Array.from(articleHTML.querySelectorAll('h2, h3, h4, p, ul'));
  let sectionStarts = [];
  sections.forEach((el, i) => {
    if (el.nodeName === "H2") sectionStarts.push(i)
  }); // remove the extra below
  sections.splice(sectionStarts[sectionStarts.length - 2]);
  sections.splice(0, sectionStarts[1]);
  sectionStarts = sectionStarts.slice(1, sectionStarts.length - 2).map(el => el - sectionStarts[1]);

  // set up articleSections
  articleSections = [];
  sectionStarts.map((startIndex, i) => {
    if (i < sectionStarts.length-1) {
      articleSections.push(sections.slice(startIndex, sectionStarts[i + 1]));
    } else {
      articleSections.push(sections.slice(startIndex));
    }
  });
}





/* ----------------------------
 *
 *  SEARCH FUNCTIONALITY
 *
---------------------------- */
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
  const response = await fetch(searchURL)
  if (!response) {
    throw Error(response.statusText);
  }
  const json = await response.json();
  // console.log(json);
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
}





/* ----------------------------
 *
 * RELATED ARTICLES
 *
---------------------------- */
async function addSeeAlsoListener() {
  let seeAlsoButton = document.querySelector('.related-articles > button');
  seeAlsoButton.addEventListener('click', setUpRelated);
}

async function addClickRelatedListener() {
  let relatedUl = document.querySelector('.related-article-list');
  relatedUl.addEventListener('click', handleClickResult.bind(this));
}

async function setUpRelated(e) {
  e.preventDefault();

  let relatedUl = document.querySelector('.related-article-list');
  relatedUl.addEventListener('click', handleClickResult.bind(this));

  document.querySelector('.fade-bg').setAttribute('show', 'true');

  // array of nodes of li elements from see also
  let liArr = Array.from(articleSections[articleSections.length - 1][1].querySelectorAll('li'));

  liArr.forEach((li) => {
    let el = document.createElement("li");
    el.innerHTML = `${li.textContent}`;
    el.setAttribute(`title`, li.textContent);

    relatedUl.appendChild(el);
    relatedUl.appendChild(document.createElement("br"));
  });
}




















// {
//   "batchcomplete": "",
//   "query":  { "normalized": [{  "from": "Bubble_tea", "to": "Bubble tea" }],
//               "pages":  { "4045": { "pageid": 4045,
//                                     "ns": 0,
//                                     "title": "Bubble tea",
//                                     "thumbnail": { "source": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bubble_Tea.png/267px-Bubble_Tea.png", "width": 267, "height": 500 },
//                                     "pageimage": "Bubble_Tea.png" }
//                         }
//             }
// }