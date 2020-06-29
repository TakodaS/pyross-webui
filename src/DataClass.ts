import { dm } from "./index";
var jsonQ = require("jsonq");
var math = require('mathjs');
import { utils } from './index';

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class DataClass {
	private _data: Dictionary<any>;
	private _ages: List<any>;
	private _counties: List<string>;


	constructor(data: any) {
		holdClassThisContext = this;
		//var request = new XMLHttpRequest();
		//request.open("GET", data, false);
		//request.send(null)
		//this._data = JSON.parse(JSON.stringify(request.responseText));
		this._data = jsonQ(data);
	};



	public get ages() {
		return this._ages;
	}

	public set ages(ages: List<any>) {
		this._ages = ages;
	}

	public get counties() {
		return this._counties;
	}

	public set counties(counties: List<string>){
		this._counties = counties;
	}

	public returnData(xval: String, yval: String){
		return this.convertData(xval, yval):
	}



	private searchPath(keys: List<any>) {
		/* makes a superset of the keys and permutes each one, 
		 * searching from the deepest entry
		 * to the shallowest. If it finds nothing, then uses
		 * jsonQ.find of the last value */
		let permPowerSet: List<any> = utils.permPowerSet(keys);
		let pathval: List<any>;
		for (let item of permPowerSet){
			try {
				pathval = this._data.pathValue(item);
				if (Array.isArray(pathval)){
					return pathval
				}
			}
			catch (e: TypeError) {
				console.log(item, "not on path");
			}
		}
		console.warn("data not found on path, trying find method")
		for  (let key of this._keys){
			return this._data.find(key).value();
		}
	}


	private function combinedData(xval: String, yval: String){
		let pth, xpth, ypth: List<any>;
		let xvals, yvals;
		let xout = [];
		let yout = [];
		for (var county of this._counties){
			for (var age of this._ages){
				pth = [county, age];
				try {
					xpth = [county,  xval];
					ypth = [county, age, yval];
					xvals = this.searchPath(xpth);
					yvals = this.searchPath(ypth);
				}
				catch (e: TypeError) {
					console.log(pth, " is not implemented");
				}
				xout = jsonQ.union(xout, xvals);
				try {
				yout = math.add(yout, yvals);
				}
				catch (e:RangeError) {
					yout = yvals;
				}
			}
		}
		return [xout, yout];
	}

	private function convertData(xval, yval){
		var dataForChart = [];
		var data = this.combinedData(xval, yval);
		var xvals = data[0];
		var yvals = data[1];
		for (var i=0; i<xvals.length; i++){
			dataForChart.push({"x": xvals[i],
				"y": yvals[i]}
		}
		return dataForChart;
	}

	// Export
	export { DataClass };
