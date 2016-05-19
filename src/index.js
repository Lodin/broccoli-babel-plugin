import 'babel-polyfill';
import {readdir, readFile, writeFile} from 'fs-promise';
import {transform} from 'babel-core';
import {dirname} from 'path';
import mkdirp from 'mkdirp-promise';
import Plugin from 'broccoli-plugin';

export default class Babel extends Plugin {
  constructor(inputNodes, options = {}) {
    super(Array.isArray(inputNodes) ? inputNodes : [inputNodes], {
      name: 'Babel',
      annotation: 'ES6 to ES5 transpilation plugin for Broccoli',
      persistentOutput: options.persistentOutput ?
          options.persistentOutput :
          false
    });

    if (options.persistentOutput) {
      delete options.persistentOutput;
    }

    this.options = options;
  }

  async build() {
    const [inputPath] = this.inputPaths;

    for (let filename of await readdir(inputPath)) {
      if (filename.slice(-3) !== '.js') {
        continue;
      }

      const code = await readFile(`${inputPath}/${filename}`);
      const output = transform(code, this.options);
      const outputFilename = `${this.outputPath}/${filename}`;
      await mkdirp(dirname(outputFilename));
      await writeFile(outputFilename, output.code);
    }
  }
}
