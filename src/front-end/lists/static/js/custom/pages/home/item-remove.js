/**
 * This class handles all the logic for removing an item from a list
 */

class ItemRemove
{
    constructor(eRemoveButton) {
        this.eRemoveButton = eRemoveButton;

        // gather item info
        this.eItemContainer = $(eRemoveButton).closest(`.${ItemHtml.Elements.TOP}`);
        this.itemID = $(this.eItemContainer).attr('data-item-id');

        // gather the parent list info
        this.eListContainer = $(this.eItemContainer).closest(`.${ListHtml.Elements.CONTAINER}`);
        this.listID = $(this.eListContainer).attr('data-list-id');


        // bind the object methods
        this.remove = this.remove.bind(this);
        this.updateListItemCount = this.updateListItemCount.bind(this);
        this.getListItemCount = this.getListItemCount.bind(this);
        this._setSidenavListItemCount = this._setSidenavListItemCount.bind(this);
    }

    /**********************************************************
    Remove the item from the active list
    **********************************************************/
    remove() {
        // tell api to delete the item
        ApiWrapper.itemDelete(this.itemID);

        // remove the item html element
        $(this.eItemContainer).remove();
    }

    /**********************************************************
    Calculate the new number of items in the parent list, then
    update the count to the corresponding sidenav item
    **********************************************************/
    updateListItemCount(eSidenavListsContainer) {
        // get the new number of items in the list
        const numItems = this.getListItemCount();

        // update the sidenav item count
        this._setSidenavListItemCount(eSidenavListsContainer, numItems);
    }

    /**********************************************************
    Get the number of items in the parent active list 
    **********************************************************/
    getListItemCount() {
        
        const eListItems = $(this.eListContainer).find(`.${ItemHtml.Elements.TOP}`);
        return eListItems.length;
    }

/**********************************************************
Update the sidenav list item count
**********************************************************/
    _setSidenavListItemCount(eSidenavListsContainer, numItems) {
        // set the sidenav badge text to the new number
        const eSidenavList = $(eSidenavListsContainer).find(`.list-group-item[data-list-id="${this.listID}"]`);
        $(eSidenavList).find('.badge').text(numItems);
    }
}