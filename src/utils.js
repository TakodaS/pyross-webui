"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arraysEqual = exports.eqSet = void 0;
//Utilities for the webpage
function eqSet(as, bs) {
    if (as.size !== bs.size)
        return false;
    for (var a of as)
        if (!bs.has(a))
            return false;
    return true;
}
exports.eqSet = eqSet;
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length != b.length)
        return false;
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.arraysEqual = arraysEqual;
//# sourceMappingURL=utils.js.map