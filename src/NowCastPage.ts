// AmCharts Imports
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { lineChartWidget } from "./lineChartWidget";
import { dm } from "./index";
import { jsdata } from "./index";
import { MapChart } from "@amcharts/amcharts4/maps";


//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any;


class NowCastPage  {
    private mchart: any;
    private pchart: any;
    private lchart: any;
    

    constructor() {
        holdClassThisContext = this;
        this.initPage();
        this.setEvents();
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
        //

        //Create NowCast (NC) Widgets
        this.mchart = new mapOfUKWidget();

        //Fake pie slice data for testing piechart and linechart
        let pieChartData = dm.getAgeData(jsdata, 100);
        let selectedAges: Set<string> = new Set(["children"]);
        let selectedCounties: Set<number> = new Set();

        this.pchart = new pieChartWidget("piechart", pieChartData, selectedAges);
        this.lchart = new lineChartWidget("linechart", selectedCounties, selectedAges);
        


    }// end initPage

    setEvents(): void {

        // Add or subtract slices value from total value

        setInterval(function() {
            //console.log("checking for changes");
            if ( holdClassThisContext.mchart.hitFlag || holdClassThisContext.pchart.hitFlag) {  //data has changed
                //console.log("difference detected");
                holdClassThisContext.lchart.data = dm.convertData(jsdata, "t", "S",
                    Array.from(holdClassThisContext.pchart.selectedAges), Array.from(holdClassThisContext.mchart.selectedCounties));
                holdClassThisContext.lineChart.invalidateData();
            }

        }, 10000);
    }// end setEvents

} // end class NowCastPage


// Export
export { NowCastPage };
