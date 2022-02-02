
import { TagElements } from "./tag-elements";

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


        this.getInputValues = this.getInputValues.bind(this);
        this.getInputNameValue = this.getInputNameValue.bind(this);
        this.getInputColorValue = this.getInputColorValue.bind(this);
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