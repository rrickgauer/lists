
import { TagFormNew } from "./tags-create-new";


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
});


function addEventListeners() {
    $(TagFormNew.Elements.FORM).on('submit', function(e) {
        createNewTag(e);
    });
}



function createNewTag(eventSubmit) {
    eventSubmit.preventDefault();
    TagFormNew.create();
}

