

export class Utilities
{
    
    /**********************************************************
    Generate a new UUID
    **********************************************************/
    static getNewUUID() {
        return uuidv4();
    }

    /**********************************************************
    Transforms the given object into a FormData object.
    **********************************************************/
    static objectToFormData(canidateObject) {
        // const formData = new FormData();
        const formData = new URLSearchParams();

        for (const key in canidateObject) {
            formData.append(key, canidateObject[key]);
        }

        return formData;
    }
}