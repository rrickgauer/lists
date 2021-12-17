
// Form html selector
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
    }
}


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
    $(eForms.buttons.signup).on('click', function() {
        attemptSignup();
    });
}

/**********************************************************
Attempt to create a new user account
**********************************************************/
async function attemptSignup() {
    // retrieve the input values and turn them into a form data object
    const inputValues = getFormInputValues(eForms.selectors.signup);
    const formData = inputValuesToFormData(inputValues);

    // send the request
    const apiResponse = await ApiWrapper.usersPost(formData);

    // if successful, redirect to the home page
    if (apiResponse.ok) {
        window.location.href = '/';
    }
}


/**********************************************************
Fetch the input values from the given form
**********************************************************/
function getFormInputValues(parentFormSelector) {
    const inputValues = {
        email: $(parentFormSelector).find(eForms.inputs.email).val(),
        password: $(parentFormSelector).find(eForms.inputs.password).val(),
    }

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
}


