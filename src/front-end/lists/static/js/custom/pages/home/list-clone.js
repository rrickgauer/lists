/*
    TemplateModal.SpinnerButtons.CLONE.showSpinner();

    // send api request to clone
    const listID = TemplateModal.getCurrentTemplateID();
    const apiResponse = await ApiWrapper.listsClone(listID);

    // make sure the request was successful
    if (!apiResponse.ok) {
    TemplateModal.SpinnerButtons.CLONE.reset();
    return;
    }

    // refresh the page
    window.location.href = window.location.href;
*/


class ListCloner
{
    constructor(eListActionButton) {
        this.eListActionButton = eListActionButton;
    }


    clone() {
        console.log('cloning');
    }
}