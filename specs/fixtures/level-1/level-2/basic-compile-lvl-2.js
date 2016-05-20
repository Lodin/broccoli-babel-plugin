import {readFile} from 'fs';

class A {
  async b() {
    return await c();
  }

  async c() {
    return await doSomethingAsync();
  }
}