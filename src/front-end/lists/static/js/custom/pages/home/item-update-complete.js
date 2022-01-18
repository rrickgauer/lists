import { ApiWrapper } from "../../classes/api-wrapper";

export class ItemCompletor
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(eClickedCheckbox) {
        this.eCheckbox      = eClickedCheckbox;
        this.eItemContainer = $(this.eCheckbox).closest(`.${ItemHtml.Elements.TOP}`);
        this.itemID         = $(this.eItemContainer).attr('data-item-id');
        this.itemIsComplete = this.eCheckbox.checked;

        this.save = this.save.bind(this);

        this._markItemComplete = this._markItemComplete.bind(this);
        this._markItemIncomplete = this._markItemIncomplete.bind(this);
        this._toggleItemCss = this._toggleItemCss.bind(this);
    }

    /**********************************************************
    Save the item's new complete value
    **********************************************************/
    save() {
        
        if (this.itemIsComplete) {
            this._markItemComplete();
        }
        else {
            this._markItemIncomplete();
        }
    }

    /**********************************************************
    Mark the item as complete
    **********************************************************/
    _markItemComplete() {
        ApiWrapper.itemCompletePut(this.itemID);
        this._toggleItemCss();

    }

    /**********************************************************
    Mark the item as incomplete
    **********************************************************/
    _markItemIncomplete() {
        ApiWrapper.itemCompleteDelete(this.itemID);
        this._toggleItemCss();
    }

    /**********************************************************
    Toggle the item container's css checked class
    **********************************************************/
    _toggleItemCss() {
        if (this.itemIsComplete) {
            $(this.eItemContainer).addClass('checked');
        }
        else {
            $(this.eItemContainer).removeClass('checked');
        }
    }
}