import { ItemDrag } from "./item-drag";
import addSidenavListeners from "./controller-sidenav";
import addActiveListElementListeners from "./controller-active-list";
import addActiveListItemElementListeners from "./controller-active-list-item";
import addListSettingsModalListeners from "./controller-list-settings-modal";
import addExportItemsModalListeners from "./controller-export-items-modal";


const eActiveListContainer = '.active-lists-board';

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    addSidenavListeners();
    addActiveListElementListeners();
    addActiveListItemElementListeners();
    addListSettingsModalListeners();
    addExportItemsModalListeners();
    ItemDrag.listen(eActiveListContainer);  // listen for item drag/drop actions
}








