
class SidenavFormList
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        this.spinnerButton = new SpinnerButton(SidenavFormList.elements.submit);

        // bind all the functions
        this.toggleForm                = this.toggleForm.bind(this);
        this.showForm                  = this.showForm.bind(this);
        this.hideForm                  = this.hideForm.bind(this);
        this.saveNewList               = this.saveNewList.bind(this);
        this.validateNameInput         = this.validateNameInput.bind(this);
        this.sendPostRequest           = this.sendPostRequest.bind(this);
        this.handlePostRequestResponse = this.handlePostRequestResponse.bind(this);
        this.getTypeInputValue         = this.getTypeInputValue.bind(this);
        this.getNameInputValue         = this.getNameInputValue.bind(this);
    }

    /**********************************************************
    If the input element has a non-empty value, show the rest of the form.
    Otherwise, hide it.
    **********************************************************/
    toggleForm() {        
        const nameInputValue = this.getNameInputValue();
        nameInputValue.length > 0 ? this.showForm() : this.hideForm();
    }

    /**********************************************************
    Show the rest of the form
    **********************************************************/
    showForm() {
        $(SidenavFormList.elements.submit).removeClass('d-none');
        $(SidenavFormList.elements.radioContainer).removeClass('d-none');
    }

    /**********************************************************
    Hide the rest of the form
    **********************************************************/
    hideForm() {
        $(SidenavFormList.elements.submit).addClass('d-none');
        $(SidenavFormList.elements.radioContainer).addClass('d-none');
    }

    /**********************************************************
    Save the new list
    **********************************************************/
    async saveNewList() {
        // make sure that the name input value is valid
        if (!this.validateNameInput()) {
            return;
        }

        // disable the submit button and show that we are processing this request
        this.spinnerButton.showSpinner();

        // send the api request
        const apiResponse = await this.sendPostRequest();
        
        await this.handlePostRequestResponse(apiResponse);
    }

    /**********************************************************
    Validate that the name input value is valid
    **********************************************************/
    validateNameInput() {
        const nameInputValue = this.getNameInputValue();

        // make sure the value is not empty
        if (nameInputValue.length == 0) {
            return false;
        }

        return true;
    }


    /**********************************************************
    Send a POST request to the API to create the new list
    **********************************************************/
    async sendPostRequest() {
        // create the FormData object to send the input values to the api
        const formData = Utilities.objectToFormData({
            name: this.getNameInputValue(),
            type: this.getTypeInputValue(),
        });
        
        // send the api request
        return await ApiWrapper.listsPost(formData);
    }

    /**********************************************************
    Steps to take after receiving the api post response
    **********************************************************/
    async handlePostRequestResponse(apiResponse) {
        // refresh the page if request was successful
        if (apiResponse.ok) {
            window.location.href = window.location.href;
        } else {
            console.error(await apiResponse.text());
            this.spinnerButton.reset();
        }
    }


    /**********************************************************
    Get the current value of the type radio input
    **********************************************************/
    getTypeInputValue() {
        return $(`[name=${SidenavFormList.elements.radioName}]:checked`).val();
    }

    /**********************************************************
    Get the current value of the name text input
    **********************************************************/
    getNameInputValue() {
        return $(SidenavFormList.elements.input).val();
    }

}

/**********************************************************
ALl the related form html elements.
**********************************************************/
SidenavFormList.elements = {
    container: '.sidenav-form-list-container',
    form: '.sidenav-form-list',
    input: '.sidenav-form-list-input',
    submit: '.sidenav-form-list-submit',
    radioContainer: '.sidenav-form-list-radio',
    radioName: 'sidenav-form-list-radio-option'
}
