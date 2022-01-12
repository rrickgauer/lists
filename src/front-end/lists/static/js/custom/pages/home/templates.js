

class TemplateModal
{
    constructor() {

    }

    /**********************************************************
    Fetch the items of the selected template
    **********************************************************/
    static async fetchCurrentTemplateItems() {
        const templateID = TemplateModal.getCurrentTemplateID();

        const apiResponse = await TemplateModal.sendGetRequest(templateID);

        if (!apiResponse.successful) {
            return;
        }

        if (apiResponse.items == null || apiResponse.items.length == 0) {
            return;
        }

        const items = apiResponse.items;

        console.table(items);

    }


    /**********************************************************
    Retrieve the value of the current selected option
    **********************************************************/
    static getCurrentTemplateID() {
        return $(TemplateModal.Elements.SELECT).val();
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
}



TemplateModal.Elements = {
    MODAL: '#modal-templates',
    SELECT: '#modal-templates-select',
}