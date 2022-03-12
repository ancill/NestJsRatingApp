type ActionType = 'up' | 'down';

function perfomAction(action: ActionType | ComplexAction) {
  switch (action) {
    case 'down':
      return -1;
    case 'up':
      return 1;
  }
}
interface ComplexAction {
  s: string;
}

class Point {
  private x!: number;
  readonly y!: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  protected all() {}
}

const point = new Point(3, 5);

class D3Point extends Point {
  z: number;
  constructor(x: number, y: number, z: number) {
    super(x, y);
    this.z = z;
    this.all = () => console.log(this.y); // by protected
  }
}

class StaticTest {
  static c = 'sdf';
}
const d = StaticTest.c;

abstract class Test3 {
  myMethod() {}
}

class Test4 extends Test3 {}

enum Dice {
  One = 1,
  Two,
  Tree,
}
function ruDice(dice: Dice) {
  switch (dice) {
    case Dice.One:
      return 'Один';
    case Dice.Two:
      return 'Два';
    case Dice.Tree:
      return 'Три';
    default:
      const a: never = dice;
  }
}

function logTime<T>(num: T): T {
  if (typeof num == 'string') num.toLocaleUpperCase();
  console.log(new Date());
  return num;
}
logTime<string>('hello');

interface MyInterface {
  transform: <T, F>(a: T) => F;
}
class MyGenClass<F> {
  value!: F;
}

interface TimeStamp {
  stamp: number;
}
function logTimeStamp<T extends TimeStamp>(num: T): T {
  console.log(num.stamp);
  return num;
}
