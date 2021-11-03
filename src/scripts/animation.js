async function splashRelated() {
  // greensock to calculate position transformations
  // html filters
  // gsap.to('.related-article-list li', { duration: 3, rotation: 360, });
  let screen = document.querySelector('html');
  
  let articleList = Array.from(document.querySelectorAll('.related-article-list li'));
  // console.log(articleList, 'help');
  // let angle = (2*0 + 1) * (2 * Math.PI / articleList.length); // -PI to PI = -1 to 1
  // let radius = Math.min(screen.scrollWidth, screen.scrollHeight)/2 - 36;
  // let transformDir = [radius * Math.cos(angle), radius * Math.sin(angle)];
  // console.log(angle, radius, transformDir);

  // // gsap.to(`.related-article-list li:nth-child(${0})`, { duration: 3, rotation: 360 });
  // console.log(document.querySelector(`.related-article-list li:nth-child(${1})`));
  
  // console.log(document.querySelector('.related-article-list li'));
  
  articleList.forEach((child, i) =>{
    let n = 2 * i + 1;
    let angle = n * (Math.PI/articleList.length); // -PI to PI = -1 to 1
    let radius = Math.min(screen.scrollWidth, screen.scrollHeight)/2 - 36;
    let transformDir = [radius * Math.cos(angle), radius * Math.sin(angle)];
    console.log(transformDir);
    gsap.to(`.related-article-list li:nth-child(${n})`,
            {duration: 3, x: transformDir[0], y: transformDir[1]});
  });
}

export {splashRelated};