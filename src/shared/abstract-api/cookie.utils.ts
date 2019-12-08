export class CookieUtils {
    public static Names = {
        OnOffLine: "OnOffLine",
    };

    /**
     * General utils for managing cookies in Typescript.
     */
    public static setCookie(name: string, val: string) {
        const date = new Date();
        const value = val;

        // Set it expire in 7 days
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        const datedString = name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";

        // Set it
        document.cookie = name + "=" + value + "; path=/";
    }

    public static toggleCookie(name: string): boolean {
        const value = ! (this.getCookie(name) === "true");
        this.setCookie(name, (value) ? "true" : "false");
        return value;
    }

    public static setIfNotSet(name: string, value: string): string {
        const existingValue = this.getCookie(name);
        if (existingValue === null) {
            this.setCookie(name, value);
            return value;
        } else {
            return existingValue;
        }
    }

    public static getCookie(name: string) {
        let value = null;
        const cookieValue = "; " + document.cookie;
        const parts = cookieValue.split("; " + name + "=");

        if (parts.length === 2) {
            value = parts.pop().split(";").shift();
        }
        return value;
    }

    public static deleteCookie(name: string) {
        const date = new Date();
        // Set it expire in -1 days
        date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
        const datedString =  name + "=; expires=" + date.toUTCString() + "; path=/";
        // Set it
        document.cookie = name + "=; path=/";
    }
}
