(function(){'use strict';/************************************************
This class contains logic for disabling and then
re-enabling html buttons.

When the button is disabled, a spinner is shown
and it is set to disabled.
*************************************************/


class SpinnerButton
{
    /************************************************
    Constructor

    Parms:
        a_strSelector - the html selector
        a_strDisplayText - the original text to display
    *************************************************/
    constructor(a_strSelector) {
        this.selector = a_strSelector;
        this.displayText = $(a_strSelector).text();
    }

    /************************************************
    Disable the button and show the spinner.
    *************************************************/
    showSpinner() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).html(SpinnerButton.SPINNER_SMALL).width(width).prop('disabled', true);
    }

    /************************************************
    Reset the button back to its normal state
    *************************************************/
    reset() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).text(self.displayText).width(width).prop('disabled', false);
    }
}

SpinnerButton.SPINNER       = '<div class="spinner-border" role="status"></div>';
SpinnerButton.SPINNER_SMALL = '<div class="spinner-border spinner-border-sm" role="status"></div>';class ApiWrapper$1
{
    /**********************************************************
    Create a new user
    **********************************************************/
    static async usersPost(formData) {
        return await fetch(ApiWrapper$1.Urls.USERS, {
            method: ApiWrapper$1.Methods.POST,
            body: formData,
        });
    }

    /**********************************************************
    Login
    **********************************************************/
    static async login(formData) {
        return await fetch(ApiWrapper$1.Urls.LOGIN, {
            method: ApiWrapper$1.Methods.POST,
            body: formData,
        });
    }

    /**********************************************************
    Create a new list
    **********************************************************/
    static async listsPost(requestBody) {
        return await fetch(ApiWrapper$1.Urls.LISTS, {
            method: ApiWrapper$1.Methods.POST,
            body: requestBody,
        });
    }

    /**********************************************************
    Get a single list
    **********************************************************/
    static async listsGet(listID) {
        const url = `${ApiWrapper$1.Urls.LISTS}/${listID}`;
        return await fetch(url, {
            method: ApiWrapper$1.Methods.GET,
        });
    }

    /**********************************************************
    Update a list
    **********************************************************/
    static async listsPut(listID, formData) {
        const url = `${ApiWrapper$1.Urls.LISTS}/${listID}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.PUT,
            body: formData,
        });
    }

    /**********************************************************
    Delete a list
    **********************************************************/
    static async listsDelete(listID) {
        const url = `${ApiWrapper$1.Urls.LISTS}/${listID}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.DELETE,
        });
    }

    /**********************************************************
    Clone the given list.
    **********************************************************/
    static async listsClone(listID) {
        const url = `${ApiWrapper$1.Urls.LISTS}/${listID}/clones`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.POST,
        });
    }


    /**********************************************************
    Get the items that belong to the given list id
    **********************************************************/
    static async itemsGetByList(listID) {
        let url = `${ApiWrapper$1.Urls.ITEMS}?list_id=${listID}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.GET,
        });
    }

    /**********************************************************
    PATCH: /items
    **********************************************************/
    static async itemsPatch(bodyData) {
        const url = `${ApiWrapper$1.Urls.ITEMS}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.PATCH,
            body: bodyData,
            headers: {
                'Content-Type': 'application/json'
              },
            
        });
    }

    /**********************************************************
    PUT: /items/:item_id
    **********************************************************/
    static async itemsPut(itemID, formData) {
        const url = `${ApiWrapper$1.Urls.ITEMS}/${itemID}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.PUT,
            body: formData,
        });
    }


    /**********************************************************
    DELETE: /items/:item_id
    **********************************************************/
    static async itemDelete(itemID) {
        const url = `${ApiWrapper$1.Urls.ITEMS}/${itemID}`;

        return await fetch(url, {
            method: ApiWrapper$1.Methods.DELETE,
        });
    }


    /**********************************************************
    PUT: /items/:item_id/complete
    **********************************************************/
    static async itemCompletePut(itemID) {
        return await ApiWrapper$1._itemCompleteUpdate(itemID, ApiWrapper$1.Methods.PUT);
    }

    /**********************************************************
    DELETE: /items/:item_id/complete
    **********************************************************/
    static async itemCompleteDelete(itemID) {
        return await ApiWrapper$1._itemCompleteUpdate(itemID, ApiWrapper$1.Methods.DELETE);
    }


    static async _itemCompleteUpdate(itemID, requestMethod) {
        const url = `${ApiWrapper$1.Urls.ITEMS}/${itemID}/complete`;

        return await fetch(url, {
            method: requestMethod,
        });
    }

}



ApiWrapper$1.Methods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
};

ApiWrapper$1.Urls = {
    USERS: '/api/users',
    LOGIN: '/api/login',
    LISTS: '/api/lists',
    ITEMS: '/api/items',
};class Utilities$1
{
    
    /**********************************************************
    Generate a new UUID
    **********************************************************/
    static getNewUUID() {
        return uuidv4();
    }

    /**********************************************************
    Transforms the given object into a FormData object.
    **********************************************************/
    static objectToFormData(canidateObject) {
        const formData = new FormData();

        for (const key in canidateObject) {
            formData.append(key, canidateObject[key]);
        }

        return formData;
    }
}class SidenavFormList
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        this.spinnerButton = new SpinnerButton(SidenavFormList.elements.submit);

        // bind all the functions
        this.toggleForm                = this.toggleForm.bind(this);
        this.showForm                  = this.showForm.bind(this);
        this.hideForm                  = this.hideForm.bind(this);
        this.saveNewList               = this.saveNewList.bind(this);
        this.validateNameInput         = this.validateNameInput.bind(this);
        this.sendPostRequest           = this.sendPostRequest.bind(this);
        this.handlePostRequestResponse = this.handlePostRequestResponse.bind(this);
        this.getTypeInputValue         = this.getTypeInputValue.bind(this);
        this.getNameInputValue         = this.getNameInputValue.bind(this);
    }

    /**********************************************************
    If the input element has a non-empty value, show the rest of the form.
    Otherwise, hide it.
    **********************************************************/
    toggleForm() {        
        const nameInputValue = this.getNameInputValue();
        nameInputValue.length > 0 ? this.showForm() : this.hideForm();
    }

    /**********************************************************
    Show the rest of the form
    **********************************************************/
    showForm() {
        $(SidenavFormList.elements.submit).removeClass('d-none');
        $(SidenavFormList.elements.radioContainer).removeClass('d-none');
    }

    /**********************************************************
    Hide the rest of the form
    **********************************************************/
    hideForm() {
        $(SidenavFormList.elements.submit).addClass('d-none');
        $(SidenavFormList.elements.radioContainer).addClass('d-none');
    }

    /**********************************************************
    Save the new list
    **********************************************************/
    async saveNewList() {
        // make sure that the name input value is valid
        if (!this.validateNameInput()) {
            return;
        }

        // disable the submit button and show that we are processing this request
        this.spinnerButton.showSpinner();

        // send the api request
        const apiResponse = await this.sendPostRequest();
        
        await this.handlePostRequestResponse(apiResponse);
    }

    /**********************************************************
    Validate that the name input value is valid
    **********************************************************/
    validateNameInput() {
        const nameInputValue = this.getNameInputValue();

        // make sure the value is not empty
        if (nameInputValue.length == 0) {
            return false;
        }

        return true;
    }


    /**********************************************************
    Send a POST request to the API to create the new list
    **********************************************************/
    async sendPostRequest() {
        // create the FormData object to send the input values to the api
        const formData = Utilities$1.objectToFormData({
            name: this.getNameInputValue(),
            type: this.getTypeInputValue(),
        });
        
        // send the api request
        return await ApiWrapper$1.listsPost(formData);
    }

    /**********************************************************
    Steps to take after receiving the api post response
    **********************************************************/
    async handlePostRequestResponse(apiResponse) {
        // refresh the page if request was successful
        if (apiResponse.ok) {
            window.location.href = window.location.href;
        } else {
            console.error(await apiResponse.text());
            this.spinnerButton.reset();
        }
    }


    /**********************************************************
    Get the current value of the type radio input
    **********************************************************/
    getTypeInputValue() {
        return $(`[name=${SidenavFormList.elements.radioName}]:checked`).val();
    }

    /**********************************************************
    Get the current value of the name text input
    **********************************************************/
    getNameInputValue() {
        return $(SidenavFormList.elements.input).val();
    }

}

/**********************************************************
ALl the related form html elements.
**********************************************************/
SidenavFormList.elements = {
    container: '.sidenav-form-list-container',
    form: '.sidenav-form-list',
    input: '.sidenav-form-list-input',
    submit: '.sidenav-form-list-submit',
    radioContainer: '.sidenav-form-list-radio',
    radioName: 'sidenav-form-list-radio-option'
};class ItemHtml$1
{
    constructor(itemObject) {
        this.id          = itemObject.id;           //char(36)
        this.list_id     = itemObject.list_id;      //char(36)
        this.content     = itemObject.content;      //char(250)
        this.rank        = itemObject.rank;         //int unsigned 
        this.complete    = itemObject.complete;     //enum('n','y') 
        this.created_on  = itemObject.created_on;   //timestamp 
        this.modified_on = itemObject.modified_on;  //timestamp 

        this.getHtml = this.getHtml.bind(this);
    }

    /**********************************************************
    Returns the html for this list
    **********************************************************/
    getHtml() {
        const checkedHtml = this.complete == "y" ? 'checked' : '';

        let html = `
        <div class="${ItemHtml$1.Elements.TOP} ${checkedHtml}" data-item-id="${this.id}" data-item-complete="${this.complete}" draggable="true">
            <div class="d-flex align-items-baseline">
                <input type="checkbox" class="${ItemHtml$1.Elements.CHECKBOX}" ${checkedHtml}>
                <span class="ml-2 ${ItemHtml$1.Elements.CONTENT}">${this.content}</span>
            </div>

            <div class="d-flex align-items-baseline">
                <button type="button" class="close ${ItemHtml$1.Elements.BTN_DELETE}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>`;

        return html;
    }

    // retrieve the item element with a data-item-id that matches the itemID
    static getItemWithID(itemID) {
        const eItem = $(`.${ItemHtml$1.Elements.TOP}[data-item-id="${itemID}"]`);

        return eItem;
    }

    // Retrieve the id of the given item html element
    static getItemID(eItem) {
        return $(eItem).attr('data-item-id');
    }

    static getContainerItem(eChildElement) {
        return $(eChildElement).closest(`.${ItemHtml$1.Elements.TOP}`);
    }
}

