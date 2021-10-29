const wikiForm = document.querySelector('.wiki-form');
wikiForm.addEventListener('submit', handleSubmit);
function handleSubmit(event) {
  event.preventDefault(); //prevent reload
}