#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const AdCutter = require('./cutter');

program
  .name('auto-cut-ads')
  .description('Fetch audio/video files, inspect for ads, remove them and generate a clean version')
  .version('1.0.0')
  .argument('<input>', 'Input audio or video file')
  .option('-o, --output <output>', 'Output file path')
  .option('--ad-duration <seconds>', 'Manually specify ad duration to cut (seconds)', parseFloat)
  .option('--skip-message <message>', 'Custom skip message template (default: "skipping X seconds/minutes of ads")')
  .action(async (input, options) => {
    try {
      if (!fs.existsSync(input)) {
        console.error(`Error: Input file ${input} does not exist`);
        process.exit(1);
      }

      const output = options.output || generateOutputPath(input);
      const cutter = new AdCutter(input, output, options);
      await cutter.process();
      console.log(`Done! Clean file saved to: ${output}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

function generateOutputPath(input) {
  const ext = path.extname(input);
  const name = path.basename(input, ext);
  return path.join(path.dirname(input), `${name}.clean${ext}`);
}

program.parse();