ItemHtml$1.Elements = {
    TOP: 'active-list-item',
    CONTENT: 'active-list-item-content',
    CHECKBOX: 'active-list-item-checkbox',
    BTN_DELETE: 'active-list-item-btn-delete'
};class ListHtml$1
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
        const apiResponse = await ApiWrapper$1.listsGet(this.listID);

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
        const apiResponse = await ApiWrapper$1.itemsGetByList(this.listID);

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
        $(listBoardElement).find(`.${ListHtml$1.Elements.CONTAINER}[data-list-id="${this.listID}"]`).replaceWith(html);
    }

    /**********************************************************
    Generate the html for the list
    **********************************************************/
    getHtml() {
        const itemsHtml = this.getItemsHtml();

        // determine which type icon to display
        const typeIcon = ListHtml$1.getTypeIcon(this.metadata.type);

        let html = `
        <div class="${ListHtml$1.Elements.CONTAINER} card my-shadow" data-list-id="${this.listID}" data-list-type="${this.metadata.type}">
            <div class="card-header">

                <div class="d-flex justify-content-between align-items-baseline">
                    <h4 class="${ListHtml$1.Elements.LIST_NAME}">${this.metadata.name}</h4>

                    <div class="list-header-buttons">
                        <div class="dropdown mr-2">
                            <button class="close" type="button" data-toggle="dropdown"><i class='bx bx-dots-horizontal'></i></button>
                            <div class="dropdown-menu dropdown-menu-right">
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml$1.HeaderButtonActions.SETTINGS}">Settings</button>
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml$1.HeaderButtonActions.CLONE}">Clone</button>
                                <button class="dropdown-item" type="button" data-list-action="${ListHtml$1.HeaderButtonActions.DELETE}">Delete</button>
                            </div>
                        </div>

                        <button type="button" class="close ${ListHtml$1.Elements.BTN_CLOSE}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>

                <div class="mt-2 d-flex justify-content-between">
                    <div class="${ListHtml$1.Elements.TYPE_ICON}"><i class='bx ${typeIcon} bx-border-circle'></i></div>
                    
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input ${ListHtml$1.Elements.TOGGLE_COMPLETE}" type="checkbox" checked> Completed
                        </label>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <form class="${ListHtml$1.Elements.NEW_ITEM_FORM}">
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
            html += new ItemHtml$1(item).getHtml();
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
        const eActiveList = ListHtml$1.getActiveListElementByID(listID);
        const eIcon = $(eActiveList).find(`.${ListHtml$1.Elements.TYPE_ICON} i`);

        // drop both icon classes from the list element since we don't know which one it currently has
        $(eIcon).removeClass(ListHtml$1.TypeIcons.LIST);
        $(eIcon).removeClass(ListHtml$1.TypeIcons.TEMPLATE);

        // now add the given icon class
        $(eIcon).addClass(typeIconClass);
    }


    /**********************************************************
    Given the list id, return the active list element with the
    matching 'data-list-id' attribute.
    **********************************************************/
    static getActiveListElementByID(listID) {
        return $(`.${ListHtml$1.Elements.CONTAINER}[data-list-id="${listID}"]`);
    }

    /**********************************************************
    Given an element within an active list, find the closest 
    parent active list container element.
    **********************************************************/
    static getParentActiveListElement(eChild) {
        return $(eChild).closest(`.${ListHtml$1.Elements.CONTAINER}`);
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
        if (listType == ListHtml$1.Types.LIST) {
            return ListHtml$1.TypeIcons.LIST;
        } 
        else {
            return ListHtml$1.TypeIcons.TEMPLATE;
        }
    }
}


ListHtml$1.Elements = {
    NEW_ITEM_FORM: 'active-list-form-new-item',
    CONTAINER: 'active-list',
    BTN_CLOSE: 'active-list-btn-close',
    ACTION_BUTTONS: 'list-header-buttons',
    LIST_NAME: 'active-list-name',
    TOGGLE_COMPLETE: 'list-header-toggle-complete',
    TYPE_ICON: 'list-header-type-icon'
};


ListHtml$1.Types = {
    LIST: 'list',
    TEMPLATE: 'tempalte',
};

ListHtml$1.TypeIcons = {
    LIST:     'bx-checkbox-checked',
    TEMPLATE: 'bx-book',
};

ListHtml$1.HeaderButtonActions = {
    SETTINGS: 'settings',
    DELETE: 'delete',
    CLONE: 'clone',
};/**
 * This class handles all the logic for an item's update content form.
 */

class ItemContentUpdateForm
{
    
    constructor(eItem) {
        this.eItemContaier = eItem;
        this.itemID        = $(this.eItemContaier).attr('data-item-id');
        this.itemComplete  = $(this.eItemContaier).attr('data-item-complete');
        this.parentListID  = $(this.eItemContaier).closest(`.${ListHtml.Elements.CONTAINER}`).attr('data-list-id');

        this.eItemContent    = null;
        this.originalContent = null;

        // bind all the methods
        this.renderUpdateForm          = this.renderUpdateForm.bind(this);
        this._getFormHtml              = this._getFormHtml.bind(this);
        this.respondToActionButton     = this.respondToActionButton.bind(this);
        this._getActionButtonDataAttr  = this._getActionButtonDataAttr.bind(this);
        this.cancelUpdate              = this.cancelUpdate.bind(this);
        this._getOriginalContentAttr   = this._getOriginalContentAttr.bind(this);
        this.updateContent             = this.updateContent.bind(this);
        this._getInputValue            = this._getInputValue.bind(this);
        this._sendPutRequest           = this._sendPutRequest.bind(this);
        this._replaceItemContainerHtml = this._replaceItemContainerHtml.bind(this);
    }

    /**********************************************************
    Display the update content form on the screen
    **********************************************************/
    renderUpdateForm() {
        this.eItemContent    = $(this.eItemContaier).find(`.${ItemHtml.Elements.CONTENT}`);
        this.originalContent = $(this.eItemContent).text();

        // replace the html
        const formHtml = this._getFormHtml();
        $(this.eItemContaier).html(formHtml);

        // set focus to the input
        const input = $(this.eItemContaier).html(formHtml).find('input');

        // move cursor to end of text
        $(input).focus();
        $(input).val('');
        $(input).val(this.originalContent);
    }

    /**********************************************************
    Generate the update form html
    **********************************************************/
    _getFormHtml() {
        let html = `
        <form class="${ItemContentUpdateForm.Elements.FORM}" data-original-content="${this.originalContent}">
            <input type="text" class="form-control form-control-sm" value="${this.originalContent}">
            <button type="button" data-update-action="${ItemContentUpdateForm.Actions.SAVE}" class="btn btn-xs text-success no-focus-outline">Save</button>
            <button type="button" data-update-action="${ItemContentUpdateForm.Actions.CANCEL}" class="btn btn-xs text-danger no-focus-outline">Cancel</button>
        </form>`;

        return html;
    }

    /**********************************************************
    Respond to a form action button click

    Args:
        eButton: the update action button clicked
    **********************************************************/
    respondToActionButton(eButton) {
        const action = this._getActionButtonDataAttr(eButton);

        if (action == ItemContentUpdateForm.Actions.CANCEL) {
            this.cancelUpdate();
        }
        else {
            this.updateContent();
        }
    }

    /**********************************************************
    Get the data-update-action value for the given update button.

    Args:
        eButton: the action button whose 'data-update-action' value we want to get
    **********************************************************/
    _getActionButtonDataAttr(eButton) {
        return $(eButton).attr('data-update-action');
    }

    /**********************************************************
    Steps to take for canceling an update
    **********************************************************/
    cancelUpdate() {
        // create a new ItemHtml object with this object's previous values
        const itemHtml = new ItemHtml({
            id: this.itemID,
            complete: this.itemComplete,
            content: this._getOriginalContentAttr(),
        });

        // replace the container with the original html
        this._replaceItemContainerHtml(itemHtml);
    }

    /**********************************************************
    Get the value for the item's data-original-content attribute
    **********************************************************/
    _getOriginalContentAttr() {
        return $(this.eItemContaier).find(`.${ItemContentUpdateForm.Elements.FORM}`).attr('data-original-content');
    }

    /**********************************************************
    Update the item's content
    **********************************************************/
    updateContent() {
        // get the new content value from the input element
        const requestItemObject = {
            content: this._getInputValue(),
            complete: this.itemComplete,
            list_id: this.parentListID,
        };

        // send request to the api
        this._sendPutRequest(requestItemObject);

        // create a new ItemHtml object to replace the item's container html with
        requestItemObject.id = this.itemID;
        const newItemHtml = new ItemHtml(requestItemObject);
        this._replaceItemContainerHtml(newItemHtml);
    }

    /**********************************************************
    Get the form's input value
    **********************************************************/
    _getInputValue() {
        return $(this.eItemContaier).find(`.${ItemContentUpdateForm.Elements.FORM} input`).val();
    }

    /**********************************************************
    Send a PUT request to the api to save the new content's changes.

    Args:
        requestItemObject: object containing these fields:
            list_id
            content
            complete
    **********************************************************/
    _sendPutRequest(requestItemObject) {
        // transform the item object into a FormData object 
        const requestFormData = Utilities.objectToFormData(requestItemObject);

        try {
            // send the request
            ApiWrapper.itemsPut(this.itemID, requestFormData);
            return true;
        }
        catch(error) {
            console.error(error);
            return false;
        }
    }

    /**********************************************************
    Replace the item container's html with the given ItemHtml

    Args:
        newItemHtml: an ItemHtml object
    **********************************************************/
    _replaceItemContainerHtml(newItemHtml) {
        const html = newItemHtml.getHtml();
        
        $(this.eItemContaier).replaceWith(html);
    }
}

ItemContentUpdateForm.Elements = {
    FORM: 'active-list-item-content-form',
};


ItemContentUpdateForm.Actions = {
    SAVE: 'save',
    CANCEL: 'cancel',
};/**
 * This class handles all the actions needed to rename a list
 */
class ListRename
{

    constructor() {
        this.newName = $(ListRename.Elements.INPUT).val();
        this.listID = $(ListRename.Elements.MODAL).attr('data-list-id');

        // bind the object methods
        this.save                      = this.save.bind(this);
        this._sendRequest              = this._sendRequest.bind(this);
        this._updateActiveListElement  = this._updateActiveListElement.bind(this);
        this._updateSidenavListElement = this._updateSidenavListElement.bind(this);
    }

    /**********************************************************
    Save the list's new name
    **********************************************************/
    async save() {
        // disable the save button
        ListRename.SpinnerButton.showSpinner();

        // send api request
        const successfulRequest = await this._sendRequest();
        
        // update the active list name text if request was successful
        if (successfulRequest) {
            this._updateActiveListElement();
            this._updateSidenavListElement();
        }

        // enable the save button
        ListRename.SpinnerButton.reset();

        // close the modal
        ListRename.closeModal();
    }

    /**********************************************************
    Send the api request.

    Returns a bool:
        true: successful request
        false: error with the request
    **********************************************************/
    async _sendRequest() {
        // create a formdata oject for the request
        const formData = Utilities.objectToFormData({
            name: this.newName,
            type: ListRename.getListTypeValue(),
        });

        let result = true;

        try {
            const apiResponse = await ApiWrapper$1.listsPut(this.listID, formData);
            result = apiResponse.ok;
        } catch (error) {
            console.error(error);
            result = false;
        }

        return result;
    }

    /**********************************************************
    Update the active list's name text and type icon to the new name from the input
    **********************************************************/
    _updateActiveListElement() {
        // name
        const eActiveList = ListHtml.getActiveListElementByID(this.listID);
        $(eActiveList).find(`.${ListHtml.Elements.LIST_NAME}`).text(this.newName);

        // type - data attribute
        const newType = ListRename.getListTypeValue();
        $(eActiveList).attr('data-list-type', newType);

        // type - icon
        const eNewIcon = ListHtml.getTypeIcon(newType);
        ListHtml.setActiveListTypeIcon(this.listID, eNewIcon);

    }

    
    /**********************************************************
    Update the sidenav list's name text to the new name from the input
    **********************************************************/
    _updateSidenavListElement() {
        // name
        const eSidenavListItem = $(`#sidenav .list-group-item[data-list-id="${this.listID}"]`);
        $(eSidenavListItem).find('.list-group-item-name').text(this.newName);


        // type - icon
        const newType = ListRename.getListTypeValue();
        const newIconClass = ListHtml.getTypeIcon(newType);
        const eIcon = $(eSidenavListItem).find('.list-group-item-type i');

        // drop both icon classes from the list element since we don't know which one it currently has
        $(eIcon).removeClass(ListHtml.TypeIcons.LIST);
        $(eIcon).removeClass(ListHtml.TypeIcons.TEMPLATE);

        // now add the given icon class
        $(eIcon).addClass(newIconClass);

        // type - data attribute
        $(eSidenavListItem).attr('data-list-type', newType);
    }


    /**********************************************************
    Open the modal that has the rename list form
    **********************************************************/
    static openModal(eListActionButton) {
        const eActiveListContainer = $(eListActionButton).closest(`.${ListHtml.Elements.CONTAINER}`);
        const eModal = $(ListRename.Elements.MODAL);

        // set the list id
        const listID = $(eActiveListContainer).attr('data-list-id');
        $(eModal).attr('data-list-id', listID);

        // set the original list name
        const eNameHeader = $(eActiveListContainer).find(`.${ListHtml.Elements.LIST_NAME}`);
        const originalName = $(eNameHeader).text();
        $(eModal).attr('data-list-name-original', originalName);

        // set the input value to the orignal name
        const eInput = $(ListRename.Elements.INPUT);
        $(eInput).val(originalName);

        // set the related type radio input to checked
        const listType = $(eActiveListContainer).attr('data-list-type');
        ListRename.setTypeOptionChecked(listType);

        // show the modal
        $(eModal).modal('show');
    }


    /**********************************************************
    Mark the type radio option as checked 
    **********************************************************/
    static setTypeOptionChecked(listType) {
        $(ListRename.Elements.MODAL).find(`[name="${ListRename.Elements.TYPE_OPTIONS}"][value="${listType}"]`).prop('checked', true);
    }


    /**********************************************************
    Close the open modal
    **********************************************************/
    static closeModal() {
        $(ListRename.Elements.MODAL).modal('hide');
    }

    
    /**********************************************************
    Get the value of the checked list type radio input
    **********************************************************/
    static getListTypeValue() {
        return $(`[name="${ListRename.Elements.TYPE_OPTIONS}"]:checked`).val();
    }
}



