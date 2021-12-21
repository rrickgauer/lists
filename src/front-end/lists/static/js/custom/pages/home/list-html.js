


class ListHtml
{

    constructor(listID) {
        this.listID = listID;
        this.items = null;
        this.metadata = null;

        // bind the object's methods
        this.fetchData = this.fetchData.bind(this);
        this.fetchListMetadata = this.fetchListMetadata.bind(this);
        this.fetchItems = this.fetchItems.bind(this);
        this.renderHtml = this.renderHtml.bind(this);
        this.getHtml = this.getHtml.bind(this);
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
        $(listBoardElement).append(html);
    }


    /**********************************************************
    Generate the html for the list
    **********************************************************/
    getHtml() {
        const itemsHtml = this.getItemsHtml();

        let html = `
        <div class="active-list card my-shadow" data-list-id="${this.listID}">
            <div class="card-header">
                <div><h4>${this.metadata.name}</h4></div>
                
                <div class="list-header-buttons">
                    <div class="dropdown mr-2">
                        <button class="close" type="button" data-toggle="dropdown"><i class='bx bx-dots-horizontal'></i></button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <button class="dropdown-item" type="button">Action</button>
                            <button class="dropdown-item" type="button">Another action</button>
                            <button class="dropdown-item" type="button">Something else here</button>
                        </div>
                    </div>

                    <button type="button" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>

            <div class="card-body">
                <form>
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


}