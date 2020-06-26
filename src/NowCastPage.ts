// AmCharts Imports
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { lineChartWidget } from "./lineChartWidget";
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

        //Fake pie slice data for testing piechart and linechart
        let pieChartData = dm.getAgeData(jsdata, 100);
        let selectedAges: Set<string> = new Set(["children"]);
        let selectedCounties: Set<string> = new Set();

        this.pchart = new pieChartWidget("piechart", pieChartData, selectedAges);
        this.lchart = new lineChartWidget("linechart", this.mchart, this.pchart );
        
        this.mchart.lineChartWidget = this.lchart;
        this.pchart.lineChartWidget = this.lchart;

    }// end initPage


} // end class NowcastPage


// Export
export { NowcastPage };