ListRename.Elements = {
    MODAL: '#modal-list-rename',
    INPUT: '#list-rename-form-input',
    BTN_SAVE: '#list-rename-form-save',
    TYPE_OPTIONS: 'list-rename-form-type-radio-option',
};


ListRename.SpinnerButton = new SpinnerButton(ListRename.Elements.BTN_SAVE);class ItemDrag
{
    static listen(eItemContainer) {
        const eContainer = document.querySelector(eItemContainer);

        eContainer.addEventListener('dragstart', ItemDrag.dragStart);
        eContainer.addEventListener('drop', ItemDrag.drop);
        eContainer.addEventListener('dragenter', ItemDrag.dragEnter);
        eContainer.addEventListener('dragover', ItemDrag.dragOver);
        eContainer.addEventListener('dragleave', ItemDrag.dragLeave);
    }

    static dragStart(e) {
        // get the item container element
        const eItem = ItemHtml$1.getContainerItem(e.target);
        
        // save the value of the data-list-id attribute of the item that is being intially dragged
        const itemID = ItemHtml$1.getItemID(eItem);
        e.dataTransfer.setData('text/plain', itemID);
    }
        
    static dragEnter(e) {
        e.preventDefault();
    }
    
    static dragOver(e) {
        e.preventDefault();
    }
    
    static dragLeave(e) {
    
    }
    
    static async drop(e) {
        // get the element container that is the drop location
        let eDroppedItem = ItemHtml$1.getContainerItem(e.target);
        const droppedItemID = ItemHtml$1.getItemID(eDroppedItem);
        
        // get the item that was initially dragged through retrieving its data-list-id value set in the initial drag function
        const draggedItemID = e.dataTransfer.getData('text/plain');
        let eDraggedItem = ItemHtml$1.getItemWithID(draggedItemID);

        // clone both elements
        ItemDrag._swapItemElements(eDroppedItem, eDraggedItem);

        // determine the new rank values the 2 items now have
        const newItemRanks = ItemDrag.getRanks(droppedItemID, draggedItemID);

        // send the request to the api
        await ApiWrapper$1.itemsPatch(JSON.stringify(newItemRanks));
    }

    // given 2 item elements, swap them
    /**********************************************************
    Generate the html for all this list's items
    **********************************************************/
    static _swapItemElements(eItem1, eItem2) {
        const eItem1Clone = eItem1.clone();
        const eItem2Clone = eItem2.clone();
    
        // replace each element with the clone
        $(eItem1).replaceWith(eItem2Clone);
        $(eItem2).replaceWith(eItem1Clone);
    }

    /**********************************************************
    Generate the html for all this list's items
    **********************************************************/
    static getRanks(eItemID1, eItemID2) {
        // fetch the new elements
        const eItem1 = ItemHtml$1.getItemWithID(eItemID1);
        const eItem2 = ItemHtml$1.getItemWithID(eItemID2);

        // get a list of all the items in the parent list
        const eListItems = ListHtml$1.getParentActiveListElement(eItem1).find(`.${ItemHtml$1.Elements.TOP}`);

        // add the pair of items to the output
        const ranks = [];
        
        ranks.push({
            id: eItemID1,
            rank: eListItems.index(eItem1),
        });

        ranks.push({
            id: eItemID2,
            rank: eListItems.index(eItem2),
        });

        return ranks;
    }
}/**
 * This class is responsible for saving new items to active lists.
 * 
 * It sends the POST request to the API.
 * Then, it appends the item to the html.
 */
