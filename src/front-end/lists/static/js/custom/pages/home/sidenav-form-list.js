
class SidenavFormList
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        // bind all the functions
        this.toggleSubmitButton = this.toggleSubmitButton.bind(this);
        this.showSubmitButton   = this.showSubmitButton.bind(this);
        this.hideSubmitButton   = this.hideSubmitButton.bind(this);
        this.saveNewList        = this.saveNewList.bind(this);
        this.getFormData        = this.getFormData.bind(this);
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


    /**********************************************************
    Save the new list
    **********************************************************/
    async saveNewList() {
        const inputValue = $(SidenavFormList.elements.input).val();

        // make sure the value is not empty
        if (inputValue.length == 0) {
            return;
        }
        
        // send the api request
        const formData = this.getFormData();
        const apiResponse = await ApiWrapper.listsPost(formData);
        
        // refresh the page if request was successful
        if (apiResponse.ok) {
            window.location.href = window.location.href;
        } 
        else {
            console.log(await apiResponse.text());
        }
    }


    /**********************************************************
    Return the form inputs as a FormData object
    **********************************************************/
    getFormData() {
        const formData = new FormData();
        formData.append('name', $(SidenavFormList.elements.input).val());

        return formData;
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
