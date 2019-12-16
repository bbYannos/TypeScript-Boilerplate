export class IconsService {
  public static carret = '<a href="javascript:;" class="fa fa-chevron-right"></a>';
  public static glopIcon = '<i class="fa fa-check" style="color:green"></i>';
  public static notGlopIcon = '<i class="fa fa-times-circle" style="color:red"></i>';
  public static loadingSpin = '<i class="fa fa-circle-o-notch fa-spin"></i>';

  public static deleteIcon = (color: string = "red") =>
    '<a href="javascript:;" title="Supprimer" class="to_delete" >' + // to_delete: used by datatable
    '<span class="fa fa-times" style="color:' + color + '"></span>' +
    "</a>";

  public static editIcon = (color: string = "green") =>
    '<a href="javascript:;" title="Editer"  >' +
    '<span class="fa fa-pencil-square-o" style="color:' + color + '"></span>' +
    "</a>";

  public static onOff = (value) => {
    let html = '<a href="javascript:;">';
    html += (value) ? IconsService.glopIcon : IconsService.notGlopIcon;
    return html += "</a>";
  };

  public static nullLink = (content: string, title: string, readOnly: boolean) => {
    if (readOnly === true) {
      return '<a href="javascript:" title="' + title + '" style="cursor:not-allowed">' + content + "</a>";
    }
    return '<a href="javascript:" title="' + title + '" >' + content + "</a>";
  };

  public static downloadIcon = (url: string = "") => {
    return (url === "") ? "" : '<a href="' + url + '" target="_blank" title="Télécharger le document"><i class="fa fa-file-download" style="#00638f; cursor: pointer"></i></a>';
  };
}
