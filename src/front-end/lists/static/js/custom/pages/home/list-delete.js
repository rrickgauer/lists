import { ListHtml } from "./list-html";
import { ApiWrapper } from "../../classes/api-wrapper";

/**
 * This class handles all the actions needed to delete a list
 */
export class ListDelete
{
    constructor(listID) {
        this.listID = listID;
        this.eActiveList = ListHtml.getActiveListElementByID(listID);

        // bind the object methods
        this.delete = this.delete.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.removeListElements = this.removeListElements.bind(this);
    }

    /**********************************************************
    Delete the list 
    **********************************************************/
    async delete() {
        // confirm user wants to delete the list
        if (!confirm('Are you sure you want to delete this list?')) {
            return false;
        }

        // send the delete request to the api
        const successfulRequest = await this.sendRequest();
        
        if (!successfulRequest) {
            return false;   // error with the request, so stop here
        }

        return true;
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

