import { SpinnerButton } from '../../classes/spinner-button';
import { ApiWrapper } from '../../classes/api-wrapper';
import { Utilities } from '../../classes/utilities';

export class SidenavFormList
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        this.spinnerButton = new SpinnerButton(SidenavFormList.Elements.SUBMIT);

        // bind all the functions
        this.toggleForm                = this.toggleForm.bind(this);
        this.showForm                  = this.showForm.bind(this);
        this.hideForm                  = this.hideForm.bind(this);
        this.saveNewList               = this.saveNewList.bind(this);
        this.disableInputs = this.disableInputs.bind(this);
        this.enableInputs = this.enableInputs.bind(this);
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
        $(SidenavFormList.Elements.SUBMIT).removeClass('d-none');
        $(SidenavFormList.Elements.RADIO_CONTAINER).removeClass('d-none');
    }

    /**********************************************************
    Hide the rest of the form
    **********************************************************/
    hideForm() {
        $(SidenavFormList.Elements.SUBMIT).addClass('d-none');
        $(SidenavFormList.Elements.RADIO_CONTAINER).addClass('d-none');
    }

    /**********************************************************
    Save the new list
    **********************************************************/
    async saveNewList() {
        // make sure that the name input value is valid
        if (!this.validateNameInput()) {
            return;
        }

        // disable the form inputs and show that we are processing this request
        this.disableInputs();

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
            this.enableInputs();
        }
    }
    
    /**********************************************************
    Disable the form by disabling the button and input elements.
    **********************************************************/
    disableInputs() {
        this.spinnerButton.showSpinner();
        $(`${SidenavFormList.Elements.INPUT}`).prop('disabled', true);
    }

    /**********************************************************
    Enable all the form inputs. (Remove the disabled attribute)
    **********************************************************/
    enableInputs() {
        this.spinnerButton.reset();
        $(`${SidenavFormList.Elements.INPUT}`).prop('disabled', false);
    }

    /**********************************************************
    Get the current value of the type radio input
    **********************************************************/
    getTypeInputValue() {
        return $(`[name=${SidenavFormList.Elements.RADIO_NAME}]:checked`).val();
    }

    /**********************************************************
    Get the current value of the name text input
    **********************************************************/
    getNameInputValue() {
        return $(SidenavFormList.Elements.INPUT).val();
    }

}

/**********************************************************
ALl the related form html elements.
**********************************************************/
SidenavFormList.Elements = {
    CONTAINER: '.sidenav-form-list-container',
    FORM: '.sidenav-form-list',
    INPUT: '.sidenav-form-list-input',
    SUBMIT: '.sidenav-form-list-submit',
    RADIO_CONTAINER: '.sidenav-form-list-radio',
    RADIO_NAME: 'sidenav-form-list-radio-option'
}
