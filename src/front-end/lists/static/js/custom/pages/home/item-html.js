

class ItemHtml
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
        <div class="${ItemHtml.Elements.TOP} ${checkedHtml}" data-item-id="${this.id}" data-item-complete="${this.complete}" draggable="true">
            <div class="d-flex align-items-baseline">
                <input type="checkbox" class="${ItemHtml.Elements.CHECKBOX}" ${checkedHtml}>
                <span class="ml-2 ${ItemHtml.Elements.CONTENT}">${this.content}</span>
            </div>

            <div class="d-flex align-items-baseline">
                <button type="button" class="close ${ItemHtml.Elements.BTN_DELETE}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>`;

        return html;
    }

    // retrieve the item element with a data-item-id that matches the itemID
    static getItemWithID(itemID) {
        const eItem = $(`.${ItemHtml.Elements.TOP}[data-item-id="${itemID}"]`);

        return eItem;
    }

    // Retrieve the id of the given item html element
    static getItemID(eItem) {
        return $(eItem).attr('data-item-id');
    }

    static getContainerItem(eChildElement) {
        return $(eChildElement).closest(`.${ItemHtml.Elements.TOP}`);
    }
}

ItemHtml.Elements = {
    TOP: 'active-list-item',
    CONTENT: 'active-list-item-content',
    CHECKBOX: 'active-list-item-checkbox',
    BTN_DELETE: 'active-list-item-btn-delete'
}



