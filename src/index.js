import {writeFile} from 'fs';
import {transformFile} from 'babel-core';
import {dirname} from 'path';
import {isArray} from 'lodash';
import Plugin from 'broccoli-plugin';
import walkSync from 'walk-sync';
import mkdirp from 'mkdirp';

export default class Babel extends Plugin {
    constructor(inputNodes, options = {}) {
        super(isArray(inputNodes) ? inputNodes : [inputNodes], {
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

            transformFile(`${srcDir}/${filename}`, this.options, (transpileErr, output) => {
                if (transpileErr) {
                    throw transpileErr;
                }

                const outputFilename = `${this.outputPath}/${filename}`;

                mkdirp(dirname(outputFilename));
                writeFile(outputFilename, output, (writeErr) => {
                    if (writeErr) {
                        throw writeErr;
                    }
                });
            });
        }
    }
}