import { spawn } from 'child_process';

async function run() {
  const args = ['-p', 'Hello & World < > | "quotes"'];
  const safeArgs = args.map(arg => `"${arg.replace(/"/g, '\\"')}"`);
  
  const child = spawn('node', ['print_args.js'].concat(safeArgs), {
    shell: true,
    windowsVerbatimArguments: true
  });
  
  child.stdout.on('data', d => console.log('OUT:', d.toString()));
  child.stderr.on('data', d => console.log('ERR:', d.toString()));
  child.on('close', c => console.log('EXIT:', c));
}
run();
