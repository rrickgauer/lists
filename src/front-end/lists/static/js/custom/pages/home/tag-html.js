
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
        const classes = `badge badge-pill ${TagHtml.Elements.CONTAINER} ${this.tag.color_text} mx-1`;
        const styleBg = `background-color: ${this.tag.color};`;
        const styleTextColor = `color: ${this.tag.color_text};`;

        const html = `
        <span class="${classes}" style="${styleBg} ${styleTextColor}" data-tag-id="${this.tag.id}">
            ${this.tag.name}
        </span>`;

        return html;
    }
}


TagHtml.Elements = {
    CONTAINER: 'tag-badge',
}