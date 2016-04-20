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

    function getSpeedInMilliseconds(pageId) {

        /*takes a value from 0 to 100 and returns value in milliseconds*/

        var tempValue = getSpeedBarValue(pageId);

        if (tempValue == 100) {
            computed = 100;
        }

        else if (tempValue == 0) {
            computed = 1100;
        }

        else {
            tempValue = 100 - tempValue;

            var fastest = 100;
            var slowest  = 1100;

            var perDivision = (slowest-fastest)/100.0;

            var computed = (tempValue*perDivision) + 100;
        }

        return computed;

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

    function redrawGraph(node, id, sampleGraphNum) {
        //draw.output.removeGraph(node);

        if (sampleGraphNum == 1) {
            graph = new Graph(sampleGraph2);
        }

        graphNodes = draw.output.drawGraph(graph, id);
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
        drawProgressBar : drawProgressBar,
        redrawGraph : redrawGraph,
        getSpeedInMilliseconds : getSpeedInMilliseconds
    }

}());