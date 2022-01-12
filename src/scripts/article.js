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
var seeAlsoUl;

loadArticleContent();

async function loadArticleContent() {
  // set up articleURL and articleHTML
  articleURL = `https://en.wikipedia.org/w/api.php?action=parse&prop=text&page=${articleName.split(' ').join('_')}&format=json&origin=*`;

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
  // console.log(relatedBox);
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
    articleSections.slice(0,articleSections.length-1).forEach(arr =>
      arr.forEach(el => sectionBox.appendChild(el)))
  } else {
    sectionBox.innerHTML = "<p>This page is redirected, check 'see also' for new page</p>";
  }
}

async function setUpImages() {
  articleImages = Array.from(articleHTML.querySelectorAll('img')).filter((imgNode) => imgNode.width > 120 && imgNode.height > 120);
}

async function setUpArticleSections(data) {
  let htmlAsText = data.parse.text["*"]; //json obj -> text
  
  // REDIRECT
  if (htmlAsText.includes("Redirect to:")) {
    let newTitle = htmlAsText.match(/title\=\".+\"/)[0];
    newTitle = newTitle.slice(7, newTitle.length - 1);

    articleRedirectLi = document.createElement('li');
    articleRedirectLi.setAttribute('title', newTitle);
    articleRedirectLi.textContent = newTitle;
  }
  
  // article contents -> parseable html
  articleHTML = new DOMParser().parseFromString(htmlAsText, 'text/html').querySelector('.mw-parser-output');

  // remove table of contents, references header, edit section links
  let toc = articleHTML.querySelector('#toc');
  if (toc) articleHTML.removeChild(toc);

  let ref_header = articleHTML.querySelector('#References').parentElement
  if (ref_header) articleHTML.removeChild(ref_header)
  Array.from(articleHTML.querySelectorAll('h2, h3, h4, h5')).forEach(heading =>
    heading.removeChild(heading.querySelector('.mw-editsection'))
  )

  // retrieve sections we want to display
  let sections = Array.from(articleHTML.querySelectorAll('h2, h3, h4, h5, p, .div-col > ul, .mw-parser-output > ul, .wikitable, dl'));
  articleSections = [[]]
  let i = 0
  sections.forEach(el => {
    if (el.nodeName !== 'H2') {
      articleSections[i].push(el)
    } else {
      i += 1
      articleSections[i] = [el]
    }
  })

  // separate see also
  let seeAlsoIndex = articleSections.findIndex(el => el[0] && Array.from(el[0].children).some(child => child.innerHTML === 'See also'))
  let seeAlso = articleSections.splice(seeAlsoIndex, 1)[0]
  console.log(seeAlso)
  seeAlsoUl = seeAlso[1]
  // debugger
  

  // SET UP RELATED
  // let relatedUl = document.querySelector('.related-article-list');
  // Array.from(seeAlsoUl).forEach(el => relatedUl.appendChild(el))

  // let sectionStarts = [];
  // sections.forEach((el, i) => {
  //   if (el.nodeName === "H2") sectionStarts.push(i)
  // });
  // console.log(sections)
  
  // let indexContents = sections.findIndex(node => node.innerHTML === "Contents");
  // let indexExtra = sections.findIndex((node) => {
  //   if (node.firstChild && [ 'Books', 'Notes', 'References', 'Bibliography', 'Further_reading',
  //       'Additional_reading', 'External_links', 'Articles'].includes(node.firstChild.id))
  //       return true;
  // })
  // // console.log('indexExtra', indexExtra, sections[indexExtra]);
  
  // sections.splice(indexExtra);
  // if (indexContents > -1) {
  //   sections.splice( indexContents, sectionStarts[sectionStarts.indexOf(indexContents)+1] );
  //   sectionStarts = sectionStarts.slice(1, sectionStarts.length - 2).map(el => el - sectionStarts[1]);
  // }
  // console.log('sectionStarts', sectionStarts)


  // console.log(articleName, 'sections', sections);
  // console.log(articleSections);
  // set up articleSections
  // articleSections = [];
  // sectionStarts.map((startIndex, i) => {
  //   if (i < sectionStarts.length-1) {
  //     articleSections.push(sections.slice(startIndex, sectionStarts[i + 1]));
  //   } else {
  //     articleSections.push(sections.slice(startIndex));
  //   }
  // });
  
  // console.log(articleSections);
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
  setUpResults(json);
  return json;
}

async function setUpResults(results) {
  const resultBox = document.querySelector('.search-results');
  
  resultBox.addEventListener('click', handleClickResult.bind(this));
  
  while(resultBox.firstChild) {resultBox.removeChild(resultBox.firstChild)};

  results.query.search.forEach((entry) => {
    let searchResult = document.createElement("button");
    searchResult.innerHTML = `${entry['title']}`; //must use = b/c js not jquery
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
  
  await addToSeeAlso();

  splashRelated();
}

async function addToSeeAlso() {
  let relatedUl = document.querySelector('.related-article-list');
  relatedUl.addEventListener('click', handleClickResult.bind(this));

  document.querySelector('.fade-bg').setAttribute('show', 'true');

  if (seeAlsoUl) {
    let liArr = Array.from(seeAlsoUl.children).map(el => el.firstChild.innerHTML)
    console.log(liArr)
      liArr.forEach((li) => {
        let el = document.createElement("li");
        el.innerHTML = `${li}`;
        el.setAttribute(`title`, li);

        relatedUl.appendChild(el);
        relatedUl.appendChild(document.createElement("br"));
      });
  } else if (articleRedirectLi) {
    relatedUl.appendChild(articleRedirectLi);
  }

  // // array of nodes of li elements from see also
  // if (articleSections.length > 0) {
  //   let rel = articleSections[articleSections.length - 1];
  //   console.log(rel[0]);
  //   if (rel[0].textContent && rel[0].textContent.includes("See also")) {
  //     let liArr = Array.from(rel[1].querySelectorAll('li')).filter(el => !el.textContent.includes('portal'));
  //     liArr.forEach((li) => {
  //       let el = document.createElement("li");
  //       el.innerHTML = `${li.textContent}`;
  //       el.setAttribute(`title`, li.textContent);

  //       relatedUl.appendChild(el);
  //       relatedUl.appendChild(document.createElement("br"));
  //     });
  //   }
  // } else { relatedUl.appendChild(articleRedirectLi); }
}