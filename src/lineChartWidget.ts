import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { DataClass } from "./DataClass";
import { dm } from "./index";
import { jsdata } from "./index";


//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class lineChartWidget {
	private _name: string;
	private mchart: mapOfUKWidget;
	private pchart: pieChartWidget;
	private dclass: DataClass;
	// private _selectedCounties: Set<string>;
	// private _selectedAges: Set<string>;
	private _lineChart: am4charts.XYChart;
	private cacheCounties: Set<string>;
	private cacheAges: Set<string>;
	private _data: any;



	//constructor(name: string, selectedCounties: Set<string>, selectedAges: Set<string>) {
	constructor(name: string, mchart: mapOfUKWidget, pchart: pieChartWidget, dclass: DataClass) {
		this._name = name;
		this.mchart = mchart;
		this.pchart = pchart;
		this.dclass = dclass;
		// this._selectedCounties = mchart.selectedCounties;
		// this._selectedAges = pchart.selectedAges;
		holdClassThisContext = this;
		this._lineChart = am4core.create("linechart", am4charts.XYChart);
		this.cacheCounties = new Set();
		this.cacheAges = new Set();
		this.initLineChart();
		//this.setEvents();
	};

	//////////////////////////////Public Interface////////////////////////////////////////
	// 
	//
	public get lineChart(): am4charts.XYChart {
		return this._lineChart;
	}
	//
	public get data(): any {
		return this._data;
	}
	public set data(value: any) {
		this._lineChart.data = this._data = value;
	}
	//
	public updateDataRequest() {
		//console.log("checking for changes");
		//	this.dclass.keys = ["GB-CM", "I", "Adults"];
		this.dclass.selectedAges = this.pchart.selectedAges;
		this.dclass.selectedCounties = this.mchart.selectedCounties;
		this._lineChart.data = this.dclass.data;

		this._lineChart.invalidateData();
	}
	//
	//
	//////////////////////////////////////////////////////////////////////////////////////


	///////////////////// Private Interface...not to be used by consumer

	initLineChart(): void {

		//this.lineChart = am4core.create("linechart", am4charts.XYChart);
		//lineChart.height = am4core.percent(25);
		this._lineChart.responsive.enabled = true;
		this._lineChart.height = 250
		this._lineChart.width = am4core.percent(100);
		this._lineChart.fontSize = "0.8em";
		this._lineChart.paddingRight = 30;
		this._lineChart.paddingLeft = 30;
		this._lineChart.maskBullets = false;
		this._lineChart.zoomOutButton.disabled = true;
		this._lineChart.paddingBottom = 0;
		this._lineChart.paddingTop = 10;

		// let title = this._lineChart.titles.push(new am4core.Label());
		// title.text = "Fake COVID-19 cases";
		// title.marginBottom = 15;
		//Put title directly on chart to save space /////////////////////////////
		let lclabel = this._lineChart.createChild(am4core.Label);
		lclabel.text = "Pyross Inference";
		lclabel.fontSize = 20;
		lclabel.align = "above";
		lclabel.isMeasured = false;
		lclabel.x = am4core.percent(50);
		lclabel.horizontalCenter = "middle";
		lclabel.y = 0;

		let xAxis = this._lineChart.xAxes.push(new am4charts.ValueAxis());
		xAxis.renderer.minGridDistance = 40;
		xAxis.title.text = "time/Days"

		// Create value axis
		let yAxis = this._lineChart.yAxes.push(new am4charts.ValueAxis());
		yAxis.title.text = "% of population"
		var seriesList = [];
		let classes = this.dclass.classes;
		console.log(classes.length);
		for (let i = 0; i < classes.length; i++) {
			console.log(i, " being pushed");
			var series = this._lineChart.series.push(new am4charts.LineSeries());
			seriesList.push(series);
			seriesList[i].dataFields.valueX = "t";
			seriesList[i].dataFields.valueY = classes[i];
			seriesList[i].name = classes[i];
			console.log(seriesList);
		}
	

this._lineChart.legend = new am4charts.Legend();


	}// end initLineChart

}// end class lineChartWidget


// Export
export { lineChartWidget };

