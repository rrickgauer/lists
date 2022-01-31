
import { TagElements } from "./tag-elements";

/**
 * This class handles creating a new tag
 */
export class TagFormNew
{

    /**********************************************************
    Create a new tag
    **********************************************************/
    static create() {
        const inputValues = TagFormNew.getInputValues();
        console.log(inputValues);
    }

    /**********************************************************
    Get the form input values.

    Returns an object comprised of these fields:
        - name
        - color
    **********************************************************/
    static getInputValues() {
        return {
            name: TagFormNew.getNameInputValue(),
            color: TagFormNew.getColorInputValue(),
        }
    }


    /**********************************************************
    Get the name input value
    **********************************************************/
    static getNameInputValue() {
        return $(TagElements.FormNew.Inputs.NAME).val();
    }

    /**********************************************************
    Get the value of the color input element
    **********************************************************/
    static getColorInputValue() {
        return $(TagElements.FormNew.Inputs.COLOR).val();
    }
}





