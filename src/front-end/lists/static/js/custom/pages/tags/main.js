
import { TagFormNew } from "./tags-create-new";
import { TagElements } from "./tag-elements";
import { TagSectionToggle } from "./tag-section-toggle";


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

    // edit tag
    $(`.${TagElements.ListGroupItem.BTN_EDIT}`).on('click', function() {
        showEditFormSection(this);
    });

    // cancel edit tag
    $(`.${TagElements.FormEdit.Buttons.CANCEL}`).on('click', function() {
        showNormalDisplaySection(this);
    });
}

/**********************************************************
Steps to take to create a new tag
**********************************************************/
function createNewTag(eventSubmit) {
    eventSubmit.preventDefault();
    TagFormNew.create();
}

/**********************************************************
Show the edit tag form
**********************************************************/
function showEditFormSection(eToggleBtn) {
    const toggler = new TagSectionToggle(eToggleBtn);
    toggler.showEditFormSection();
}


/**********************************************************
Show the normal display tag section
**********************************************************/
function showNormalDisplaySection(eToggleBtn) {
    const toggler = new TagSectionToggle(eToggleBtn);
    toggler.showDisplaySection();
}




