
import { TagElements } from "./tag-elements";
import { Utilities } from "../../classes/utilities";
import { ApiWrapper } from "../../classes/api-wrapper";
import { SpinnerButton } from "../../classes/spinner-button";

/**
 * Responsible for updating an existing tag.
 */
export class TagUpdateForm
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(eForm) {
        this.eForm = eForm;
        this.eTagContainer = TagElements.getParentTagElement(eForm);
        this.tagID = TagElements.getTagID(this.eTagContainer);
        this.eSubmitBtn = $(this.eForm).find(`.${TagElements.FormEdit.Buttons.SUBMIT}`);

        this.spinnerButton = new SpinnerButton(this.eSubmitBtn);


        // bind the object methods
        this.save                     = this.save.bind(this);
        this.getInputValuesUrlEncoded = this.getInputValuesUrlEncoded.bind(this);
        this.getInputValues           = this.getInputValues.bind(this);
        this.getInputNameValue        = this.getInputNameValue.bind(this);
        this.getInputColorValue       = this.getInputColorValue.bind(this);
    }


    /**********************************************************
    Send api request to update this tag
    Returns the api response
    **********************************************************/
    async save() {
        const formData = this.getInputValuesUrlEncoded();
        const apiResponse = await ApiWrapper.tagsPut(this.tagID, formData);

        return apiResponse;
    }

    /**********************************************************
    Get the input values as a Form Url Encoded object
    **********************************************************/
    getInputValuesUrlEncoded() {
        const inputValues = this.getInputValues();
        return Utilities.objectToFormData(inputValues);
    }

    /**********************************************************
    Get the values of the inputs.

    Returns an object comprised of these keys:
        - name
        - color
    **********************************************************/
    getInputValues() {
        return {
            name: this.getInputNameValue(),
            color: this.getInputColorValue(),
        }
    }

    /**********************************************************
    Return the name input element value
    **********************************************************/
    getInputNameValue() {
        return $(this.eTagContainer).find(`.${TagElements.FormEdit.Inputs.NAME}`).val();
    }


    /**********************************************************
    Return the color input element value
    **********************************************************/
    getInputColorValue() {
        return $(this.eTagContainer).find(`.${TagElements.FormEdit.Inputs.COLOR}`).val();
    }
}