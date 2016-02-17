/*dependencies : d3.js, Graph.js, geom.js */

var draw = draw || {};

draw.output = (function() {

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
                          .append('svg')
                              .attr({
                                  "preserveAspectRatio" : "xMinYMin meet",
                                  "viewBox" : "0 0 900 500"
                              })
                              .classed("svg-content-responsive", true);

        vertexNode = d3.select("svg")
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


        textNode = d3.select("svg")
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

        edgeNode = d3.select("svg")
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

    return {
        drawGraph : drawGraph,
        removeGraph : removeGraph,
    }
    
}()); 