import { ItemHtml } from "./item-html";
import { ItemContentUpdateForm } from "./item-content-update-form";
import { ItemCompletor } from './item-update-complete';
import { ItemRemove } from "./item-remove";

const eActiveListContainer = '.active-lists-board';


/**********************************************************
ACTIVE LIST ITEM: add event listeners
**********************************************************/
export default function addActiveListItemElementListeners() {
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
