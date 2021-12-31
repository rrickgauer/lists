

class ListRename
{

    constructor(eListActionButton) {
        this.eListActionButton = eListActionButton;
        this.eListContainer    = $(eListActionButton).closest(`.${ListHtml.Elements.CONTAINER}`);
        this.listID            = $(this.eListContainer).attr('data-list-id');
        this.eNameHeader       = $(this.eListContainer).find(`.${ListHtml.Elements.LIST_NAME}`);
        this.originalName      = $(this.eNameHeader).text();

        // bind the object's methods
        // this.openModal = this.openModal.bind(this);
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
}

