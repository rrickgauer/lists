
import { TagFormNew } from "./tags-create-new";
import { TagElements } from "./tag-elements";
import { TagSectionToggle } from "./tag-section-toggle";
import { TagDelete } from "./tags-delete";
import { TagUpdateForm } from "./tags-update-form";
import { ApiWrapper } from "../../classes/api-wrapper";


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

    // delete existing tag
    $(`.${TagElements.ListGroupItem.BTN_DELETE}`).on('click', function() {
        deleteTag(this);
    });

    $(`.${TagElements.FormEdit.FORM}`).on('submit', function(e) {
        updateTag(e);
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



/**********************************************************
Delete the tag
**********************************************************/
function deleteTag(eClickedDeleteBtn) {
    const tagDelete = new TagDelete(eClickedDeleteBtn);

    if (tagDelete.confirm()) {
        tagDelete.delete();
    }
}

/**********************************************************
Update the tag
**********************************************************/
async function updateTag(event) {
    // prevent the form from being submitted automatically
    event.preventDefault();

    const updateForm = new TagUpdateForm(event.target);
    
    // disable the submit button
    updateForm.spinnerButton.showSpinner();
    
    // send the api request
    const apiResponse = await updateForm.save();

    // enable the submit button
    updateForm.spinnerButton.reset();

    // if successful api request, refresh the page
    // otherwise log the error
    if (apiResponse.ok) {
        window.location.href = window.location.href;
    } else {
        ApiWrapper.logError(apiResponse);
    }
}