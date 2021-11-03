const { async } = require("regenerator-runtime");
import { addClearSearchListener, addClearRelatedListener, addReadMeListener, handleClearSearchClick, handleClearRelatedClick, handleAddReadMeClick } from "./handlers";
import {splashRelated} from "./animation";

document.addEventListener('DOMContentLoaded', addSubmitEventListener); //wait to load before listeners
document.addEventListener('DOMContentLoaded', addSeeAlsoListener);
document.addEventListener('DOMContentLoaded', addClearSearchListener);
document.addEventListener('DOMContentLoaded', addClearRelatedListener);
document.addEventListener('DOMContentLoaded', addReadMeListener);





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
var articleRedirectLi;
loadArticleContent();

async function loadArticleContent() {
  
  // set up articleURL and articleHTML
  articleURL = `http://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${articleName.split(' ').join('_')}&format=json&origin=*`;

  console.log(`loading ${articleName}, ${articleURL}`);
  
  await fetch(articleURL)
    .then(response => response.json())
    .then(data => {
      setUpArticleSections(data);
    })


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
  console.log(relatedBox);
  document.querySelector('.fade-bg').setAttribute('show', 'false');

  // add content to article images
  while (pictureBox.firstChild) { pictureBox.removeChild(pictureBox.firstChild) };
  if (articleImages.length > 0) {
    articleImages.forEach(el => pictureBox.appendChild(el));
  } else {
    pictureBox.innerHTML = "<img src='./assets/chikadee.jpg'>";
  }

  // add content to sectionBox
  while (sectionBox.firstChild) { sectionBox.removeChild(sectionBox.firstChild) };
  if (articleSections.length > 0) {
    articleSections.forEach(arr =>
      arr.forEach(el => sectionBox.appendChild(el)))
  } else {
    sectionBox.innerHTML = "<p>This page is redirected, check 'see also' for new page</p>";
  }
}

async function setUpImages(data) {
  articleImages = Array.from(articleHTML.querySelectorAll('img')).filter((imgNode) => imgNode.width > 120 && imgNode.height > 120);
}

async function setUpArticleSections(data) {
  let htmlAsText = data.parse.text["*"]; //json obj -> text

  if (htmlAsText.includes('Redirect to:')) {
    let newTitle = htmlAsText.match(/title\=\".+\"/)[0];
    newTitle = newTitle.slice(7, newTitle.length - 1);

    console.log('new title match\n', newTitle);
    articleRedirectLi = document.createElement('li');
    articleRedirectLi.setAttribute('title', newTitle);
    articleRedirectLi.textContent = newTitle;
    console.log(articleRedirectLi);
  }

  
  
  articleHTML = new DOMParser().parseFromString(htmlAsText, 'text/html'); //text -> parseable html

  // retrieve sections we want to display
  let sections = Array.from(articleHTML.querySelectorAll('h2, h3, h4, h5, p, ul'));
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

  setUpImages(data);
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
  let seeAlsoButton = document.querySelector('.seealso-button');
  seeAlsoButton.addEventListener('click', setUpRelated);
}

async function addClickRelatedListener() {
  let relatedUl = document.querySelector('.related-article-list');
  relatedUl.addEventListener('click', handleClickResult.bind(relatedUl));
}

async function setUpRelated(e) {
  e.preventDefault();
  
  // let relatedUl = document.querySelector('.related-article-list');
  // relatedUl.addEventListener('click', handleClickResult.bind(this));
  
  // document.querySelector('.fade-bg').setAttribute('show', 'true');

  // // array of nodes of li elements from see also
  // if (articleSections.length > 0) {
  //   let rel = articleSections[articleSections.length - 1][1];
  //   if (rel) {
  //     let liArr = Array.from(rel.querySelectorAll('li')).filter(el => !el.textContent.includes('portal'));
  //     liArr.forEach((li) => {
  //       let el = document.createElement("li");
  //       el.innerHTML = `${li.textContent}`;
  //       el.setAttribute(`title`, li.textContent);

  //       relatedUl.appendChild(el);
  //       relatedUl.appendChild(document.createElement("br"));
  //     });
  //   }
  // } else { relatedUl.appendChild(articleRedirectLi);}
  await addToSeeAlso();
  
  splashRelated();
}

async function addToSeeAlso() {
  let relatedUl = document.querySelector('.related-article-list');
  relatedUl.addEventListener('click', handleClickResult.bind(this));

  document.querySelector('.fade-bg').setAttribute('show', 'true');

  // array of nodes of li elements from see also
  if (articleSections.length > 0) {
    let rel = articleSections[articleSections.length - 1][1];
    if (rel) {
      let liArr = Array.from(rel.querySelectorAll('li')).filter(el => !el.textContent.includes('portal'));
      liArr.forEach((li) => {
        let el = document.createElement("li");
        el.innerHTML = `${li.textContent}`;
        el.setAttribute(`title`, li.textContent);

        relatedUl.appendChild(el);
        relatedUl.appendChild(document.createElement("br"));
      });
    }
  } else { relatedUl.appendChild(articleRedirectLi); }
}