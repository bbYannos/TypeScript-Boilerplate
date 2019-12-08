export class FormUtils {
  public static toJSON(form: HTMLFormElement) {
    const json = {};
    const elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
      const element = elements[i] as HTMLInputElement;
      const name = element.name;
      const value = element.value;
      if (name) {
        json[name] = value;
      }
    }
    return json;
  }
}
