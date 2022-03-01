import { SidenavFormList } from './sidenav-form-list';
import { ListHtml } from "./list-html";



const eOverlay = '<div style="z-index: 109;" class="drawer-overlay"></div>';

const eSidebar = {
    buttons: {close: '#sidenav-btn-close',},
    filterForm: '#sidenav-collapse-sections-filter-form',
}

const eActiveListContainer = '.active-lists-board';
const mSidenavFormList = new SidenavFormList();
const eBtnShowSidenavBtn = '#btn-show-sidenav';
const eListsContainer = '#lists-container';


/**********************************************************
SIDENAV: Register all the event listeners
**********************************************************/
export default function addSidenavListeners() {
    // open sidenav
    $(eBtnShowSidenavBtn).on('click', function() {
        toggleSidenav();
    }); 

    // open a list from the sidebar
    $('#lists-container').on('click', '.list-group-item-action', function() {
        activateList(this);
    });

    // clicking on overlay when sidebar is active
    $('body').on('click', '.drawer-overlay', closeSidenav);

    // close sidebar button clicked
    $(eSidebar.buttons.close).on('click', closeSidenav);

    // begin typing into the new list input
    $(SidenavFormList.Elements.INPUT).on('keyup change', mSidenavFormList.toggleForm);

    // create a new list from the sidenav
    $(SidenavFormList.Elements.SUBMIT).on('click', mSidenavFormList.saveNewList);

    // create a new list from the sidenav
    $(SidenavFormList.Elements.INPUT).on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            mSidenavFormList.saveNewList();
        }
    });

    // filter lists
    $(eSidebar.filterForm).find(`.form-check-input`).on('change', function(e) {
        const checkboxValue = $(this).val();
        $(eListsContainer).find(`[data-list-type="${checkboxValue}"]`).toggleClass('d-none');
    });

    // make sure only 1 collapseable section is open at a time
    $('#sidenav-collapse-sections .collapse').on('show.bs.collapse', function() {
        $('#sidenav-collapse-sections .collapse').collapse('hide');
    });
}


/**********************************************************
Open/close the sidebar
**********************************************************/
function toggleSidenav() {
    $('#page').toggleClass('sidenav-open');
    $('body').append(eOverlay);
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
Close the sidebar
**********************************************************/
function closeSidenav() {
    $('#page').removeClass('sidenav-open');
    $('body .drawer-overlay').remove();
    $('#sidenav-collapse-sections .collapse').collapse('hide');
}