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
                          .append('svg')
                              .attr({
                                  "preserveAspectRatio" : "xMinYMin meet",
                                  "viewBox" : "0 0 600 400"
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
                                        }

                                        "r" : graph.radius
                                    })
                                    .style({
                                        "fill" : "#FFFFFF",
                                        "stroke" "#C61C6F",
                                        "stroke-width" : 2.5
                                    });


        textNode = d3.select("svg")
                       .append("g")
                           .attr("id", "texts")
                           .selectAll("text")
                               .data(graphData[0]).enter()
                               .append("text")
                                   .attr({
                                        "x" : function(d) {
                                            return (d.value <= 9) ? (d.xVal-5) : (d.xVal-10);
                                        },

                                        "y" : function(d) {
                                            return (d.yVal + 5.3333);
                                        },

                                        "font-weight" : "bold"
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


        graph.graphData.edgeData.map(function(d) { //drawing the edges
            var twoCircles = [];
            twoCircles.push(graph.vertexData[d.from]);
            twoCircles.push(graph.vertexData[d.to]);

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
                                        "fill" : "none"
                                   });

            //animate the path creation

            var totalLength = path.node().getTotalLength();

            path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(450)
            .ease("linear")
            .attr("stroke-dashoffset", 0);

        });

    }

    return {
        drawGraph : drawGraph
    }
    
}()); 