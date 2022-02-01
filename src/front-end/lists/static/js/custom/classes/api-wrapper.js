


export class ApiWrapper
{
    /**********************************************************
    Create a new user
    **********************************************************/
    static async usersPost(formData) {
        return await fetch(ApiWrapper.Urls.USERS, {
            method: ApiWrapper.Methods.POST,
            body: formData,
        });
    }

    /**********************************************************
    Login
    **********************************************************/
    static async login(formData) {
        return await fetch(ApiWrapper.Urls.LOGIN, {
            method: ApiWrapper.Methods.POST,
            body: formData,
        });
    }

    /**********************************************************
    Create a new list
    **********************************************************/
    static async listsPost(requestBody) {
        return await fetch(ApiWrapper.Urls.LISTS, {
            method: ApiWrapper.Methods.POST,
            body: requestBody,
        });
    }

    /**********************************************************
    Get a single list
    **********************************************************/
    static async listsGet(listID) {
        const url = `${ApiWrapper.Urls.LISTS}/${listID}`;
        return await fetch(url, {
            method: ApiWrapper.Methods.GET,
        });
    }

    /**********************************************************
    Update a list
    **********************************************************/
    static async listsPut(listID, formData) {
        const url = `${ApiWrapper.Urls.LISTS}/${listID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.PUT,
            body: formData,
        });
    }

    /**********************************************************
    Delete a list
    **********************************************************/
    static async listsDelete(listID) {
        const url = `${ApiWrapper.Urls.LISTS}/${listID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.DELETE,
        });
    }

    /**********************************************************
    Clone the given list.
    **********************************************************/
    static async listsClone(listID) {
        const url = `${ApiWrapper.Urls.LISTS}/${listID}/clones`;

        return await fetch(url, {
            method: ApiWrapper.Methods.POST,
        });
    }


    /**********************************************************
    Get the items that belong to the given list id
    **********************************************************/
    static async itemsGetByList(listID) {
        let url = `${ApiWrapper.Urls.ITEMS}?list_id=${listID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.GET,
        });
    }

    /**********************************************************
    PATCH: /items
    **********************************************************/
    static async itemsPatch(bodyData) {
        const url = `${ApiWrapper.Urls.ITEMS}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.PATCH,
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
        const url = `${ApiWrapper.Urls.ITEMS}/${itemID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.PUT,
            body: formData,
        });
    }

    /**********************************************************
    DELETE: /items
    **********************************************************/
    static async itemsDelete(itemIdsJsonString) {
        const url = `${ApiWrapper.Urls.ITEMS}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.DELETE,
            body: itemIdsJsonString,
            headers: {
                'Content-Type': 'application/json'
              },
        });
    }


    /**********************************************************
    DELETE: /items/:item_id
    **********************************************************/
    static async itemDelete(itemID) {
        const url = `${ApiWrapper.Urls.ITEMS}/${itemID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.DELETE,
        });
    }


    /**********************************************************
    PUT: /items/:item_id/complete
    **********************************************************/
    static async itemCompletePut(itemID) {
        return await ApiWrapper._itemCompleteUpdate(itemID, ApiWrapper.Methods.PUT);
    }

    /**********************************************************
    DELETE: /items/:item_id/complete
    **********************************************************/
    static async itemCompleteDelete(itemID) {
        return await ApiWrapper._itemCompleteUpdate(itemID, ApiWrapper.Methods.DELETE);
    }


    /**********************************************************
    Internal function used for item complete updating
    **********************************************************/
    static async _itemCompleteUpdate(itemID, requestMethod) {
        const url = `${ApiWrapper.Urls.ITEMS}/${itemID}/complete`;

        return await fetch(url, {
            method: requestMethod,
        });
    }

    /**********************************************************
    POST: /tags
    **********************************************************/
    static async tagsPost(formData) {
        const url = `${ApiWrapper.Urls.TAGS}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.POST,
            body: formData,
        });
    }

    /**********************************************************
    DELETE: /tags/:tag_id
    **********************************************************/
    static async tagsDelete(tagID) {
        const url = `${ApiWrapper.Urls.TAGS}/${tagID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.DELETE,
        });
    }


    /**********************************************************
    Log the api response error
    **********************************************************/
    static async logError(apiResponse) {
        console.error(await apiResponse.text());
    }

}



ApiWrapper.Methods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
}

ApiWrapper.Urls = {
    USERS: '/api/users',
    LOGIN: '/api/login',
    LISTS: '/api/lists',
    ITEMS: '/api/items',
    TAGS: '/api/tags'
}