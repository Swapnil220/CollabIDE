// import Docker from 'dockerode';
import {ErrorResponse} from '../utils/ErrorResponse.js';

// const docker = new Docker();

// // Supported languages and their Docker images
// const languageImages = {
//   javascript: 'node:16',
//   python: 'python:3.9',
//   java: 'openjdk:11',
//   'c++': 'gcc:latest'
// };

// // Timeout for execution (in milliseconds)
// const EXECUTION_TIMEOUT = 5000;

// export const executeCode = async (language, code) => {
//   if (!languageImages[language]) {
//     throw new ErrorResponse(`Unsupported language: ${language}`, 400);
//   }

//   console.log(language,"language")

//   try {
//     // Pull the Docker image if not already present
//     await docker.pull(languageImages[language]);

//     // Create a container
//     const container = await docker.createContainer({
//       Image: languageImages[language],
//       Cmd: getExecutionCommand(language),
//       Tty: false,
//       AttachStdout: true,
//       AttachStderr: true,
//       HostConfig: {
//         AutoRemove: true,
//         Memory: 100 * 1024 * 1024, // 100MB memory limit
//         NetworkMode: 'none' // No network access
//       }
//     });

//     console.log(container,"containerrrrrrrrrrrr")

//     // Start the container
//     await container.start();

//     // Attach to the container to get output
//     const stream = await container.attach({
//       stream: true,
//       stdout: true,
//       stderr: true
//     });

//     // Send code to container's stdin
//     const exec = await container.exec({
//       Cmd: ['sh', '-c', code],
//       AttachStdout: true,
//       AttachStderr: true
//     });

//     const execStream = await exec.start({ hijack: true, stdin: true });
    
//     // Set timeout for execution
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(() => {
//         reject(new ErrorResponse('Execution timed out', 408));
//       }, EXECUTION_TIMEOUT);
//     });

//     // Wait for execution to complete
//     const output = await Promise.race([
//       new Promise((resolve) => {
//         let output = '';
//         execStream.on('data', (chunk) => {
//           output += chunk.toString();
//         });
//         execStream.on('end', () => {
//           resolve(output);
//         });
//       }),
//       timeoutPromise
//     ]);

//     // Stop and remove the container
//     try {
//       await container.stop();
//       await container.remove();
//     } catch (err) {
//       console.error('Error cleaning up container:', err);
//     }

//     return output;
//   } catch (error) {
//     console.error('Execution error:', error);
//     throw new ErrorResponse('Failed to execute code', 500);
//   }
// };

// const getExecutionCommand = (language) => {
//   switch (language) {
//     case 'javascript':
//       return ['node', '-e'];
//     case 'python':
//       return ['python', '-c'];
//     case 'java':
//       return ['bash', '-c', 'javac Main.java && java Main'];
//     case 'c++':
//       return ['bash', '-c', 'g++ -o main main.cpp && ./main'];
//     default:
//       return ['sh', '-c'];
//   }
// };


// server/services/codeExecution.js
import Docker from 'dockerode';

const docker = new Docker({
  socketPath: process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock'
});

// Pull the image if it doesn't exist and wait for completion
const ensureImageExists = async (imageName) => {
  try {
    await docker.getImage(imageName).inspect();
  } catch {
    console.log(`Pulling ${imageName}...`);
    await new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, onFinished, onProgress);

        function onFinished(err, output) {
          if (err) return reject(err);
          resolve(output);
        }

        function onProgress(event) {
          // Optional: console.log(event.status);
        }
      });
    });
  }
};

export const executeCode = async (language, code) => {
  const images = {
    javascript: 'node:16',
    python: 'python:3.9',
    java: 'openjdk:11-jdk',
    'c++': 'gcc:latest'
  };

  if (!images[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    // Ensure image is available
    await ensureImageExists(images[language]);

    const container = await docker.createContainer({
      Image: images[language],
      Cmd: getExecutionCommand(language, code),
      Tty: false,
      HostConfig: {
        Memory: 100 * 1024 * 1024, // 100 MB
        NetworkMode: 'none'
      }
    });

    await container.start();
    await container.wait(); // wait for container to finish

    const logs = await container.logs({
      stdout: true,
      stderr: true
    });

    await container.remove(); // manually remove container

    return logs.toString();
  } catch (error) {
    throw new Error(`Execution failed: ${error.message}`);
  }
};

const escapeForShell = (str) =>
    str
      .replace(/[\r\n]+/g, '\n')        // Normalize newlines (Windows -> Unix)
      .replace(/[^\x20-\x7E\n]/g, '')   // Remove non-printable characters
      .replace(/"/g, '\\"');         // Escape double quotes
  

const getExecutionCommand = (language, code) => {
console.log("Raw Code: ", code); // Log the raw code for inspection
const safeCode = escapeForShell(code);

console.log("Sanitized Code: ", safeCode); // Log the sanitized code

switch (language) {
    case 'javascript':
    return ['node', '-e', code];
    case 'python':
    return ['python', '-c', code];
    case 'java':
    return ['sh', '-c', `echo "${safeCode}" > Main.java && javac Main.java && java Main`];
    case 'c++':
    return ['sh', '-c', `echo "${safeCode}" > main.cpp && g++ main.cpp -o main && ./main`];
    default:
    return ['sh', '-c', code];
}
};
      


// const getExecutionCommand = (language, code) => {
//     // Normalize line endings and escape quotes for shell safety
//     const safeCode = code.replace(/\r\n/g, '\n').replace(/"/g, '\\"').trim();
  
//     switch (language) {
//       case 'javascript':
//         return ['node', '-e', safeCode];
//       case 'python':
//         return ['python', '-c', safeCode];
//       case 'java':
//         return ['sh', '-c', `echo "${safeCode}" > Main.java && javac Main.java && java Main`];
//       case 'cpp':
//         return ['sh', '-c', `echo "${safeCode}" > main.cpp && g++ main.cpp -o main && ./main`];
//       default:
//         return ['sh', '-c', safeCode];
//     }
//   };
