const { spawn } = require('child_process');

console.log('Starting build test...');

const build = spawn('npm', ['run', 'build'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

let output = '';
let errorOutput = '';

build.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log(text);
});

build.stderr.on('data', (data) => {
  const text = data.toString();
  errorOutput += text;
  console.error(text);
});

build.on('close', (code) => {
  console.log(`\nBuild process exited with code ${code}`);
  if (code !== 0) {
    console.log('\n=== BUILD OUTPUT ===');
    console.log(output);
    console.log('\n=== ERROR OUTPUT ===');
    console.log(errorOutput);
  }
});