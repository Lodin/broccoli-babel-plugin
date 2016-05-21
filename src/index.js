import 'babel-polyfill';
import {readFile, writeFile} from 'fs-promise';
import {transform} from 'babel-core';
import path from 'path';
import mkdirp from 'mkdirp-then';
import Plugin from 'broccoli-plugin';
import walk from 'walk-sync';

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

    for (let fname of walk(inputPath)) {
      if (fname.slice(-3) !== '.js') {
        continue;
      }

      const code = await readFile(`${inputPath}/${fname}`, 'utf8');
      const output = transform(code, this.options);

      const outputFilename = `${this.outputPath}/${fname}`;

      await mkdirp(path.dirname(outputFilename));
      await writeFile(outputFilename, output.code);
    }
  }
}
