
/**
 * Item model
 */
export class Item
{
    constructor(item) {
        this.complete    = null;
        this.content     = null;
        this.created_on  = null;
        this.id          = null;
        this.list_id     = null;
        this.list_name   = null;
        this.modified_on = null;
        this.rank        = null;

        for (const key in this) {
            if (item.hasOwnProperty(key)) {
                this[key] = item[key];
            }
        }
    }
}