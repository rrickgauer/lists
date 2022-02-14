import { ListRename } from "./list-rename";
import { ListClone } from "./list-clone";
import { ListSettingsModal } from "./list-settings-modal";
import { ListDelete } from './list-delete';
import { ListSettingsModalTags } from "./list-settings-modal-tags";
import { TagAssignment } from "./tag-assignment";



/**********************************************************
List rename form modal: add event listeners
**********************************************************/
export default function addListSettingsModalListeners() {
    // save the list rename
    $(ListSettingsModal.Elements.BTN_SAVE).on('click', function() {
        saveListSettings();
    });

    // save the list rename for typing enter key while input is in focus
    $(ListSettingsModal.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            saveListSettings();
        }
    });


    // clone list
    $(ListSettingsModal.Elements.FORM_CLONE).on('submit', function(e) {
        e.preventDefault();
        const listSettings = new ListClone();
        listSettings.clone();
    });


    // delete list
    $(ListSettingsModal.Elements.BTN_DELETE).on('click', deleteList);

    // close modal
    $(ListSettingsModal.Elements.MODAL).on('hide.bs.modal', ListSettingsModal.handleModalCloseEvent);

    // rename list name input
    $(ListSettingsModal.Elements.INPUT).on('keyup change', ListSettingsModal.handleNameInputChange);

    // assign/remove a tag to a list
    $(`.${ListSettingsModalTags.Elements.ITEM_CHECKBOX}`).on('change', function() {
        assignListTag(this);
    });

}

/**********************************************************
Action listener for saving a list rename
**********************************************************/
function saveListSettings() {
    const listSettings = new ListRename();
    listSettings.save();
}

/**********************************************************
Delete the current list
**********************************************************/
function deleteList() {
    const listID = ListSettingsModal.getCurrentListID();
    const listDelete = new ListDelete(listID);

    if (!listDelete.confirm()) {
        return;
    }

    listDelete.delete();
    listDelete.removeListElements();
    ListSettingsModal.closeModal();
}

/**********************************************************
Add or remove the tag assignment
**********************************************************/
function assignListTag(eClickedCheckbox) {
    const tagAssignment = new TagAssignment(eClickedCheckbox);

    if (tagAssignment.isNew()) {
        tagAssignment.save();
    } else {
        tagAssignment.delete();
    }
}
