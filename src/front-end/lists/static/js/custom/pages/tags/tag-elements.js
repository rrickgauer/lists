
/**
 * This class contains all the element names for js to select
 */
export class TagElements {}


/**********************************************************
List group item tag elements
**********************************************************/
TagElements.ListGroupItem = {
    CONTAINER: 'tags-list-group-item',
    BADGE: 'tag-badge',
    SECTION_DISPLAY: 'tags-list-group-item-display',
    BTN_EDIT: 'tags-list-group-item-btn-edit',
    BTN_DELETE: 'tags-list-group-item-btn-delete',
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
    CONTAINER: 'tags-list-group-item-form-container',
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


