(function(exports){'use strict';/************************************************
This class contains logic for disabling and then
re-enabling html buttons.

When the button is disabled, a spinner is shown
and it is set to disabled.
*************************************************/


class SpinnerButton
{
    /************************************************
    Constructor

    Parms:
        a_strSelector - the html selector
        a_strDisplayText - the original text to display
    *************************************************/
    constructor(a_strSelector) {
        this.selector = a_strSelector;
        this.displayText = $(a_strSelector).text();
    }

    /************************************************
    Disable the button and show the spinner.
    *************************************************/
    showSpinner() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).html(SpinnerButton.SPINNER_SMALL).width(width).prop('disabled', true);
    }

    /************************************************
    Reset the button back to its normal state
    *************************************************/
    reset() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).text(self.displayText).width(width).prop('disabled', false);
    }
}

SpinnerButton.SPINNER       = '<div class="spinner-border" role="status"></div>';
SpinnerButton.SPINNER_SMALL = '<div class="spinner-border spinner-border-sm" role="status"></div>';class ApiWrapper
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


    static async _itemCompleteUpdate(itemID, requestMethod) {
        const url = `${ApiWrapper.Urls.ITEMS}/${itemID}/complete`;

        return await fetch(url, {
            method: requestMethod,
        });
    }

}



ApiWrapper.Methods = {
    POST: 'POST',
    GET: 'GET',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
};

ApiWrapper.Urls = {
    USERS: '/api/users',
    LOGIN: '/api/login',
    LISTS: '/api/lists',
    ITEMS: '/api/items',
};// Form html selector
const eForms = {
    selectors: {
        login: '#login-form',
        signup: '#signup-form',
    },

    inputs: {
        email: '.form-input-email',
        password: '.form-input-password', 
    },

    buttons: {
        login: '#login-form-btn-submit',
        signup: '#signup-form-btn-submit',
        class: '.form-btn-submit',
    }
};

// spinner buttons
const mSpinnerButtons = {
    login: new SpinnerButton(eForms.buttons.login),
    signup: new SpinnerButton(eForms.buttons.signup),
};


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    $('.form-control').on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            submitForm(this);
        }
    });

    $(eForms.buttons.signup).on('click', function() {
        attemptSignup();
    });

    $(eForms.buttons.login).on('click', function() {
        attemptLogin();
    });
}

/**********************************************************
Submit the form after user hits enter while typing in a form input.
**********************************************************/
function submitForm(activeInputElement) {
    const parentForm = $(activeInputElement).closest('form');
    const parentFormID = '#' + $(parentForm).attr('id');

    if (parentFormID == eForms.selectors.signup) {
        attemptSignup();
    } else {
        attemptLogin();
    }
}


/**********************************************************
Attempt to create a new user account
**********************************************************/
async function attemptSignup() {
    mSpinnerButtons.signup.showSpinner();

    // retrieve the input values and turn them into a form data object
    const inputValues = getFormInputValues(eForms.selectors.signup);
    const formData = inputValuesToFormData(inputValues);

    // send the request
    const apiResponse = await ApiWrapper.usersPost(formData);

    // if successful, redirect to the home page
    if (apiResponse.ok) {
        window.location.href = '/';
    } else {
        console.error(await apiResponse.text());
        mSpinnerButtons.signup.reset();
    }
}

/**********************************************************
Attempt to create a new user account
**********************************************************/
async function attemptLogin() {
    mSpinnerButtons.login.showSpinner();

    // retrieve the input values and turn them into a form data object
    const inputValues = getFormInputValues(eForms.selectors.login);
    const formData = inputValuesToFormData(inputValues);

    // send the request
    const apiResponse = await ApiWrapper.login(formData);

    // if successful, redirect to the home page
    if (apiResponse.ok) {
        window.location.href = '/';
    } else {
        console.error(await apiResponse.text());
        mSpinnerButtons.login.reset();
    }
}


/**********************************************************
Fetch the input values from the given form
**********************************************************/
function getFormInputValues(parentFormSelector) {
    const inputValues = {
        email: $(parentFormSelector).find(eForms.inputs.email).val(),
        password: $(parentFormSelector).find(eForms.inputs.password).val(),
    };

    return inputValues;
}

/**********************************************************
Transforms a js object into a FormData object
**********************************************************/
function inputValuesToFormData(inputValuesDict) {
    const formData = new FormData();
    formData.append('email', inputValuesDict.email);
    formData.append('password', inputValuesDict.password);

    return formData;
}exports.addEventListeners=addEventListeners;exports.attemptLogin=attemptLogin;exports.attemptSignup=attemptSignup;exports.eForms=eForms;exports.getFormInputValues=getFormInputValues;exports.inputValuesToFormData=inputValuesToFormData;exports.mSpinnerButtons=mSpinnerButtons;exports.submitForm=submitForm;Object.defineProperty(exports,'__esModule',{value:true});return exports;})({});