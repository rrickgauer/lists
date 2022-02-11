
import autosize from "../../lib/autosize";


/**
 * This class controls the export items modal.
 */
export class ExportItemsModal
{

    /**
     * Show the modal
     */
    static showModal() {
        $(ExportItemsModal.Elements.MODAL).modal('show');
    }

    /**
     * Show the loading section (spinner) and hide the textarea section
     */
    static showLoadingSection() {
        $(ExportItemsModal.Elements.MODAL).addClass('loading');
    }

    /**
     * Show the normal textarea section and hide the loading section
     */
    static hideLoadingSection() {
        $(ExportItemsModal.Elements.MODAL).removeClass('loading');
    }


    /**
     * Set the modal's list id data attribute value 
     * 
     * @param {string} newListID 
     */
    static setCurrentListID(newListID) {
        $(ExportItemsModal.Elements.MODAL).attr('data-list-id', newListID);
    }

    // get the current list id from teh data-list-id attribute
    static getCurrentListID() {
        return $(ExportItemsModal.Elements.MODAL).attr('data-list-id');
    }

    /**
     * Set the textarea's value to the one given
     * 
     * @param {string} newTextareaValue - the new textarea value
     */
    static setTextareaValue(newTextareaValue) {
        $(ExportItemsModal.Elements.TEXTAREA).val(newTextareaValue);
    }


    /**
     * Auto adjust the height of the textarea to fit all the list items
     */
    static resizeTextarea() {
        autosize($(ExportItemsModal.Elements.TEXTAREA));
        autosize.update($(ExportItemsModal.Elements.TEXTAREA));
    }
}



ExportItemsModal.Elements = {
    MODAL: '#export-items-modal',
    TEXTAREA: '#export-items-textarea'
}