import { SpinnerButton } from '../../classes/spinner-button';
import { ApiWrapper } from "../../classes/api-wrapper";
import { Utilities } from '../../classes/utilities';
import { ListHtml } from './list-html';
import { ListDelete } from './list-delete';


/**
 * This class handles all the actions needed to rename a list
 */
export class ListSettings
{

    constructor() {
        this.newName = $(ListSettings.Elements.INPUT).val();
        this.listID = $(ListSettings.Elements.MODAL).attr('data-list-id');

        // bind the object methods
        this.save                      = this.save.bind(this);
        this._sendPutRequest           = this._sendPutRequest.bind(this);
        this._updateActiveListElement  = this._updateActiveListElement.bind(this);
        this._updateSidenavListElement = this._updateSidenavListElement.bind(this);
        this.disableInputs             = this.disableInputs.bind(this);
        this.enableInputs              = this.enableInputs.bind(this);
        this.clone = this.clone.bind(this);
        this.delete = this.delete.bind(this);
    }

    /**********************************************************
    Save the list's new name
    **********************************************************/
    async save() {
        // disable all the form inputs
        this.disableInputs();
        ListSettings.keepModalOpen(true);

        // send api request
        const successfulRequest = await this._sendPutRequest();
        
        // update the active list name text if request was successful
        if (successfulRequest) {
            this._updateActiveListElement();
            this._updateSidenavListElement();
        }
        
        ListSettings.keepModalOpen(false);

        // close the modal
        ListSettings.closeModal();

        // enable the inputs
        this.enableInputs();
    }


