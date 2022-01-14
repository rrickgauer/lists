

class TemplateModal {


    /**********************************************************
    Event response handler for user selecting a new option from the select element
    **********************************************************/
    static async changeTemplate(actionEvent) {
        // show the loading spinner screen
        TemplateModal.removeInitialClass();
        TemplateModal.toggleLoading(false);

        // set the value of the rename form input element to the name of the selected list
        TemplateModal.initRenameFormValue();
    
        // if selected option is a new template, first we need to tell the api to create a new template
        if ('isNewTemplate' in actionEvent.params.data) {
            await TemplateModal.createNewTemplate(actionEvent.params.data);
        } 

        await TemplateModal.fetchCurrentTemplateItems();

        // show the items and remove the loading spinner
        TemplateModal.toggleLoading(true);
    }


    /**********************************************************
    Create a new template out of the given newSelectOptionDataOption

    Args:
        value of a newly created Select2 data tag object
    **********************************************************/
    static async createNewTemplate(newSelectOptionDataOption) {
        // retrieve all the required data values for the api request
        const listID = newSelectOptionDataOption.id;

        const newListObject = {
            name: newSelectOptionDataOption.text,
            type: 'template',
        }

        // // append the new option to the list of templates
        TemplateModal.addSelectOption(newListObject);
    
        // sort the options
        TemplateModal.sortSelectOptions();
    
        // now send the api request
        const formData = Utilities.objectToFormData(newListObject);
        await ApiWrapper.listsPut(listID, formData);
    }

    /**********************************************************
    Append the given option object to the list select element options
    **********************************************************/
    static addSelectOption(newListObject) {
        const listID = TemplateModal.getCurrentTemplateID();
        
        // append the new option to the list of templates
        const newOption = new Option(newListObject.name, listID, false, false);
        $(TemplateModal.Elements.SELECT).append(newOption);
    
        // remove the first option since it was created by select2 automatically
        // if this does not happen, then new options are added twice to the option list
        const eOptionsWithSameID = $(TemplateModal.Elements.SELECT).find(`option[value="${listID}"]`);
        $(eOptionsWithSameID[0]).remove();
    
        // select the newest option
        $(TemplateModal.Elements.SELECT).val(listID);
    }

    /**********************************************************
    Fetch the items of the selected template
    **********************************************************/
    static async fetchCurrentTemplateItems() {
        // fetch the template items from the api
        const templateID = TemplateModal.getCurrentTemplateID();
        const apiResponse = await TemplateModal.sendGetRequest(templateID);

        if (!apiResponse.successful) {
            TemplateModal.toggleLoading(true);
            TemplateModal.logBadApiRequest(apiResponse);
            return;
        }

        if (apiResponse.items == null || apiResponse.items.length == 0) {
            apiResponse.items = [];
        }

        // render the items to the screen
        TemplateModal.renderItems(apiResponse.items);
    }


    /**********************************************************
    Remove the initial css class from the modal
    **********************************************************/
    static removeInitialClass() {
        $(TemplateModal.Elements.MODAL).removeClass('initial');
    }

    /**********************************************************
    Show or hide the loading screen

    Args:
        showItems: bool - true=show items, false = show loading screen
    **********************************************************/
    static toggleLoading(showItems) {
        if (showItems) {
            $(TemplateModal.Elements.MODAL).removeClass('loading');
        } else {
            $(TemplateModal.Elements.MODAL).addClass('loading');
        }
    }

    /**********************************************************
    Set the rename form's input value to the name of the current template
    **********************************************************/
    static initRenameFormValue() {
        const templateName = TemplateModal.getCurrentTemplateName();
        $(TemplateModal.Elements.RENAME_FORM.INPUT).val(templateName);
    }

    /**********************************************************
    Returns the name of the current template
    **********************************************************/
    static getCurrentTemplateName() {
        return $(TemplateModal.Elements.SELECT).find('option:checked').text();
    }


    /**********************************************************
    Send a get request to the api to fetch the template items
    **********************************************************/
    static async sendGetRequest(templateID) {
        const result = {
            successful: true,
            items: null,
        }

        const apiResponse = await ApiWrapper.itemsGetByList(templateID);

        if (!apiResponse.ok) {
            result.successful = false;
            return result;
        }

        try {
            result.items = await apiResponse.json();
        } catch (error) {
            result.items = [];  // api returned an empty list
        }

        return result;
    }

