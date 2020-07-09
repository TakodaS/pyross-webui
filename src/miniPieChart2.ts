import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import { pieChartWidget } from "./pieChartWidget"

// Local imports
//import { pieChartWidget } from "./pieChartWidget";

//The following alias is needed as the context of "this" within the event handlers is "undefined"!
var holdClassThisContext: any
var firstOver = true

class miniPieChart2 {
  private name: string
  private bigPieChartWidget: any

  private _pieChartData: any
  // private _selectedAges: Set<string>;
  private _pieChart: am4charts.PieChart
  private series: am4charts.PieSeries
  private smallPieTemplate: any
  private _data: any
  private inactiveColor: any
  private activeColor: any
  

  constructor(name: string, bigPieChartWidget: pieChartWidget) {
    this.name = name
    // this._pieChartData = pieChartData;
    // this.selectedAges = selectedAges;
    this.bigPieChartWidget = bigPieChartWidget
    this._pieChartData = bigPieChartWidget.pieChartData
    this.inactiveColor = bigPieChartWidget.inactiveColor
    this.activeColor = bigPieChartWidget.activeColor
    holdClassThisContext = this
    this.initPieChart()
    this.setEvents()
  }

  //////////////////////////////Public Interface////////////////////////////////////////
  //
  //
  //
  //   public get pieChart(): am4charts.PieChart {
  //     return this._pieChart
  //   }
  //
  //
  // Called from BIG Pie Chart (if all slices are the same), this changes the active status of the Mini Charts's slices
  public setMiniChartActiveInactive(activeFlag: number) {
    //0 = allInactive  1 = allActive
    //console.log("MINI from BIG setMINICHartActiveInactive....activeFlag:", activeFlag, "miniChartColor=", this.getSmallPieColor())
    if (activeFlag === 0 && this.getSmallPieColor() == this.inactiveColor) {
      this.setSmallPieColor(this.activeColor)
      //this.MINIsetAliasActiveInactive(1);
    } else if (
      activeFlag === 1 &&
      this.getSmallPieColor() == this.activeColor
    ) {
      this.setSmallPieColor(this.inactiveColor)
      //this.MINIsetAliasActiveInactive(0);
    }
  }
  //
  //////////////////////////////////////////////////////////////////////////////////////

  ///////////////////// Private Interface...not to be used by consumer

  private initPieChart(): void {
    this._pieChart = am4core.create(this.name, am4charts.PieChart)
    this._pieChart.data = this._pieChartData
    this._pieChart.hiddenState.properties.opacity = 0 // this creates initial fade-in
    this._pieChart.radius = am4core.percent(50)
    this._pieChart.innerRadius = am4core.percent(0)
    //this._pieChart.x = am4core.percent(-5);

    //console.log(
      "this BIG piechart is",
      this,
      "\nbigPieChart is",
      this.bigPieChartWidget
    )
    // Add and configure Series
    this.series = this._pieChart.series.push(new am4charts.PieSeries())
    this.series.dataFields.value = "value"
    //this.series.dataFields.radiusValue = "value";
    this.series.dataFields.category = "ageRange"

    this.series.ticks.template.disabled = true
    this.series.labels.template.disabled = true

    // This creates initial animation
    this.series.hiddenState.properties.opacity = 1
    this.series.hiddenState.properties.endAngle = -90
    this.series.hiddenState.properties.startAngle = -90

    this.smallPieTemplate = this.series.slices.template
    this.smallPieTemplate.cornerRadius = 3
    this.smallPieTemplate.fill = this.activeColor
    this.smallPieTemplate.fillOpacity = 1
    this.smallPieTemplate.stroke = am4core.color("white")
    this.smallPieTemplate.strokeWidth = 0.5

    // this.series.slices.template.strokeWidth = 0;
    //this.series.slices.template.stroke = am4core.color("white");
    //this.series.slices.template.tooltipText = "{ageRange}:{value}";
    this.smallPieTemplate.tooltipText = ""
    //this allows template properties to propogate after initialization!!!
    this.smallPieTemplate.applyOnClones = true

