import { ExportItemsModal } from "./export-items-modal";



/**********************************************************
Action listeners for export items modal
**********************************************************/
export default function addExportItemsModalListeners() {
    // show the spinner when the modal is closed
    $(ExportItemsModal.Elements.MODAL).on('hidden.bs.modal', ExportItemsModal.showLoadingSection);
}