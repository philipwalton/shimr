for (const stylesheet of document.styleSheets) {
  for (const rule of stylesheet.rules) {
    for (const property of Object.keys(rule.style)) {

      // if (rule.selectorText == 'p' && property == 'fontSize') {
      //   debugger;
      // }

      // const qRegex = /((?:\d+\.)?\d+)q/g;
      // if (qRegex.test(rule.style[property])) {
      //   rule.style[property] = rule.style[property]
      //       .replace(qRegex, (match, p1) => `${parseFloat(p1)  * 2}em`);
      // }

      if (rule.style[property].includes('red')) {
        rule.style[property] = rule.style[property].replace('red', 'green');
      }

    }
  }
}
