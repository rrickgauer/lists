/**
 * This class handles all the logic for an item's update content form.
 */

class ItemContentUpdateForm
{
    
    constructor(eItem) {
        this.eItemContaier   = eItem;
        this.itemID          = $(this.eItemContaier).attr('data-item-id');
        this.itemComplete    = $(this.eItemContaier).attr('data-item-complete');

        this.eItemContent    = null;
        this.originalContent = null;

        this.renderUpdateForm         = this.renderUpdateForm.bind(this);
        this._getFormHtml             = this._getFormHtml.bind(this);
        this.respondToActionButton    = this.respondToActionButton.bind(this);
        this._getActionButtonDataAttr = this._getActionButtonDataAttr.bind(this);
        this.cancelUpdate             = this.cancelUpdate.bind(this);
        this._getOriginalContentAttr  = this._getOriginalContentAttr.bind(this);

        this._replaceItemContainerHtml = this._replaceItemContainerHtml.bind(this);
    }

    /**********************************************************
    Display the update content form on the screen
    **********************************************************/
    renderUpdateForm() {
        this.eItemContent    = $(this.eItemContaier).find(`.${ItemHtml.Elements.CONTENT}`);
        this.originalContent = $(this.eItemContent).text();

        const formHtml = this._getFormHtml();

        $(this.eItemContaier).html(formHtml);
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
