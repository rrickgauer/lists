
/**
 * This class handles all the actions needed to rename a list
 */

class ListRename
{

    constructor() {
        this.newName = $(ListRename.Elements.INPUT).val();
        this.listID = $(ListRename.Elements.MODAL).attr('data-list-id');

        this.save = this.save.bind(this);
        this._sendRequest = this._sendRequest.bind(this);
        this._updateActiveListText = this._updateActiveListText.bind(this);
        this._updateSidenavListText = this._updateSidenavListText.bind(this);
    }

    /**********************************************************
    Save the list's new name
    **********************************************************/
    async save() {
        // disable the save button
        ListRename.SpinnerButton.showSpinner();

        // send api request
        const successfulRequest = await this._sendRequest();
        
        // update the active list name text if request was successful
        if (successfulRequest) {
            this._updateActiveListText();
            this._updateSidenavListText();
        }

        // enable the save button
        ListRename.SpinnerButton.reset();

        // close the modal
        ListRename.closeModal();
    }

    /**********************************************************
    Send the api request.

    Returns a bool:
        true: successful request
        false: error with the request
    **********************************************************/
    async _sendRequest() {
        // create a formdata oject for the request
        const formData = Utilities.objectToFormData({
            name: this.newName,
        });

        let result = true;

        try {
            const apiResponse = await ApiWrapper.listsPut(this.listID, formData);
            result = apiResponse.ok;
        } catch (error) {
            console.error(error);
            result = false;
        }

        return result;
    }

    /**********************************************************
    Update the active list's name text to the new name from the input
    **********************************************************/
    _updateActiveListText() {
        const eActiveList = ListHtml.getActiveListElementByID(this.listID);
        $(eActiveList).find(`.${ListHtml.Elements.LIST_NAME}`).text(this.newName);
    }

    
    /**********************************************************
    Update the sidenav list's name text to the new name from the input
    **********************************************************/
    _updateSidenavListText() {
        const eSidenavListItem = $(`#sidenav .list-group-item[data-list-id="${this.listID}"]`);
        $(eSidenavListItem).find('.list-group-item-name').text(this.newName);
    }


    /**********************************************************
    Open the modal that has the rename list form
    **********************************************************/
    static openModal(eListActionButton) {
        const eActiveListContainer = $(eListActionButton).closest(`.${ListHtml.Elements.CONTAINER}`);
        const eModal = $(ListRename.Elements.MODAL);

        // set the list id
        const listID = $(eActiveListContainer).attr('data-list-id');
        $(eModal).attr('data-list-id', listID);

        // set the original list name
        const eNameHeader = $(eActiveListContainer).find(`.${ListHtml.Elements.LIST_NAME}`);
        const originalName = $(eNameHeader).text();
        $(eModal).attr('data-list-name-original', originalName);

        // set the input value to the orignal name
        const eInput = $(ListRename.Elements.INPUT);
        $(eInput).val(originalName);

        // show the modal
        $(eModal).modal('show');
    }

    /**********************************************************
    Close the open modal
    **********************************************************/
    static closeModal() {
        $(ListRename.Elements.MODAL).modal('hide');
    }
}



ListRename.Elements = {
    MODAL: '#modal-list-rename',
    INPUT: '#list-rename-form-input',
    BTN_SAVE: '#list-rename-form-save',
}


ListRename.SpinnerButton = new SpinnerButton(ListRename.Elements.BTN_SAVE);

