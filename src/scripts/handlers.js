/* ----------------------------
 *
 * clear search results from page
 *
---------------------------- */
async function addClearSearchListener() {
  const html = document.querySelector('html:not(input)');
  html.addEventListener('click', handleClearSearchClick);
}
async function handleClearSearchClick(e) {
  e.preventDefault();
  let searchBox = document.querySelector('.search-results');
  while (searchBox.firstChild) {searchBox.removeChild(searchBox.firstChild);}
}

/* ----------------------------
 *
 * clear related articles + readme from page
 *
---------------------------- */
async function addClearRelatedListener() {
  const relatedBox = document.querySelector('.fade-bg');
  relatedBox.addEventListener('click', handleClearRelatedClick);
}
async function handleClearRelatedClick(e) {
  e.preventDefault();
  
  document.querySelector('.fade-bg').setAttribute('show', 'false');
  
  let relatedBox = document.querySelector('.related-article-list');
  while (relatedBox.firstChild) { relatedBox.removeChild(relatedBox.firstChild); }

  let readmeBox = document.querySelector('.readme');
  if (readmeBox.firstChild) readmeBox.removeChild(readmeBox.firstChild);
}
// add listener + handle click readme
async function addReadMeListener() {
  let readmeBox = document.querySelector('.readme-button');
  readmeBox.addEventListener('click', handleAddReadMeClick.bind(this));
  console.log('listener added');
}
async function handleAddReadMeClick(e) {
  e.preventDefault();
  let readme = document.querySelector('.readme');
  let readmeEl = document.createElement('p');
  readmeEl.innerHTML = `<h3>Bubblepedia</h3>
  <p>
    A bubble tea-themed way to browse wikipedia!
    <ol>
      <li>Enter a search to find a page you're interested in</li>
      <li>Click 'see also' to explore related articles!</li>
    </ol>
  </p>`;
  readme.appendChild(readmeEl);
  document.querySelector('.fade-bg').setAttribute('show', 'true');
  console.log('content added');
}

export { addClearSearchListener, addClearRelatedListener, addReadMeListener, handleClearSearchClick, handleClearRelatedClick, handleAddReadMeClick};