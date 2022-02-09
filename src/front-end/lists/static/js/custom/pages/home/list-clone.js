import { ApiWrapper } from "../../classes/api-wrapper";
import { Utilities } from "../../classes/utilities";
import { ListSettingsModal } from "./list-settings-modal";

/**
 * This class handles cloning a list
 */
export class ListClone
{
    constructor() {
        this.listID = ListSettingsModal.getCurrentListID();

        // bind the object methods
        this.clone                   = this.clone.bind(this);
        this.freezeModal             = this.freezeModal.bind(this);
        this.getUrlEncodedInputValue = this.getUrlEncodedInputValue.bind(this);
        this.unfreezeModal           = this.unfreezeModal.bind(this);
    }

    
    /**********************************************************
    Clone the current list
    **********************************************************/
    async clone() {
        this.freezeModal();

        const formData = this.getUrlEncodedInputValue();

        // send the clone api request
        const apiResponse = await ApiWrapper.listsClone(this.listID, formData);

        // ensure the request was successful
        if (!apiResponse.ok) {
            this.unfreezeModal();
            
            ApiWrapper.logError(apiResponse);
            
            return false;
        }
        
        // successfull clone - refresh the page
        window.location.href = window.location.href;
        return true;
    }

    // freeze the modal
    freezeModal() {
        // disable spinner button
        ListSettingsModal.SpinnerButtons.CLONE_SUBMIT.showSpinner();
        ListSettingsModal.keepModalOpen(true);
    }

    // url-encode the name input element value for the api
    getUrlEncodedInputValue() {
        return Utilities.objectToFormData({
            name: ListSettingsModal.getCloneFormInputValue(),
        })
    }

    // allow user to close the modal
    unfreezeModal() {
        ListSettingsModal.SpinnerButtons.CLONE_SUBMIT.reset();
        ListSettingsModal.keepModalOpen(false);
    }
}