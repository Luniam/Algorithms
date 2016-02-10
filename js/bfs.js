/*dependencies : jquery.js, jquery-ui.js d3.js, Graph.js, geom.js, q.js, drawgraph.js, ui.js */



$(document).ready(startfn);

function startfn() {

    var steps = 0;


    /* (╯°□°）╯︵ ┻━┻   stupid variables*/
    var played = false; // if bfs was run atleast once
    var playing = 1;
    var paused = 0;
    var notStarted = 2;
    var finished = 3;
    var playState = notStarted;


    ui.output.pageLoad("#viz", "#speedbar", "#progressbar");

    function togglePlayButton() {
        if (playState === paused || playState === notStarted) {
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

    function selectSourceButton() {
        $("#slide").toggle("slide");
    }

    function bfsgo() {

        var source = +$("#sourceInput").val();
        selectSourceButton();
        bfs(ui.output.graph(), ui.output.graphNodes(), source);
    }

    function bfs(G, graphNodes, s) {
        
        if (played) {
            resetGraph(G);
        }

        var white = "WHITE";
        var gray = "GRAY";
        var black = "BLACK";

        for(var i = 0; i < G.V(); i++) {
            if (i !== s) {
                G.colors[i] = white;
                G.d[i] = -1;
                G.parents[i] = -1;
            }
        }

        G.colors[s] = gray;
        G.d[s] = 0;
        G.parents[s] = 0;

        var q = new Queue(); // from  q.js
        q.enqueue(s);

        var delayValue = 1;
        var edgeDelayValue = 1.5;
        while(q.size() > 0) {
            var u = q.dequeue();
            var vertex = "#vertex" + u;
            var text = "#text" + u;

            d3.select(vertex).transition().style({
                "fill" : "#F38630",
                "stroke" : "#F38630"
            }).delay(delayValue * 900).duration(1000);

            d3.select(text).transition().style({
                "fill" : "rgb(255, 255, 255)"
            }).delay(delayValue * 900).duration(1000);

            delayValue++;

            var adj = G.getAdj(u);

            for(var i = 0; i < adj.length; i++) {
                var v = adj[i];

                if (G.colors[v] === white) { //haven't been explored before

                    //edge animation

                    var edge = "#edge";
                    if (u < v) {edge = edge + u + v;}

                    else {edge = edge + v + u;}

                    d3.select(edge).transition().style({
                        "stroke" : "rgb(0, 128, 0)",
                        "stroke-width" : 5
                    }).delay(edgeDelayValue * 900).duration(1000);

                    edgeDelayValue++;

                    var vertex2 = "#vertex" + v;
                    d3.select(vertex2).transition().style({
                        "fill" : "#999999",
                        "stroke" : "#999999"
                    }).delay(delayValue * 900).duration(1000);

                    G.colors[v] = gray;
                    G.d[v] = G.d[u] + 1;
                    G.parents[v] = u;
                    q.enqueue(v);
                }
            }

            G.colors[u] = black;
        }
        played = true;
    }

    function forwardBTN() {
        
    }

    function resetGraph(G) {

        for(var i = 0; i < G.V(); i++) {
            var vertex = "#vertex" + i;
            var text = "#text" + i;
            d3.select(vertex).transition().style({
                "fill" : "#FFFFFF",
                "stroke" : "#C61C6F"
            }).duration(400);

            d3.select(text).transition().style({
                "fill" : "#000000"
            }).duration(400);

            var adj = G.getAdj(i);

            for(var j = 0; j < adj.length; j++) {
                var v = adj[j];
                var edge = "#edge";

                if(v > i) { //making sure that I am not resetting the same edge twice
                    edge = edge + i + v;
                    d3.select(edge).transition().style({
                        "stroke" : "#000000",
                        "stroke-width" : 2
                    }).duration(400);
                }
            }
        }

    }

    /*event handlers*/

    $("#play").on("click", togglePlayButton);

    $("#forward").on("click", forwardBTN);

    $("#runBFS").on("click", selectSourceButton);

    $("#startBFS").on("click", bfsgo); //start main bfs
}