import moment from "shared/moment";
import {ObjectUtils} from "shared/utils/object.utils";
import {IconsService} from "./Icons.Service";

export const EDITABLE_TYPES = {
  protected: -1,
  textInput: 0,
  dateTimeInput: 1,
  dateInput: 2,
  timeInput: 3,
  durationInput: 4,
  select: 5,
  colorPicker: 6,
  checkBox: 7,
  numberInput: 8,
};

export const DATE_TIME_FORMAT = "DD/MM/Y HH:mm";
export const DATE_FORMAT = "DD/MM/Y";
export const TIME_FORMAT = "HH:mm";
export const MIDNIGHT = () => moment().startOf("day").clone();

export const IconWrapper = (html) => '<div style="text-align:center">' + html + "</div>";


// todo: DATE: (title: string = null, data: string = null) =>
export const COLUMNS = {
  DATE: {
    orderDataType: "dom-moment",
    render: (data) => (data.isValid()) ? data.format(DATE_FORMAT) : "",
    width: "100px",
    className: "align-center",
  },

  DATE_TIME: (title: string, propertyName: string, format: string = DATE_TIME_FORMAT) => {
    const width = (format === DATE_TIME_FORMAT) ? "100px" : "75px";
    return {
      title: title, data: propertyName, orderDataType: "dom-moment",
      render: (data: moment.Moment) => (ObjectUtils.isValidMoment(data)) ? data.format(format) : "",
      width: width,
    };
  },
  TIME: (title: string, propertyName: string) => {
    return {
      title: title, data: propertyName,
      render: (duration: moment.Duration) => (duration === null) ? "" : duration.format(TIME_FORMAT), width: "50px",
    };
  },

  LABEL: (title: string, propertyName: string, width: number = null) => {
    return {
      title: title, data: propertyName, width: (width === null) ? "auto" : width + "px",
      render: (data) => (data && data.length) ? data : '<span class="text-danger">Entrez un ' + title.toLowerCase() + "</span>",
    };
  },
  LABEL_IF_EXIST: (title: string, propertyName: string) => {
    return {title: title, data: propertyName, render: (data) => (data) ? data.label : ""};
  },
  NUMBER: (title: string, propertyName: string) => (
    {title: title, data: propertyName, width: "40px", className: "align-center"}
  ),
  COLOR: (propertyName: string) => {
    return {
      title: "#", data: propertyName, orderable: false, className: "details-control align-center",
      render: (data) => '<span class="color-display" style="background-color:' + data + '"></span>',
    };
  },
  EXPANDABLE: {
    name: "expandable",
    orderable: false,
    className: "details-control align-center",
    render: () => IconsService.carret,
    width: "10px",
  },
  IDENTIFIER: {name: "identifier", data: "identifier", visible: false},
  CHECK_BOX: (title: string, propertyName: string) => ({
    title: title, data: propertyName,
    name: "checkBox", orderable: false, width: "40px", className: "align-center",
    render: (data, type, row) => {
      const icon = (data) ? IconsService.glopIcon : IconsService.notGlopIcon;
      return IconsService.nullLink(icon, "", row.readOnly);
    },
  }),
  MAIL: (title: string, propertyName: string) => {
    return {
      title: title, data: propertyName,
      render: (data) => (data !== null && data.length) ? '<a href="mailto:' + data + '">' + data + "</a>" : "",
    };
  },
  MAILTO_LINK: (title: string, propertyName: string, mailPropertyName: string = "mail") => {
    return {
      title: title, data: null, render: (object) => {
        if (object[propertyName] === null || object[propertyName] === "") {
          return "";
        }
        if (object[mailPropertyName] === null || object[mailPropertyName] === "") {
          return object[propertyName];
        }
        return '<a href="mailto:' + object[mailPropertyName] + '" title=" ' + object[mailPropertyName] + '">' + object[propertyName] + "</a>";
      },
    };
  },
  EDIT: {title: "", name: "edit", width: "40px", render: () => IconWrapper(IconsService.editIcon())},
  DELETE: {name: "delete", orderable: false, render: () => IconWrapper(IconsService.deleteIcon()), width: "40px"},
  DOWNLOAD_FILE: {
    name: "download_file",
    orderable: false,
    searchable: false,
    render: (data) => IconsService.downloadIcon(data),
    width: "40px",
    className: "align-center",
  },

};

export const language = {
  fr: {
    processing: "Traitement en cours...",
    search: "Rechercher&nbsp;:",
    lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
    info: "Affichage de l'&eacute;l&eacute;ment _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
    infoEmpty: "Affichage de l'&eacute;l&eacute;ment 0 &agrave; 0 sur 0 &eacute;l&eacute;ment",
    infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
    infoPostFix: "",
    loadingRecords: "Chargement en cours...",
    zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
    emptyTable: "Aucune donn&eacute;e disponible dans le tableau",
    paginate: {
      first: "Premier",
      previous: "Pr&eacute;c&eacute;dent",
      next: "Suivant",
      last: "Dernier",
    },
    aria: {
      sortAscending: ": activer pour trier la colonne par ordre croissant",
      sortDescending: ": activer pour trier la colonne par ordre d&eacute;croissant",
    },
  },
};

