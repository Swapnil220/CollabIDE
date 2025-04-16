

// // server/services/codeExecution.js
// import Docker from 'dockerode';

// const docker = new Docker({
//   socketPath: process.platform === 'win32'
//     ? '//./pipe/docker_engine'
//     : '/var/run/docker.sock'
// });

// // Pull the image if it doesn't exist and wait for completion
// const ensureImageExists = async (imageName) => {
//   try {
//     await docker.getImage(imageName).inspect();
//   } catch {
//     console.log(`Pulling ${imageName}...`);
//     await new Promise((resolve, reject) => {
//       docker.pull(imageName, (err, stream) => {
//         if (err) return reject(err);
//         docker.modem.followProgress(stream, onFinished, onProgress);

//         function onFinished(err, output) {
//           if (err) return reject(err);
//           resolve(output);
//         }

//         function onProgress(event) {
//           // Optional: console.log(event.status);
//         }
//       });
//     });
//   }
// };

// export const executeCode = async (language, code) => {
//   const images = {
//     javascript: 'node:16',
//     python: 'python:3.9',
//     java: 'openjdk:11-jdk',
//     'c++': 'gcc:latest'
//   };

//   if (!images[language]) {
//     throw new Error(`Unsupported language: ${language}`);
//   }

//   try {
//     // Ensure image is available
//     await ensureImageExists(images[language]);

//     const container = await docker.createContainer({
//       Image: images[language],
//       Cmd: getExecutionCommand(language, code),
//       Tty: false,
//       HostConfig: {
//         Memory: 100 * 1024 * 1024, // 100 MB
//         NetworkMode: 'none'
//       }
//     });

//     await container.start();
//     await container.wait(); // wait for container to finish

//     const logs = await container.logs({
//       stdout: true,
//       stderr: true
//     });

//     await container.remove(); // manually remove container

//     return logs.toString();
//   } catch (error) {
//     throw new Error(`Execution failed: ${error.message}`);
//   }
// };

// const escapeForShell = (str) =>
//     str
//       .replace(/[\r\n]+/g, '\n')        // Normalize newlines (Windows -> Unix)
//       .replace(/[^\x20-\x7E\n]/g, '')   // Remove non-printable characters
//       .replace(/"/g, '\\"');         // Escape double quotes
  

// const getExecutionCommand = (language, code) => {
// console.log("Raw Code: ", code); // Log the raw code for inspection
// const safeCode = escapeForShell(code);

// console.log("Sanitized Code: ", safeCode); // Log the sanitized code

// switch (language) {
//     case 'javascript':
//     return ['node', '-e', code];
//     case 'python':
//     return ['python', '-c', code];
//     case 'java':
//     return ['sh', '-c', `echo "${safeCode}" > Main.java && javac Main.java && java Main`];
//     case 'c++':
//     return ['sh', '-c', `echo "${safeCode}" > main.cpp && g++ main.cpp -o main && ./main`];
//     default:
//     return ['sh', '-c', code];
// }
// };


import axios from 'axios';

/**
 * Mapping of languages to their respective execution service URLs
 */
const services = {
  javascript: {
    url: 'https://collabide-1.onrender.com:5002/execute',
  },
  python: {
    url: 'http://code-exec-python:5001/execute',
  },
  // Java and C++ can be added here later
};

/**
 * Executes code by forwarding it to the appropriate microservice
 * @param {string} language - The programming language (e.g., "javascript", "python")
 * @param {string} code - The code to execute
 * @returns {string} - Output of the execution
 */
export const executeCode = async (language, code) => {
  const service = services[language];

  if (!service) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await axios.post(service.url, { code }, { timeout: 7000 });

    if (response.data.success) {
      return response.data.output;
    } else {
      return `Error: ${response.data.output}`;
    }
  } catch (error) {
    if (error.response?.data?.output) {
      throw new Error(`Execution failed: ${error.response.data.output}`);
    } else {
      throw new Error(`Execution failed: ${error.message}`);
    }
  }
};
