var Graph = function(graphData) {

    /*unweighted undirected graph*/


    //"constructor"
    this.init = function() {
        this.graphData = graphData; //graphData = [vertexData, edgeData, radius]
        this.radius = graphData[2];

        this.Vertices = 0;
        this.Edges = 0;
        this.adj = []; //adjacency lists

        //construct adjacency list from graphData
        this.Vertices = graphData[0].length;
        this.adj = new Array(this.Vertices);
        for(var i = 0; i < this.Vertices; i++) {
            this.adj[i] = [];
        }
        for(var i = 0; i < this.Vertices; i++) {
            v = graphData[1][i].from;
            w = graphData[1][i].to;
            this.addEdge(v, w);
        }
    }
    //"constructor"

    this.addEdge = function(v, w) {
        this.adj[v].push(w);
        this.adj[w].push(v);
        this.Edges++;
    }

    this.getAdj = function(v) { //returns an array, the adjacency list of the corresponding vertex
        return this.adj[v];
    }
}