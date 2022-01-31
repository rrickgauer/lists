
/**
 * This class contains all the element names for js to select
 */
export class TagElements {
    
    /**********************************************************
    Get the parent tag container element that the given child element belongs to
    **********************************************************/
    static getParentTagElement(eChildElement) {
        return $(eChildElement).closest(`.${TagElements.ListGroupItem.CONTAINER}`);
    }

    /**********************************************************
    Get the display section of the given tag element
    **********************************************************/
    static getSectionDisplay(eTagContainer) {
        return $(eTagContainer).find(`.${TagElements.ListGroupItem.Sections.DISPLAY}`);
    }
    
    /**********************************************************
    Get the edit tag form section of the given tag element
    **********************************************************/
    static getSectionFormEdit(eTagContainer) {
        return $(eTagContainer).find(`.${TagElements.ListGroupItem.Sections.FORM}`);
    }

}


/**********************************************************
List group item tag elements
**********************************************************/
TagElements.ListGroupItem = {
    CONTAINER: 'tags-list-group-item',
    BADGE: 'tag-badge',
    BTN_EDIT: 'tags-list-group-item-btn-edit',
    BTN_DELETE: 'tags-list-group-item-btn-delete',
    Sections: {
        DISPLAY: 'tags-list-group-item-display',
        FORM: 'tags-list-group-item-form-container',
    }
}


/**********************************************************
New tag form elements
**********************************************************/
TagElements.FormNew = {
    FORM: '#tags-form-new',
    CONTAINER: '#tags-form-new-container',
    BTN_SUBMIT: '#tags-form-new-btn-submit',
    Inputs: {
        NAME: '#tags-form-new-input-name',
        COLOR: '#tags-form-new-input-color',
    },
}

/**********************************************************
Edit tag form element
**********************************************************/
TagElements.FormEdit = {
    
    FORM: 'tags-form-edit',
    Inputs: {
        NAME: 'tags-form-edit-input-name',
        COLOR: 'tags-form-edit-input-color',
    },
    Buttons: {
        CANCEL: 'tags-form-edit-btn-cancel',
        SUBMIT: 'tags-form-edit-btn-submit',
    },
}