    /**********************************************************
    Send the api request.

    Returns a bool:
        true: successful request
        false: error with the request
    **********************************************************/
    async _sendPutRequest() {
        // create a formdata oject for the request
        const formData = Utilities.objectToFormData({
            name: this.newName,
            type: ListSettings.getListTypeValue(),
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
        const newType = ListSettings.getListTypeValue();
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
        const newType = ListSettings.getListTypeValue();
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
        ListSettings.SpinnerButtons.SAVE.showSpinner();
        ListSettings.setInputProps(true);
    }

    /**********************************************************
    Remove the disabled attribute to the form inputs
    **********************************************************/
    enableInputs() {
        ListSettings.SpinnerButtons.SAVE.reset();
        ListSettings.setInputProps(false);
    }

    /**********************************************************
    Clone the current list
    **********************************************************/
    async clone() {
        // disable spinner button
        ListSettings.SpinnerButtons.CLONE.showSpinner();

        ListSettings.keepModalOpen(true);

        // send the clone api request
        const apiResponse = await ApiWrapper.listsClone(this.listID);

        // ensure the request was successful
        if (!apiResponse.ok) {
            ListSettings.SpinnerButtons.CLONE.reset();
            console.error(await apiResponse.text());
            ListSettings.keepModalOpen(false);
            return false;
        }
        
        // successfull clone - refresh the page
        window.location.href = window.location.href;
        return true;
    }


    /**********************************************************
    Delete the current list
    **********************************************************/
    async delete() {
        const listDelete = new ListDelete(this.listID);
        listDelete.delete();

        listDelete.removeListElements();
        ListSettings.closeModal();
    }

    /**********************************************************
    Open the modal that has the rename list form
    **********************************************************/
    static openModal(eListActionButton) {
        const eActiveListContainer = $(eListActionButton).closest(`.${ListHtml.Elements.CONTAINER}`);
        const eModal = $(ListSettings.Elements.MODAL);

        // set the list id
        const listID = $(eActiveListContainer).attr('data-list-id');
        $(eModal).attr('data-list-id', listID);

        // set the original list name
        const eNameHeader = $(eActiveListContainer).find(`.${ListHtml.Elements.LIST_NAME}`);
        const originalName = $(eNameHeader).text();
        $(eModal).attr('data-list-name-original', originalName);

        // set the input value to the orignal name
        const eInput = $(ListSettings.Elements.INPUT);
        $(eInput).val(originalName);

        // set the related type radio input to checked
        const listType = $(eActiveListContainer).attr('data-list-type');
        ListSettings.setTypeOptionChecked(listType);

        // show the modal
        $(eModal).modal('show');
    }


    /**********************************************************
    Mark the type radio option as checked 
    **********************************************************/
    static setTypeOptionChecked(listType) {
        $(ListSettings.Elements.MODAL).find(`[name="${ListSettings.Elements.TYPE_OPTIONS}"][value="${listType}"]`).prop('checked', true);
    }


    /**********************************************************
    Close the open modal
    **********************************************************/
    static closeModal() {
        $(ListSettings.Elements.MODAL).modal('hide');
    }

    
    /**********************************************************
    Get the value of the checked list type radio input
    **********************************************************/
    static getListTypeValue() {
        return $(`[name="${ListSettings.Elements.TYPE_OPTIONS}"]:checked`).val();
    }

    /**********************************************************
    Set the form inputs' disabled attributes to the one provided

    Args:
        newPropValue: bool
            true: add the disabled attribute
            false: remove the disabled attribute
    **********************************************************/
    static setInputProps(newPropValue) {
        $(ListSettings.Elements.INPUT).prop('disabled', newPropValue);
        $(`[name="${ListSettings.Elements.TYPE_OPTIONS}"]`).prop('disabled', newPropValue);
    }

    /**********************************************************
    Add the waiting js class to the modal

    Args:
        setModalToWaiting: bool
            true: add the class
            false: remove the class
    **********************************************************/
    static keepModalOpen(setModalToWaiting) {
        if (setModalToWaiting) {
            $(ListSettings.Elements.MODAL).addClass(ListSettings.WaitingClasses.WAITING);
        } else {
            $(ListSettings.Elements.MODAL).removeClass(ListSettings.WaitingClasses.WAITING);
        }
    }

    /**********************************************************
    Set the modal's data-backdrop attribute value

    Args:
        dataBackdrop: ListSettings.ModalBackdrop value
            STATIC: if user clicks on backdrop, modal remains open
            OTHER: modal closes when user clicks on backdrop
    **********************************************************/
    static setModalBackdropAttribute(dataBackdrop) {
        $(ListSettings.Elements.MODAL).attr('data-backdrop', dataBackdrop);
    }


    /**********************************************************
    Handles the close modal event.
    If the modal has the waiting class, it will not close.
    **********************************************************/
    static handleModalCloseEvent(e) {
        const isModalWaiting = ListSettings.isModalWaitingForResponse();

        if (isModalWaiting) {
            e.preventDefault();
        }
    }

    
    /**********************************************************
    Check if the modal is waiting for an api response.
    Checks if it has the waiting class.

    Returns a bool
    **********************************************************/
    static isModalWaitingForResponse() {
        return $(ListSettings.Elements.MODAL).hasClass(ListSettings.WaitingClasses.WAITING);
    }
}



ListSettings.Elements = {
    MODAL: '#modal-list-settings',
    INPUT: '#list-rename-form-input',
    BTN_SAVE: '#list-rename-form-save',
    TYPE_OPTIONS: 'list-rename-form-type-radio-option',
    BTN_CLONE: '#modal-list-settings-btn-clone',
    BTN_DELETE: '#modal-list-settings-btn-delete',
    BTN_CLOSE_MODAL: '#modal-list-settings-btn-close-modal',
}

ListSettings.SpinnerButtons = {
    SAVE: new SpinnerButton(ListSettings.Elements.BTN_SAVE),
    CLONE: new SpinnerButton(ListSettings.Elements.BTN_CLONE),
    DELETE: new SpinnerButton(ListSettings.Elements.BTN_DELETE),
}

ListSettings.WaitingClasses = {
    WAITING: 'js-waiting-response',
}


ListSettings.ModalBackdrop = {
    STATIC: 'static',
    OTHER: 'false',
}

