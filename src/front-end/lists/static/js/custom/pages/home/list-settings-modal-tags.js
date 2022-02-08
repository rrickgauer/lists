import { ListHtml } from "./list-html";



/**
 * This class handles logic related to the tags section in the list settings modal.
 */
export class ListSettingsModalTags
{
    
    /**********************************************************
    Given the active list element's id: copy over its assigned tag 
    badges to the list settings modal tags section.
    **********************************************************/
    static setAssignedTags(listID) {
        const eActiveListContainer = ListHtml.getActiveListElementByID(listID);

        // copy over the badges from the active list
        const eTags = ListHtml.getAssignedTags(eActiveListContainer).clone();
        $(ListSettingsModalTags.Elements.ASSIGNED).html(eTags);
            
        // uncheck all the list boxes to start
        const eItemCheckboxes = ListSettingsModalTags.getAllItemCheckboxElements();
        ListSettingsModalTags.setCheckboxesTo(eItemCheckboxes, false);

        // Get a list of the current list's assigned tag ids
        const assignedTagIDs = ListSettingsModalTags.getAssignedTagIDs(eTags);

        // get a filtered down collection of checkbox elements - ones that have values found in the assigned tag id list
        const eAssignedCheckboxes = $(eItemCheckboxes).filter(function() {
            const checkboxValue = $(this).val();
            return assignedTagIDs.includes(checkboxValue);
        });

        // mark the assigned tag elements as checked
        ListSettingsModalTags.setCheckboxesTo(eAssignedCheckboxes, true);
    }

    
    /**********************************************************
    Get a list of the current list's assigned tag ids
    **********************************************************/
    static getAssignedTagIDs(eTags) {
        const assignedTagIDs = [];

        $(eTags).each(function() {
            const tagID = $(this).attr('data-tag-id');
            assignedTagIDs.push(tagID);
        });

        return assignedTagIDs;
    }


    /**********************************************************
    Set the given collection of checkbox elements' checked attribute value to either true or false
    Either mark all them checked or uncheck them all
    **********************************************************/
    static setCheckboxesTo(eCheckboxes, setToChecked) {
        $(eCheckboxes).prop('checked', setToChecked);
    }

    /**********************************************************
    Retrieve all the tag checkbox elements from the modal
    **********************************************************/
    static getAllItemCheckboxElements() {
        return $(ListSettingsModalTags.Elements.COLLAPSE).find(`.${ListSettingsModalTags.Elements.ITEM_CHECKBOX}`);
    }
    
}

/**
 * HTML elements for the tags section in the list settings modal
 */
ListSettingsModalTags.Elements = {
    ASSIGNED     : '#modal-list-settings-sidenav-tags-assigned',
    COLLAPSE     : '#modal-list-settings-sidenav-tags-collapse',
    ITEM_CHECKBOX: 'sidenav-tags-collapse-item-input',
}


