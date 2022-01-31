
import { TagFormNew } from "./tags-create-new";
import { TagElements } from "./tag-elements";


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
});

/**********************************************************
Add all the page action listeners
**********************************************************/
function addEventListeners() {
    $(TagElements.FormNew.FORM).on('submit', function(e) {
        createNewTag(e);
    });
}

/**********************************************************
Steps to take to create a new tag
**********************************************************/
function createNewTag(eventSubmit) {
    eventSubmit.preventDefault();
    TagFormNew.create();
}

