async function splashRelated() {
  // greensock to calculate position transformations
  // html filters
  gsap.to('.related-article-list li', { duration: 3, rotation: 360, });
  
  // let articleList = Array.from(document.querySelectorAll('.related-article-list li'));
  // console.log(articleList);
  // let angle = (2*0 + 1) * (2 * Math.PI / articleList.length); // -PI to PI = -1 to 1
  // let radius = Math.min(Window.innerWidth, Window.innerHeight)/2 - 36;
  // let transformDir = (radius * Math.cos(angle), radius * Math.sin(angle));
  // console.log(angle, radius, transformDir);
  // // gsap.to(`.related-article-list li:nth-child(${0})`, { duration: 3, rotation: 360 });
  // console.log(document.querySelector(`.related-article-list li:nth-child(${1})`));
  
  // console.log(document.querySelector('.related-article-list li'));
  
  // articleList.forEach((child, n) =>{
  //   let angle = (2*n+1) * (2 * Math.pi/articleList.length); // -PI to PI = -1 to 1
  //   let radius = Math.min(window.innerwidth, window.innerHeight)/2 - 36;
  //   let transformDir = (radius * Math.cos(angle), radius * Math.sin(angle));
  //   console.log(transformDir);
  //   gsap.to(`.related-article-list li:nth-child(${n})`, {duration: 3, rotation: 360});
  // });
}

export {splashRelated};