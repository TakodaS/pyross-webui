
//export * as am4core from "./amchartsCOREdeuglified.js";

export * as jsdata from './data/UK.json';
export * as dm from './dataMap';
export * as utils from './utils';
export * as ui from './UIwidgets';


import { NowcastPage } from "./NowcastPage";
let ncPage = new NowcastPage();


//Class trials
import { myRec } from "./myRec";
var r1 = new myRec(2, 10);
var v1 = r1.area;
console.log("my rectangle is:", v1)



