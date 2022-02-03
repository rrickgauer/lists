import { SpinnerButton } from '../../classes/spinner-button';
import { ListHtml } from './list-html';

import { ListSettingsModalTags } from "./list-settings-modal-tags";


/**
 * This class handles all the elements/actions surrounding the list settings modal.
 */
export class ListSettingsModal
{
    
    /**********************************************************
    Open the modal that has the rename list form
    **********************************************************/
    static openModal(eListActionButton) {
        const eActiveListContainer = $(eListActionButton).closest(`.${ListHtml.Elements.CONTAINER}`);

        // set the list id
        const listID = $(eActiveListContainer).attr('data-list-id');
        $(ListSettingsModal.Elements.MODAL).attr('data-list-id', listID);

        // set related name elements to the name of the list
        const originalListName = $(eActiveListContainer).find(`.${ListHtml.Elements.LIST_NAME}`).text();
        ListSettingsModal._setNameDisplays(originalListName);

        // set the related type radio input to checked
        const listType = $(eActiveListContainer).attr('data-list-type');
        ListSettingsModal.setTypeOptionChecked(listType);

        // set the list's assigned tags
        ListSettingsModalTags.setAssignedTags(listID);

        // show the modal
        $(ListSettingsModal.Elements.MODAL).modal('show');
    }

    
    /**********************************************************
    Set related name elements to the name of the list
    **********************************************************/
    static _setNameDisplays(listName) {
        // set the list name data attribute
        $(ListSettingsModal.Elements.MODAL).attr('data-list-name-original', listName);

        // name input form element value
        $(ListSettingsModal.Elements.INPUT).val(listName);
    }


    /**********************************************************
    Mark the type radio option as checked 
    **********************************************************/
    static setTypeOptionChecked(listType) {
        $(ListSettingsModal.Elements.MODAL).find(`[name="${ListSettingsModal.Elements.TYPE_OPTIONS}"][value="${listType}"]`).prop('checked', true);
    }


    /**********************************************************
    Close the open modal
    **********************************************************/
    static closeModal() {
        $(ListSettingsModal.Elements.MODAL).modal('hide');
    }
    
    /**********************************************************
    Get the value of the checked list type radio input
    **********************************************************/
    static getListTypeValue() {
        return $(`[name="${ListSettingsModal.Elements.TYPE_OPTIONS}"]:checked`).val();
    }

    /**********************************************************
    Set the form inputs' disabled attributes to the one provided

    Args:
        newPropValue: bool
            true: add the disabled attribute
            false: remove the disabled attribute
    **********************************************************/
    static setInputProps(newPropValue) {
        $(ListSettingsModal.Elements.INPUT).prop('disabled', newPropValue);
        $(`[name="${ListSettingsModal.Elements.TYPE_OPTIONS}"]`).prop('disabled', newPropValue);
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
            $(ListSettingsModal.Elements.MODAL).addClass(ListSettingsModal.WaitingClasses.WAITING);
        } else {
            $(ListSettingsModal.Elements.MODAL).removeClass(ListSettingsModal.WaitingClasses.WAITING);
        }
    }

    /**********************************************************
    Set the modal's data-backdrop attribute value

    Args:
        dataBackdrop: ListSettingsModal.ModalBackdrop value
            STATIC: if user clicks on backdrop, modal remains open
            OTHER: modal closes when user clicks on backdrop
    **********************************************************/
    static setModalBackdropAttribute(dataBackdrop) {
        $(ListSettingsModal.Elements.MODAL).attr('data-backdrop', dataBackdrop);
    }


    /**********************************************************
    Handles the close modal event.
    If the modal has the waiting class, it will not close.
    **********************************************************/
    static handleModalCloseEvent(e) {
        const isModalWaiting = ListSettingsModal.isModalWaitingForResponse();

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
        return $(ListSettingsModal.Elements.MODAL).hasClass(ListSettingsModal.WaitingClasses.WAITING);
    }

    /**********************************************************
    Event handler for name input keyup, change events
    **********************************************************/
    static handleNameInputChange() {
        if (!ListSettingsModal.doesNameInputHaveValue()) {
            $(ListSettingsModal.Elements.BTN_SAVE).prop('disabled', true);
        } else {
            $(ListSettingsModal.Elements.BTN_SAVE).prop('disabled', false);
        }
    }

    /**********************************************************
    Checks if the name input has a value
    **********************************************************/
    static doesNameInputHaveValue() {
        const nameInputValue = ListSettingsModal.getNameInputValue();

        if (nameInputValue == '' || nameInputValue == 0) {
            return false;
        } else {
            return true;
        }
    }

    /**********************************************************
    Get the value in the name input element
    **********************************************************/
    static getNameInputValue() {
        return $(ListSettingsModal.Elements.INPUT).val();
    }

    /**********************************************************
    Get the current list id attribute value
    **********************************************************/
    static getCurrentListID() {
        return $(ListSettingsModal.Elements.MODAL).attr('data-list-id');
    }

    /**********************************************************
    Add the disabled attribute to the form inputs
    **********************************************************/
    static disableInputs() {
        // disable the save button
        ListSettingsModal.SpinnerButtons.SAVE.showSpinner();
        ListSettingsModal.setInputProps(true);
    }

    /**********************************************************
    Remove the disabled attribute to the form inputs
    **********************************************************/
    static enableInputs() {
        ListSettingsModal.SpinnerButtons.SAVE.reset();
        ListSettingsModal.setInputProps(false);
    }

}


ListSettingsModal.Elements = {
    MODAL                      : '#modal-list-settings',
    INPUT                      : '#list-rename-form-input',
    BTN_SAVE                   : '#list-rename-form-save',
    TYPE_OPTIONS               : 'list-rename-form-type-radio-option',
    BTN_CLONE                  : '#modal-list-settings-btn-clone',
    BTN_DELETE                 : '#modal-list-settings-btn-delete',
    BTN_CLOSE_MODAL            : '#modal-list-settings-btn-close-modal',
}

ListSettingsModal.SpinnerButtons = {
    SAVE: new SpinnerButton(ListSettingsModal.Elements.BTN_SAVE),
    CLONE: new SpinnerButton(ListSettingsModal.Elements.BTN_CLONE),
    DELETE: new SpinnerButton(ListSettingsModal.Elements.BTN_DELETE),
}

ListSettingsModal.WaitingClasses = {
    WAITING: 'js-waiting-response',
}


ListSettingsModal.ModalBackdrop = {
    STATIC: 'static',
    OTHER: 'false',
}