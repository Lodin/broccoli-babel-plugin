import 'babel-polyfill';
import {readFile, writeFile} from 'fs-promise';
import {readFileSync} from 'fs';
import {transform} from 'babel-core';
import path from 'path';
import mkdirp from 'mkdirp-then';
import Plugin from 'broccoli-plugin';
import walk from 'walk-sync';

/**
 * Broccoli plugin that transpiles es2015 code to es5 using Babel of version 6.
 */
export default class Babel extends Plugin {

  /**
   * Creates a new Babel plugin instance. For more info see
   * {@link https://github.com/broccolijs/broccoli-plugin}
   *
   * @param {Node|Node[]} inputNodes List of input nodes
   * @param {Object} options Plugin options
   */
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

    if (Object.getOwnPropertyNames(options).length === 0) {
      options = JSON.parse(
          readFileSync(path.join(process.env.PWD, '.babelrc'), 'utf8')
      );
    }

    /**
     * Plugin options. Equal to Babel options
     * {@link https://babeljs.io/docs/usage/options/}
     *
     * @type {Object}
     */
    this.options = options;
  }

  /**
   * Builds received nodes.
   *
   * Walks over all files in the directory, asynchronously reads it, compiles
   * through babel and writes the compiled data to the output folder.
   */
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
