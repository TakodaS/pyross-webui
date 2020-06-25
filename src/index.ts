import * as UKmap from "./interactiveUKmap.ts";
//import * as am4core from "@amcharts/amcharts4/core";
// import * as am4maps from "@amcharts/amcharts4/maps";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
// import * as dm from "./dataMap";
// import * as utils from "./utils";

//export * as am4core from "@amcharts/amcharts4/core";
// export * as am4maps from "@amcharts/amcharts4/maps";
// export * as am4charts from "@amcharts/amcharts4/charts";
// export { am4themes_animated } from "@amcharts/amcharts4/themes/animated";
// export am4geodata_ukCountiesHigh from "@amcharts/amcharts4-geodata/ukCountiesHigh";
// export * as dm from "./dataMap";
// export * as utils from "./utils";

export * as jsdata from './data/UK.json';
export * as dm from './dataMap';
export * as utils from './utils';
export * as ui from './UIwidgets';


//UKmap.makeChart("chartdiv")   //interactiveUKMaps.ts
//UKmap.interactivePlot("chartdiv")

import { NowcastPage } from "./NowcastPage";
let ncPage = new NowcastPage();


//Class trials
import { myRec } from "./myRec";
var r1 = new myRec(2, 10);
var v1 = r1.area;
console.log("myrec2 is Austen:", v1)



