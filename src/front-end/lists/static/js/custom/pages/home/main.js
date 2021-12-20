const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {
        close: '#sidenav-btn-close',
    }
}


const mSidenavFormList = new SidenavFormList();

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
    
    toggleSidenav();    // open the sidebar initially
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
}

/**********************************************************
Open a list from the sidebar
**********************************************************/
async function activateList(sidebarListElement) {
    $(sidebarListElement).toggleClass('active');

    const listID = $(sidebarListElement).attr('data-list-id');
    const list = new List(listID);
    
    const successfulFetch = await list.fetchItems();

    if (!successfulFetch) {
        return;
    }

    console.log(list);
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

