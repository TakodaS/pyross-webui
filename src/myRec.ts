//File myRec
class myRec {
  height: number;
  width: number;

  constructor(height:number, width:number) {
    this.height = height + 10;
    this.width = width;
  }
  // Getter
  get area() {
    return this.calcArea();
  }
  // Method
  calcArea() {
    return this.height * this.width;
  }
}

// Export the named class directly
export { myRec };
//export const myRec = MyFoo;
//export type myRec = MyFoo;
