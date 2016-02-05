/*dependencies : jquery.js, jquery-ui.js d3.js, Graph.js, geom.js, drawgraph.js, ui.js */



$(document).ready(startfn);

function startfn() {

    var defaultGraph = 1;
    var graph;
    var graphNodes;
    var speedbarValue;
    var speed = 1100; /* in milliseconds*/

    var playing = 1;
    var paused = 0;

    var playState = paused;

    pageLoad();

    function pageLoad() {

        if (defaultGraph == 1) { //from sampleGraphs.js
            graph = new Graph(sampleGraph1); //Graph.js
            graph.init(); // ALWAYS CALL "init" AFTER CREATING THE GRAPH
        }

        graphNodes = draw.output.drawGraph(graph, "#viz"); // from drawgraph.js
        ui.output.drawSpeedBar("#speedbar"); // from ui.js
        speedbarValue = ui.output.getSpeedBarValue("#speedbar");
        ui.output.drawProgressBar("#progressbar");
    }


    function redrawGraph(graph, node, id) {
        draw.output.removeGraph(node);        
    }

    function togglePlay() {
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

    /*event handlers*/

    $("#play").on("click", togglePlay);

}