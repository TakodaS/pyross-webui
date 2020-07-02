// AmCharts Imports
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";
//import am4themes_amchartsdark from "@amcharts/amcharts4/themes/amchartsdark";


am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_material);
//am4core.useTheme(am4themes_amchartsdark);

// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { lineChartWidget } from "./lineChartWidget";
import { DataClass } from "./DataClass";
import { dm } from "./index";
import { jsdata } from "./index";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class NowcastPage  {
    private mchart: any;
    private pchart: any;
    private lchart: any;
    
    constructor() {
        holdClassThisContext = this;
        this.initPage();
    };

    //////////////////////////////Public Interface////////////////////////////////////////
    // 
    //
    
    //
    //
    //////////////////////////////////////////////////////////////////////////////////////


    ///////////////////// Private Interface...not to be used by consumer
    initPage(): void {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        ////////////////////////////////////////////////////////////// 
        // Create containers 
        ////////////////////////////////////////////////////////////// 
        // let container = am4core.create(label, am4core.Container)
        // container.width = am4core.percent(100);
        // container.height = am4core.percent(100);
        // container.layout = "horizontal";
        // let UIcontainer = container.createChild(am4core.Container);
        // let UIwidth = 50;
        // UIcontainer.width = am4core.percent(UIwidth);
        // UIcontainer.height = am4core.percent(100);
        // let outputContainer = container.createChild(am4core.Container);
        // outputContainer.width = am4core.percent(100-UIwidth);
        // outputContainer.height = am4core.percent(100);

        //Create Nowcast (NC) Widgets
	    this.mchart = new mapOfUKWidget();
	    this.dclass = new DataClass(jsdata);

        //Fake pie slice data for testing piechart and linechart
        let fakeData = [{ ageRange: "children", value: 98681 }, { ageRange: "millennials", value: 200000 },
            { ageRange: "Gen Z", value: 309963 }, { ageRange: "Baby Boomer", value: 400000 },
            { ageRange: "Adults", value: 549963 },       ]
	fakeData = this.dclass.agesForPiechart;
        //let pieChartData = dm.getAgeData(jsdata, 100);
        let pieChartData = fakeData;
        let selectedAges: Set<string> = new Set();
        let selectedCounties: Set<string> = new Set();

        this.pchart = new pieChartWidget("piechart", pieChartData, selectedAges);
        this.lchart = new lineChartWidget("linechart", this.mchart, this.pchart, this.dclass);
        
        this.mchart.lineChartWidget = this.lchart;
        this.pchart.lineChartWidget = this.lchart;

    }// end initPage


} // end class NowcastPage


// Export
export { NowcastPage };
