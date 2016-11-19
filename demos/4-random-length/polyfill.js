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


let _id = 0;
const uid = () => {
  return String(_id++);
}


const randomLength = postcss.plugin('random-length', (options) => {
  const randomRegex = /random/g;

  return (css) => {
    css.walkRules((rule) => {

      const newRules = {};
      rule.walkDecls((decl, i) => {

        if (randomRegex.test(decl.value)) {
          for (const el of document.querySelectorAll(rule.selector)) {
            let id;
            if (el.hasAttribute('polyfill-id')) {
              id = el.getAttribute('polyfill-id');
            } else {
              id = uid();
              el.setAttribute('polyfill-id', id);
            }

            const newRule = newRules[id] || (newRules[id] = rule.clone({
              selector: rule.selector + `[polyfill-id="${id}"]`,
              nodes: []
            }));

            newRule.nodes.push(decl.clone({
              value: decl.value.replace(
                  randomRegex, () => `${Math.random() * 100}%`)
            }));
          }
        }
      });

      // Clone the current rule and update the selector.
      rule.parent.insertBefore(rule, rule.clone({
        selector: rule.selector + ':not(.z)'
      }))

      // Insert all the new rules before the current rule.
      for (const id of Object.keys(newRules)) {
        rule.parent.insertBefore(rule, newRules[id]);
      }

      // Remove the current rule and continue interating.
      rule.remove();
    });
  };
});



const pageStylesheet = document.querySelector('link[rel="stylesheet"]');


fetch(pageStylesheet.href)
  .then((response) => response.text())
  .then((css) => {
    postcss([qUnit, randomLength])
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


