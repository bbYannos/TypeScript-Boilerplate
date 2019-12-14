// @ref: https://mariusschulz.com/blog/conditional-types-in-typescript
// @ref: https://stackoverflow.com/questions/59314895/type-to-represent-parent-having-keys-of-certain-type/59315273#59315273
/*
export type KeyOfValueTypeForReading<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T];

type KeyOfValueTypeForWriting<T, U> = {
  [K in keyof T]: [U] extends [T[K]] ? K : never
}[keyof T];

class ChildClass {
  public name: string;
}

class ParentClass {
  public child: ChildClass;
}

class GenericSetter<T, U> {
  public propName: KeyOfValueTypeForWriting<T, U>; // No Error
  public setProp(parent: T, child: U) {
    parent[this.propName] = child;
  }
}

const oops = new GenericSetter<{ a: string }, string | number>();
oops.propName = "a";
const myParent = { a: "bar" };
oops.setProp(myParent, 123);
 */
