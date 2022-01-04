const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {
        close: '#sidenav-btn-close',
    }
}

const eActiveListContainer = '.active-lists-board';

const mSidenavFormList = new SidenavFormList();

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
    
    // toggleSidenav();    // open the sidebar initially
    testingActivateFirstList();
});


/**********************************************************
Add all the event listeners to the page
**********************************************************/
function addEventListeners() {
    // sidebar clicking on a list
    $('#lists-container').on('click', '.list-group-item-action', function() {
        activateList(this);
    });

    // clicking on overlay when sidebar is active
    $('body').on('click', '.drawer-overlay', closeSidenav);

    // close sidebar button clicked
    $(eSidebar.buttons.close).on('click', closeSidenav);

    // add value to sidebar new list form input
    $(SidenavFormList.elements.input).on('keyup change', mSidenavFormList.toggleSubmitButton);

    // create a new list from the sidenav
    $(SidenavFormList.elements.submit).on('click', mSidenavFormList.saveNewList);

    $(SidenavFormList.elements.input).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            mSidenavFormList.saveNewList();
        }
    });

    // create new item
    $(eActiveListContainer).on('keypress', `.${ListHtml.Elements.NEW_ITEM_FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            createNewItem(this);
        }
    });

    // Display an item's update content form
    $(eActiveListContainer).on('click', `.${ItemHtml.Elements.CONTENT}`, function() {
        displayItemUpdateForm(this);
    });

    // When editing an item's content, either save or cancel update
    $(eActiveListContainer).on('click', `.${ItemContentUpdateForm.Elements.FORM} button`, function() {
        performUpdateItemFormAction(this);
    });

    // When editing an item's content, hits enter
    $(eActiveListContainer).on('keypress', `.${ItemContentUpdateForm.Elements.FORM} input`, function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            updateItemContent(this);
        }
    });

    // When editing an item's content, hits enter
    $(eActiveListContainer).on('focusout', `.${ItemContentUpdateForm.Elements.FORM} input`, function() {
        // cancelItemContentUpdate(this);
    });

    // close an active list
    $(eActiveListContainer).on('click', `.${ListHtml.Elements.BTN_CLOSE}`, function() {
        closeActiveList(this);
    });


    // mark item complete
    $(eActiveListContainer).on('change', `.${ItemHtml.Elements.CHECKBOX}`, function() {
        completeItem(this);
    });

    // delete an item
    $(eActiveListContainer).on('click', `.${ItemHtml.Elements.BTN_DELETE}`, function() {
        deleteItem(this);
    });

    // close an active list
    $(eActiveListContainer).on('click', `.${ListHtml.Elements.ACTION_BUTTONS} .dropdown-item`, function() {
        performListAction(this);
    });

    // save the list rename
    $(ListRename.Elements.BTN_SAVE).on('click', function() {
        saveListRename();
    });




}

function testingActivateFirstList() {
    const firstList = $('#lists-container').find('.list-group-item-action')[0];
    activateList(firstList);
}



/**********************************************************
Open a list from the sidebar
**********************************************************/
async function activateList(sidebarListElement) {
    // make sure the list isn't already active 
    if ($(sidebarListElement).hasClass('active')) {
        return;
    }
    
    $(sidebarListElement).addClass('active');

    const listID = $(sidebarListElement).attr('data-list-id');
    const list = new ListHtml(listID);

    list.displayLoadingCard(eActiveListContainer);

    if (!await list.fetchData()) {
        console.error('could not fetch the list data from the api');
        return;
    }

    list.renderHtml(eActiveListContainer);
}

/**********************************************************
Open/close the sidebar
**********************************************************/
function toggleSidenav() {
    $('#page').toggleClass('sidenav-open');
    $('body').append(eOverlay);
}

/**********************************************************
Close the sidebar
**********************************************************/
function closeSidenav() {
    $('#page').removeClass('sidenav-open');
    $('body .drawer-overlay').remove();
}



/**********************************************************
Attempt to add a new item to the active list in focus
**********************************************************/
function createNewItem(inputElement) {
    const itemCreator = new ItemCreator(inputElement);

    // ensure the input is not empty
    if (!itemCreator.loadInputValue()) {
        console.warn('Input was empty');
        return;
    }

    itemCreator.assignNewItemID();
    
    if (!itemCreator.sendPostRequest()) {
        return;
    }

    itemCreator.appendToList();
    itemCreator.clearInputValue();
}

/**********************************************************
Render an item's update content form.
**********************************************************/
function displayItemUpdateForm(eItemContent) {
    const eItemContainer = $(eItemContent).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.renderUpdateForm();
}

/**********************************************************
Respond to an item's update content form action button being clicked.
**********************************************************/
function performUpdateItemFormAction(eUpdateItemFormActionButton) {
    const eItemContainer = $(eUpdateItemFormActionButton).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.respondToActionButton(eUpdateItemFormActionButton);
}

/**********************************************************
Update an item's content
**********************************************************/
function updateItemContent(eItemUpdateFormInput) {
    const eItemContainer = $(eItemUpdateFormInput).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.updateContent();
}

/**********************************************************
Cancel an item's content update
**********************************************************/
function cancelItemContentUpdate(eItemUpdateFormInput) {
    const eItemContainer = $(eItemUpdateFormInput).closest(`.${ItemHtml.Elements.TOP}`);
    
    const itemUpdateForm = new ItemContentUpdateForm(eItemContainer);
    itemUpdateForm.cancelUpdate();
}



/**********************************************************
Close an active list
**********************************************************/
function closeActiveList(eClickedCloseButton) {
    const eActiveList = $(eClickedCloseButton).closest(`.${ListHtml.Elements.CONTAINER}`);
    const listID = $(eActiveList).attr('data-list-id');

    // remove active list from the board
    $(eActiveList).remove();    

    // remove active class from sidenav list item
    $(`#lists-container .list-group-item[data-list-id="${listID}"]`).removeClass('active');
    
}

/**********************************************************
Item's complete checkbox was clicked
**********************************************************/
function completeItem(eCheckbox) {
    const itemCompletor = new ItemCompletor(eCheckbox);
    itemCompletor.save();
}

/**********************************************************
Delete an item
**********************************************************/
function deleteItem(eDeleteButton) {
    const itemRemove = new ItemRemove(eDeleteButton);

    itemRemove.remove();
    itemRemove.updateListItemCount('#sidenav');
}


/**********************************************************
Determine which list action to take
**********************************************************/
function performListAction(eListActionButton) {
    const listActionValue = $(eListActionButton).attr('data-list-action');
    
    // determine which button was clicked
    switch(listActionValue)
    {
        case "rename":
            ListRename.openModal(eListActionButton);
            break;
        case "delete":
            const listDelete = new ListDelete(eListActionButton);
            console.log(listDelete);
            listDelete.delete();
            break;

    }
}

/**********************************************************
Action listener for saving a list rename
**********************************************************/
function saveListRename() {
    const listRename = new ListRename();
    listRename.save();
}