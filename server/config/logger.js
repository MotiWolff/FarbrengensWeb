// Simple logger that respects SILENT_MODE environment variable
const SILENT_MODE = process.env.SILENT_MODE === 'true';

const logger = {
  log: (...args) => {
    if (!SILENT_MODE) console.log(...args);
  },
  error: (...args) => {
    if (!SILENT_MODE) console.error(...args);
  },
  warn: (...args) => {
    if (!SILENT_MODE) console.warn(...args);
  },
  info: (...args) => {
    if (!SILENT_MODE) console.info(...args);
  }
};

// Override global console when SILENT_MODE is enabled
if (SILENT_MODE) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.info = () => {};
}

module.exports = logger;
