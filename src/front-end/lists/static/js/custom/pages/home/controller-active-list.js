import { ListHtml } from "./list-html";
import { ItemCreator } from "./item-creator";
import { CompleteItemsRemover } from "./list-remove-complete-items";
import { ListSettingsModal } from "./list-settings-modal";
import { ExportItemsModal } from "./export-items-modal";
import { ExportItems } from "./export-items";



const eActiveListContainer = '.active-lists-board';

/**********************************************************
ACTIVE LIST: add event listeners
**********************************************************/
export default function addActiveListElementListeners() {
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


/**********************************************************
Export the list by instantiating an ExportItems object
**********************************************************/
function exportList(eListActionButton) {
    ExportItemsModal.showModal();

    const eList = ListHtml.getParentActiveListElement(eListActionButton);
    const listID = ListHtml.getActiveListElementID(eList);

    const exporter = new ExportItems(listID);
    exporter.export();
}