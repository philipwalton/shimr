var pageStylesheet = document.querySelector('link[rel="stylesheet"]');

fetch(pageStylesheet.href)
  .then((response) => response.text())
  .then((css) => {

    const qRegex = /((?:\d+\.)?\d+)q/g;
    css = css.replace(qRegex, (match, p1) => `${parseFloat(p1) * 2}em`);

    updatePageStyles(css);
  });


const updatePageStyles = (css) => {
  let polyfilledStyles = document.getElementById('polyfill-style');
  if (polyfilledStyles) {
    polyfilledStyles.innerHTML = css;
  } else {
    polyfilledStyles = document.createElement('style');
    polyfilledStyles.id = 'polyfill-style';
    polyfilledStyles.innerHTML = css;
    document.head.removeChild(pageStylesheet);
    document.head.appendChild(polyfilledStyles);
    document.body.classList.add('ready');
  }
};
