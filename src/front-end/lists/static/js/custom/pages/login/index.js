

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



function addEventListeners() {
    $(eForms.buttons.signup).on('click', function() {
        attemptSignup();
    });
}

async function attemptSignup() {
    const inputValues = getFormInputValues(eForms.selectors.signup);

    const formData = new FormData();
    formData.append('email', inputValues.email);
    formData.append('password', inputValues.password);

    const apiResponse = await ApiWrapper.usersPost(formData);

    if (apiResponse.ok) {
        window.location.href = '/';
    }
}

function getFormInputValues(parentFormSelector) {
    const inputValues = {
        email: $(parentFormSelector).find(eForms.inputs.email).val(),
        password: $(parentFormSelector).find(eForms.inputs.password).val(),
    }

    return inputValues;
}
