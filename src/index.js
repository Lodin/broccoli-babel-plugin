import {writeFileSync} from 'fs';
import {transformFileSync} from 'babel-core';
import {dirname} from 'path';
import {sync as createDirSync} from 'mkdirp';
import Plugin from 'broccoli-plugin';
import walkSync from 'walk-sync';
import 'babel-polyfill';

export default class Babel extends Plugin {
  constructor(inputNodes, options = {}) {
    super(Array.isArray(inputNodes) ? inputNodes : [inputNodes], {
      annotation: options.annotation
    });

    this.options = options;
  }

  build() {
    const srcDir = this.inputPaths[0];

    for (let filename of walkSync(srcDir)) {
      if (filename.slice(-3) !== '.js') {
        continue;
      }

      const output = transformFileSync(`${srcDir}/${filename}`, this.options);
      const outputFilename = `${this.outputPath}/${filename}`;

      createDirSync(dirname(outputFilename));

      writeFileSync(outputFilename, output.code);
    }
  }
}
