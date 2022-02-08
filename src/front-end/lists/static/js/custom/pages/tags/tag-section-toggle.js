import { TagElements } from "./tag-elements";


/**
 * This class handles toggling which section of a tag to display
 */
export class TagSectionToggle
{
    
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(eActionButton) {
        this.eActionButton   = eActionButton;
        this.eTagContainer   = TagElements.getParentTagElement(eActionButton);
        this.eSectionDisplay = TagElements.getSectionDisplay(this.eTagContainer);
        this.eSectionForm    = TagElements.getSectionFormEdit(this.eTagContainer);

        // bind the object methods
        this.showEditFormSection = this.showEditFormSection.bind(this);
        this.showDisplaySection  = this.showDisplaySection.bind(this);
    }

    /**********************************************************
    Show the edit tag form section
    Hide the display section
    **********************************************************/
    showEditFormSection() {
        $(this.eSectionDisplay).addClass('d-none');
        $(this.eSectionForm).removeClass('d-none');
    }

    /**********************************************************
    Hide the edit tag form section
    Show the display section
    **********************************************************/
    showDisplaySection() {
        $(this.eSectionDisplay).removeClass('d-none');
        $(this.eSectionForm).addClass('d-none');
    }

}