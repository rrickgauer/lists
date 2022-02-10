


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
}



ExportItemsModal.Elements = {
    MODAL: '#export-items-modal',
    TEXTAREA: '#export-items-textarea'
}