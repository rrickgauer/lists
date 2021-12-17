
class SidenavFormList
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        // bind all the functions
        this.toggleSubmitButton = this.toggleSubmitButton.bind(this);
        this.showSubmitButton = this.showSubmitButton.bind(this);
        this.hideSubmitButton = this.hideSubmitButton.bind(this);
    }

    /**********************************************************
    If the input element has a non-empty value, show the save button.
    Otherwise, hide it.
    **********************************************************/
    toggleSubmitButton() {        
        const inputValue = $(SidenavFormList.elements.input).val();
        inputValue.length > 0 ? this.showSubmitButton() : this.hideSubmitButton();
    }

    /**********************************************************
    Show the submit button
    **********************************************************/
    showSubmitButton() {
        $(SidenavFormList.elements.submit).removeClass('d-none');
    }

    /**********************************************************
    Hide the submit button
    **********************************************************/
    hideSubmitButton() {
        $(SidenavFormList.elements.submit).addClass('d-none');
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
}
