const fs = require('fs');
const path = require('path');

function walk(dir) {
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx') || p.endsWith('.css') || p.endsWith('.ts')) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/ transition-colors duration-300/gi, '');
      c = c.replace(/ transition-colors/gi, '');
      c = c.replace(/transition: background-color 0.3s ease, color 0.3s ease;/gi, '');
      fs.writeFileSync(p, c);
    }
  });
}

walk('./app');
console.log("Transitions scrubbed.");
