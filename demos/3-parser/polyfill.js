const postcss = require('postcss');


const qUnit = postcss.plugin('q-unit', (options) => {
  return (css) => {
    css.walkRules((rule) => {
      rule.walkDecls((decl, i) => {

        const qRegex = /((?:\d+\.)?\d+)q/g;
        if (qRegex.test(decl.value)) {
          decl.value = decl.value
              .replace(qRegex, (match, p1) => `${parseFloat(p1) * 2}em`);
        }

      });
    });
  };
});


const pageStylesheet = document.querySelector('link[rel="stylesheet"]');


fetch(pageStylesheet.href)
  .then((response) => response.text())
  .then((css) => {
    postcss([qUnit])
      .process(css)
      .then(({css}) => updatePageStyles(css));
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


