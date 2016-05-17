import {expect} from 'chai';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Builder} from 'broccoli';
import Babel from '../src';

describe('Babel broccoli plugin', () => {
  it('should transpile es6 files to es5', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {presets: 'es2015'});

    return (new Builder(nodes)).build().then(() => {
      const fixture = readFileSync(join(nodes.outputPath, 'basic-compile.js'), 'utf8');
      const expectation = readFileSync(join(__dirname, 'expects', 'basic-compile.js'), 'utf8');

      expect(fixture).to.equal(expectation);
    });
  });

  it('should not transpile file with extensions differs from `.js`', () => {
    const nodes = new Babel(join(__dirname, 'fixtures'), {presets: 'es2015'});

    return (new Builder(nodes)).build().then(() => {
      expect(() => {
        readFileSync(join(nodes.outputPath, 'basic-not-compile.html'), 'utf8')
      }).to.throw(Error);
    });
  });

  it('should take single node or multiple nodes', () => {
    expect(() => {
      new Babel([join(__dirname, 'fixtures'), join(__dirname, 'expects')]);
      new Babel(join(__dirname, 'fixtures'));
    }).to.not.throw(TypeError);
  });
});