import { SidenavFormList } from './sidenav-form-list';
import { ListHtml } from "./list-html";
import { ItemHtml } from "./item-html";
import { ItemContentUpdateForm } from "./item-content-update-form";
import { ListRename } from "./list-rename";
import { ItemDrag } from "./item-drag";
import { ItemCreator } from "./item-creator";
import { ItemCompletor } from './item-update-complete';
import { ItemRemove } from "./item-remove";
import { CompleteItemsRemover } from "./list-remove-complete-items";
import { ListClone } from "./list-clone";
import { ListSettingsModal } from "./list-settings-modal";
import { ListDelete } from './list-delete';
import { ListSettingsModalTags } from "./list-settings-modal-tags";
import { TagAssignment } from "./tag-assignment";
import { ExportItemsModal } from "./export-items-modal";
import { ExportItems } from "./export-items";

const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {close: '#sidenav-btn-close',},
    filterForm: '#sidenav-collapse-sections-filter-form',
}

const eActiveListContainer = '.active-lists-board';
const mSidenavFormList = new SidenavFormList();
const eBtnShowSidenavBtn = '#btn-show-sidenav';
const eListsContainer = '#lists-container';


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
    toggleSidenav();    // open the sidebar initially
    testingActivateFirstList();
    
    
    // $('#modal-templates').modal('show');
    // ExportItemsModal.showModal();
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    addSidenavListeners();
    addActiveListElementListeners();
    addActiveListItemElementListeners();
    addListSettingsModalListeners();
    addExportItemsModalListeners();
    ItemDrag.listen(eActiveListContainer);  // listen for item drag/drop actions
}


/**********************************************************
SIDENAV: Register all the event listeners
**********************************************************/
function addSidenavListeners() {
    // open sidenav
    $(eBtnShowSidenavBtn).on('click', function() {
        toggleSidenav();
    }); 

    // sidebar clicking on a list
    $('#lists-container').on('click', '.list-group-item-action', function() {
        activateList(this);
    });

    // clicking on overlay when sidebar is active
    $('body').on('click', '.drawer-overlay', closeSidenav);

    // close sidebar button clicked
    $(eSidebar.buttons.close).on('click', closeSidenav);

    // begin typing into the new list input
    $(SidenavFormList.Elements.INPUT).on('keyup change', mSidenavFormList.toggleForm);

    // create a new list from the sidenav
    $(SidenavFormList.Elements.SUBMIT).on('click', mSidenavFormList.saveNewList);

    // create a new list from the sidenav
    $(SidenavFormList.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            mSidenavFormList.saveNewList();
        }
    });

    // filter lists
    $(eSidebar.filterForm).find(`.form-check-input`).on('change', function(e) {
        const checkboxValue = $(this).val();
        $(eListsContainer).find(`[data-list-type="${checkboxValue}"]`).toggleClass('d-none');
    });

    // make sure only 1 collapseable section is open at a time
    $('#sidenav-collapse-sections .collapse').on('show.bs.collapse', function() {
        $('#sidenav-collapse-sections .collapse').collapse('hide');
    });
}

/**********************************************************
Open/close the sidebar
**********************************************************/
function toggleSidenav() {
    $('#page').toggleClass('sidenav-open');
    $('body').append(eOverlay);
}

/**********************************************************
Open a list from the sidebar
**********************************************************/
async function activateList(sidebarListElement) {
    // make sure the list isn't already active 
    if ($(sidebarListElement).hasClass('active')) {
        return;
    }
    
    $(sidebarListElement).addClass('active');

    const listID = $(sidebarListElement).attr('data-list-id');
    const list = new ListHtml(listID);

    list.displayLoadingCard(eActiveListContainer);

    if (!await list.fetchData()) {
        console.error('could not fetch the list data from the api');
        return;
    }

    list.renderHtml(eActiveListContainer);
}


/**********************************************************
Close the sidebar
**********************************************************/
function closeSidenav() {
    $('#page').removeClass('sidenav-open');
    $('body .drawer-overlay').remove();
    $('#sidenav-collapse-sections .collapse').collapse('hide');
}

