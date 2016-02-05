/*dependencies : jquery jquery-ui */

var ui = ui || {}

ui.output = (function() {


    function drawSpeedBar(pageId) {
        /*pageId is a string e.g. "#speedbar"*/

        $(pageId).slider();
        $(pageId).slider('value',50); // set the speed to a middle value
    }

    function getSpeedBarValue(pageId) {
        return $(pageId).slider("option", "value");
    }

    function getSpeedInMilliseconds(tempValue) {

        /*takes a value from 0 to 100 and returns value in milliseconds*/

        var lowVal = 100;
        var hiVal  = 2100;

        var perDivision = (hiVal-lowVal)/100;

        var computed = (tempValue*perDivision) + lowVal;

        return computed;

    }

    function drawProgressBar(pageId) {
        $(pageId).progressbar({
            value : 0
        });
    }

    return {
        drawSpeedBar : drawSpeedBar,
        getSpeedBarValue : getSpeedBarValue,
        drawProgressBar : drawProgressBar,
        getSpeedInMilliseconds : getSpeedInMilliseconds
    }

}());