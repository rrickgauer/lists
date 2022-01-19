import { SpinnerButton } from '../../classes/spinner-button';
import { ApiWrapper } from "../../classes/api-wrapper";
import { Utilities } from '../../classes/utilities';
import { ListHtml } from './list-html';


/**
 * This class handles all the actions needed to rename a list
 */
export class ListRename
{

    constructor() {
        this.newName = $(ListRename.Elements.INPUT).val();
        this.listID = $(ListRename.Elements.MODAL).attr('data-list-id');

        // bind the object methods
        this.save                      = this.save.bind(this);
        this._sendRequest              = this._sendRequest.bind(this);
        this._updateActiveListElement  = this._updateActiveListElement.bind(this);
        this._updateSidenavListElement = this._updateSidenavListElement.bind(this);
        this.disableInputs = this.disableInputs.bind(this);
        this.enableInputs = this.enableInputs.bind(this);
    }

    /**********************************************************
    Save the list's new name
    **********************************************************/
    async save() {
        // disable all the form inputs
        this.disableInputs();

        // send api request
        const successfulRequest = await this._sendRequest();
        
        // update the active list name text if request was successful
        if (successfulRequest) {
            this._updateActiveListElement();
            this._updateSidenavListElement();
        }

        // close the modal
        ListRename.closeModal();

        // enable the inputs
        this.enableInputs();
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
            type: ListRename.getListTypeValue(),
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
    Update the active list's name text and type icon to the new name from the input
    **********************************************************/
    _updateActiveListElement() {
        // name
        const eActiveList = ListHtml.getActiveListElementByID(this.listID);
        $(eActiveList).find(`.${ListHtml.Elements.LIST_NAME}`).text(this.newName);

        // type - data attribute
        const newType = ListRename.getListTypeValue();
        $(eActiveList).attr('data-list-type', newType);

        // type - icon
        const eNewIcon = ListHtml.getTypeIcon(newType);
        ListHtml.setActiveListTypeIcon(this.listID, eNewIcon);

    }

    
    /**********************************************************
    Update the sidenav list's name text to the new name from the input
    **********************************************************/
    _updateSidenavListElement() {
        // name
        const eSidenavListItem = $(`#sidenav .list-group-item[data-list-id="${this.listID}"]`);
        $(eSidenavListItem).find('.list-group-item-name').text(this.newName);


        // type - icon
        const newType = ListRename.getListTypeValue();
        const newIconClass = ListHtml.getTypeIcon(newType);
        const eIcon = $(eSidenavListItem).find('.list-group-item-type i');

        // drop both icon classes from the list element since we don't know which one it currently has
        $(eIcon).removeClass(ListHtml.TypeIcons.LIST);
        $(eIcon).removeClass(ListHtml.TypeIcons.TEMPLATE);

        // now add the given icon class
        $(eIcon).addClass(newIconClass);

        // type - data attribute
        $(eSidenavListItem).attr('data-list-type', newType);
    }

    /**********************************************************
    Add the disabled attribute to the form inputs
    **********************************************************/
    disableInputs() {
        // disable the save button
        ListRename.SpinnerButton.showSpinner();
        ListRename.setInputProps(true);
    }

    /**********************************************************
    Remove the disabled attribute to the form inputs
    **********************************************************/
    enableInputs() {
        ListRename.SpinnerButton.reset();
        ListRename.setInputProps(false);
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

        // set the related type radio input to checked
        const listType = $(eActiveListContainer).attr('data-list-type');
        ListRename.setTypeOptionChecked(listType);

        // show the modal
        $(eModal).modal('show');
    }


    /**********************************************************
    Mark the type radio option as checked 
    **********************************************************/
    static setTypeOptionChecked(listType) {
        $(ListRename.Elements.MODAL).find(`[name="${ListRename.Elements.TYPE_OPTIONS}"][value="${listType}"]`).prop('checked', true);
    }


    /**********************************************************
    Close the open modal
    **********************************************************/
    static closeModal() {
        $(ListRename.Elements.MODAL).modal('hide');
    }

    
    /**********************************************************
    Get the value of the checked list type radio input
    **********************************************************/
    static getListTypeValue() {
        return $(`[name="${ListRename.Elements.TYPE_OPTIONS}"]:checked`).val();
    }

    /**********************************************************
    Set the form inputs' disabled attributes to the one provided

    Args:
        newPropValue: bool
            true: add the disabled attribute
            false: remove the disabled attribute
    **********************************************************/
    static setInputProps(newPropValue) {
        $(ListRename.Elements.INPUT).prop('disabled', newPropValue);
        $(`[name="${ListRename.Elements.TYPE_OPTIONS}"]`).prop('disabled', newPropValue);
    }
}



ListRename.Elements = {
    MODAL: '#modal-list-rename',
    INPUT: '#list-rename-form-input',
    BTN_SAVE: '#list-rename-form-save',
    TYPE_OPTIONS: 'list-rename-form-type-radio-option',
}


ListRename.SpinnerButton = new SpinnerButton(ListRename.Elements.BTN_SAVE);

