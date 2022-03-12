type Point = { x: number; y: number };
type P = keyof Point;
function MyF() {
  return { a: 1 };
}
type K = ReturnType<typeof MyF>;

const MyArray = [{ name: 'Vasya', age: 30 }];
type Person = typeof MyArray[number]['age'];

type MessageOf<T> = T extends { message: unknown } ? T['message'] : never;
interface Email {
  message: string;
}

interface Cat {
  test: number;
}

type EmailMessageContents = MessageOf<Email>;
type CatMessageContents = MessageOf<Cat>;

type OptionFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type world = 'world';
type Greeting = `hello ${world}`;
