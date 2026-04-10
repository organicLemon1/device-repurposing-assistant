const fs = require('fs');

const files = [
  './app/page.tsx', 
  './app/confirm/page.tsx', 
  './app/specs/page.tsx', 
  './app/ideas/page.tsx',
  './app/components/molecules/SectionHeader.tsx',
  './app/components/molecules/FileUploadArea.tsx'
];

files.forEach(p => {
  let c = fs.readFileSync(p, 'utf8');
  
  // Universal spacing reductions to keep content above the fold
  c = c.replace(/p-4 sm:p-8 lg:p-12/g, 'p-3 sm:p-4 lg:p-6');
  c = c.replace(/mb-10 lg:mb-14/g, 'mb-5 lg:mb-6');
  c = c.replace(/gap-8 lg:gap-10/g, 'gap-4 lg:gap-6');
  c = c.replace(/p-6 sm:p-8/g, 'p-4 sm:p-5');

  if (p.includes('ideas/page.tsx')) {
    c = c.replace(/mb-14/g, 'mb-6');
    c = c.replace(/gap-8/g, 'gap-5');
    c = c.replace(/p-8/g, 'p-5');
    c = c.replace(/mt-10 pt-6/g, 'mt-5 pt-4');
    c = c.replace(/mb-6/g, 'mb-3');
  }
  
  if (p.includes('SectionHeader.tsx')) {
     c = c.replace(/mb-6 pb-4/g, 'mb-3 pb-2');
  }
  
  if (p.includes('page.tsx')) {
    c = c.replace(/mt-6 flex justify-end pt-5/g, 'mt-3 flex justify-end pt-4');
    c = c.replace(/mb-12/g, 'mb-6');
  }
  
  if (p.includes('FileUploadArea.tsx')) {
     c = c.replace(/mb-6/g, 'mb-3');
  }

  if (p.includes('confirm/page.tsx')) {
     c = c.replace(/min-h-\[300px\]/g, 'min-h-[220px]');
     c = c.replace(/mt-8/g, 'mt-5');
  }

  fs.writeFileSync(p, c);
});

console.log("Spacing tightened.");
