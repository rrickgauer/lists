
/**
 * This class is responsible for saving new items to active lists.
 */


class ItemCreator
{

    constructor(newItemInputElement) {
        this.eInput = newItemInputElement;

        this.content = null;
        this.itemID = null;

        this.loadInputValue = this.loadInputValue.bind(this);
        this.assignNewItemID = this.assignNewItemID.bind(this);
        this.sendPostRequest = this.sendPostRequest.bind(this);
        this._inputToFormData = this._inputToFormData.bind(this);
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
        const apiResponse = await ApiWrapper.itemsPut(this.itemID, formData);

        const apiResponseText = await apiResponse.text();
        console.log(apiResponseText);
    }

    /**********************************************************
    Transform the input value into a FormData object so it can
    be sent to the api correctly.
    **********************************************************/
    _inputToFormData() {
        return Utilities.objectToFormData({
            content: this.content,
        });
    }

}

