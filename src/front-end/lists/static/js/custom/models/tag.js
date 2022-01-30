
/**
 * Model class for Tags
 */
export class Tag
{
    constructor(newTagObject) {
        this.id         = null;
        this.name       = null;
        this.color      = null;
        this.created_on = null;
        this.user_id    = null;


        for (const key in this) {
            if (newTagObject.hasOwnProperty(key)) {
                this[key] = newTagObject[key];
            }
        }
    }
}