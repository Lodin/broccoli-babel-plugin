import {expect} from 'chai';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Builder} from 'broccoli';
import Babel from '../src';

describe('Babel broccoli plugin', () => {
  it('should compile es6 files to es5', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {presets: 'es2015'});

    return (new Builder(nodes)).build().then(() => {
      const fixture = readFileSync(join(nodes.outputPath, 'basic-compile.js'), 'utf8');
      const expectation = readFileSync(join(__dirname, 'expects', 'basic-compile.js'), 'utf8');

      expect(fixture).to.equal(expectation);
    });
  });
});