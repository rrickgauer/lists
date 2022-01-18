import { ListHtml } from "./list-html";
import { ItemHtml } from "./item-html";
import { Utilities } from "../../classes/utilities";
import { ApiWrapper } from "../../classes/api-wrapper";

/**
 * This class handles all the logic for an item's update content form.
 */
export class ItemContentUpdateForm
{
    
    constructor(eItem) {
        this.eItemContaier = eItem;
        this.itemID        = $(this.eItemContaier).attr('data-item-id');
        this.itemComplete  = $(this.eItemContaier).attr('data-item-complete');
        this.parentListID  = $(this.eItemContaier).closest(`.${ListHtml.Elements.CONTAINER}`).attr('data-list-id');

        this.eItemContent    = null;
        this.originalContent = null;

        // bind all the methods
        this.renderUpdateForm          = this.renderUpdateForm.bind(this);
        this._getFormHtml              = this._getFormHtml.bind(this);
        this.respondToActionButton     = this.respondToActionButton.bind(this);
        this._getActionButtonDataAttr  = this._getActionButtonDataAttr.bind(this);
        this.cancelUpdate              = this.cancelUpdate.bind(this);
        this._getOriginalContentAttr   = this._getOriginalContentAttr.bind(this);
        this.updateContent             = this.updateContent.bind(this);
        this._getInputValue            = this._getInputValue.bind(this);
        this._sendPutRequest           = this._sendPutRequest.bind(this);
        this._replaceItemContainerHtml = this._replaceItemContainerHtml.bind(this);
    }

    /**********************************************************
    Display the update content form on the screen
    **********************************************************/
    renderUpdateForm() {
        this.eItemContent    = $(this.eItemContaier).find(`.${ItemHtml.Elements.CONTENT}`);
        this.originalContent = $(this.eItemContent).text();

        // replace the html
        const formHtml = this._getFormHtml();
        $(this.eItemContaier).html(formHtml);

        // set focus to the input
        const input = $(this.eItemContaier).html(formHtml).find('input');

        // move cursor to end of text
        $(input).focus();
        $(input).val('');
        $(input).val(this.originalContent);
    }

    /**********************************************************
    Generate the update form html
    **********************************************************/
    _getFormHtml() {
        let html = `
        <form class="${ItemContentUpdateForm.Elements.FORM}" data-original-content="${this.originalContent}">
            <input type="text" class="form-control form-control-sm" value="${this.originalContent}">
            <button type="button" data-update-action="${ItemContentUpdateForm.Actions.SAVE}" class="btn btn-xs text-success no-focus-outline">Save</button>
            <button type="button" data-update-action="${ItemContentUpdateForm.Actions.CANCEL}" class="btn btn-xs text-danger no-focus-outline">Cancel</button>
        </form>`;

        return html;
    }

    /**********************************************************
    Respond to a form action button click

    Args:
        eButton: the update action button clicked
    **********************************************************/
    respondToActionButton(eButton) {
        const action = this._getActionButtonDataAttr(eButton);

        if (action == ItemContentUpdateForm.Actions.CANCEL) {
            this.cancelUpdate();
        }
        else {
            this.updateContent();
        }
    }

    /**********************************************************
    Get the data-update-action value for the given update button.

    Args:
        eButton: the action button whose 'data-update-action' value we want to get
    **********************************************************/
    _getActionButtonDataAttr(eButton) {
        return $(eButton).attr('data-update-action');
    }

    /**********************************************************
    Steps to take for canceling an update
    **********************************************************/
    cancelUpdate() {
        // create a new ItemHtml object with this object's previous values
        const itemHtml = new ItemHtml({
            id: this.itemID,
            complete: this.itemComplete,
            content: this._getOriginalContentAttr(),
        });

        // replace the container with the original html
        this._replaceItemContainerHtml(itemHtml);
    }

    /**********************************************************
    Get the value for the item's data-original-content attribute
    **********************************************************/
    _getOriginalContentAttr() {
        return $(this.eItemContaier).find(`.${ItemContentUpdateForm.Elements.FORM}`).attr('data-original-content');
    }

    /**********************************************************
    Update the item's content
    **********************************************************/
    updateContent() {
        // get the new content value from the input element
        const requestItemObject = {
            content: this._getInputValue(),
            complete: this.itemComplete,
            list_id: this.parentListID,
        }

        // send request to the api
        this._sendPutRequest(requestItemObject);

        // create a new ItemHtml object to replace the item's container html with
        requestItemObject.id = this.itemID;
        const newItemHtml = new ItemHtml(requestItemObject);
        this._replaceItemContainerHtml(newItemHtml);
    }

    /**********************************************************
    Get the form's input value
    **********************************************************/
    _getInputValue() {
        return $(this.eItemContaier).find(`.${ItemContentUpdateForm.Elements.FORM} input`).val();
    }

    /**********************************************************
    Send a PUT request to the api to save the new content's changes.

    Args:
        requestItemObject: object containing these fields:
            list_id
            content
            complete
    **********************************************************/
    _sendPutRequest(requestItemObject) {
        // transform the item object into a FormData object 
        const requestFormData = Utilities.objectToFormData(requestItemObject);

        try {
            // send the request
            ApiWrapper.itemsPut(this.itemID, requestFormData);
            return true;
        }
        catch(error) {
            console.error(error);
            return false;
        }
    }

    /**********************************************************
    Replace the item container's html with the given ItemHtml

    Args:
        newItemHtml: an ItemHtml object
    **********************************************************/
    _replaceItemContainerHtml(newItemHtml) {
        const html = newItemHtml.getHtml();
        
        $(this.eItemContaier).replaceWith(html);
    }
}

ItemContentUpdateForm.Elements = {
    FORM: 'active-list-item-content-form',
}


ItemContentUpdateForm.Actions = {
    SAVE: 'save',
    CANCEL: 'cancel',
}
