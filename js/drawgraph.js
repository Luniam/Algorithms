/*dependencies : d3.js, Graph.js, geom.js */

var draw = draw || {};

draw.output = (function() {


    var drawSampleGraph = [];
    var drawVertexData = [];
    var drawEdgeData = [];

    //drawpanel variable
    var drag_line;
    var isdragstarted = false;

    var mousedown_link = null;
    var selected_link = null;
    var selected_link_mouse = null;
    var mousedown_link_mouse = null;

    var drawPath;

    function drawGraph(graph, pageId) {
        /*takes a Graph object and an id(string) e.g. "#viz"*/

        var svgNode;
        var vertexNode;
        var textNode;
        var edgeNode;

        svgNode = d3.select(pageId)
                      .append("div")
                          .classed("svg-container", true)
                          .classed("col-md-8", true)
                          .attr("id" , "mainSVG")
                          .append('svg')
                              .attr({
                                  "preserveAspectRatio" : "xMinYMin meet",
                                  "viewBox" : "0 0 900 500"
                              })
                              .classed("svg-content-responsive", true);

        vertexNode = d3.select("#mainSVG").select("svg")
                        .append("g")
                            .attr("id", "vertices")
                            .selectAll("circle")
                                .data(graph.graphData[0]).enter()
                                .append("circle")
                                    .attr({
                                        "cx" : function(d) {
                                            return d.xVal;
                                        },

                                        "cy" : function(d) {
                                            return d.yVal;
                                        },

                                        "r" : graph.radius,

                                        "id" : function(d) {
                                            return "vertex" + d.value;
                                        }
                                    })
                                    .style({
                                        "fill" : "#FFFFFF",
                                        "stroke" : "#C61C6F",
                                        "stroke-width" : 2.5
                                    });


        textNode = d3.select("#mainSVG").select("svg")
                       .append("g")
                           .attr("id", "texts")
                           .selectAll("text")
                               .data(graph.graphData[0]).enter()
                               .append("text")
                                   .attr({
                                        "x" : function(d) {
                                            return (d.value <= 9) ? (d.xVal-5) : (d.xVal-10);
                                        },

                                        "y" : function(d) {
                                            return (d.yVal + 5.3333);
                                        },

                                        "id" : function(d) {
                                            return "text" + d.value;
                                        },

                                        "font-weight" : "bold",
                                        "font-size" : "1.15em"
                                   })
                                   .text(function(d) {
                                        return d.value;
                                   })

        //using line generator to draw edge paths in animation

        var line = d3.svg.line()
                            .x(function(d) {
                                return d.xVal;
                            })
                            .y(function(d) {
                                return d.yVal;
                            });

        edgeNode = d3.select("#mainSVG").select("svg")
                        .append("g")
                            .attr("id", "edges")


        graph.graphData[1].map(function(d) { //drawing the edges
            var twoCircles = [];
            twoCircles.push(graph.graphData[0][d.from]);
            twoCircles.push(graph.graphData[0][d.to]);

            var points = getThePoints(twoCircles); //function from geom.js

            var newPoints = [];
            var obj1 = {};
            obj1.xVal = points[0];
            obj1.yVal = points[1];
            newPoints.push(obj1);

            var obj2 = {};
            obj2.xVal = points[2];
            obj2.yVal = points[3];
            newPoints.push(obj2);

            var path = edgeNode.append("path")
                                   .attr({
                                        "d" : line(newPoints),
                                        "stroke" : "#000000",
                                        "stroke-width" : 2,
                                        "fill" : "none",
                                        "id" : ("edge" + d.from + "" + d.to)
                                   });

            //animate the path creation

            var totalLength = path.node().getTotalLength();

            path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(300)
            .ease("linear")
            .attr("stroke-dashoffset", 0);

        });

        return [svgNode, vertexNode, edgeNode, textNode];

    }

    function removeGraph(svgNodeToRemove) {
        svgNodeToRemove.remove();
    }

    function drawDragLine() {
        drag_line = d3.select("#drawPanel").append('svg:path')
                        .attr('class', 'link dragline hidden')
                        .attr('d', 'M0,0L0,0');
    }

    function drawVertex(coords, time) {

        var gid = "g" + time;

        var gnode = d3.select("#drawPanel").append("g").attr("id", gid).classed("node", true)
                        .call(d3.behavior.drag()
                                .on("dragstart", dragstarted)
                                .on("drag", dragged)
                                .on("dragend", dragended))
                        .on("mouseup", mouseup)
                        .on("mouseover", mouseover)
                        .on("mouseout", mouseout);
                        //.on("touchend", touchended)

        var circeNode = gnode.append("circle")
                            .attr({
                                "cx" : coords[0],
                                "cy" : coords[1],
                                "r" : 20
                            })
                            .style({
                                "fill" : "#FFFFFF",
                                "stroke" : "#C61C6F",
                                "stroke-width" : 2.5
                            })
                            .classed("node", true);

        var textNode = gnode.append("text")
                            .attr({
                                "x" : (time <= 9) ? (coords[0]-5) : (coords[0]-10),
                                "y" : (coords[1] + 5.3333),
                                "font-weight" : "bold",
                                "font-size" : "1.15em"
                            })
                            .classed("node", true)
                            .text(time);
    }

    function dragstarted() {
        d3.event.sourceEvent.stopPropagation();

        isdragstarted = true;

        selected_link = this;
        
        mousedown_link = this;
        mousedown_link_mouse = d3.mouse(mousedown_link);
    }

    function dragged() {
        d3.event.sourceEvent.stopPropagation();

        drag_line.attr('d', 'M' + mousedown_link_mouse[0] + ',' + mousedown_link_mouse[1] + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1])
            .classed("hidden", false);
    }

    function dragended() {
        d3.event.sourceEvent.stopPropagation();

        isdragstarted = false;
        drag_line.classed("hidden", true);

    }

    function mouseup() {

        if (!mousedown_link) {
            return;
        }

        if (isdragstarted) {
            selected_link = this;

            if (selected_link === mousedown_link) {
                return;
            }

            var fromVertex = mousedown_link.id;
            var toVertex = selected_link.id;

            var first = parseInt(fromVertex.substr(1));
            var second = parseInt(toVertex.substr(1));

            var tempObj = {};

            if (first < second) { //because edge id will always be #edge01/#edge45
                tempObj["from"] = first;
                tempObj["to"] = second;
            }

            else {
                tempObj["from"] = second;
                tempObj["to"] = first;
            }

            tempObj["weight"] = 0;

            for(var i = 0; i < drawEdgeData.length; i++) {
                var compObj = drawEdgeData[i];

                if (first < second) {
                    if (compObj.from === first && compObj.to === second) {
                        return;
                    }
                }

                else {
                    if (compObj.from === second && compObj.to === first) {
                        return;
                    }
                }
            }

            drawEdgeData.push(tempObj);

            var circles = [];
            circles.push(drawVertexData[first]);
            circles.push(drawVertexData[second]);

            var drawPoints = getThePoints(circles); //from geom.js

            drawPath = d3.select("#drawPanel").append("svg:path")
                            .attr('d', 'M' + drawPoints[0] + ',' + drawPoints[1] + 'L' + drawPoints[2] + ',' + drawPoints[3]).attr("stroke", "#000000")
                            .attr("stroke-width", 3)
                            .attr("fill", "none");
            
        }

    }


    /*function touchended() {
        //same as mouseup for touch devices

        if (!mousedown_link) {
            return;
        }

        if (isdragstarted) {
            selected_link = this;

            if (selected_link === mousedown_link) {
                return;
            }

            var fromVertex = mousedown_link.id;
            var toVertex = selected_link.id;

            var first = parseInt(fromVertex.substr(1));
            var second = parseInt(toVertex.substr(1));

            var tempObj = {};

            if (first < second) { //because edge id will always be #edge01/#edge45
                tempObj["from"] = first;
                tempObj["to"] = second;
            }

            else {
                tempObj["from"] = second;
                tempObj["to"] = first;
            }

            tempObj["weight"] = 0;

            for(var i = 0; i < drawEdgeData.length; i++) {
                var compObj = drawEdgeData[i];

                if (first < second) {
                    if (compObj.from === first && compObj.to === second) {
                        return;
                    }
                }

                else {
                    if (compObj.from === second && compObj.to === first) {
                        return;
                    }
                }
            }

            drawEdgeData.push(tempObj);

            var circles = [];
            circles.push(drawVertexData[first]);
            circles.push(drawVertexData[second]);

            var drawPoints = getThePoints(circles); //from geom.js

            drawPath = d3.select("#drawPanel").append("svg:path")
                            .attr('d', 'M' + drawPoints[0] + ',' + drawPoints[1] + 'L' + drawPoints[2] + ',' + drawPoints[3]).attr("stroke", "#000000")
                            .attr("stroke-width", 3)
                            .attr("fill", "none");
            
        }
    }*/

    function mouseover() {

        if (!mousedown_link) {
            return;
        }

        if (isdragstarted) {
            d3.select(this).select("circle").attr("r", 25);
        }
    }


    function mouseout() {
        if (!mousedown_link) {
            return;
        }

        d3.select(this).select("circle").attr("r", 20);
    }

    /*function pathClick() {
        d3.event.sourceEvent.stopPropagation();
        console.log("a");
    }*/


    //getter and setter

    function getDrawVertexData() {
        return drawVertexData;
    }

    function setDrawVertexData(tempArray) {
        drawVertexData = tempArray;
    }

    function getDrawSampleGraph() {
        return drawSampleGraph;
    }

    function setDrawSampleGraph(tempArray) {
        drawSampleGraph = tempArray;
    }

    function getDrawEdgeData() {
        return drawEdgeData;
    }

    function setDrawEdgeData(tempArray) {
        drawEdgeData = tempArray;
    }

    return {
        drawGraph : drawGraph,
        removeGraph : removeGraph,
        drawVertex : drawVertex,
        drawDragLine : drawDragLine,
        getDrawVertexData : getDrawVertexData,
        setDrawVertexData : setDrawVertexData,
        getDrawSampleGraph : getDrawSampleGraph,
        setDrawSampleGraph : setDrawSampleGraph,
        getDrawEdgeData : getDrawEdgeData,
        setDrawEdgeData : setDrawEdgeData
    }
    
}()); 