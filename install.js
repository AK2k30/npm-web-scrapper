const fs = require('fs');
const path = require('path');

function isInUserProject() {
  // Check if we're in the user's project, not in our own package
  return path.basename(path.dirname(process.cwd())) === 'node_modules';
}

function updatePackageJson() {
  if (!isInUserProject()) {
    return; // Don't modify anything if we're not in a user's project
  }

  const userPackageJsonPath = path.join(process.cwd(), '..', '..', 'package.json');

  if (!fs.existsSync(userPackageJsonPath)) {
    console.log('No package.json found in the project root. Skipping script addition.');
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(userPackageJsonPath, 'utf8'));

    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    if (!packageJson.scripts['web-scrap-ai']) {
      packageJson.scripts['web-scrap-ai'] = 'web-scrap-ai';
      fs.writeFileSync(userPackageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Added "web-scrap-ai" script to your package.json');
    } else {
      console.log('"web-scrap-ai" script already exists in package.json');
    }
  } catch (error) {
    console.error('Error updating package.json:', error.message);
  }
}

updatePackageJson();