
import { ListHtml } from "./list-html";
import { ApiWrapper } from "../../classes/api-wrapper";

/**
 * This class is responsible for removing all the complete items from an active list.
 */
export class CompleteItemsRemover
{   
    
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(eListActionButton) {
        this.eListActionButton = eListActionButton;

        this.eListContainer = ListHtml.getParentActiveListElement(eListActionButton);
        this.eListItems = ListHtml.getChildItems(this.eListContainer);
        this.eListItemsComplete = $(this.eListItems).filter(".checked");
        this.completeItemIds = CompleteItemsRemover.getItemElementIds(this.eListItemsComplete);
    }

    
    /**********************************************************
    Tell api to delete the items
    **********************************************************/
    async remove() {
        // transform the lsit of item ids into a json string
        const itemsData = JSON.stringify(this.completeItemIds);

        // send the api request
        ApiWrapper.itemsDelete(itemsData);

        // remove the complete items from the active list
        $(this.eListItemsComplete).remove();
    }


    /**********************************************************
    Get a list of data-item-id attribute values for all item elements in the given list.
    **********************************************************/
    static getItemElementIds(eItems) {
        const itemIds = $(eItems).map(function() {
            return $(this).attr('data-item-id');
        }).get();

        return itemIds;
    }
}

