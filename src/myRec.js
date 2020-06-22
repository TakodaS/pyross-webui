"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myRec = void 0;
//File myRec
class myRec {
    constructor(height, width) {
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
exports.myRec = myRec;
//export const myRec = MyFoo;
//export type myRec = MyFoo;
//# sourceMappingURL=myRec.js.map