
import { Tag } from "../../models/tag";


/**
 * This class handles generating the html for a tag element badge.
 * 
 * tag properties:
 *  - color
 *  - created_on
 *  - id
 *  - name
 *  - text_color
 */
export class TagHtml
{
    /**
     * Constructor
     * 
     * @param {Tag} tag 
     */
    constructor(tag) {
        this.tag = tag;
        this.getHtml = this.getHtml.bind(this);
    }


    getHtml() {
        const classes = `badge badge-pill ${TagHtml.Elements.CONTAINER} ${this.tag.text_color} mx-1`;
        const style = `background-color: ${this.tag.color};`;

        const html = `
        <span class="${classes}" style="${style}" data-tag-id="${this.tag.id}">
            ${this.tag.name}
        </span>`;

        return html;
    }
}


TagHtml.Elements = {
    CONTAINER: 'tag-badge',
}