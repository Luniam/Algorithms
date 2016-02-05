/*dependencies : jquery jquery-ui drawgraph */

var ui = ui || {}

ui.output = (function() {

    var defaultGraph = 1;
    var graph;
    var graphNodes;
    var speedbarValue;
    var speed = 1100; /* in milliseconds*/

    var playing = 1;
    var paused = 0;

    var playState = paused;


    function get_graph() {
        return graph;
    }

    function get_playState() {
        return playState;
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
        return $(pageId).slider("option", "value");
    }

    function getSpeedInMilliseconds(tempValue) {

        /*takes a value from 0 to 100 and returns value in milliseconds*/

        var lowVal = 100;
        var hiVal  = 2100;

        var perDivision = (hiVal-lowVal)/100;

        var computed = (tempValue*perDivision) + lowVal;

        return computed;

    }

    function drawProgressBar(pageId) {
        $(pageId).progressbar({
            value : 0
        });
    }

    function pageLoad(vizId, speedbarId, progressbarId) {

        if (defaultGraph == 1) { //from sampleGraphs.js
            graph = new Graph(sampleGraph1); //Graph.js
            graph.init(); // ALWAYS CALL "init" AFTER CREATING THE GRAPH
        }

        graphNodes = draw.output.drawGraph(graph, vizId); // from drawgraph.js
        drawSpeedBar(speedbarId);
        speedbarValue = getSpeedBarValue(speedbarId);
        drawProgressBar(progressbarId);
    }

    function redrawGraph(graph, node, id) {
        draw.output.removeGraph(node);        
    }

    function togglePlayButton() {
        if (playState == paused) {
            playState = playing;
            $(this).removeClass("glyphicon glyphicon-play playpause");
            $(this).addClass("glyphicon glyphicon-pause playpause");
        }

        else {
            playState = paused;
            $(this).removeClass("glyphicon glyphicon-pause playpause");
            $(this).addClass("glyphicon glyphicon-play playpause");
        }
    }

    return {
        pageLoad : pageLoad,
        togglePlayButton : togglePlayButton,
        graph : get_graph,
        playState : get_playState,
        graphNodes : get_graphNodes
    }

}());