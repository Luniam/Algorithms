var radius = 20;
var vertexData1 = [

  {
    xVal : 330,
    yVal : 60,
    value : 0
  },

  {
    xVal : 230,
    yVal : 60,
    value : 1
  },

  {
    xVal : 230,
    yVal : 250,
    value : 2
  },

  {
    xVal : 430,
    yVal : 200,
    value : 3
  },

  {
    xVal : 80,
    yVal : 300,
    value : 4
  },

  {
    xVal : 380,
    yVal : 300,
    value : 5
  },

  {
    xVal : 130,
    yVal : 400,
    value : 6
  },

  {
    xVal : 330,
    yVal : 400,
    value : 7
  },

  {
    xVal : 450,
    yVal : 400,
    value : 8
  }

];

var edgeData1 = [
    {
        from : 0,
        to : 1,
        weight : 0
    },

    {
        from : 0,
        to : 2,
        weight : 0
    },

    {
        from : 0,
        to : 3,
        weight : 0
    },

    {
        from : 0,
        to : 4,
        weight : 0
    },

    {
        from : 1,
        to : 2,
        weight : 0
    },

    {
        from : 2,
        to : 3,
        weight : 0
    },

    {
        from : 1,
        to : 3,
        weight : 0
    },

    {
        from : 2,
        to : 4,
        weight : 0
    },

    {
        from : 2,
        to : 5,
        weight : 0
    },

    {
        from : 4,
        to : 6,
        weight : 0
    },

    {
        from : 5,
        to : 7,
        weight : 0
    },

    {
        from : 7,
        to : 8,
        weight : 0
    },

    {
        from : 8,
        to : 5,
        weight : 0
    }
];

var sampleGraph1 = [vertexData1, edgeData1, radius];