    //let omg3 = this.series.slices.template.states.create("hoverActive");
    //omg3.properties.shiftRadius = 0;
    // omg3.properties.shiftRadius = 0.1;
    // omg3.properties.scale = 1.05;
    //omg3.properties.fillOpacity = 0.6;
    //omg3.properties.fill = this.activeColor;
    //omg.properties.stroke = this.highlightStrokeColor;
    //omg.properties.strokeWidth = 0;

    let ds = this.series.slices.template.states.create("aliasInactive")
    ds.properties.fill = this.inactiveColor
    ds.properties.fillOpacity = 1
    ds.properties.shiftRadius = 0
    ds.properties.scale = 1
    ds.properties.stroke = am4core.color("white")
    ds.properties.strokeWidth = 0.5

    let as = this.series.slices.template.states.create("aliasActive")
    as.properties.fill = this.activeColor
    as.properties.fillOpacity = 1
    as.properties.shiftRadius = 0
    as.properties.scale = 1
    as.properties.stroke = am4core.color("white")
    as.properties.strokeWidth = 0.5

    //Give the handle of this mini wiget to the Big Pie Chart widget
    this.bigPieChartWidget.miniChart = this
    //this.series.hoverable = false;
    //this.series.togglable = false;

    //Disable default hover and activeHover effects
    this.smallPieTemplate.states.getKey("hover").properties.scale = 1;
    this.smallPieTemplate.states.getKey("active").properties.shiftRadius = 0;
    // this.unsetDefaultHoverState();
    // this.unsetDefaultHoverActiveState();
    //console.log("pie series template", this.smallPieTemplate)

  } // end initPieChart



  // private unsetDefaultHoverState():void {
  //   // Override some state properties on slice and its label
  //   let slicesTemplate = this.series.slices.template
  //   if (slicesTemplate.states.hasKey("hover")) {
  //     /* "hover" state already exists; use getKey() to retrieve it */
  //     this.hoverState = slicesTemplate.states.getKey("hover")
  //   } else {
  //     /* "hover" state has not yet been created, create it */
  //     this.hoverState = slicesTemplate.states.create("hover")
  //   }
  //   this.hoverState.properties.fillOpacity = 1
  //   this.hoverState.properties.shiftRadius = 0
  //   this.hoverState.properties.scale = 1
    // if ((num = 0)) {
    //   this.hoverState.properties.fill = this.inactiveColor
    // } else {
    //   this.hoverState.properties.fill = this.activeColor
    // }
    //console.log("in unsetDefaultHoverState", this.hoverState.properties.fill)
  //} // end unsetDefaultHoverState

  // private unsetDefaultHoverActiveState():void {
  //   // Override some state properties on slice and its label
  //   let slicesTemplate = this.series.slices.template
  //   if (slicesTemplate.states.hasKey("hoverActive")) {
  //     /* "hover" state already exists; use getKey() to retrieve it */
  //     this.hoverActiveState = slicesTemplate.states.getKey("hoverActive")
  //   } else {
  //     /* "hover" state has not yet been created, create it */
  //     this.hoverActiveState = slicesTemplate.states.create("hoverActive")
  //   }
  //   this.hoverActiveState.properties.fillOpacity = 1
  //   this.hoverActiveState.properties.shiftRadius = 0
  //   this.hoverActiveState.properties.scale = 1
  //   // if ((num = 0)) {
  //   //   this.hoverActiveState.properties.fill = this.inactiveColor
  //   // } else {
  //   //   this.hoverActiveState.properties.fill = this.activeColor
  //   // }
  //   //console.log("in unsetDefaultHoverActiveState", this.hoverActiveState.properties.fill)
  // } // end unsetDefaultHoverActiveState


  private checkActive() {
    let allActive = true
    let allInactive = true
    this.series.slices.each(function (slice) {
      if (slice.isActive) {
        allInactive = false
      }
      if (!slice.isActive) {
        allActive = false
      }
    })
    //console.log( "in checkActive......allActive?",allActive,all Inactive?",allInactive)
  } // end checkActive

  //num = 0 is default color, num = 1 is active color
  private MINIchartSetAllSliceActiveOrInactive(num: number) {
    //this.series.slices.template.isActive = false;
    this.series.slices.each(function (slice) {
      if (num == 0) {
        slice.isActive = false
      } else {
        slice.isActive = true
      }
    })
  } // end MINIchartSetAllSliceActiveOrInactive

  private MINIsetAliasActiveInactive(num: number) {
    this.series.slices.each(function (slice) {
      if (num == 0) {
        slice.setState("aliasInactive");
      } else if (num == 1) {
        slice.setState("aliasActive");
      }
    }
  }

  private setSmallPieColor(smcolor: am4core.Color): void {
    if (smcolor == this.inactiveColor) {
      this.smallPieTemplate.fill = this.inactiveColor
    } else if (smcolor == this.activeColor) {
      this.smallPieTemplate.fill = this.activeColor
    }
  }

  private getSmallPieColor(): am4core.Color {
    if (this.smallPieTemplate.fill == this.inactiveColor) {
      return this.inactiveColor
    } else {
      return this.activeColor
    }
  }

  //////////////////////////////////////////////////
  //Events
  ////////////////////////////////////////////////////

  private setEvents(): void {


    // Set active status (and therefore color) of the BIG PIE to be the same as small pie.
    this.series.slices.template.events.on("hit", function (ev) {
      //console.log("slices", holdClassThisContext.series.slices)
      if (
        holdClassThisContext.getSmallPieColor() ==
        holdClassThisContext.activeColor
      ) {
        //make all BIG chart slices active
        holdClassThisContext.bigPieChartWidget.BIGchartSetAllSliceActiveOrInactive(
          1
        )
      } else {
        //make all  inative
        holdClassThisContext.bigPieChartWidget.BIGchartSetAllSliceActiveOrInactive(
          0
        )
      }
    }) //end hit small pie

    // Hover has complicated hidden behaviours so use a simple custom alias states (only changes colour)
    this.series.slices.template.events.on("over", function (ev) {
      let slice = ev.target
      let smcolor = holdClassThisContext.getSmallPieColor()
      //slice.setState("hoverState");
      //console.log("small Pie over smcolor = ", smcolor);
      if (smcolor == holdClassThisContext.inactiveColor) {
        //console.log("small Pie over inactive smcolor = ", smcolor)
        //holdClassThisContext.bigPieChartWidget.setAllSliceHover(0)
        holdClassThisContext.bigPieChartWidget.setAliasActiveOrInactive(0)
        holdClassThisContext.MINIsetAliasActiveInactive(0)
      } else {
        //console.log("small Pie over active smcolor = ", smcolor)
        //holdClassThisContext.bigPieChartWidget.setAllSliceHover(1)
        holdClassThisContext.bigPieChartWidget.setAliasActiveOrInactive(1)
        holdClassThisContext.MINIsetAliasActiveInactive(1)
      }
    })

    this.series.slices.template.events.on("out", function (event) {
      let smcolor = holdClassThisContext.getSmallPieColor()
      holdClassThisContext.bigPieChartWidget.setAliasActiveOrInactive(2) //keep same status
      //Keep same status on MINI pie chart too!
      //This overrides default hovers and hoverActive state
      if (smcolor == holdClassThisContext.inactiveColor) {
        holdClassThisContext.MINIsetAliasActiveInactive(0)
      } else {
        holdClassThisContext.MINIsetAliasActiveInactive(1)
      }
    //   if (smcolor == holdClassThisContext.inactiveColor) {
    //     //console.log("small Pie out inactive smcolor = ", smcolor)
    //     //holdClassThisContext.bigPieChartWidget.setAllSliceHover(1)
    //     holdClassThisContext.bigPieChartWidget.setAliasActiveOrInactive(1)
    //     holdClassThisContext.MINIsetAliasActiveInactive(0)
    //   } else {
    //     //console.log("small Pie out active smcolor = ", smcolor)
    //     //holdClassThisContext.bigPieChartWidget.setAllSliceHover(0)
    //     holdClassThisContext.bigPieChartWidget.setAliasActiveOrInactive(0)
    //     holdClassThisContext.MINIsetAliasActiveInactive(1)
    //   }
     })
      
      
  } //end setEvents
} // end class miniPieChart

// Export
export { miniPieChart2 }
