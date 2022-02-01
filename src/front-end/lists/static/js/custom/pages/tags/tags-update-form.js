
import { TagElements } from "./tag-elements";

export class TagUpdateForm
{
    constructor(eForm) {
        this.eForm = eForm;
        this.eTagContainer = TagElements.getParentTagElement(eForm);
        this.tagID = TagElements.getTagID(this.eTagContainer);


        this.getInputValues = this.getInputValues.bind(this);
        this.getInputNameValue = this.getInputNameValue.bind(this);
        this.getInputColorValue = this.getInputColorValue.bind(this);
    }

    getInputValues() {
        return {
            name: this.getInputNameValue(),
            color: this.getInputColorValue(),
        }
    }

    getInputNameValue() {
        return $(this.eTagContainer).find(`.${TagElements.FormEdit.Inputs.NAME}`).val();
    }

    getInputColorValue() {
        return $(this.eTagContainer).find(`.${TagElements.FormEdit.Inputs.COLOR}`).val();
    }
}