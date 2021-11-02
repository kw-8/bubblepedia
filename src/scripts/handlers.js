async function addClearSearchListener() {
  const html = document.querySelector('html:not(input)');
  html.addEventListener('click', handleClearSearchClick);
}
async function addClearRelatedListener() {
  const relatedBox = document.querySelector('.related-article-list');
  relatedBox.addEventListener('click', handleClearRelatedClick);
}

async function handleClearSearchClick(e) {
  e.preventDefault();
  let searchBox = document.querySelector('.search-results');
  while (searchBox.firstChild) {searchBox.removeChild(searchBox.firstChild);}
}
async function handleClearRelatedClick(e) {
  e.preventDefault();
  let relatedBox = document.querySelector('.related-article-list');
  while (relatedBox.firstChild) { relatedBox.removeChild(relatedBox.firstChild); }
}

export {addClearSearchListener, addClearRelatedListener, handleClearSearchClick, handleClearRelatedClick};