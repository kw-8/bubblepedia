async function splashRelated() {
  // greensock to calculate position transformations
  // html filters
  let screen = document.querySelector('.fade-bg');
  
  let articleList = Array.from(document.querySelectorAll('.related-article-list li'));
  
  articleList.forEach((child, i) =>{
    let n = 2 * i + 1;
    let angle = n * (Math.PI/articleList.length); // -PI to PI = -1 to 1
    let radius = 0.3 * Math.min(screen.scrollWidth, screen.scrollHeight);
    let transformDir = [radius * Math.cos(angle), radius * Math.sin(angle)];
    // gsap.to(`.related-article-list li:nth-child(${n})`, { scale: 3 });
    gsap.to(`.related-article-list li:nth-child(${n})`,
      { duration: 1, x: transformDir[0], y: transformDir[1], scale: 1.5});
  });
}

export {splashRelated};