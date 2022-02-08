import { ApiWrapper } from "../../classes/api-wrapper";
import { Utilities } from '../../classes/utilities';
import { ListHtml } from './list-html';
import { ListSettingsModal } from './list-settings-modal';

/**
 * This class handles all the actions needed to rename a list
 */
export class ListRename
{

    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        this.newName = ListSettingsModal.getNameInputValue();
        this.listID = ListSettingsModal.getCurrentListID();

        // bind the object methods
        this.save                      = this.save.bind(this);
        this._sendPutRequest           = this._sendPutRequest.bind(this);
        this._updateActiveListElement  = this._updateActiveListElement.bind(this);
        this._updateSidenavListElement = this._updateSidenavListElement.bind(this);
    }

    /**********************************************************
    Save the list's new name
    **********************************************************/
    async save() {
        if (!ListSettingsModal.doesNameInputHaveValue()) {
            return;
        }

        // disable all the form inputs
        ListSettingsModal.disableInputs();
        ListSettingsModal.keepModalOpen(true);

        // send api request
        const successfulRequest = await this._sendPutRequest();
        
        // update the active list name text if request was successful
        if (successfulRequest) {
            this._updateActiveListElement();
            this._updateSidenavListElement();
        }
        
        ListSettingsModal.keepModalOpen(false);

        // close the modal
        ListSettingsModal.closeModal();

        // enable the inputs
        ListSettingsModal.enableInputs();
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
            type: ListSettingsModal.getListTypeValue(),
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
        const newType = ListSettingsModal.getListTypeValue();
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
        const newType = ListSettingsModal.getListTypeValue();
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
}
