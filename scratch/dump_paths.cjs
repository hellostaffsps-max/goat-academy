const fs = require('fs');

const fileContent = fs.readFileSync('c:/Users/hello/OneDrive/Desktop/academy/app/src/data/coffeeData.ts', 'utf-8');

// Quick regex to find learningPaths
const pathsRegex = /export const learningPaths\s*:\s*LearningPath\[\]\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]\s*);/m;
const match = fileContent.match(pathsRegex);

if (match) {
  console.log("Found learning paths!");
  // we won't eval, just print it out to see the structure
  console.log(match[0].substring(0, 1000) + "...");
} else {
  console.log("learningPaths not found by regex.");
}
