var Graph = function(graphData) {

    /*unweighted undirected graph*/

    this.graphData = graphData; //graphData = [vertexData, edgeData, radius]
    this.radius = graphData[2];

    this.Vertices = 0;
    this.Edges = 0;
    this.adj = []; //adjacency lists

    this.init = function() { //construct adjacency list from graphData
        this.Vertices = graphData[0].length;
        this.adj = new Array(this.Vertices);
        for(var i = 0; i < this.Vertices; i++) {
            v = graphData[1][i].from;
            w = graphData[1][i].to;
            addEdge(v, w);
        }
    }

    this.addEdge = function(v, w) {
        adj[v].push(w);
        adj[w].push(v);
        this.Edges++;
    }

    this.getAdj = function(v) { //returns an array, the adjacency list of the corresponding vertex
        return this.adj[v];
    }
}