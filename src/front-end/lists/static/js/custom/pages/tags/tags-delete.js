
import { ApiWrapper } from "../../classes/api-wrapper";
import { TagElements } from "./tag-elements";


/**
 * This class is responsible for deleting tag elements
 */
export class TagDelete
{
    
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(eClickedBtn) {
        this.eClickedBtn = eClickedBtn;
        this.eTagContainer = TagElements.getParentTagElement(eClickedBtn);
        this.tagID = TagElements.getTagID(this.eTagContainer);

        // bind object methods
        this.confirm = this.confirm.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    /**********************************************************
    Make sure the user wants to delete the tag

    Returns a bool:
        true: they confirmed yes they want to delete
        false: they do not want to delete
    **********************************************************/
    confirm() {
        return confirm('Are you sure you want to delete this tag?');
    }
    
    /**********************************************************
    Tell api to delete this tag
    **********************************************************/
    async delete() {
        ApiWrapper.tagsDelete(this.tagID);
        $(this.eTagContainer).remove();
    }
}