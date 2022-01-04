

class ItemDrag
{



    static listen(eItemContainer) {

        const eContainer = document.querySelector(eItemContainer);

        eContainer.addEventListener('dragstart', ItemDrag.dragStart);
        eContainer.addEventListener('drop', ItemDrag.drop);
        eContainer.addEventListener('dragenter', ItemDrag.dragEnter);
        eContainer.addEventListener('dragover', ItemDrag.dragOver);
        eContainer.addEventListener('dragleave', ItemDrag.dragLeave);
    }


    static dragStart(e) {
        // get the item container element
        const eItem = ItemHtml.getContainerItem(e.target);
        
        // save the value of the data-list-id attribute of the item that is being intially dragged
        const itemID = ItemHtml.getItemID(eItem);
        e.dataTransfer.setData('text/plain', itemID);
    }

        
    static dragEnter(e) {
        e.preventDefault();
    }
    
    static dragOver(e) {
        e.preventDefault();
    }
    
    static dragLeave(e) {
    
    }
    
    static drop(e) {
        // get the element container that is the drop location
        let eDroppedItem = ItemHtml.getContainerItem(e.target);
        const droppedItemID = ItemHtml.getItemID(eDroppedItem);
        
        // get the item that was initially dragged through retrieving its data-list-id value set in the initial drag function
        const draggedItemID = e.dataTransfer.getData('text/plain');
        let eDraggedItem = ItemHtml.getItemWithID(draggedItemID);

        // clone both elements
        ItemDrag._swapItemElements(eDroppedItem, eDraggedItem);


        // determine the new rank values the 2 items now have
        const newItemRanks = ItemDrag.getRanks(droppedItemID, draggedItemID);
        console.table(newItemRanks);
    }

    // given 2 item elements, swap them
    /**********************************************************
    Generate the html for all this list's items
    **********************************************************/
    static _swapItemElements(eItem1, eItem2) {
        const eItem1Clone = eItem1.clone();
        const eItem2Clone = eItem2.clone();
    
        // replace each element with the clone
        $(eItem1).replaceWith(eItem2Clone);
        $(eItem2).replaceWith(eItem1Clone);
    }
    
    /**********************************************************
    Generate the html for all this list's items
    **********************************************************/
    static getRanks(eItemID1, eItemID2) {
        // fetch the new elements
        const eItem1 = ItemHtml.getItemWithID(eItemID1);
        const eItem2 = ItemHtml.getItemWithID(eItemID2);

        // get a list of all the items in the parent list
        const eListItems = ListHtml.getParentActiveListElement(eItem1).find(`.${ItemHtml.Elements.TOP}`);

        // add the pair of items to the output
        const ranks = [];
        
        ranks.push({
            id: eItemID1,
            rank: eListItems.index(eItem1),
        });

        ranks.push({
            id: eItemID2,
            rank: eListItems.index(eItem2),
        });

        return ranks;
    }

    


    

}