
import { ExportItemsModal } from "./export-items-modal";
import { ApiWrapper } from "../../classes/api-wrapper";
import { Item } from "../../models/item";


/**
 * Export the list items into a textarea for the user to copy
 */
export class ExportItems
{
    
    /**
     * Constructor
     * 
     * @param {string} listID - the list id
     */
    constructor(listID) {
        this.listID = listID;

        /** @type { Item[] } */
        this.items = [];

        
        // bind the object's methods
        this.export       = this.export.bind(this);
        this._fetchItems  = this._fetchItems.bind(this);
        this._renderItems = this._renderItems.bind(this);

        ExportItemsModal.setCurrentListID(this.listID);
    }

    /**
     * Export the list 
     */ 
    async export() {

        // try to fetch the list items from the api
        const itemsFetched = await this._fetchItems();
        if (!itemsFetched) {
            return false;
        }

        this._renderItems();

        ExportItemsModal.hideLoadingSection();
        ExportItemsModal.resizeTextarea();   
    }

    /**
     * Fetch the list items from the api
     * 
     * @returns {bool} True if successfully requested api, otherwise false.
     */
    async _fetchItems() {
        const apiResponse = await ApiWrapper.itemsGetByList(this.listID);

        let successfulFetch = false;

        try {
            this.items = await apiResponse.json();
            successfulFetch = true;
        } 
        catch (exception) {
            ApiWrapper.logError(apiResponse);
            this.items = [];
        }

        return successfulFetch;
    }

    /**
     * Display the items in the text area
     */
    _renderItems() {
        let output = '';
        let first = true;

        for (const item of this.items) {
            if (!first) {
                output += '\n';
            }

            output += `${item.content}`;
            first = false;
        }

        ExportItemsModal.setTextareaValue(output);
    }
}