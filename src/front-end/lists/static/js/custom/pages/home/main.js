import { SidenavFormList } from './sidenav-form-list';
import { ListHtml } from "./list-html";
import { ItemHtml } from "./item-html";
import { ItemContentUpdateForm } from "./item-content-update-form";
import { ListSettings } from "./list-settings";
import { ItemDrag } from "./item-drag";
import { ItemCreator } from "./item-creator";
import { ListDelete } from "./list-delete";
import { ItemCompletor } from './item-update-complete';
import { ItemRemove } from "./item-remove";
import { ListCloner } from "./list-clone";

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
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    addSidenavListeners();
    addActiveListElementListeners();
    addActiveListItemElementListeners();
    addListSettingsModalListeners();
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
        e.preventDefault();
        performListAction(this);
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
function performListAction(eListActionButton) {
    const listActionValue = $(eListActionButton).attr('data-list-action');
    
    // determine which button was clicked
    switch(listActionValue)
    {
        case ListHtml.HeaderButtonActions.SETTINGS:
            ListSettings.openModal(eListActionButton);
            break;
        case ListHtml.HeaderButtonActions.DELETE:
            const listDelete = new ListDelete(eListActionButton);
            listDelete.delete();
            break;
        case ListHtml.HeaderButtonActions.CLONE:
            const listClone = new ListCloner(eListActionButton);
            listClone.clone();
            break;
    }
}

/**********************************************************
Toggle complete items' visibility
**********************************************************/
function toggleCompleteItemsVisibility(eClickedCheckbox) {
    const eListContainer = ListHtml.getParentActiveListElement(eClickedCheckbox);
    $(eListContainer).toggleClass('hide-completed');
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
Cancel an item's content update
**********************************************************/
function cancelItemContentUpdate(eItemUpdateFormInput) {
    const eItemContainer = $(eItemUpdateFormInput).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.cancelUpdate();
}

/**********************************************************
List rename form modal: add event listeners
**********************************************************/
function addListSettingsModalListeners() {
    // save the list rename
    $(ListSettings.Elements.BTN_SAVE).on('click', function() {
        saveListSettings();
    });

    // save the list rename for typing enter key while input is in focus
    $(ListSettings.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            saveListSettings();
        }
    });


    // clone list
    $(ListSettings.Elements.BTN_CLONE).on('click', function() {
        const listSettings = new ListSettings();
        listSettings.clone();
    });

    // delete list
    $(ListSettings.Elements.BTN_DELETE).on('click', function() {
        const listSettings = new ListSettings();
        listSettings.delete();
    });

    
}

/**********************************************************
Action listener for saving a list rename
**********************************************************/
function saveListSettings() {
    const listSettings = new ListSettings();
    listSettings.save();
}


function testingActivateFirstList() {
    const firstList = $('#lists-container').find('.list-group-item-action')[0];
    activateList(firstList);
}
