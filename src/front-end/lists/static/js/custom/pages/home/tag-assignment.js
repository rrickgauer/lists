
import { ListSettingsModal } from "./list-settings-modal";
import { ApiWrapper } from "../../classes/api-wrapper";

export class TagAssignment
{
    
    constructor(eClickedCheckbox) {
        this.eClickedCheckbox = eClickedCheckbox;
        this.tagID = $(this.eClickedCheckbox).val();
        this.listID = ListSettingsModal.getCurrentListID();

        // bind the object's methods
        this.isNew = this.isNew.bind(this);
        this.save = this.save.bind(this);
    }

    /**********************************************************
    Checks if tag assignment should be saved or deleted

    Returns a bool:
        true - save the tag assignment
        false - delete the tag assignment
    **********************************************************/
    isNew() {
        return this.eClickedCheckbox.checked;
    }

    // save the assignment
    async save() {        
        ApiWrapper.listTagsPost(this.listID, this.tagID);
    }

    // remove the assignment
    async delete() {
        ApiWrapper.listTagsDelete(this.listID, this.tagID);
    }

}

