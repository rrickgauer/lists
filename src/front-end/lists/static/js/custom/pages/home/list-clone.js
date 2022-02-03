import { ApiWrapper } from "../../classes/api-wrapper";
import { ListSettingsModal } from "./list-settings-modal";

/**
 * This class handles cloning a list
 */
export class ListClone
{
    constructor() {
        this.listID = ListSettingsModal.getCurrentListID();

        // bind the object methods
        this.clone                     = this.clone.bind(this);
    }

    
    /**********************************************************
    Clone the current list
    **********************************************************/
    async clone() {
        // disable spinner button
        ListSettingsModal.SpinnerButtons.CLONE.showSpinner();

        ListSettingsModal.keepModalOpen(true);

        // send the clone api request
        const apiResponse = await ApiWrapper.listsClone(this.listID);

        // ensure the request was successful
        if (!apiResponse.ok) {
            ListSettingsModal.SpinnerButtons.CLONE.reset();
            console.error(await apiResponse.text());
            ListSettingsModal.keepModalOpen(false);
            return false;
        }
        
        // successfull clone - refresh the page
        window.location.href = window.location.href;
        return true;
    }
}