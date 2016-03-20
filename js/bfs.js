/*dependencies : jquery.js, jquery-ui.js d3.js, Graph.js, geom.js, q.js, drawgraph.js, ui.js */



$(document).ready(startfn);

function startfn() {

    var progressbarId = "#progressbar";
    var speedbarId = "#speedbar";
    var vizId = "#viz";

    var steps = 0;
    var progressbarIncreaseValue = 0;

    /* (╯°□°）╯︵ ┻━┻   stupid variables and values*/
    var played = false; //if bfs was run atleast once
    var playing = 1;
    var paused = 0;
    var notStarted = 2;
    var finished = 3;

    var playState = notStarted;

    //bfs vertex coloring
    var white = "WHITE";
    var gray = "GRAY";
    var black = "BLACK";


    var turn = "vertex";
    var vertexMarker = 0;
    var edgeMarker = 0;

    var mainQ = new Queue(); // from  q.js
    var mainStack = [];


    var animateList = [];

    var resetId = 0;

    /*end of the stupid variables*/


    ui.output.pageLoad(vizId, speedbarId, progressbarId);

    var source = 0; //default source
    var graphNodes = ui.output.graphNodes();
    var G = ui.output.graph(); //graph and graphnodes are initialized after pageload


    function togglePlayButton() {
        
        if (playState === paused) {
            playState = playing;
            changeIcon("pause");
            bfs(resetId);
        }

        else if (playState === playing) {
            playState = paused;
            changeIcon("play");
        }

        else if (playState === finished) {
            //bfsgo(); except selectSourceButton() in the followinbg code

            preBFS();

            playState = playing;
            changeIcon("pause");

            setTimeout(function() {
                bfs(resetId);
            }, 500);
        }
    }

    function changeIcon(state) { //state = "pause"/"play"/"repeat"
        $("#play").removeClass();
        $("#play").addClass("glyphicon glyphicon-"+ state + " playpause");
    }

    function selectSourceButton() {
        $("#slide").toggle("slide");
    }

    function chooseSampleGraph() {
        $("#slide3").toggle("slide");
    }

    function initializeSource() {

        resetValues();

        if(source > G.V()-1 || source < 0) { //check source validity
            var temp = G.V()-1;
            alert("please select a source between 0 and " + temp);
            return;
        }

        if (played) {
            ui.output.resetGraph(G);
            played = false;
        }

        playState = playing;
        changeIcon("pause");

        for(var i = 0; i < G.V(); i++) {
            if (i !== source) {
                G.colors[i] = white;
                G.d[i] = -1;
                G.parents[i] = -1;
            }
        }

        G.colors[source] = gray;
        G.d[source] = 0;
        G.parents[source] = 0;
        
        mainQ.enqueue(source);
    }

    function preBFS() {
        source = +$("#sourceInput").val();
        //initializing
        initializeSource();
        bfsSim();
        resetId++;
    }

    function bfsgo() {
        selectSourceButton(); //for sliding

        preBFS();

        setTimeout(function() {
            bfs(resetId);
        }, 500);
    }
    
    function bfs(id) {

        played = true;
        
        if (vertexMarker <= G.V()-1 && playState === playing && id == resetId) {

            
            if (turn == "vertex") {

                var tempVertex = Object.keys(animateList[vertexMarker])[0];

                var vertex = "#vertex" + tempVertex;
                var text = "#text" + tempVertex;

                d3.select(vertex).transition().style({
                    "fill" : "#F38630",
                    "stroke" : "#F38630"
                }).duration(500);

                d3.select(text).transition().style({
                    "fill" : "rgb(255, 255, 255)"
                }).duration(500);

                turn = "edge";

                ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);

                setTimeout(function() {
                    bfs(id);
                }, 500);
            }

            else if (turn == "edge") {

                var tempVertex = Object.keys(animateList[vertexMarker])[0];
                var tempList = animateList[vertexMarker][tempVertex];
                
                if (tempList.length == 0) {
                    turn = "vertex";
                    edgeMarker = 0;
                    vertexMarker++;
                }

                else if (edgeMarker >= tempList.length) {
                    turn = "vertex";
                    edgeMarker = 0;
                    vertexMarker++;
                }

                else {

                    var vertex2 = "#vertex" + tempList[edgeMarker];

                    var edge = "#edge";

                    if (parseInt(tempVertex) < tempList[edgeMarker]) {
                        edge = edge + tempVertex + tempList[edgeMarker];
                    }

                    else {
                        edge = edge + tempList[edgeMarker] + tempVertex;
                    }

                    d3.select(edge).transition().style({
                        "stroke" : "rgb(0, 128, 0)",
                        "stroke-width" : 5
                    }).duration(500);

                    d3.select(vertex2).transition().style({
                        "fill" : "#808080",
                        "stroke" : "#808080"
                    }).delay(50).duration(500);

                    edgeMarker++;

                    ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);
                }

                if (vertexMarker == G.V()) {
                    playState = finished;
                    changeIcon("repeat");
                    return;
                }

                setTimeout(function() {
                    bfs(id);
                }, 500);
            }
        }

        else if (vertexMarker == G.V()) {
            playState = finished;
            changeIcon("repeat");
        }

        else { return; }

    }

    

    function forwardBTN() {
        
    }

    function bfsSim() {

        steps = 0;

        while(mainQ.size() > 0) {

            var u = mainQ.dequeue();
            steps++;
            
            var temp = {};
            temp[u] = [];

            var adj = G.getAdj(u);

            for(var i = 0; i < adj.length; i++) {
                var v = adj[i];

                if (G.colors[v] === white) { //haven't been explored before
                    steps++;
                    temp[u].push(v);

                    G.colors[v] = gray;
                    G.d[v] = G.d[u] + 1;
                    G.parents[v] = u;
                    mainQ.enqueue(v);
                }
            }

            animateList.push(temp);
            G.colors[u] === black;
        }
        
        steps--;

        if (steps != 0) {
            progressbarIncreaseValue = 100/steps;
        }
    }

    function resetValues() {
        turn = "vertex";
        vertexMarker = 0;
        edgeMarker = 0;

        mainQ = new Queue(); // from  q.js
        mainStack = [];

        animateList = [];

        ui.output.drawProgressBar(progressbarId); //resetting the progressbar
    }

    /*event handlers*/

    $("#play").on("click", togglePlayButton);

    $("#forward").on("click", forwardBTN);

    $("#runBFS").on("click", selectSourceButton);

    $("#startBFS").on("click", bfsgo); //start main bfs

    $("#samples").on("click", chooseSampleGraph);    
}