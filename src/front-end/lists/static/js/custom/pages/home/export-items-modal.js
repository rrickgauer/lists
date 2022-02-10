


export class ExportItemsModal
{
    // show the modal
    static showModal() {
        $(ExportItemsModal.Elements.MODAL).modal('show');
    }

    // show the loading section (spinner) and hide the textarea section
    static showLoadingSection() {
        $(ExportItemsModal.Elements.MODAL).addClass('loading');
    }

    // show the normal textarea section and hide the loading section
    static hideLoadingSection() {
        $(ExportItemsModal.Elements.MODAL).removeClass('loading');
    }


    // set the modal's list id data attribute value
    static setCurrentListID(newListID) {
        $(ExportItemsModal.Elements.MODAL).attr('data-list-id', newListID);
    }

    // get the current list id from teh data-list-id attribute
    static getCurrentListID() {
        return $(ExportItemsModal.Elements.MODAL).attr('data-list-id');
    }

    static setTextareaValue(newTextareaValue) {
        $(ExportItemsModal.Elements.TEXTAREA).val(newTextareaValue);
    }
}



ExportItemsModal.Elements = {
    MODAL: '#export-items-modal',
    TEXTAREA: '#export-items-textarea'
}