import { ApiWrapper } from "../../classes/api-wrapper";
import { SpinnerButton } from "../../classes/spinner-button";
import { ListHtml } from "./list-html";

export class ListCloner
{
    constructor(eListActionButton) {
        this.eListActionButton    = eListActionButton;
        this.eActiveListContainer = ListHtml.getParentActiveListElement(this.eListActionButton);
        this.listID               = ListHtml.getActiveListElementID(this.eActiveListContainer);
        this.spinnerButton        = new SpinnerButton(this.eListActionButton);

        this.clone = this.clone.bind(this);
    }

    // clone the list
    async clone() {
        this.spinnerButton.showSpinner();
        
        // send api request to clone
        const apiResponse = await ApiWrapper.listsClone(this.listID);

        // make sure the request was successful
        if (!apiResponse.ok) {
            this.spinnerButton.reset();
            return;
        }
    
        // refresh the page
        window.location.href = window.location.href;
    }
}