    /**********************************************************
    Render the given list of items as checklist items on the screen
    **********************************************************/
    static renderItems(items) {
        let html = '';

        for (const item of items) {
            const itemHtml = new ItemHtml(item);
            html += itemHtml.getHtml();
        }

        $(TemplateModal.Elements.ITEMS_CONTAINER).html(html);
    }

    /**********************************************************
    Send a request to clone current template into a new list
    **********************************************************/
    static async cloneList() {
        TemplateModal.SpinnerButtons.CLONE.showSpinner();

        // send api request to clone
        const listID = TemplateModal.getCurrentTemplateID();
        const apiResponse = await ApiWrapper.listsClone(listID);

        // make sure the request was successful
        if (!apiResponse.ok) {
            TemplateModal.SpinnerButtons.CLONE.reset();
            return;
        }

        // refresh the page
        window.location.href = window.location.href;
    }

    /**********************************************************
    Retrieve the value of the current selected option
    **********************************************************/
    static getCurrentTemplateID() {
        return $(TemplateModal.Elements.SELECT).val();
    }
    
    /**********************************************************
    Save the new name of the current template
    **********************************************************/
    static async saveRename() {
        // show loading spinner on the submit button
        TemplateModal.SpinnerButtons.RENAME.showSpinner();

        // send the api request
        const newName = $(TemplateModal.Elements.RENAME_FORM.INPUT).val();
        const apiResponse = await TemplateModal.sendPutRequest();

        // once we have a response, enable the save button
        TemplateModal.SpinnerButtons.RENAME.reset();

        // make sure the response was successful
        if (!apiResponse.ok) {
            await TemplateModal.logBadApiRequest(apiResponse);
            return;
        }

        // update the selected option's text display to the new name
        $(TemplateModal.Elements.SELECT).find('option:checked').text(newName);

        // close the dropdown
        $(TemplateModal.Elements.RENAME_FORM.DROPDOWN).dropdown('hide');

        // sort the select options
        TemplateModal.sortSelectOptions();

    }

    /**********************************************************
    Send a put request to the api
    **********************************************************/
    static async sendPutRequest() {
        // fetch all the required data for the api request
        const listID = TemplateModal.getCurrentTemplateID();
        const newName = $(TemplateModal.Elements.RENAME_FORM.INPUT).val();

        const formData = Utilities.objectToFormData({
            name: newName,
            type: 'template',
        });

        // send the api request
        const apiResponse = await ApiWrapper.listsPut(listID, formData);

        return apiResponse;
    }

    /**********************************************************
    Log an api response to the error console
    **********************************************************/
    static async logBadApiRequest(apiResponse) {
        const responseText = await apiResponse.text();
        console.error(responseText);
    }

    /**********************************************************
    Sort the select options 
    **********************************************************/
    static sortSelectOptions() {
        const eOptions = $(TemplateModal.Elements.SELECT).find('option');

        const eSortedOptions = eOptions.sort(function (a, b) {
            var nameA = $(a).text().toUpperCase();
            var nameB = $(b).text().toUpperCase();
            return (nameA < nameB) ? -1 : 1;
        });

        $(TemplateModal.Elements.SELECT).html(eSortedOptions);
    }
}



TemplateModal.Elements = {
    MODAL: '#modal-templates',
    SELECT: '#modal-templates-select',
    ITEMS_CONTAINER: '#modal-templates-items-container',
    BODY_ITEMS: '#modal-templates-body-items',
    BODY_LOADING: '#modal-templates-body-loading',

    RENAME_FORM: {
        INPUT: '#modal-templates-footer-rename-input',
        SAVE_BTN: '#modal-templates-footer-rename-btn',
        DROPDOWN: '#modal-templates-rename-dropdown',
    },

    BUTTONS: {
        CLONE: '#modal-templates-footer-btn-clone',
        NEW: '#modal-templates-footer-btn-new',
        DELETE: '#modal-templates-footer-btn-delete',
    }
}




// spinner buttons
TemplateModal.SpinnerButtons = {
    CLONE: new SpinnerButton(TemplateModal.Elements.BUTTONS.CLONE),
    RENAME: new SpinnerButton(TemplateModal.Elements.RENAME_FORM.SAVE_BTN),
    NEW: new SpinnerButton(TemplateModal.Elements.BUTTONS.NEW),
    DELETE: new SpinnerButton(TemplateModal.Elements.BUTTONS.DELETE),
}



TemplateModal.Select = $(TemplateModal.Elements.SELECT).select2({
    theme: 'bootstrap4',
    tags: true,
    createTag: function (params) {
        return {
          id: Utilities.getNewUUID(),
          text: params.term,
          isNewTemplate: true,
        }
    },
});


