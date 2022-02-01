
import { TagElements } from "./tag-elements";

export class TagDelete
{
    constructor(eClickedBtn) {
        this.eClickedBtn = eClickedBtn;
        this.eTagContainer = TagElements.getParentTagElement(eClickedBtn);
        this.tagID = TagElements.getTagID(this.eTagContainer);

        // bind object methods
        this.confirm = this.confirm.bind(this);
    }

    // make sure the user wants to delete the tag
    confirm() {
        return confirm('Are you sure you want to delete this tag?');
    }
}