
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
        class: '.form-btn-submit',
    }
}

// spinner buttons
const mSpinnerButtons = {
    login: new SpinnerButton(eForms.buttons.login),
    signup: new SpinnerButton(eForms.buttons.signup),
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




