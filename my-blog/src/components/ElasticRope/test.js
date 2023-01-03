// console.log(foo)
// var foo = () => {}
class Foo {
  get bar() {
    console.log(1);
  }
  set bar(v) {
    console.log(v);
  }
}
const foo = new Foo();
foo.bar;
foo.bar = 6;
// foo.apply(undefined, args);
console.log(Boolean(0))
