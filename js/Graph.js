var Graph = function(graphData) {

    /*unweighted undirected graph*/

    this.graphData = graphData; //graphData = [vertexData, edgeData, radius]
    this.radius = graphData[2];

    this.Vertices = 0;
    this.Edges = 0;
    this.adj = []; //adjacency lists

    //construct adjacency list from graphData
    this.Vertices = graphData[0].length;
    this.adj = new Array(this.Vertices);

    /*for bfs*/

    this.colors = new Array(this.Vertices);
    this.d = new Array(this.Vertices);
    this.parents = new Array(this.Vertices); 

    for(var i = 0; i < this.Vertices; i++) {
        this.adj[i] = [];
    }

    for(var i = 0; i < this.graphData[1].length; i++) {
        v = graphData[1][i].from;
        w = graphData[1][i].to;
        this.addEdge(v, w);
    }
}

Graph.prototype.addEdge = function(v, w) {
    this.adj[v].push(w);
    this.adj[w].push(v);
    this.Edges++;
};

Graph.prototype.getAdj = function(v) { //returns an array, the adjacency list of the corresponding vertex
    return this.adj[v];
};

Graph.prototype.V = function() { return this.Vertices; };

Graph.prototype.E = function() { return this.Edges; };