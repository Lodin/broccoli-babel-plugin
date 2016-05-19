import {expect} from 'chai';
import {readFile, readFileSync} from 'fs-promise';
import {join} from 'path';
import {Builder} from 'broccoli';
import Babel from '../src';

describe('Babel broccoli plugin', () => {
  it('should transpile es6 files to es5', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {presets: 'es2015'});

    return (new Builder(nodes)).build().then(async() => {
      const fixturePath = join(nodes.outputPath, 'basic-compile.js');
      const fixture = await readFile(fixturePath, 'utf8');
      const expectsPath = join(__dirname, 'expects', 'basic-compile.js');
      const expectation = await readFile(expectsPath, 'utf8');

      expect(fixture).to.equal(expectation);
    });
  });

  it('should not transpile file with extensions differs from `.js`', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {presets: 'es2015'});

    return (new Builder(nodes)).build().then(() => {
      expect(() => {
        readFileSync(join(nodes.outputPath, 'basic-not-compile.html'), 'utf8');
      }).to.throw(Error);
    });
  });

  it('should take single node or multiple nodes', () => {
    expect(() => {
      new Babel([join(__dirname, 'fixtures'), join(__dirname, 'expects')]);
      new Babel(join(__dirname, 'fixtures'));
    }).to.not.throw(TypeError);
  });

  it('should remove broccoli plugin options from babel option list', () => {
    const babel = new Babel(join(__dirname, 'fixtures'), {
      persistentOutput: true
    });

    expect(babel.options.persistentOutput).to.be.undefined;
  });
});
