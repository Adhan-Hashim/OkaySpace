const { spawn } = require('child_process');

console.log('Starting OkaySpace Platform...');

const server = spawn('npm', ['run', 'server'], { stdio: 'inherit', shell: true });
const client = spawn('npm', ['run', 'client'], { stdio: 'inherit', shell: true });

server.on('close', (code) => {
    if (code !== 0) console.log(`Server process exited with code ${code}`);
    process.exit(code);
});

client.on('close', (code) => {
    if (code !== 0) console.log(`Client process exited with code ${code}`);
    process.exit(code);
});
