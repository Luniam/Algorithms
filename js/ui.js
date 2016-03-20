/*dependencies : jquery jquery-ui drawgraph */

var ui = ui || {};

ui.output = (function() {

    var defaultGraph = 1;
    var graph;
    var graphNodes;
    var speedbarValue;
    var speed = 1100; /* in milliseconds*/

    /*boolean values*/
    var directedGraph = 1;
    var undirectedGraph = 0;
    /*boolean values*/

    var graphType = undirectedGraph;

    function get_graph() {
        return graph;
    }

    function get_graphNodes() {
        return graphNodes;
    }


    function drawSpeedBar(pageId) {
        /*pageId is a string e.g. "#speedbar"*/

        $(pageId).slider();
        $(pageId).slider('value',50); // set the speed to a middle value
    }

    function getSpeedBarValue(pageId) {
        return +$(pageId).slider("option", "value");
    }

    function getSpeedInMilliseconds(tempValue) {

        /*takes a value from 0 to 100 and returns value in milliseconds*/

        var lowVal = 100;
        var hiVal  = 2100;

        var perDivision = (hiVal-lowVal)/100;

        var computed = (tempValue*perDivision) + lowVal;

        return (2150 - computed);

    }

    function drawProgressBar(pageId) {
        $(pageId).progressbar({
            value : 0
        });
    }

    function changeProgressBar(pageId, newValue) {

        var oldValue = $(pageId).progressbar("value");
        var final = oldValue + newValue

        $(pageId).progressbar({
            value : final
        });
    }

    function pageLoad(vizId, speedbarId, progressbarId) {

        if (defaultGraph == 1 && graphType == undirectedGraph) { //from sampleGraphs.js
            graph = new Graph(sampleGraph1); //Graph.js
        }

        graphNodes = draw.output.drawGraph(graph, vizId); // from drawgraph.js
        drawSpeedBar(speedbarId);
        speedbarValue = getSpeedBarValue(speedbarId);
        drawProgressBar(progressbarId);
    }

    function redrawGraph(graph, node, id) {
        draw.output.removeGraph(node);        
    }

    function resetGraph(G) {

        for(var i = 0; i < G.V(); i++) {
            var vertex = "#vertex" + i;
            var text = "#text" + i;
            d3.select(vertex).transition().style({
                "fill" : "#FFFFFF",
                "stroke" : "#C61C6F"
            }).duration(300);

            d3.select(text).transition().style({
                "fill" : "#000000"
            }).duration(300);

            var adj = G.getAdj(i);

            for(var j = 0; j < adj.length; j++) {
                var v = adj[j];
                var edge = "#edge";

                if(v > i) { //making sure that I am not resetting the same edge twice
                    edge = edge + i + v;
                    d3.select(edge).transition().style({
                        "stroke" : "#000000",
                        "stroke-width" : 2
                    }).duration(300);
                }
            }
        }

    }

    return {
        pageLoad : pageLoad,
        graph : get_graph,
        graphNodes : get_graphNodes,
        resetGraph : resetGraph,
        changeProgressBar : changeProgressBar,
        drawProgressBar : drawProgressBar
    }

}());