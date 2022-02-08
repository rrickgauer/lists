import { ApiWrapper } from "../../classes/api-wrapper";
import { ItemHtml } from "./item-html";
import { TagHtml } from "./tag-html";

export class ListHtml
{

    constructor(listID) {
        this.listID   = listID;
        this.items    = null;
        this.metadata = null;
        this.tags     = null;

        // bind the object's methods
        this.fetchData            = this.fetchData.bind(this);
        this.sendApiRequests      = this.sendApiRequests.bind(this);
        this.parseApiResponseData = this.parseApiResponseData.bind(this);
        this.renderHtml           = this.renderHtml.bind(this);
        this.getHtml              = this.getHtml.bind(this);
        this.displayLoadingCard   = this.displayLoadingCard.bind(this);
    }

    /**********************************************************
    Fetch both the list data and its items

    Returns a bool:
        true: data was successfully fetched
        false: api error
    **********************************************************/
    async fetchData() {
        const sendRequestsResult = await this.sendApiRequests();

        if (!sendRequestsResult.successful) {
            return false;
        }

        // parse each api response and assign it to the respective property
        this.items = await this.parseApiResponseData(sendRequestsResult.apiResponses.items);
        this.metadata = await this.parseApiResponseData(sendRequestsResult.apiResponses.meta);
        this.tags = await this.parseApiResponseData(sendRequestsResult.apiResponses.tags);

        return true;
    }
    
    /**********************************************************
    Send all the api requests:
        GET: /lists/:list_id
        GET: /lists/:list_id/items
        GET: /lists/:list_id/tags

    Returns an object:
        successful - bool
        apiResponses - object with all 3 request responses
    **********************************************************/
    async sendApiRequests() {

        const returnVal = {
            successful: true,
        }

        // create an object with all 3 requests
        returnVal.apiResponses = {
            meta: await ApiWrapper.listsGet(this.listID),
            tags: await ApiWrapper.listTagsGet(this.listID),
            items: await ApiWrapper.itemsGetByList(this.listID),
        }

        // send all 3 requests
        await Promise.all(Object.values(returnVal.apiResponses)).catch((error) => {
            console.error(error);
            returnVal.successful = false;
        });

        return returnVal;
    }

    /**********************************************************
    Try to parse the given text data into json
    Returns an empty list if unable to parse
    **********************************************************/
    async parseApiResponseData(apiResponsePromise) {
        try {
            return await apiResponsePromise.json();
        } catch (error) {
            return [];
        }
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
        const tagsHtml = this.getTagsHtml();

        // determine which type icon to display
        const typeIcon = ListHtml.getTypeIcon(this.metadata.type);

        let html = `
        <div class="${ListHtml.Elements.CONTAINER} card my-shadow" data-list-id="${this.listID}" data-list-type="${this.metadata.type}">
            <div class="card-header pl-0">

                <div class="d-flex justify-content-between align-items-baseline">
                    <div class="d-flex align-items-baseline pl-3">
                        
                        <div class="${ListHtml.Elements.TYPE_ICON} mr-2 color-primary-primary">
                            <i class='bx ${typeIcon} bx-border-circle'></i>
                        </div>
                
                        <h4 class="${ListHtml.Elements.LIST_NAME}">${this.metadata.name}</h4>
                    </div>

                    <div class="list-header-buttons">
                        <div class="dropdown mr-2">
                            <button class="close" type="button" data-toggle="dropdown"><i class='bx bx-dots-horizontal'></i></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml.HeaderButtonActions.SETTINGS}">
                                    <i class='bx bx-cog'></i> Settings
                                </button>

                                <div class="dropdown-divider"></div>
                                
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml.HeaderButtonActions.TOGGLE_COMPLETE}">
                                    <div class="form-check">
                                        <label class="form-check-label">
                                            <input class="form-check-input ${ListHtml.Elements.TOGGLE_COMPLETE}" type="checkbox" checked> Toggle complete items
                                        </label>
                                    </div>
                                </button>

                                <button class="dropdown-item" type="button" data-list-action="${ListHtml.HeaderButtonActions.REMOVE_COMPLETE}">
                                    <i class='bx bx-trash'></i> Remove completed items
                                </button>
                    
                            </div>
                        </div>

                        <button type="button" class="close ${ListHtml.Elements.BTN_CLOSE}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>


                <div class="${ListHtml.Elements.TAGS_CONTAINER}">
                    ${tagsHtml}
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
    Generate the html for all this list' assigned tags
    **********************************************************/
    getTagsHtml() {
        let html = '';
        
        for (const tag of this.tags) {
            html += new TagHtml(tag).getHtml();
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

    
    /**********************************************************
    Get the name of the active list who has the given id
    **********************************************************/
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
    Get the given active list element's id from its data-list-id attribute.
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
    
    /**********************************************************
    Retrieve all the active list item elements of the given list element
    **********************************************************/
    static getChildItems(eActiveList) {
        return $(eActiveList).find(`.${ItemHtml.Elements.TOP}`);
    }

    /**********************************************************
    Retrieve all the assigned tag elements of the given list element
    **********************************************************/
    static getAssignedTags(eActiveListContainer) {
        return $(eActiveListContainer).find(`.${ListHtml.Elements.TAGS_CONTAINER} .${TagHtml.Elements.CONTAINER}`);
    }


}


ListHtml.Elements = {
    NEW_ITEM_FORM: 'active-list-form-new-item',
    CONTAINER: 'active-list',
    BTN_CLOSE: 'active-list-btn-close',
    ACTION_BUTTONS: 'list-header-buttons',
    LIST_NAME: 'active-list-name',
    TOGGLE_COMPLETE: 'list-header-toggle-complete',
    TYPE_ICON: 'list-header-type-icon',
    TAGS_CONTAINER: 'active-list-tags-container',
}


ListHtml.Types = {
    LIST: 'list',
    TEMPLATE: 'tempalte',
}

ListHtml.TypeIcons = {
    LIST:     'bx-list-check',
    TEMPLATE: 'bx-copy-alt',
}

ListHtml.HeaderButtonActions = {
    SETTINGS: 'settings',
    TOGGLE_COMPLETE: 'toggle-complete',
    REMOVE_COMPLETE: 'remove-complete',
}



