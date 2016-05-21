import {expect} from 'chai';
import {readFile, readFileSync} from 'fs-promise';
import {join} from 'path';
import {Builder} from 'broccoli';
import Babel from '../src';
import babelrc from './expects/babelrc';

describe('Babel broccoli plugin', () => {
  it('should transpile es6 files to es5', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {
      presets: ['es2015', 'stage-0']
    });

    return (new Builder(nodes)).build().then(async() => {
      const fixturePath = join(nodes.outputPath, 'basic-compile.js');
      const fixture = await readFile(fixturePath, 'utf8');
      const expectsPath = join(__dirname, 'expects', 'basic-compile.js');
      const expectation = await readFile(expectsPath, 'utf8');

      expect(fixture).to.equal(expectation);
    });
  });

  it('should work with inner folders', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {
      presets: ['es2015', 'stage-0']
    });

    return (new Builder(nodes)).build().then(async() => {
      const fxPathLvl1 = join(nodes.outputPath, 'level-1',
          'basic-compile-lvl-1.js');
      const fxPathLvl2 = join(nodes.outputPath, 'level-1', 'level-2',
          'basic-compile-lvl-2.js');
      const fxLvl1 = await readFile(fxPathLvl1, 'utf8');
      const fxLvl2 = await readFile(fxPathLvl2, 'utf8');
      const exPathLvl1 = join(__dirname, 'expects', 'level-1',
          'basic-compile-lvl-1.js');
      const exPathLvl2 = join(__dirname, 'expects', 'level-1', 'level-2',
          'basic-compile-lvl-2.js');

      const exLvl1 = await readFile(exPathLvl1, 'utf8');
      const exLvl2 = await readFile(exPathLvl2, 'utf8');

      expect(fxLvl1).to.equal(exLvl1);
      expect(fxLvl2).to.equal(exLvl2);
    });
  });

  it('should not transpile file with extensions differs from `.js`', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {
      presets: ['es2015', 'stage-0']
    });

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
  
  it('should read `.babelrc` file if no options provided', () => {
    const babel = new Babel(join(__dirname, 'fixtures'));
    expect(babel.options).to.deep.equal(babelrc);
  });
});
