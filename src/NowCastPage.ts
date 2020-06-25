// AmCharts Imports
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Local imports
import { mapOfUKWidget } from "./mapOfUKWidget";
import { pieChartWidget } from "./pieChartWidget";
import { lineChartWidget } from "./lineChartWidget";
import { dm } from "./index";
import { jsdata } from "./index";


class NowCastPage  {

    constructor() {
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
        var dataForChart = [];
        //var selectedCounties = new Set();
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
        //let mapChart = ui.UKmap("mapchart", selectedCounties);

        //Deal With NowCast (NC) Widgets
        var mc = new mapOfUKWidget();
        let mapChart = mc.mapChart;
        let pieChartData = dm.getAgeData(jsdata, 100);
        var pc = new pieChartWidget("piechart", pieChartData, selectedAges);

    }// end initPage


} // end class NowCastPage


// Export
export { NowCastPage };
