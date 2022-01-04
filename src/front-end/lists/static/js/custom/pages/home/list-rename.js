

class ListRename
{

    constructor() {
        this.newName = $(ListRename.Elements.INPUT).val();
        this.listID = $(ListRename.Elements.MODAL).attr('data-list-id');

        this.save = this.save.bind(this);
        this._sendPutRequest = this._sendPutRequest.bind(this);
    }

    async save() {
        // send api request
        this._sendPutRequest();
    }

    async _sendPutRequest() {
        // create a formdata oject for the request
        const formData = Utilities.objectToFormData({
            name: this.newName,
        });

        let result = true;

        try {
            const apiResponse = await ApiWrapper.listsPut(this.listID, formData);
            
            console.log(await apiResponse.text());
        } catch (error) {
            console.error(error);
            result = false;
        }

        return result;
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
}



ListRename.Elements = {
    MODAL: '#modal-list-rename',
    INPUT: '#list-rename-form-input',
    BTN_SAVE: '#list-rename-form-save',
}

