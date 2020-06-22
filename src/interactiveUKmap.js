"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChart = void 0;
/* Imports */
const am4core = __importStar(require("@amcharts/amcharts4/core"));
const am4charts = __importStar(require("@amcharts/amcharts4/charts"));
const animated_1 = __importDefault(require("@amcharts/amcharts4/themes/animated"));
const jsdata = __importStar(require("./data/UK.json"));
const dm = __importStar(require("./dataMap"));
const utils = __importStar(require("./utils"));
const ui = __importStar(require("./UIwidgets"));
const UIWidgets_ts_1 = __importDefault(require("./UIWidgets.ts"));
var rec = new UIWidgets_ts_1.default(2, 3);
console.log("in index.ts rectangle width is:", rec.calcArea());
function makeChart(label) {
    // Themes begin
    am4core.useTheme(animated_1.default);
    // Themes end
    var dataForChart = [];
    var selectedCounties = new Set();
    var selectedAges = new Set(["children"]);
    //selectedAges.add("children");
    var cacheCounties = new Set();
    var cacheAges = new Set();
    ////////////////////////////////////////////////////////////// 
    // Create containers 
    ////////////////////////////////////////////////////////////// 
    //let container = am4core.create(label, am4core.Container)
    //container.width = am4core.percent(100);
    //container.height = am4core.percent(100);
    //container.layout = "horizontal";
    //let UIcontainer = container.createChild(am4core.Container);
    //let UIwidth = 50;
    //UIcontainer.width = am4core.percent(UIwidth);
    //UIcontainer.height = am4core.percent(100);
    //let outputContainer = container.createChild(am4core.Container);
    //outputContainer.width = am4core.percent(100-UIwidth);
    //outputContainer.height = am4core.percent(100);
    ////////////////////////////////////////////////////
    //UUI charts
    let mapChart = ui.UKmap("mapchart", selectedCounties);
    let pieChart = ui.pieChart("piechart", selectedAges);
    pieChart.data = dm.getAgeData(jsdata, 100);
    ///////////////////////////////////////////////////////////////////////
    //Output charts
    //////////////////////////////////////////////////////////////////////
    let lineChart = am4core.create("linechart", am4charts.XYChart);
    //lineChart.height = am4core.percent(25);
    lineChart.responsive.enabled = true;
    lineChart.height = 250;
    lineChart.width = am4core.percent(100);
    lineChart.fontSize = "0.8em";
    lineChart.paddingRight = 30;
    lineChart.paddingLeft = 30;
    lineChart.maskBullets = false;
    lineChart.zoomOutButton.disabled = true;
    lineChart.paddingBottom = 5;
    lineChart.paddingTop = 3;
    let title = lineChart.titles.push(new am4core.Label());
    title.text = "Fake COVID-19 cases";
    title.marginBottom = 15;
    let xAxis = lineChart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.minGridDistance = 40;
    // Create value axis
    let yAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
    lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), ["all"]);
    var series1 = lineChart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueX = "x";
    series1.dataFields.valueY = "y";
    //////////////////////////////////////////////////
    //Events
    ////////////////////////////////////////////////////
    setInterval(function () {
        //console.log("checking for changes");
        if (!(utils.eqSet(cacheCounties, selectedCounties)) &&
            utils.eqSet(cacheAges, selectedAges)) {
            //console.log("difference detected");
            lineChart.data = dm.convertData(jsdata, "t", "S", Array.from(selectedAges), Array.from(selectedCounties));
            lineChart.invalidateData();
            cacheAges = new Set(selectedAges);
            cacheCounties = new Set(selectedCounties);
        }
    }, 300);
    // Add or subtract slices value from total value
}
exports.makeChart = makeChart;
;
//# sourceMappingURL=interactiveUKmap.js.map