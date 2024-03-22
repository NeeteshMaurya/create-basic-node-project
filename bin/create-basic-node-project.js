#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const prompt = require('prompt-sync')();
const { program } = require('commander');

// Create project directory
const createProject = (projectDir) => {
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir);
  } else {
    console.error('Project directory already exists. Aborting.');
    process.exit(1);
  }
};

// Copy template files
const copyTemplateFiles = (projectDir) => {
  const templatesDir = path.join(__dirname, '../templates');
  fs.readdirSync(templatesDir).forEach(file => {
    const sourcePath = path.join(templatesDir, file);
    const targetPath = path.join(process.cwd(), projectDir, file);

    // Check if the file is a directory
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      // If it's a directory, recursively copy its contents
      fs.mkdirSync(targetPath);
      fs.readdirSync(sourcePath).forEach(subfile => {
        const subSourcePath = path.join(sourcePath, subfile);
        const subTargetPath = path.join(targetPath, subfile);
        fs.copyFileSync(subSourcePath, subTargetPath);
      });
    } else {
      // If it's a file, simply copy it
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
};

// Create package.json file interactively
const createPackageJson = (projectDir) => {
  const packageJsonPath = path.join(process.cwd(), projectDir, 'package.json');

  console.log('This utility will walk you through creating a package.json file.');
  console.log('Press ^C at any time to quit.');

  const packageJson = {
    name: projectDir
  };

  packageJson.name = projectDir;
  packageJson.version = prompt('version: (1.0.0) ') || '1.0.0';
  packageJson.description = prompt('description: ');
  packageJson.main = prompt('entry point: (index.js) ') || 'index.js';
  packageJson.scripts = {
    start: 'node index.js'
  };
  packageJson.keywords = (prompt('keywords: ') || '').split(',');
  packageJson.author = prompt('author: ');
  packageJson.license = prompt('license: (ISC) ') || 'ISC';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

// Install dependencies
const installDependencies = (projectDir) => {
  process.chdir(projectDir);
  execSync('npm install express dotenv cors', { stdio: 'inherit' });
};

// CLI command to create a new project
program
  .version('1.0.0')
  .arguments('<projectName>')
  .action((projectName) => {
    console.log(`Creating new project: ${projectName}`);
    createProject(projectName);
    copyTemplateFiles(projectName);
    createPackageJson(projectName);
    installDependencies(projectName);
    console.log(`Project ${projectName} created successfully!`);
  });

program.parse(process.argv);

