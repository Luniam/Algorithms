$(document).ready(function(){
    $("#filter").keyup(function(){
 
        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;
 
        
       
        var imageClasses = $("#photo-container").find(".home-image");

        imageClasses.each(function(a) {
            var imageDiv = imageClasses[a];
            var image = $(imageDiv).find("img");
            var dat = $(image).data("tags");
            
            if (dat.search(new RegExp(filter, "i")) < 0) {
                $(imageDiv).fadeOut(400);
            }

            else {
                $(imageDiv).show();
                count++;
            }
        });
        
 
        // Update the count
        var numberItems = count;
        $("#filter-count").text(count);
    });
});