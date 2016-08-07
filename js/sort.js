
$(document).ready(startfn);

function startfn() {


    var progressbarId = "#progressbar";
    var speedbarId = "#speedbar";
    var vizId = "#viz";
    var svgId = "#mainSVG";
    var bars;
    var total = 50;

    var colorArray = ['#B58929', '#C61C6F', '#9900ff', '#268BD2', '#28ABE3', '#85992C', '#208000', '#006600'];
    /*var colorArray2 = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];*/
    effectsIndex = 0;

    var xScale,yScale,colors;

    var canvasHeight, canvasWidth, height, width;
    var barWidth = 70;
    var barOffset = 15;


    var margin = {
        top : 30,
        right : 0,
        bottom : 40,
        left : 0
    };

    var barData = sort.output.genData(total);
   
    ui.output.pageLoad(vizId, speedbarId, progressbarId);
    ui.output.drawSVG(vizId);

    var svgNode = d3.select("svg");

    setHeightWidth();
    setColorsAndScales();
    bars = sort.output.drawBarData(barData, vizId, svgId, xScale, yScale, height, colors);
    

    /*altering the page
    starts here*/

    function removeAllRect() {
        $("#bars").remove();
    }

    function splitSVG(vizId, svgId) {
        $("svg").remove();
        var svg1 = d3.select(vizId).select(svgId).append("svg")
                                   .attr({
                                      "id" : "svg1",
                                      "preserveAspectRatio" : "xMinYMin meet",
                                      "viewBox" : "0 0 1800 500"
                                   });

        var svg2 = d3.select(vizId).select(svgId).append("svg")
                                   .attr({
                                      "id" : "svg2",
                                      "preserveAspectRatio" : "xMinYMin meet",
                                      "viewBox" : "0 0 1800 500"
                                   });
                        
        setHeightWidthForMergeSort();
        setColorsAndScales();
        newBarData = [];
        barData.forEach(function(d) {
            newBarData.push(d);
        });
        newBarData.sort();
        bars1 = sort.output.drawBarDataForMergeSort(barData, vizId, svgId, "#svg1", xScale, yScale, height, colors);
        bars2 = sort.output.drawSortedData(newBarData, vizId, svgId, "#svg2", xScale, yScale, height);
    }

    /*altering the page
    ends here*/

    //setting up page properties - start

    function setHeightWidth() {
        svgNode = d3.select("svg");
        canvasHeight = parseFloat(svgNode.style("height"));
        canvasWidth = parseFloat(svgNode.style("width"));

        height = canvasHeight + 20;
        width = canvasWidth - margin.left - margin.right;

        if (canvasHeight >= 550) {
            height = canvasHeight - margin.top - margin.bottom;
        }

        if (canvasWidth >= 1000) {
            width  = canvasWidth - margin.left - margin.right - 150;
        }

        console.log(canvasWidth);
        console.log(canvasHeight);
        console.log(width);
        console.log(height);
    }

    function setHeightWidthForMergeSort() {
        svgNode = d3.select("svg");
        canvasHeight = parseFloat(svgNode.style("height"));
        canvasWidth = parseFloat(svgNode.style("width"));

        height = canvasHeight + 200;

        if (canvasWidth >= 1000) {
            width = canvasWidth - margin.left - margin.right + 650;
        }

        else {
            width = canvasWidth - margin.left - margin.right + 850;
        }
    }

    function setColorsAndScales() {
        colors = d3.scale.linear()
                .range(colorArray)
                .domain([0, barData.length*.14, barData.length*.28, barData.length*.42, barData.length*.56, barData.length*.70, barData.length*.84,  barData.length]);

        yScale = d3.scale.linear()
                   .range([0, height])
                   .domain([0, d3.max(barData, function(d) { return d; })]);

        xScale = d3.scale.ordinal()
               .rangeBands([0, width], .1, .3) //optional second and third args for inner and outer padding
               .domain(d3.range(0, barData.length));
    }

    //setting up page properties - end


    /*event handler immediate responses
    start*/

    function startMergeSort() {
        splitSVG(vizId, svgId);
    }

    function toggleButton() {
        $("#slide").css("padding-top", "90px");
        $("#slide").toggle("slide");
    }

    function generateAgain() {

        if ($("#svg1").length > 0) {
            $("#svg1").remove();
            $("#svg2").remove();

            var svg = d3.select(vizId).select(svgId).append("svg")
                                   .attr({
                                      "preserveAspectRatio" : "xMinYMin meet",
                                      "viewBox" : "0 0 900 500"
                                    });
        }

        else {
            removeAllRect();
        }

        total = +$("#barsInput").val();

        if (total > 5000) {
            alert("Too many!");
            return;
        }

        $("#slide").toggle("slide");
        barData.length = 0;
        barData = sort.output.genData(total);
        
        setHeightWidth(); //height and width should be set first
        setColorsAndScales();
        bars = sort.output.drawBarData(barData, vizId, svgId, xScale, yScale, height, colors);
    }

    /*event handler immediate responses
    end*/

    //event handlers

    $("#randomize").on("click", toggleButton);
    $("#gen").on("click", generateAgain);
    $("#mergeSort").on("click", startMergeSort);
}