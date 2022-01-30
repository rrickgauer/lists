

/**
 * This class handles creating a new tag
 */
export class TagFormNew
{

    static create() {
        console.log('Create new tag');
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




