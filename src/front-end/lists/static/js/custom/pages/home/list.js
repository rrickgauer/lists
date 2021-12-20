


class List
{

    constructor(listID) {
        this.listID = listID;
        this.items = null;

        this.fetchItems = this.fetchItems.bind(this);
    }

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
}