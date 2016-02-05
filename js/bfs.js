/*dependencies : jquery.js, jquery-ui.js d3.js, Graph.js, geom.js, drawgraph.js, ui.js */



$(document).ready(startfn);

function startfn() {

    ui.output.pageLoad("#viz", "#speedbar", "#progressbar");


    function selectSource() {
        $("#slide").toggle("slide");
    }


    function bfsgo() {

        var source = +$("#sourceInput").val();
        selectSource();
        bfs(ui.output.graph(), ui.output.graphNodes(), source);
    }

    function bfs(graph, graphNodes, s) {
        var vertex = "#vertex" + s;
    }

    /*event handlers*/

    $("#play").on("click", ui.output.togglePlayButton);

    $("#runBFS").on("click", selectSource);

    $("#startBFS").on("click", bfsgo);

}
