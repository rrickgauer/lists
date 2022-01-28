import { ListHtml } from "./list-html";
import { ApiWrapper } from "../../classes/api-wrapper";

/**
 * This class handles all the actions needed to delete a list
 */
export class ListDelete
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(listID) {
        this.listID = listID;
        this.eActiveList = ListHtml.getActiveListElementByID(listID);
        this.listName = ListHtml.getActiveListElementName(this.listID);

        // bind the object methods
        this.confirm            = this.confirm.bind(this);
        this.delete             = this.delete.bind(this);
        this.sendRequest        = this.sendRequest.bind(this);
        this.removeListElements = this.removeListElements.bind(this);
    }

    /**********************************************************
    Confirm user wants to delete the list
    Have them type out the list name into the prompt input
    **********************************************************/
    confirm() {
        // prompt user for list name
        let promptResponse = prompt(`Please type "${this.listName}" to confirm:`);

        // make sure they filled it out
        if (promptResponse == null || promptResponse.length == 0) {
            return false;
        }

        // check if prompt response is match with list name
        return promptResponse.toLowerCase() == this.listName.toLowerCase();
    }

    /**********************************************************
    Delete the list 
    **********************************************************/
    async delete() {
        // send the delete request to the api
        return await this.sendRequest();
    }

    /**********************************************************
    Send the delete request to the api
    **********************************************************/
    async sendRequest() {
        try {
            const apiResponse = await ApiWrapper.listsDelete(this.listID);

            if (!apiResponse.ok) {
                console.error(await apiResponse.text());
            }

            return apiResponse.ok;

        } catch (error) {
            console.error(error);
            return false;
        }
    }

    /**********************************************************
    Remove the active/sidenav list elements
    **********************************************************/
    removeListElements() {
        // remove the active list
        $(this.eActiveList).remove();

        // remove the sidenav list
        $(`#sidenav  .list-group-item[data-list-id="${this.listID}"]`).remove();
    }
}

