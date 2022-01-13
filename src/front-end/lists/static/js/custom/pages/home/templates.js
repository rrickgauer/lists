

class TemplateModal
{

    /**********************************************************
    Fetch the items of the selected template
    **********************************************************/
    static async fetchCurrentTemplateItems() {
        // show the loading spinner screen
        TemplateModal.removeInitialClass();
        TemplateModal.toggleLoading(false);

        // set the value of the rename form input element to the name of the selected list
        TemplateModal.initRenameFormValue();
        
        // fetch the template items from the api
        const templateID = TemplateModal.getCurrentTemplateID();
        const apiResponse = await TemplateModal.sendGetRequest(templateID);

        if (!apiResponse.successful) {
            TemplateModal.toggleLoading(true);
            return;
        }

        if (apiResponse.items == null || apiResponse.items.length == 0) {
            apiResponse.items = [];
        }

        // render the items to the screen
        TemplateModal.renderItems(apiResponse.items);

        // show the items and remove the loading spinner
        TemplateModal.toggleLoading(true);
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
    },
    
    BUTTONS: {
        CLONE: '#modal-templates-footer-btn-clone',
        RENAME: '#modal-templates-footer-btn-rename',
        NEW: '#modal-templates-footer-btn-new',
        DELETE: '#modal-templates-footer-btn-delete',
    }
}




// spinner buttons
TemplateModal.SpinnerButtons = {
    CLONE: new SpinnerButton(TemplateModal.Elements.BUTTONS.CLONE),
    RENAME: new SpinnerButton(TemplateModal.Elements.BUTTONS.RENAME),
    NEW: new SpinnerButton(TemplateModal.Elements.BUTTONS.NEW),
    DELETE: new SpinnerButton(TemplateModal.Elements.BUTTONS.DELETE),
}

