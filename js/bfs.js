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

    var previousEdgeMarker = [];

    var mainQ = new Queue(); // from  q.js
    var mainStack = [];


    var animateList = [];

    var resetId = 0;

    var speedTempValue = 0;
    var speed = 500; //default speed

    var time = 0;

    //extra variables for dfs

    var timedfs = 0; //for measuring discovery time and finishing time

    var playingBFS = "BFS";
    var playingDFS = "DFS";

    var version = playingBFS; //default to bfs

    /*end of the stupid variables*/


    ui.output.pageLoad(vizId, speedbarId, progressbarId);

    var source = 0; //default source
    var graphNodes = ui.output.graphNodes();
    var G = ui.output.graph(); //graph and graphnodes are initialized after pageload

    function togglePlayButton() {
        
        if (playState === paused) {
            playState = playing;
            changeIcon("pause");
            if (version === playingBFS) {
                bfs(resetId);
            }

            else if (version === playingDFS) {
                dfs(resetId);
            }
        }

        else if (playState === playing) {
            playState = paused;
            changeIcon("play");
        }

        else if (playState === finished) {

            if (version === playingBFS) {
               //bfsgo(); except selectSourceButton() in the following code

                preBFS();

                playState = playing;
                changeIcon("pause");

                speed = ui.output.getSpeedInMilliseconds(speedbarId);


                setTimeout(function() {
                    bfs(resetId);
                }, speed);
            }

            else if (version === playingDFS) {

                dfsgo();

                playState = playing;
                changeIcon("pause");
            }
        }

        else {
            alert("Please choose BFS or DFS from the left hand side menu.");
        }
    }

    function changeIcon(state) { //state = "pause"/"play"/"repeat"
        $("#play").removeClass();
        $("#play").addClass("glyphicon glyphicon-"+ state + " playpause");
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

        version = playingBFS;

        preBFS();

        speed = ui.output.getSpeedInMilliseconds(speedbarId);

        setTimeout(function() {
            bfs(resetId);
        }, speed);
    }

    function vertexTurn() {

        if (vertexMarker >= animateList.length) {
            playState = finished;
            changeIcon("repeat");
            return;
        }

        var tempVertex = Object.keys(animateList[vertexMarker])[0];

        var vertex = "#vertex" + tempVertex;
        var text = "#text" + tempVertex;

        var tempObj = {};
        var tempArray = [];
        tempArray.push(vertex);
        tempArray.push(text);
        tempObj["vertex"] = tempArray;
        mainStack.push(tempObj);

        speed = ui.output.getSpeedInMilliseconds(speedbarId);       

        d3.select(vertex).transition().style({
            "fill" : "#F38630",
            "stroke" : "#F38630"
        }).duration(speed);

        d3.select(text).transition().style({
            "fill" : "rgb(255, 255, 255)"
        }).duration(speed);

        turn = "edge";

        ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);

        if (vertexMarker == G.V()-1) {
            playState = finished;
            changeIcon("repeat");
            return;
        }

    }

    function edgeTurn() {

        var tempVertex = Object.keys(animateList[vertexMarker])[0];
        var tempList = animateList[vertexMarker][tempVertex];
        
        if (tempList.length == 0) {
            turn = "vertex";
            previousEdgeMarker.push(edgeMarker);
            edgeMarker = 0;
            vertexMarker++;

            var tempObj = {};
            var tempArray = [];
            tempObj["edgeTurn"] = tempArray;
            mainStack.push(tempObj);  


            vertexTurn();

            if (vertexMarker == G.V()) {
                playState = finished;
                changeIcon("repeat");
                return;
            }
        }

        else if (edgeMarker >= tempList.length) { //redundant
            turn = "vertex";
            edgeMarker = 0;
            vertexMarker++;

            if (vertexMarker == G.V()) {
                playState = finished;
                changeIcon("repeat");
                return;
            }
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

            var tempObj = {};
            var tempArray = [];
            tempArray.push(vertex2);
            tempArray.push(edge);
            tempObj["edge"] = tempArray;
            mainStack.push(tempObj);

            speed = ui.output.getSpeedInMilliseconds(speedbarId);


            d3.select(edge).transition().style({
                "stroke" : "rgb(0, 128, 0)",
                "stroke-width" : 5
            }).duration(speed);

            d3.select(vertex2).transition().style({
                "fill" : "#808080",
                "stroke" : "#808080"
            }).delay(50).duration(speed);

            edgeMarker++;

            if (edgeMarker >= tempList.length) {
                turn = "vertex";
                previousEdgeMarker.push(edgeMarker);
                edgeMarker = 0;
                vertexMarker++;

                var tempObj = {};
                var tempArray = [];
                tempObj["edgeTurn2"] = tempArray;
                mainStack.push(tempObj);

                if (vertexMarker == G.V()) { //redundant
                    playState = finished;
                    changeIcon("repeat");
                    return;
                }
            }

            ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);
        }

        if (vertexMarker == G.V()) { //redundant
            playState = finished;
            changeIcon("repeat");
            return;
        }

    }

    function forwardBTN() {
        
        if (version === playingBFS) {

            if (vertexMarker <= G.V()-1 && playState === paused) {

                if (turn == "vertex") {
                    vertexTurn();
                }

                else if (turn == "edge") {
                    edgeTurn();
                }

            }
        }

        else if (version === playingDFS && playState === paused) {
            if (turn === "vertex") {
                vertexTurnDFS();
            }

            else if (turn === "edge") {
                edgeTurnDFS();
            }
        }
    }
    
    function bfs(id) {

        played = true;
        
        if (vertexMarker <= G.V()-1 && playState === playing && id == resetId) {

            
            if (turn == "vertex") {

                vertexTurn();

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                setTimeout(function() {
                    bfs(id);
                }, speed);
            }

            else if (turn == "edge") {

                edgeTurn();

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                setTimeout(function() {
                    bfs(id);
                }, speed);
            }
        }

        else if (vertexMarker == G.V()) {
            playState = finished;
            changeIcon("repeat");
        }

        else { return; }

    }


    function backwardBTN() {

        if (mainStack.length > 0 && playState === paused) {
            var obj = mainStack.pop();

            var key = Object.keys(obj)[0];

            if (key == "vertex") {
                var vertex = obj["vertex"][0];
                var text = obj["vertex"][1];

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                d3.select(vertex).transition().style({
                    "fill" : "#808080",
                    "stroke" : "#808080"
                }).duration(speed);

                d3.select(text).transition().style({
                    "fill" : "#000000"
                }).duration(speed);

                turn =  "vertex";

                var decreaseValue = -1 * progressbarIncreaseValue;

                ui.output.changeProgressBar(progressbarId, decreaseValue);



                var newObj = mainStack[mainStack.length - 1];
                var newKey = Object.keys(newObj)[0];

                if (newKey == "edgeTurn") {
                    turn = "edge";
                    vertexMarker--;
                    edgeMarker = previousEdgeMarker.pop();
                    mainStack.pop();
                }

            }

            else if (key == "edge") {
                var vertex2 = obj["edge"][0];
                var edge = obj["edge"][1];

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                d3.select(vertex2).transition().style({
                    "fill" : "#FFFFFF",
                    "stroke" : "#C61C6F"
                }).delay(50).duration(speed);

                d3.select(edge).transition().style({
                    "stroke" : "#000000",
                    "stroke-width" : 2
                }).duration(speed);

                edgeMarker--;

                var decreaseValue = -1 * progressbarIncreaseValue;

                ui.output.changeProgressBar(progressbarId, decreaseValue);
            }

            else if (key == "edgeTurn2") {
                turn = "edge";
                vertexMarker--;
                edgeMarker = previousEdgeMarker.pop();

                var newObj = mainStack[mainStack.length - 1];
                var newKey = Object.keys(newObj)[0];

                if (newKey == "edge") {
                    backwardBTN();
                }
            }
        }

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

        if (steps != 0) {
            progressbarIncreaseValue = 100/steps;
        }
    }

    //dfs specific code start

    function dfsSim() {

        steps = 0;

        for (var u = 0; u < G.V(); u++) {
            G.colors[u] = white;
            G.parents[u] = -1;
        }

        timedfs = 0;

        for (var u = 0; u < G.V(); u++) {
            if (G.colors[u] === white) {
                dfsVisit(u);
            }
        }
        /*console.log(animateList);
        console.log(steps);*/
        if (steps != 0) {
            progressbarIncreaseValue = 100/steps;
        }
    }

    function dfsVisit(u) {
        timedfs++;

        //u.d = time omitted

        var temp = {};
        temp[u] = [];
        //steps++;

        G.colors[u] = gray;

        var adj = G.getAdj(u);

        for(var i = 0; i < adj.length; i++) {

            var v = adj[i];

            if (G.colors[v] === white) {
                G.parents[v] = u;
                temp[u].push(v);
                animateList.push(temp);

                steps+=2;

                temp = {};
                temp[u] = [];
                dfsVisit(v);
            }
        }

        animateList.push(temp);
        steps++;
        G.colors[u] = black;
        timedfs++;
        //u.f = time omitted
    }

    function dfsgo() {
        resetId++;
        resetValues();

        version = playingDFS;

        if (played) {
            ui.output.resetGraph(G);
            played = false;
        }

        playState = playing;
        changeIcon("pause");

        dfsSim();

        //test

        speed = ui.output.getSpeedInMilliseconds(speedbarId);

        setTimeout(function() {
            dfs(resetId);
        }, speed);
    }


    function dfs(id) {
       
        played = true;
        
        if ( playState === playing && id == resetId) {

            
            if (turn == "vertex") {

                vertexTurnDFS();

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                setTimeout(function() {
                    dfs(id);
                }, speed);
            }

            else if (turn == "edge") {

                edgeTurnDFS();

                speed = ui.output.getSpeedInMilliseconds(speedbarId);
    

                setTimeout(function() {
                    dfs(id);
                }, speed);
            }
        }

        else { return; }
    }

    function vertexTurnDFS() {

        if (vertexMarker >= animateList.length) {
            playState = finished;
            changeIcon("repeat");
            return;
        }

        var tempVertex = Object.keys(animateList[vertexMarker])[0];

        var vertex = "#vertex" + tempVertex;
        var text = "#text" + tempVertex;

        var tempObj = {};
        var tempArray = [];
        tempArray.push(vertex);
        tempArray.push(text);
        tempObj["vertex"] = tempArray;
        mainStack.push(tempObj);

        speed = ui.output.getSpeedInMilliseconds(speedbarId);       

        d3.select(vertex).transition().style({
            "fill" : "#808080",
            "stroke" : "#FF1919"
        }).duration(speed);

        d3.select(text).transition().style({
            "fill" : "rgb(255, 255, 255)"
        }).duration(speed);

        setTimeout(function() {
            d3.select(vertex).transition().style({
                "fill" : "#808080",
                "stroke" : "#808080"
            }).duration(speed);

            d3.select(text).transition().style({
                "fill" : "rgb(0, 0, 0)"
            }).duration(speed);

        }, speed);

        turn = "edge";

        ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);
    }

    function edgeTurnDFS() {

        var tempVertex = Object.keys(animateList[vertexMarker])[0];
        var tempList = animateList[vertexMarker][tempVertex];
        
        if (tempList.length == 0) {
            turn = "vertex";
            previousEdgeMarker.push(edgeMarker);
            edgeMarker = 0;
            vertexMarker++;

            var tempObj = {};
            var tempArray = [];
            tempObj["edgeTurn"] = tempArray;
            mainStack.push(tempObj);

            var vertexTemp = "#vertex" + tempVertex;
            var textTemp = "#text" + tempVertex; 
            d3.select(vertexTemp).transition().style({
                "fill" : "#F38630",
                "stroke" : "#F38630"
            }).duration(speed);

            d3.select(textTemp).transition().style({
                "fill" : "rgb(255, 255, 255)"
            }).duration(speed);
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

            var tempObj = {};
            var tempArray = [];
            tempArray.push(vertex2);
            tempArray.push(edge);
            tempObj["edge"] = tempArray;
            mainStack.push(tempObj);

            speed = ui.output.getSpeedInMilliseconds(speedbarId);


            d3.select(edge).transition().style({
                "stroke" : "rgb(0, 128, 0)",
                "stroke-width" : 5
            }).duration(speed);

            d3.select(vertex2).transition().style({
                "fill" : "#808080",
                "stroke" : "#808080"
            }).delay(50).duration(speed);

            edgeMarker++;

            if (edgeMarker >= tempList.length) {
                turn = "vertex";
                previousEdgeMarker.push(edgeMarker);
                edgeMarker = 0;
                vertexMarker++;

                var tempObj = {};
                var tempArray = [];
                tempObj["edgeTurn2"] = tempArray;
                mainStack.push(tempObj);
            }

            ui.output.changeProgressBar(progressbarId, progressbarIncreaseValue);
        }
    }


    //dfs specific code end

    function resetValues() {
        turn = "vertex";
        vertexMarker = 0;
        edgeMarker = 0;

        mainQ = new Queue(); // from  q.js
        mainStack = [];

        animateList = [];

        ui.output.drawProgressBar(progressbarId); //resetting the progressbar
    }

    function changeSampleGraph(graphNumber) {

        $("#mainSVG").remove();

        ui.output.redrawGraph(graphNodes[0], vizId, graphNumber);

        G = ui.output.graph();
        graphNodes = ui.output.graphNodes();
        resetValues();

        playState = notStarted;
        changeIcon("play");
        played = false;

        resetId = 0;

        chooseSampleGraph();//for sliding back
    }


    /*left side bar functions*/

    function setPadding() {
        if ($("#slide").css("display") == "none") {
            $(".thirdelem").css("padding-top", "90px");
        }

        else {
            $(".thirdelem").css("padding-top", "45px");
        }
    }

    function selectSourceButton() {
        $("#slide").toggle("slide");
        setTimeout(function() {
            setPadding();
        }, 500);
    }

    function chooseSampleGraph() {

        setPadding();
        
        $("#slide3").toggle("slide");
    }

    /*left side bar functions*/


    /*event handlers*/

    $("#play").on("click", togglePlayButton);

    $("#forward").on("click", forwardBTN);

    $("#backward").on("click", backwardBTN);

    $("#runBFS").on("click", selectSourceButton);

    $("#runDFS").on("click", dfsgo);

    $("#startBFS").on("click", bfsgo); //start main bfs

    $("#samples").on("click", chooseSampleGraph);

    $("#graph1").on('click', function() {
        changeSampleGraph(1);
    });

    $("#graph2").on('click', function() {
        changeSampleGraph(2);
    });

    $("#graph3").on('click', function() {
        changeSampleGraph(3);
    });

    d3.select("#drawPanel").on("mousedown", function() {

        if (d3.event.defaultPrevented) { return; };
        ui.output.drawVertexOnClick(this, time++);
    }); //d3 event

    /*d3.select("#drawPanel").selectAll(".link2").on("click", function() {
        draw.output.pathClick();
    });*/

    $("#draw").on("click", function() {
        ui.output.resetDrawPanel();
        time = 0;
    });

    $("#doneButton").on("click", function() {
        if (time != 0) {
            $("#mainSVG").remove();
            ui.output.drawUserGraph(time, vizId);

            G = ui.output.graph();
            graphNodes = ui.output.graphNodes();
            resetValues();

            playState = notStarted;
            changeIcon("play");
            played = false;

            resetId = 0;
        }
    });

    $("#restartButton").on("click", function() {
        ui.output.resetDrawPanel();
        time = 0;
    });
}