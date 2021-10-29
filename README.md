# Bubblepedia

## Background

Bubblepedia is a Wikipedia trawler that displays  
the article body and related articles in a fun way.


## Functionality

In bubblepedia, users will be able to:
- search for wikipedia pages
- view pictures on the page
- click between article sections
- click a picture from related articles to go to the article

In addition, bubblepedia will have
- an instructions page describing how to use bubblepedia
- a link to this readme
- night and day mode toggle


## Technologies, Libraries, APIs

`Wikipedia API` for content, `Canvas` for some basic movement, and `Greensock` for RelatedArticle animation


## Implementation Timeline

- Friday Afternoon & Weekend
  - Set up project, npm, webpack, canvas
  - Create `ArticleSection`, `SectionToggle`, `RelatedArticle` classes
  - Start setting up grid
- Monday
  - Make sure classes are working together without animation
  - Add a search bar
  - Tweak still visuals
  - Start working on basic animation: pop up, circling (using animation keyframes?)
- Tuesday
  - Add Greensock to the basic animation, work on animation keyframes
  - Try to attain a visually satisfying morphing dynamic, consider looking at some physics fluid models
- Wednesday
  - Keep working on animation
  - If successful, try to add mini-droplets for extra effect
  - In the afternoon, try to add a day/night toggle
- Thursday Morning
  - Touch up, scrap anything that doesn't work