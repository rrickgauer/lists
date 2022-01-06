
/**
 * This class is responsible for saving new items to active lists.
 * 
 * It sends the POST request to the API.
 * Then, it appends the item to the html.
 */


class ItemCreator
{

    constructor(newItemInputElement) {
        this.eInput       = newItemInputElement;
        this.eParentList  = $(newItemInputElement).closest(`.${ListHtml.Elements.CONTAINER}`);
        this.parentListID = $(this.eParentList).attr('data-list-id');
        this.content      = null;
        this.itemID       = null;

        this.loadInputValue   = this.loadInputValue.bind(this);
        this.assignNewItemID  = this.assignNewItemID.bind(this);
        this.sendPostRequest  = this.sendPostRequest.bind(this);
        this._inputToFormData = this._inputToFormData.bind(this);
        this.clearInputValue  = this.clearInputValue.bind(this);
        this.appendToList     = this.appendToList.bind(this);
    }


    /**********************************************************
    Retrieve the input element's value.

    Returns a bool:
        true: the input is not empty and has a value
        false: value is empty or null
    **********************************************************/
    loadInputValue() {
        const inputElementValue = $(this.eInput).val();

        if (inputElementValue.length > 0) {
            this.content = inputElementValue;
            return true;
        }
        else {
            this.content = null;
            return false;
        }
    }

    
    /**********************************************************
    Set the item id's value to a newly generated uuid
    **********************************************************/
    assignNewItemID() {
        this.itemID = Utilities.getNewUUID();
        return this;
    }

    /**********************************************************
    Send the request to the api to create the new item
    **********************************************************/
    async sendPostRequest() {
        const formData = this._inputToFormData();
        
        try {
            ApiWrapper.itemsPut(this.itemID, formData);
            return true;
        } catch(error) {
            return false;
        }

    }

    /**********************************************************
    Transform the input value into a FormData object so it can
    be sent to the api correctly.
    **********************************************************/
    _inputToFormData() {
        return Utilities.objectToFormData({
            content: this.content,
            list_id: this.parentListID,
        });
    }

    /**********************************************************
    Clear the input's value
    **********************************************************/
    clearInputValue() {
        $(this.eInput).val('');
    }

    /**********************************************************
    Append the item to the active list's html
    **********************************************************/
    appendToList() {
        const itemHtml = new ItemHtml({
            id: this.itemID,
            content: this.content,
        });

        const html = itemHtml.getHtml();

        // $(this.eParentList).find('.active-list-items-container').prepend(html);
        $(this.eParentList).find('.active-list-items-container').append(html);
    }

}

