import path from 'path';
import {readFile, readFileSync} from 'fs-promise';
import {Builder} from 'broccoli';
import Babel from '../src';
import babelrc from './expects/babelrc';

const fixturesPath = path.join(__dirname, 'fixtures');
const expectsPath = path.join(__dirname, 'expects');

describe('Babel broccoli plugin', () => {
  it('should transpile es6 files to es5', done => {
    const nodes = new Babel(fixturesPath, {
      presets: ['es2015', 'stage-0']
    });

    return (new Builder(nodes)).build().then(async() => {
      const fixturePath = path.join(nodes.outputPath, 'basic-compile.js');
      const fixture = await readFile(fixturePath, 'utf8');
      const expectPath = path.join(expectsPath, 'basic-compile.js');
      const expectation = await readFile(expectPath, 'utf8');

      expect(fixture).toEqual(expectation);
      done();
    });
  });

  it('should work with inner folders', done => {
    const nodes = new Babel(fixturesPath, {
      presets: ['es2015', 'stage-0']
    });

    return (new Builder(nodes)).build().then(async() => {
      const fxPathLvl1 = path.join(nodes.outputPath, 'level-1',
          'basic-compile-lvl-1.js');
      const fxPathLvl2 = path.join(nodes.outputPath, 'level-1', 'level-2',
          'basic-compile-lvl-2.js');
      const fxLvl1 = await readFile(fxPathLvl1, 'utf8');
      const fxLvl2 = await readFile(fxPathLvl2, 'utf8');
      const exPathLvl1 = path.join(expectsPath, 'level-1',
          'basic-compile-lvl-1.js');
      const exPathLvl2 = path.join(expectsPath, 'level-1', 'level-2',
          'basic-compile-lvl-2.js');

      const exLvl1 = await readFile(exPathLvl1, 'utf8');
      const exLvl2 = await readFile(exPathLvl2, 'utf8');

      expect(fxLvl1).toEqual(exLvl1);
      expect(fxLvl2).toEqual(exLvl2);
      done();
    });
  });

  it('should not transpile file with extensions differs from `.js`', done => {
    const nodes = new Babel(fixturesPath, {
      presets: ['es2015', 'stage-0']
    });

    return (new Builder(nodes)).build().then(() => {
      expect(() => {
        readFileSync(
            path.join(nodes.outputPath, 'basic-not-compile.html'),
            'utf8'
        );
      }).toThrow();
      done();
    });
  });

  it('should take single node or multiple nodes', () => {
    expect(() => {
      new Babel([fixturesPath, expectsPath]);
      new Babel(fixturesPath);
    }).not.toThrow();
  });

  it('should remove broccoli plugin options from babel option list', () => {
    const babel = new Babel(fixturesPath, {persistentOutput: true});
    expect(babel.options.persistentOutput).toBeUndefined();
  });

  it('should read `.babelrc` file if no options provided', () => {
    const babel = new Babel(fixturesPath);
    expect(babel.options).toEqual(babelrc);
  });
});
