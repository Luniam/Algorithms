var ui = ui || {};

ui.output = (function() {

    function drawSpeedBar(pageId) {
        /*pageId is a string e.g. "#speedbar"*/

        $(pageId).slider();
        $(pageId).slider('value',50); // set the speed to a middle value
    }

    function getSpeedBarValue(pageId) {
        return +$(pageId).slider("option", "value");
    }

    function getSpeedInMilliseconds(pageId) {

        /*takes a value from 0 to 100 and returns value in milliseconds*/

        var tempValue = getSpeedBarValue(pageId);

        if (tempValue == 100) {
            computed = 100;
        }

        else if (tempValue == 0) {
            computed = 1100;
        }

        else {
            tempValue = 100 - tempValue;

            var fastest = 100;
            var slowest  = 1100;

            var perDivision = (slowest-fastest)/100.0;

            var computed = (tempValue*perDivision) + 100;
        }

        return computed;

    }

    function drawProgressBar(pageId) {
        $(pageId).progressbar({
            value : 0
        });
    }

    function changeProgressBar(pageId, newValue) {

        var oldValue = $(pageId).progressbar("value");
        var final = oldValue + newValue;

        $(pageId).progressbar({
            value : final
        });
    }

    function pageLoad(vizId, speedbarId, progressbarId) {
        drawSpeedBar(speedbarId);
        speedbarValue = getSpeedBarValue(speedbarId);
        drawProgressBar(progressbarId);
    }

    function drawSVG(vizId) {
        svgNode = d3.select(vizId)
                      .append("div")
                          .classed("svg-container", true)
                          .classed("col-md-8", true)
                          .attr("id" , "mainSVG")
                          .append('svg')
                              .attr({
                                  "preserveAspectRatio" : "xMinYMin meet",
                                  "viewBox" : "0 0 900 500"
                              })
                              .classed("svg-content-responsive", true);
    }

    return {
        pageLoad : pageLoad,
        drawSVG : drawSVG
    }

}());