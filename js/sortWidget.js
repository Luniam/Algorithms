var sort = sort || {};

sort.output = (function() {

    var effectsArray = ["elastic", "bounce"];

    var tooltip = d3.select('body')
                .append('div')
                  .attr("id", "tooltip")
                  .style({
                    'position' : 'absolute',
                    'padding' : '0 10px',
                    'background' : 'white',
                    'opacity' : 0
                  });

    function genData(total) {
        var tempData = [];
        for(var i = 0; i < total; i++) {
            tempData.push(Math.round(10 + (Math.random() * 89)));
        }
        return tempData;
    }


    function drawBarDataOnPage(data, vizId, svgId, xScale, yScale, height, colors) {
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

    function drawBarDataOnPageForMergeSort(data, vizId, svgId, newId, xScale, yScale, height, colors) {
        var tempColor;
        var tempBars = d3.select(vizId).select(svgId).select(newId)
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

    function drawSortedData(data, vizId, svgId, newId, xScale, yScale, height) {
        var tempColor;
        var tempBars = d3.select(vizId).select(svgId).select(newId)
                                        .append("g")
                                        .attr({
                                            "id" : "bars"
                                        }).selectAll("rect")
                                            .data(data)
                                            .enter()
                                            .append("rect")
                                                .style({
                                                    "fill" : "white"
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

    return {
        genData : genData,
        drawBarData : drawBarDataOnPage,
        drawBarDataForMergeSort : drawBarDataOnPageForMergeSort,
        drawSortedData : drawSortedData
    }

}());