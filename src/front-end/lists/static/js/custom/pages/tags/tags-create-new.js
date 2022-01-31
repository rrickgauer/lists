

/**
 * This class handles creating a new tag
 */
export class TagFormNew
{

    static create() {

        const inputValues = {
            name: TagFormNew.getNameInputValue(),
            color: TagFormNew.getColorInputValue(),
        }

        console.log(inputValues);
    }

    static getNameInputValue() {
        return $(TagFormNew.Elements.Inputs.NAME).val();
    }

    static getColorInputValue() {
        return $(TagFormNew.Elements.Inputs.COLOR).val();
    }
}


TagFormNew.Elements = {
    FORM: '#tags-form-new',
    CONTAINER: '#tags-form-new-container',
    Inputs: {
        NAME: '#tags-form-new-input-name',
        COLOR: '#tags-form-new-input-color',
    },
    BTN_SUBMIT: '#tags-form-new-btn-submit',
}




