
import { TagElements } from "./tag-elements";
import { SpinnerButton } from "../../classes/spinner-button";
import { Utilities } from "../../classes/utilities";
import { ApiWrapper } from "../../classes/api-wrapper";

/**
 * This class handles creating a new tag
 */
export class TagFormNew
{
    /**********************************************************
    Create a new tag
    **********************************************************/
    static async create() {
        TagFormNew.SpinnerButton.showSpinner();

        const inputValues = TagFormNew.getInputValues();
        const formData = Utilities.objectToFormData(inputValues);

        const apiResponse = await ApiWrapper.tagsPost(formData);
        
        if (apiResponse.ok) {
            window.location.href = window.location.href;
        } 
        else {
            TagFormNew.SpinnerButton.reset();
            ApiWrapper.logError(apiResponse);
        }
    }

    /**********************************************************
    Get the form input values.

    Returns an object comprised of these fields:
        - name
        - color
    **********************************************************/
    static getInputValues() {
        return {
            name: TagFormNew.getNameInputValue(),
            color: TagFormNew.getColorInputValue(),
        }
    }


    /**********************************************************
    Get the name input value
    **********************************************************/
    static getNameInputValue() {
        return $(TagElements.FormNew.Inputs.NAME).val();
    }

    /**********************************************************
    Get the value of the color input element
    **********************************************************/
    static getColorInputValue() {
        return $(TagElements.FormNew.Inputs.COLOR).val();
    }
}


TagFormNew.SpinnerButton = new SpinnerButton('#tags-form-new-btn-submit');




