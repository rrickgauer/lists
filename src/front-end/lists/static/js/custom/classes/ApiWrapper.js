


class ApiWrapper
{
    static async usersPost(formData) {

        console.log(formData);

        return await fetch(ApiWrapper.Urls.USERS, {
            method: ApiWrapper.Methods.POST,
            body: formData,
        })
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
}