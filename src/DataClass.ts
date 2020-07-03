import { dm } from "./index";
var jsonQ = require("jsonq");
var math = require('mathjs');
import { utils } from './index';

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class DataClass {
	private _indict: Dictionary<any>;
	private _data: Dictionary<any>;
	private _classes: List<any>;
	private _t: List<number>;
	private _selectedAges: List<any>;
	private _selectedCounties: List<string>;
	private _ages: List<any>;
	private _counties: List<any>;
	private _formattedData: List<Dictionary>;
	private _filteredData: Dictionary<any>;
	private _jqdata: Dictionary<any>;
	private _combinedData: Dictionary<any>;


	constructor(data: any) {
		holdClassThisContext = this;
		//var request = new XMLHttpRequest();
		//request.open("GET", data, false);
		//request.send(null)
		//this._data = JSON.parse(JSON.stringify(request.responseText));
		this._indict = data;
		this._data = this._indict.data;
		this._ages = this._indict.ages;
		this._classes = this._indict.classes;
		this._counties = this._indict.counties;
		this._jqdata = jsonQ(this._data);
	};


	//////////////////////////////Public Interface////////////////////////////////////////

	public get ages() {
		return this._ages;
	}

	public get agesForPiechart() {
		let outList: List<any> = [];
		for (let age of this.ages) {
			outList.push({ ageRange: age, value: 1 });
		}
		return outList;
	}

	public get selectedAges() {
		return Array.from(this._selectedAges);
	}

	public get classes() {
		return this._classes;
	}

	public set selectedAges(ages: List<any>) {
		this._selectedAges = ages;
	}

	public get counties() {
		return this._counties;
	}

	public get selectedCounties() {
		return this._selectedCounties;
	}

	public set selectedCounties(counties: List<string>) {
		this._selectedCounties = counties;
	}

	public get data() {
		this.getAvailableCounties();
		this.getAvailableAges();
		this.filterData();
		this.combineData();
		this.convertData();
		return this._formattedData;
	}

	public get formattedData() {
		return this._formattedData;
	}

	//////////////////////////////////////////////////////////////////////////////////////


	///////////////////// Private Interface...not to be used by consumer

	private function filterData() {
		/* Filters data based on age and county */
		let outdict: Dictionary<any> = {};
		if (this.selectedCounties.length > 0 && this.selectedAges > 0) {
			for (let county of this.selectedCounties) {
				outdict[county] = {};
				for (let age of this.selectedAges) {
					outdict[county][age] = this._jqdata.find(county).find(age).value();
				}
			}
		}
		else if (this.selectedCounties.length === 0) {
			for (let age of this.selectedAges) {
				outdict[age] = this._jqdata.find(age).value();
			}

		}
		else if (this.selectedAges.length === 0) {
			for (let county of this.selectedCounties) {
				outdict[county] = this._jqdata.find(county).value();
			}

		}
		else {
			console.log("nothing selected");
		}
		this._filteredData = outdict;
	}

	private function getAvailableCounties() {
		if (this.counties.length === 0) {
			return
		}
		if (this.selectedCounties === ["all"]) {
			this.selectedCounties = this._counties;
		}
		else {
			let intersectCounties: List<string>;
			intersectCounties = jsonQ.intersection(this.counties, this.selectedCounties);
			this.selectedCounties = intersectCounties
		}
	}

	private function getAvailableAges() {
		if (this.ages.length === 0) {
			return
		}
		if (this._selectedAges === ["all"]) {
			this._selectedAges = this.ages;
		}
		else {
			let intersectAges: List<string>;
			intersectAges = jsonQ.intersection(this.ages, this.selectedAges);
			this.selectedAges = intersectAges;
		}
	}

	private function combineData(): void {
		let jqdat = jsonQ(this._filteredData);
		let cDat;
		let outDict = {'t': jqdat.find('t').value().reduce(
			(r, a) => r))};

		//	let tDat = jqdat.find("t").value()[0];
		//	let tDalet outDict = {"t": tDat};
		//console.log(tDat);
		for (let cls of this._classes) {
			cDat = jqdat.find(cls).value().reduce(
				(r, a) => r.map((b, i) => a[i] + b), math.zeros([10]));
			outDict[cls] = cDat;
		}
		this._combinedData = outDict;
	}

	private function convertData() {
	/*converts data to useable format by am4charts*/
		let cm = this._combinedData;
		let dataForChart = [];
		let dataPoint;
		let tScaled;
		if ('t' in cm){
			for (let i = 0; i < cm['t'].length; i++) {
				dataPoint = {};
				for (let key in cm) {
					dataPoint[key] = cm[key][i];
					if (key === 't'){
						dataPoint[key] *=10;
					}
				}

				//tScaled = cm['t'][i];
				//dataPoint['t']=tScaled;
				dataForChart.push(dataPoint);

			}
		}
			this._formattedData = dataForChart;
	}
}
// Export
export { DataClass };
