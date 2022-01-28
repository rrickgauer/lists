import { ApiWrapper } from "../../classes/api-wrapper";
import { ItemHtml } from "./item-html";

export class ListHtml
{

    constructor(listID) {
        this.listID = listID;
        this.items = null;
        this.metadata = null;

        // bind the object's methods
        this.fetchData          = this.fetchData.bind(this);
        this.fetchListMetadata  = this.fetchListMetadata.bind(this);
        this.fetchItems         = this.fetchItems.bind(this);
        this.renderHtml         = this.renderHtml.bind(this);
        this.getHtml            = this.getHtml.bind(this);
        this.displayLoadingCard = this.displayLoadingCard.bind(this);
    }

    /**********************************************************
    Fetch both the list data and its items

    Returns a bool:
        true: data was successfully fetched
        false: api error
    **********************************************************/
    async fetchData() {
        const fetchMetadataSuccess = await this.fetchListMetadata();

        if (!fetchMetadataSuccess) {
            return false;
        }

        const fetchItemsSuccess = await this.fetchItems();

        if (!fetchItemsSuccess) {
            return false;
        }


        return true;
    }
    
    /**********************************************************
    Fetch the list metadata from the api.

    Returns a bool:
        true: data was successfully fetched
        false: api error
    **********************************************************/
    async fetchListMetadata() {
        const apiResponse = await ApiWrapper.listsGet(this.listID);

        if (!apiResponse.ok) {
            return false;
        }

        try {
            this.metadata = await apiResponse.json();    
        } catch (error) {
            this.metadata = null;
            return false;
        }

        return true;
    }

    /**********************************************************
    Fetch the list items from the api

    Returns a bool:
        true: data was successfully fetched
        false: api error
    **********************************************************/
    async fetchItems() {
        const apiResponse = await ApiWrapper.itemsGetByList(this.listID);

        if (!apiResponse.ok) {
            return false;
        }

        try {
            this.items = await apiResponse.json();
        } catch (error) {
            this.items = [];    // no items in this list
        }
        
        return true;
    }

    /**********************************************************
    Render this list's html to the given html element
    **********************************************************/
    renderHtml(listBoardElement) {
        const html = this.getHtml();

        // replace the loading card element with the complete card
        $(listBoardElement).find(`.${ListHtml.Elements.CONTAINER}[data-list-id="${this.listID}"]`).replaceWith(html);
    }

    /**********************************************************
    Generate the html for the list
    **********************************************************/
    getHtml() {
        const itemsHtml = this.getItemsHtml();

        // determine which type icon to display
        const typeIcon = ListHtml.getTypeIcon(this.metadata.type);

        let html = `
        <div class="${ListHtml.Elements.CONTAINER} card my-shadow" data-list-id="${this.listID}" data-list-type="${this.metadata.type}">
            <div class="card-header">

                <div class="d-flex justify-content-between align-items-baseline">
                    <h4 class="${ListHtml.Elements.LIST_NAME}">${this.metadata.name}</h4>

                    <div class="list-header-buttons">
                        <div class="dropdown mr-2">
                            <button class="close" type="button" data-toggle="dropdown"><i class='bx bx-dots-horizontal'></i></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml.HeaderButtonActions.SETTINGS}">Settings</button>
                            </div>
                        </div>

                        <button type="button" class="close ${ListHtml.Elements.BTN_CLOSE}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

                <div class="mt-2 d-flex justify-content-between">
                    <div class="${ListHtml.Elements.TYPE_ICON}"><i class='bx ${typeIcon} bx-border-circle'></i></div>
                    
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input ${ListHtml.Elements.TOGGLE_COMPLETE}" type="checkbox" checked> Completed
                        </label>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <form class="${ListHtml.Elements.NEW_ITEM_FORM}">
                    <input class="form-control form-control-sm" type="text" placeholder="Add new item...">
                </form>

                <hr>

                <div class="active-list-items-container">
                    ${itemsHtml}
                </div>
            </div>
        </div>`;

        return html;
    }


    /**********************************************************
    Generate the html for all this list's items
    **********************************************************/
    getItemsHtml() {
        let html = '';
        for (const item of this.items) {
            html += new ItemHtml(item).getHtml();
        }

        return html;
    }

    /**********************************************************
    Display the loading card html prior to fetching the data from the api.
    **********************************************************/
    displayLoadingCard(listBoardElement) {
        const html = `
            <div class="active-list card my-shadow" data-list-id="${this.listID}">
                <div class="card-body d-flex justify-content-center w-100">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>`;

        $(listBoardElement).append(html);
    }

    
    /**********************************************************
    Set the given list's icon class to the one provided

    Args:
        listID: list id
        typeIconClass: ListHtml.TypeIcons value
    **********************************************************/
    static setActiveListTypeIcon(listID, typeIconClass) {
        // gather the icon element
        const eActiveList = ListHtml.getActiveListElementByID(listID);
        const eIcon = $(eActiveList).find(`.${ListHtml.Elements.TYPE_ICON} i`);

        // drop both icon classes from the list element since we don't know which one it currently has
        $(eIcon).removeClass(ListHtml.TypeIcons.LIST);
        $(eIcon).removeClass(ListHtml.TypeIcons.TEMPLATE);

        // now add the given icon class
        $(eIcon).addClass(typeIconClass);
    }

    static getActiveListElementName(listID) {
        const eActiveList = ListHtml.getActiveListElementByID(listID);

        return $(eActiveList).find(`.${ListHtml.Elements.LIST_NAME}`).text();
    }


    /**********************************************************
    Given the list id, return the active list element with the
    matching 'data-list-id' attribute.
    **********************************************************/
    static getActiveListElementByID(listID) {
        return $(`.${ListHtml.Elements.CONTAINER}[data-list-id="${listID}"]`);
    }

    /**********************************************************
    Given an element within an active list, find the closest 
    parent active list container element.
    **********************************************************/
    static getParentActiveListElement(eChild) {
        return $(eChild).closest(`.${ListHtml.Elements.CONTAINER}`);
    }

    /**********************************************************
    Get the given active list element's id from its data-list-id 
    attribute.
    **********************************************************/
    static getActiveListElementID(eActiveList) {
        return $(eActiveList).attr('data-list-id');
    }

    /**********************************************************
    Return the appropriate type icon that should be displayed 
    for the given listType.

    Args:
        listType: ListHtml.Types member
    **********************************************************/
    static getTypeIcon(listType) {
        if (listType == ListHtml.Types.LIST) {
            return ListHtml.TypeIcons.LIST;
        } 
        else {
            return ListHtml.TypeIcons.TEMPLATE;
        }
    }



}


ListHtml.Elements = {
    NEW_ITEM_FORM: 'active-list-form-new-item',
    CONTAINER: 'active-list',
    BTN_CLOSE: 'active-list-btn-close',
    ACTION_BUTTONS: 'list-header-buttons',
    LIST_NAME: 'active-list-name',
    TOGGLE_COMPLETE: 'list-header-toggle-complete',
    TYPE_ICON: 'list-header-type-icon'
}


ListHtml.Types = {
    LIST: 'list',
    TEMPLATE: 'tempalte',
}

ListHtml.TypeIcons = {
    LIST:     'bx-checkbox-checked',
    TEMPLATE: 'bx-book',
}

ListHtml.HeaderButtonActions = {
    SETTINGS: 'settings',
}



