async function addClearSearchListener() {
  const html = document.querySelector('html:not(input)');
  html.addEventListener('click', handleClearSearchClick);
}
async function addClearRelatedListener() {
  const relatedBox = document.querySelector('.fade-bg');
  relatedBox.addEventListener('click', handleClearRelatedClick);
}

async function handleClearSearchClick(e) {
  e.preventDefault();
  let searchBox = document.querySelector('.search-results');
  while (searchBox.firstChild) {searchBox.removeChild(searchBox.firstChild);}
}
async function handleClearRelatedClick(e) {
  e.preventDefault();
  
  document.querySelector('.fade-bg').setAttribute('show', 'false');

  let relatedBox = document.querySelector('.related-article-list');
  while (relatedBox.firstChild) { relatedBox.removeChild(relatedBox.firstChild); }
}

// async function handleSeeAlsoClick(e) {

//   gsap.to('.related-article-list', { duration: 3, rotation: 360, });
// }

export {addClearSearchListener, addClearRelatedListener, handleClearSearchClick, handleClearRelatedClick};