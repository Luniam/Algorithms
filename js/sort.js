
$(document).ready(startfn);

function startfn() {


    var progressbarId = "#progressbar";
    var speedbarId = "#speedbar";
    var vizId = "#viz";
    var svgId = "#mainSVG";
    var bars;
    var total = 15;

    var colorArray = ['#B58929', '#C61C6F', '#9900ff', '#268BD2', '#28ABE3', '#85992C', '#208000', '#006600'];
    var colorArray2 = ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];
    var effectsArray = ["elastic", "bounce"];
    effectsIndex = 0;

    var tooltip = d3.select('body')
                .append('div')
                  .attr("id", "tooltip")
                  .style({
                    'position' : 'absolute',
                    'padding' : '0 10px',
                    'background' : 'white',
                    'opacity' : 0
                  });

    var barData = genData(total);

    var xScale,yScale,colors;
   
    ui.output.pageLoad(vizId, speedbarId, progressbarId);
    ui.output.drawSVG(vizId);

    var svgNode = d3.select("svg");

      var margin = {
        top : 30,
        right : 0,
        bottom : 40,
        left : 0
      };


    var height = parseFloat(svgNode.style("height")) - margin.top - margin.bottom,
        width  = parseFloat(svgNode.style("width")) - margin.left - margin.right - 150,
        barWidth = 70,
        barOffset = 15;


    setColorsAndScales();


    bars = drawBarDataOnPage(barData, vizId, svgId);
    

    function drawBarDataOnPage(data, vizId, svgId) {
        var tempColor;
        var tempBars = d3.select(vizId).select(svgId).select("svg")
                                        .append("g")
                                        .attr({
                                            "id" : "bars"
                                        }).selectAll("rect")
                                            .data(data)
                                            .enter()
                                            .append("rect")
                                                .style({
                                                    "fill" : function(d, i) {
                                                        return colors(i);
                                                    }
                                                })
                                                .attr({
                                                    "width" : xScale.rangeBand(),
                                                    "height" : 0,
                                                    "x" : function(d, i) {
                                                        return xScale(i);
                                                    },
                                                    "y" : height,
                                                    "id" : function(d, i) {
                                                        return i + "rect" + d;
                                                    }
                                                })
                                                .on("mouseover", function(d) {
                                                    tempColor = this.style.fill;
                                                    
                                                    tooltip.transition()
                                                       .style({
                                                        'opacity' : .9
                                                       }).duration(100);
                                                    tooltip.html(d)
                                                        .style({
                                                          'top' : ((d3.event.pageY - 40 ) + 'px'),
                                                          'left' : ((d3.event.pageX - 10) + 'px')
                                                        });

                                                    d3.select(this)
                                                      .style({
                                                        'opacity' : .5,
                                                        'fill' : 'orange',
                                                      });
                                                })
                                                .on("mouseout", function() {

                                                    tooltip.transition()
                                                       .style({
                                                        'opacity' : 0
                                                    });

                                                    d3.select(this)
                                                      .style({
                                                        'opacity' : 1,
                                                        'fill' : tempColor
                                                      });
                                                });

        tempBars.transition()
                 .attr({
                    'height' : function(d) {
                      return yScale(d); //mapping the height through yScale
                    },
                    'y' : function(d) {
                      return height - yScale(d);
                    }
                 })
                 .delay(function(d, i) {
                  return i * 10;
                 })
                 .duration(1000)
                 .ease(effectsArray[effectsIndex]);

        if (effectsIndex == 0) { effectsIndex = 1; }
        else { effectsIndex = 0; }

        return tempBars;
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


    function genData(total) {
        var tempData = [];
        for(var i = 0; i < total; i++) {
            tempData.push(Math.round(10 + (Math.random() * 90)));
        }
        return tempData;
    }


    function removeAllRect() {
        $("#bars").remove();
    }

    function generateAgain() {
        total = +$("#barsInput").val();

        if (total > 5000) {
            alert("Too many!");
            return;
        }

        $("#slide").toggle("slide");
        barData.length = 0;
        barData = genData(total);
        removeAllRect();

        setColorsAndScales();


        bars = drawBarDataOnPage(barData, vizId, svgId);
    }


    function toggleButton() {
        $("#slide").css("padding-top", "90px");
        $("#slide").toggle("slide");
    }


    $("#randomize").on("click", toggleButton);
    $("#gen").on("click", generateAgain);

}