class A {
  static b = 1;
  static s = 'test';

  static c() {
    return A.b;
  }

  d() {
    return A.b;
  }
}

class B extends A {
  constructor() {
    super();
  }

  d() {
    return A.b + 1;
  }
}