class ItemCreator
{

    constructor(newItemInputElement) {
        this.eInput       = newItemInputElement;
        this.eParentList  = $(newItemInputElement).closest(`.${ListHtml$1.Elements.CONTAINER}`);
        this.parentListID = $(this.eParentList).attr('data-list-id');
        this.content      = null;
        this.itemID       = null;
        this.rank         = $(this.eParentList).find(`.${ItemHtml$1.Elements.TOP}`).length;

        this.loadInputValue   = this.loadInputValue.bind(this);
        this.assignNewItemID  = this.assignNewItemID.bind(this);
        this.sendPostRequest  = this.sendPostRequest.bind(this);
        this._inputToFormData = this._inputToFormData.bind(this);
        this.clearInputValue  = this.clearInputValue.bind(this);
        this.appendToList     = this.appendToList.bind(this);
    }


    /**********************************************************
    Retrieve the input element's value.

    Returns a bool:
        true: the input is not empty and has a value
        false: value is empty or null
    **********************************************************/
    loadInputValue() {
        const inputElementValue = $(this.eInput).val();

        if (inputElementValue.length > 0) {
            this.content = inputElementValue;
            return true;
        }
        else {
            this.content = null;
            return false;
        }
    }

    
    /**********************************************************
    Set the item id's value to a newly generated uuid
    **********************************************************/
    assignNewItemID() {
        this.itemID = Utilities$1.getNewUUID();
        return this;
    }

