const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {
        close: '#sidenav-btn-close',
    }
}


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
    // sidebar clicking on a list
    $('#lists-container').on('click', '.list-group-item-action', function() {
        activateList(this);
    });

    // clicking on overlay when sidebar is active
    $('body').on('click', '.drawer-overlay', closeSidenav);

    // close sidebar button clicked
    $(eSidebar.buttons.close).on('click', closeSidenav);
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
Open a list from the sidebar
**********************************************************/
function activateList(sidebarListElement) {
    $(sidebarListElement).toggleClass('active');
}