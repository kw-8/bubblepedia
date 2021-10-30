document.addEventListener('DOMContentLoaded', addSubmitEventListener);

function addSubmitEventListener() {
  const searchForm = document.querySelector('.wiki-form');
  console.log(searchForm);
  searchForm.addEventListener('submit', handleSubmit);
}

async function handleSubmit(e) {
  console.log(e.cancelable)
  //prevent reload
  addSubmitEventListener();
  e.preventDefault();
  // trim the search input from wiki pinput and save to searchTerm
  const searchTerm = document.querySelector('.wiki-input').value.trim();
  console.log("searchTerm");
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
  displayResults(json);
  return json;
}

async function displayResults(results) {
  results.query.search.forEach((entry) => {
    // http://en.wikipedia.org/?curid=
    // add to html
    console.log(entry['title']) // do something with
  });
}