    /**********************************************************
    Send the request to the api to create the new item
    **********************************************************/
    async sendPostRequest() {
        const formData = this._inputToFormData();
        
        try {
            ApiWrapper.itemsPut(this.itemID, formData);
            return true;
        } catch(error) {
            return false;
        }

    }

    /**********************************************************
    Transform the input value into a FormData object so it can
    be sent to the api correctly.
    **********************************************************/
    _inputToFormData() {
        return Utilities$1.objectToFormData({
            content: this.content,
            list_id: this.parentListID,
            rank: this.rank,
        });
    }

    /**********************************************************
    Clear the input's value
    **********************************************************/
    clearInputValue() {
        $(this.eInput).val('');
    }

    /**********************************************************
    Append the item to the active list's html
    **********************************************************/
    appendToList() {
        const itemHtml = new ItemHtml$1({
            id: this.itemID,
            content: this.content,
        });

        const html = itemHtml.getHtml();

        // $(this.eParentList).find('.active-list-items-container').prepend(html);
        $(this.eParentList).find('.active-list-items-container').append(html);
    }

}const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {
        close: '#sidenav-btn-close',
    },

    filterForm: '#sidenav-collapse-sections-filter-form',
};

const eActiveListContainer = '.active-lists-board';

const mSidenavFormList = new SidenavFormList();

