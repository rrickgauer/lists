/**
 * This class handles all the actions needed to delete a list
 */



class ListDelete
{
    constructor(eDeleteButton) {
        this.eDeleteButton = eDeleteButton;
        this.eActiveList = ListHtml.getParentActiveListElement(eDeleteButton);
        this.listID = ListHtml.getActiveListElementID(this.eActiveList);

        this.delete = this.delete.bind(this);
    }

    async delete() {

        // confirm user wants to delete the list
        if (!confirm('Are you sure you want to delete this list?')) {
            return;
        }




    }

    async sendRequest() {
        
    }
}

