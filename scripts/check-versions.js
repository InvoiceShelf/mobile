const {execSync} = require('child_process');

// Define the required versions
const requiredNodeVersion = '14';
const requiredJdkVersion = '1.8';

// Check Node.js version
const nodeVersion = process.version.split('.')[0].replace('v', ''); // Extract the major version number
if (nodeVersion !== requiredNodeVersion) {
  console.error(
    `Incorrect Node.js version. Required: ${requiredNodeVersion}, Found: ${nodeVersion}`
  );
  process.exit(1); // Exit the process with an error code
}

// Function to check JDK version using different flags and formats
function getJdkVersion() {
  try {
    // Try the newer --version flag first
    const output = execSync('java --version 2>&1').toString();
    const match = output.match(/openjdk (\d+\.\d+)/);
    if (match) {
      return match[1];
    }
  } catch (error) {
    // If the --version flag fails, fall back to the older -version flag
    try {
      const output = execSync('java -version 2>&1').toString();
      const match = output.match(/"(\d+\.\d+)/);
      if (match) {
        return match[1];
      }
    } catch (error) {
      throw new Error('Unable to determine JDK version');
    }
  }
  throw new Error('Unable to determine JDK version');
}

// Check JDK version
try {
  const jdkVersion = getJdkVersion();
  if (jdkVersion !== requiredJdkVersion) {
    console.error(
      `Incorrect JDK version. Required: ${requiredJdkVersion}, Found: ${jdkVersion}`
    );
    process.exit(1); // Exit the process with an error code
  }
} catch (error) {
  console.error('Error checking JDK version:', error);
  process.exit(1); // Exit the process with an error code
}

console.log('Environment versions are correct.');