const eBtnShowSidenavBtn = '#btn-show-sidenav';

const eListsContainer = '#lists-container';


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
    toggleSidenav();    // open the sidebar initially
    testingActivateFirstList();
    // $('#modal-templates').modal('show');
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    addSidenavListeners();
    addActiveListElementListeners();
    addActiveListItemElementListeners();
    addListRenameModalListeners();
    ItemDrag.listen(eActiveListContainer);  // listen for item drag/drop actions
}


/**********************************************************
SIDENAV: Register all the event listeners
**********************************************************/
function addSidenavListeners() {
    // open sidenav
    $(eBtnShowSidenavBtn).on('click', function() {
        toggleSidenav();
    }); 

    // sidebar clicking on a list
    $('#lists-container').on('click', '.list-group-item-action', function() {
        activateList(this);
    });

    // clicking on overlay when sidebar is active
    $('body').on('click', '.drawer-overlay', closeSidenav);

    // close sidebar button clicked
    $(eSidebar.buttons.close).on('click', closeSidenav);

    // begin typing into the new list input
    $(SidenavFormList.elements.input).on('keyup change', mSidenavFormList.toggleForm);

    // create a new list from the sidenav
    $(SidenavFormList.elements.submit).on('click', mSidenavFormList.saveNewList);

    // create a new list from the sidenav
    $(SidenavFormList.elements.input).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            mSidenavFormList.saveNewList();
        }
    });

    // filter lists
    $(eSidebar.filterForm).find(`.form-check-input`).on('change', function(e) {
        const checkboxValue = $(this).val();
        $(eListsContainer).find(`[data-list-type="${checkboxValue}"]`).toggleClass('d-none');
    });
}