/**********************************************************
ACTIVE LIST: add event listeners
**********************************************************/
function addActiveListElementListeners() {
    // create new item
    $(eActiveListContainer).on('keypress', `.${ListHtml.Elements.NEW_ITEM_FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            createNewItem(this);
        }
    });

    // close an active list
    $(eActiveListContainer).on('click', `.${ListHtml.Elements.BTN_CLOSE}`, function() {
        closeActiveList(this);
    });

    // list action button
    $(eActiveListContainer).on('click', `.${ListHtml.Elements.ACTION_BUTTONS} .dropdown-item`, function(e) {
        // e.preventDefault();
        performListAction(e);
    });

    // toggle complete items visibility
    $(eActiveListContainer).on('change', `.${ListHtml.Elements.TOGGLE_COMPLETE}`, function() {
        toggleCompleteItemsVisibility(this);
    });
}

/**********************************************************
Attempt to add a new item to the active list in focus
**********************************************************/
function createNewItem(inputElement) {
    const itemCreator = new ItemCreator(inputElement);

    // ensure the input is not empty
    if (!itemCreator.loadInputValue()) {
        console.warn('Input was empty');
        return;
    }

    itemCreator.assignNewItemID();
    
    if (!itemCreator.sendPostRequest()) {
        return;
    }

    itemCreator.appendToList();
    itemCreator.clearInputValue();
}

/**********************************************************
Close an active list
**********************************************************/
function closeActiveList(eClickedCloseButton) {
    const eActiveList = $(eClickedCloseButton).closest(`.${ListHtml.Elements.CONTAINER}`);
    const listID = $(eActiveList).attr('data-list-id');

    // remove active list from the board
    $(eActiveList).remove();    

    // remove active class from sidenav list item
    $(`#lists-container .list-group-item[data-list-id="${listID}"]`).removeClass('active');
    
}

/**********************************************************
Determine which list action to take
**********************************************************/
function performListAction(event) {
    const listActionValue = $(event.target).closest('.dropdown-item').attr('data-list-action');
    
    // determine which button was clicked
    switch(listActionValue)
    {
        // open the list settings modal
        case ListHtml.HeaderButtonActions.SETTINGS:
            ListSettingsModal.openModal(event.target);
            break;
        
        // toggle complete items' visibility
        case ListHtml.HeaderButtonActions.TOGGLE_COMPLETE:
            handleToggleCompleteItemsButton(event);
            break;
        
        // delete all complete items
        case ListHtml.HeaderButtonActions.REMOVE_COMPLETE:
            removeCompleteItems(event.target);
            break;

        // export list
        case ListHtml.HeaderButtonActions.EXPORT:
            exportList(event.target);
            break;
            
    }
}

/**********************************************************
Handle an event where user clicks on toggle complete items
This only concerns when they click outside of the checkbox/label combo
**********************************************************/
function handleToggleCompleteItemsButton(event) {
    // only worry about when users click outside of the checkbox/label
    if (event.target.tagName != "BUTTON") {
        return;
    }

    // get the checkbox element
    const eListContainer = ListHtml.getParentActiveListElement(event.target);
    const eCheckbox = $(eListContainer).find(`.${ListHtml.Elements.TOGGLE_COMPLETE}`);

    // toggle checkbox's checked
    eCheckbox[0].checked = !eCheckbox[0].checked;
    
    // fire off a change event
    $(eCheckbox).change();
}


/**********************************************************
Toggle complete items' visibility
**********************************************************/
function toggleCompleteItemsVisibility(eClickedCheckbox) {
    const eListContainer = ListHtml.getParentActiveListElement(eClickedCheckbox);
    $(eListContainer).toggleClass('hide-completed');
}


/**********************************************************
Handle event for removing complete list items
**********************************************************/
function removeCompleteItems(eListActionButton) {
    const completeItemRemover = new CompleteItemsRemover(eListActionButton);
    completeItemRemover.remove();
}



function exportList(eListActionButton) {
    ExportItemsModal.showModal();

    const eList = ListHtml.getParentActiveListElement(eListActionButton);
    const listID = ListHtml.getActiveListElementID(eList);

    const exporter = new ExportItems(listID);
    exporter.export();
}







/**********************************************************
ACTIVE LIST ITEM: add event listeners
**********************************************************/
function addActiveListItemElementListeners() {
    // Display an item's update content form
    $(eActiveListContainer).on('click', `.${ItemHtml.Elements.CONTENT}`, function() {
        displayItemUpdateForm(this);
    });
    
    // mark item complete
    $(eActiveListContainer).on('change', `.${ItemHtml.Elements.CHECKBOX}`, function() {
        completeItem(this);
    });

    // delete an item
    $(eActiveListContainer).on('click', `.${ItemHtml.Elements.BTN_DELETE}`, function() {
        deleteItem(this);
    });

    // When editing an item's content, either save or cancel update
    $(eActiveListContainer).on('click', `.${ItemContentUpdateForm.Elements.FORM} button`, function() {
        performUpdateItemFormAction(this);
    });

    // When editing an item's content, hits enter
    $(eActiveListContainer).on('keypress', `.${ItemContentUpdateForm.Elements.FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            updateItemContent(this);
        }
    });
}

/**********************************************************
Render an item's update content form.
**********************************************************/
function displayItemUpdateForm(eItemContent) {
    const eItemContainer = $(eItemContent).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.renderUpdateForm();
}

/**********************************************************
Item's complete checkbox was clicked
**********************************************************/
function completeItem(eCheckbox) {
    const itemCompletor = new ItemCompletor(eCheckbox);
    itemCompletor.save();
}


/**********************************************************
Delete an item
**********************************************************/
function deleteItem(eDeleteButton) {
    const itemRemove = new ItemRemove(eDeleteButton);
    itemRemove.remove();
    itemRemove.updateListItemCount('#sidenav');
}

/**********************************************************
Respond to an item's update content form action button being clicked.
**********************************************************/
function performUpdateItemFormAction(eUpdateItemFormActionButton) {
    const eItemContainer = $(eUpdateItemFormActionButton).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.respondToActionButton(eUpdateItemFormActionButton);
}


/**********************************************************
Update an item's content
**********************************************************/
function updateItemContent(eItemUpdateFormInput) {
    const eItemContainer = $(eItemUpdateFormInput).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.updateContent();
}   

/**********************************************************
List rename form modal: add event listeners
**********************************************************/
function addListSettingsModalListeners() {
    // save the list rename
    $(ListSettingsModal.Elements.BTN_SAVE).on('click', function() {
        saveListSettings();
    });

    // save the list rename for typing enter key while input is in focus
    $(ListSettingsModal.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            saveListSettings();
        }
    });


    // clone list
    // $(ListSettingsModal.Elements.BTN_CLONE).on('click', function() {
    //     const listSettings = new ListClone();
    //     listSettings.clone();
    // });

    $(ListSettingsModal.Elements.FORM_CLONE).on('submit', function(e) {
        e.preventDefault();
        const listSettings = new ListClone();
        listSettings.clone();
    });


    // delete list
    $(ListSettingsModal.Elements.BTN_DELETE).on('click', deleteList);

    // close modal
    $(ListSettingsModal.Elements.MODAL).on('hide.bs.modal', ListSettingsModal.handleModalCloseEvent);

    // rename list name input
    $(ListSettingsModal.Elements.INPUT).on('keyup change', ListSettingsModal.handleNameInputChange);

    // assign/remove a tag to a list
    $(`.${ListSettingsModalTags.Elements.ITEM_CHECKBOX}`).on('change', function() {
        assignListTag(this);
    });

}

/**********************************************************
Action listener for saving a list rename
**********************************************************/
function saveListSettings() {
    const listSettings = new ListRename();
    listSettings.save();
}

/**********************************************************
Delete the current list
**********************************************************/
function deleteList() {
    const listID = ListSettingsModal.getCurrentListID();
    const listDelete = new ListDelete(listID);

    if (!listDelete.confirm()) {
        return;
    }

    listDelete.delete();
    listDelete.removeListElements();
    ListSettingsModal.closeModal();
}

/**********************************************************
Add or remove the tag assignment
**********************************************************/
function assignListTag(eClickedCheckbox) {
    const tagAssignment = new TagAssignment(eClickedCheckbox);

    if (tagAssignment.isNew()) {
        tagAssignment.save();
    } else {
        tagAssignment.delete();
    }
}




function addExportItemsModalListeners() {

    // show the spinner when the modal is closed
    // $(ExportItemsModal.Elements.MODAL).on('hidden.bs.modal', ExportItemsModal.showLoadingSection);

}




function testingActivateFirstList() {
    const firstList = $('#lists-container').find('.list-group-item-action')[0];
    activateList(firstList);
}



