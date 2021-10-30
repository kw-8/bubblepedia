document.addEventListener('DOMContentLoaded', addSubmitEventListener); //wait to load before listeners

function addSubmitEventListener() {
  const searchForm = document.querySelector('.wiki-form');
  searchForm.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  console.log(e.cancelable)
  //prevent reload
  addSubmitEventListener();
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
  const searchURL = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchTerm}`;
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

  results.query.search.forEach((entry) => {
    let li = document.createElement("button");
    //must use = b/c js not jquery
    li.innerHTML = `${entry['title']}`;
    li.setAttribute(  `value`,
                      `http://en.wikipedia.org/?curid=${entry['pageid']}`);

    console.log(resultBox);
    resultBox.appendChild(li);
    // add event handlers
  });
  console.log(resultBox);
  
}

function handleSubmitResult() { }