/**********************************************************
Open/close the sidebar
**********************************************************/
function toggleSidenav() {
    $('#page').toggleClass('sidenav-open');
    $('body').append(eOverlay);
}

/**********************************************************
Open a list from the sidebar
**********************************************************/
async function activateList(sidebarListElement) {
    // make sure the list isn't already active 
    if ($(sidebarListElement).hasClass('active')) {
        return;
    }
    
    $(sidebarListElement).addClass('active');

    const listID = $(sidebarListElement).attr('data-list-id');
    const list = new ListHtml$1(listID);

    list.displayLoadingCard(eActiveListContainer);

    if (!await list.fetchData()) {
        console.error('could not fetch the list data from the api');
        return;
    }

    list.renderHtml(eActiveListContainer);
}


/**********************************************************
Close the sidebar
**********************************************************/
function closeSidenav() {
    $('#page').removeClass('sidenav-open');
    $('body .drawer-overlay').remove();
}

/**********************************************************
ACTIVE LIST: add event listeners
**********************************************************/
function addActiveListElementListeners() {
    // create new item
    $(eActiveListContainer).on('keypress', `.${ListHtml$1.Elements.NEW_ITEM_FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            createNewItem(this);
        }
    });

    // close an active list
    $(eActiveListContainer).on('click', `.${ListHtml$1.Elements.BTN_CLOSE}`, function() {
        closeActiveList(this);
    });

    // list action button
    $(eActiveListContainer).on('click', `.${ListHtml$1.Elements.ACTION_BUTTONS} .dropdown-item`, function(e) {
        e.preventDefault();
        performListAction(this);
    });

    // toggle complete items visibility
    $(eActiveListContainer).on('change', `.${ListHtml$1.Elements.TOGGLE_COMPLETE}`, function() {
        toggleCompleteItemsVisibility(this);
    });
}

/**********************************************************
Attempt to add a new item to the active list in focus
**********************************************************/
function createNewItem(inputElement) {
    const itemCreator = new ItemCreator(inputElement);

    // ensure the input is not empty
    if (!itemCreator.loadInputValue()) {
        console.warn('Input was empty');
        return;
    }

    itemCreator.assignNewItemID();
    
    if (!itemCreator.sendPostRequest()) {
        return;
    }

    itemCreator.appendToList();
    itemCreator.clearInputValue();
}

/**********************************************************
Close an active list
**********************************************************/
function closeActiveList(eClickedCloseButton) {
    const eActiveList = $(eClickedCloseButton).closest(`.${ListHtml$1.Elements.CONTAINER}`);
    const listID = $(eActiveList).attr('data-list-id');

    // remove active list from the board
    $(eActiveList).remove();    

    // remove active class from sidenav list item
    $(`#lists-container .list-group-item[data-list-id="${listID}"]`).removeClass('active');
    
}

/**********************************************************
Determine which list action to take
**********************************************************/
function performListAction(eListActionButton) {
    const listActionValue = $(eListActionButton).attr('data-list-action');
    
    // determine which button was clicked
    switch(listActionValue)
    {
        case ListHtml$1.HeaderButtonActions.SETTINGS:
            ListRename.openModal(eListActionButton);
            break;
        case ListHtml$1.HeaderButtonActions.DELETE:
            const listDelete = new ListDelete(eListActionButton);
            listDelete.delete();
            break;
        case ListHtml$1.HeaderButtonActions.CLONE:
            const listClone = new ListCloner(eListActionButton);
            listClone.clone();
            break;
    }
}

/**********************************************************
Toggle complete items' visibility
**********************************************************/
function toggleCompleteItemsVisibility(eClickedCheckbox) {
    const eListContainer = ListHtml$1.getParentActiveListElement(eClickedCheckbox);
    $(eListContainer).toggleClass('hide-completed');
}


/**********************************************************
ACTIVE LIST ITEM: add event listeners
**********************************************************/
function addActiveListItemElementListeners() {
    // Display an item's update content form
    $(eActiveListContainer).on('click', `.${ItemHtml$1.Elements.CONTENT}`, function() {
        displayItemUpdateForm(this);
    });
    
    // mark item complete
    $(eActiveListContainer).on('change', `.${ItemHtml$1.Elements.CHECKBOX}`, function() {
        completeItem(this);
    });

    // delete an item
    $(eActiveListContainer).on('click', `.${ItemHtml$1.Elements.BTN_DELETE}`, function() {
        deleteItem(this);
    });

    // When editing an item's content, either save or cancel update
    $(eActiveListContainer).on('click', `.${ItemContentUpdateForm.Elements.FORM} button`, function() {
        performUpdateItemFormAction(this);
    });

    // When editing an item's content, hits enter
    $(eActiveListContainer).on('keypress', `.${ItemContentUpdateForm.Elements.FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            updateItemContent(this);
        }
    });
}

/**********************************************************
Render an item's update content form.
**********************************************************/
function displayItemUpdateForm(eItemContent) {
    const eItemContainer = $(eItemContent).closest(`.${ItemHtml$1.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.renderUpdateForm();
}

/**********************************************************
Item's complete checkbox was clicked
**********************************************************/
function completeItem(eCheckbox) {
    const itemCompletor = new ItemCompletor(eCheckbox);
    itemCompletor.save();
}


/**********************************************************
Delete an item
**********************************************************/
function deleteItem(eDeleteButton) {
    const itemRemove = new ItemRemove(eDeleteButton);

    itemRemove.remove();
    itemRemove.updateListItemCount('#sidenav');
}

/**********************************************************
Respond to an item's update content form action button being clicked.
**********************************************************/
function performUpdateItemFormAction(eUpdateItemFormActionButton) {
    const eItemContainer = $(eUpdateItemFormActionButton).closest(`.${ItemHtml$1.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.respondToActionButton(eUpdateItemFormActionButton);
}


/**********************************************************
Update an item's content
**********************************************************/
function updateItemContent(eItemUpdateFormInput) {
    const eItemContainer = $(eItemUpdateFormInput).closest(`.${ItemHtml$1.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.updateContent();
}

/**********************************************************
List rename form modal: add event listeners
**********************************************************/
function addListRenameModalListeners() {
    // save the list rename
    $(ListRename.Elements.BTN_SAVE).on('click', function() {
        saveListRename();
    });

    // save the list rename for typing enter key while input is in focus
    $(ListRename.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            saveListRename();
        }
    });
}

/**********************************************************
Action listener for saving a list rename
**********************************************************/
function saveListRename() {
    const listRename = new ListRename();
    listRename.save();
}


function testingActivateFirstList() {
    const firstList = $('#lists-container').find('.list-group-item-action')[0];
    activateList(firstList);
}})();