


class ApiWrapper
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
    Get the items that belong to the given list id
    **********************************************************/
    static async itemsGetByList(listID) {
        let url = `${ApiWrapper.Urls.ITEMS}?list_id=${listID}`;

        return await fetch(url, {
            method: ApiWrapper.Methods.GET,
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
}