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
