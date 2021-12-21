

class ItemContentUpdateForm
{
    
    constructor(eItem) {
        this.eItemContaier   = eItem;
        this.itemID          = $(this.eItemContaier).attr('data-item-id');

        this.eItemContent    = null;
        this.originalContent = null;

        this.renderUpdateForm = this.renderUpdateForm.bind(this);
        this._getFormHtml     = this._getFormHtml.bind(this);
    }

    /**********************************************************
    Display the update content form on the screen
    **********************************************************/
    renderUpdateForm() {
        this.eItemContent    = $(this.eItemContaier).find(`.${ItemHtml.Elements.CONTENT}`);
        this.originalContent = $(this.eItemContent).text();

        const formHtml = this._getFormHtml();

        $(this.eItemContaier).html(formHtml);
    }

    /**********************************************************
    Generate the update form html
    **********************************************************/
    _getFormHtml() {
        let html = `
        <form class="${ItemContentUpdateForm.Elements.FORM}" data-original-content="${this.originalContent}">
            <input type="text" class="form-control form-control-sm" value="${this.originalContent}">
            <button type="button" data-update-action="save" class="btn btn-xs text-success no-focus-outline">Save</button>
            <button type="button" data-update-action="cancel" class="btn btn-xs text-danger no-focus-outline">Cancel</button>
        </form>`;

        return html;
    }
}

ItemContentUpdateForm.Elements = {
    FORM: 'active-list-item-content-form',
}