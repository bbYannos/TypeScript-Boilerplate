import {AppURL, routerService} from "@Layouts";
import * as moment from "moment";
import {of} from "rxjs";
import {map} from "rxjs/operators";
import {COLUMNS, DATE_FORMAT, EDITABLE_TYPES, EditableCellDefinition, IconsService} from "Shared/DataTable";
import {
  Absence,
  AbsenceQuery,
  absenceService,
  api,
  Availability,
  AvailabilityQuery,
  availabilityService,
  Exam,
  ExamQuery,
  ExamScore,
  ExamScoreQuery,
  ExamType,
  Formation,
  Module,
  ModuleQuery,
  moduleService,
  Speaker,
  Trainee,
  traineeService,
  Training,
  TrainingQuery,
  trainingService
} from "../Api";
import {ListComponent} from "./List.Component";

export class ListFactory {

  public static defaultPageLength = 20;

  public static formationListLayout() {
    const listLayout = new ListComponent<Formation>();
    listLayout.service = api.formationService;
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL("Titre", "label"),
        COLUMNS.DATE_TIME("Deb.", 'startTime', DATE_FORMAT),
        COLUMNS.DATE_TIME("Fin", 'endTime', DATE_FORMAT),
        COLUMNS.TIME("Cours", "defaultDuration"),
        COLUMNS.DELETE
      ],
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.dateInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.dateInput),
      new EditableCellDefinition(3, EDITABLE_TYPES.durationInput)
    ];
    return listLayout;
  }

  public static traineeListLayout() {
    const listComponent = new ListComponent<Trainee>();
    listComponent.service = api.traineeService;
    listComponent.overrideOptions = {
      searching: true,
    };
    this.setPaging(listComponent.overrideOptions);

    listComponent.overrideOptions.columns = [
      COLUMNS.LABEL("Nom", "lastName", 80),
      COLUMNS.LABEL("Prénom", "firstName", 80),
      COLUMNS.LABEL("Email", "email", 150),
      {
        title: "Formation", data: "formation", width: "70px", render: (formation) => {
          return (formation !== null) ? formation.label : ''
        },
      },
      COLUMNS.EDIT,
      COLUMNS.DELETE
    ];
    listComponent.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(3, EDITABLE_TYPES.select,
        {
          options$: api.formationService.list(),
          emptyLabel: '-- formation --'
        }),
    ];
    return listComponent;
  }

  public static speakerListLayout() {
    const listLayout = new ListComponent<Speaker>();
    listLayout.dataSource$ = api.speakerService.fetchAll$;
    listLayout.service = api.speakerService;
    listLayout.overrideOptions = {
      searching: true,
      columns: [
        COLUMNS.LABEL("Nom", "lastName"),
        COLUMNS.LABEL("Prénom", "firstName"),
        COLUMNS.LABEL("Email", "email"),
        COLUMNS.DELETE
      ]
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.textInput),
    ];
    return listLayout;
  }

  public static absenceListLayout(type: 'delay' | 'absence' = 'delay', trainee: Trainee = null) {
    const listComponent = new ListComponent<Absence>();
    listComponent.service = api.absenceService;
    if (trainee === null) {
      listComponent.dataSource$ = api.absenceService.fetchAll$.pipe(
        map((absences: Absence[]) =>
          absences
          .filter((absence) => (type === "delay") ? absence.delay : !absence.delay)
          .sort((abs1, abs2) => (abs1.createdAt > abs2.createdAt) ? -1 : 1)
        ),
      );
    } else {
      const query = new AbsenceQuery();
      query.trainee = trainee;
      query.delay = (type === 'delay');
      listComponent.createAction = () => absenceService.createByQuery(query);
      if (type === 'delay') {
        listComponent.dataSource$ = trainee.delays$;
      } else {
        listComponent.dataSource$ = trainee.absences$;
      }
    }

    listComponent.overrideOptions = {
      searching: false,
    };
    this.setPaging(listComponent.overrideOptions);

    const DELAY_DURATION = {
      title: "Durée",
      data: "duration",
      render: (data: moment.Duration) => data.asMinutes().toString(),
      width: "40px",
      className: "align-center"
    };

    const DELAY_TOTAL = {
      title: "Total", data: "trainee",
      render: (trainee: Trainee) => trainee.delays.length.toString() + ' <i>(' + trainee.delaysDuration.format('HH:mm', {trim: false}) + ')</i>',
      width: "40px", className: "align-center"
    };

    const UNJUSTIFIED_ABSENCES = {
      title: "Non just.", data: "trainee.unjustifiedAbsences.length",
      render: (data) => (Number(data) < 2) ? data : '<b class="text-danger" style="font-size: 18px !important">' + data + '</b>',
      width: "40px", className: "align-center"
    };

    if (type === 'delay') {
      if (trainee === null) {
        listComponent.overrideOptions.columns = [
          COLUMNS.DATE_TIME("Date", "startTime"),
          COLUMNS.LABEL("Nom", "trainee.label"),
          DELAY_DURATION,
          DELAY_TOTAL,
          COLUMNS.DELETE
        ];
        listComponent.editableCellDefinitions = [
          new EditableCellDefinition(0, EDITABLE_TYPES.dateTimeInput),
          new EditableCellDefinition(2, EDITABLE_TYPES.durationInput, {durationFormat: 'mm'}),
        ];
      } else {
        listComponent.overrideOptions.columns = [
          COLUMNS.DATE_TIME("Date", "startTime"),
          DELAY_DURATION,
          DELAY_TOTAL,
          COLUMNS.DELETE
        ];
        listComponent.editableCellDefinitions = [
          new EditableCellDefinition(0, EDITABLE_TYPES.dateTimeInput),
          new EditableCellDefinition(1, EDITABLE_TYPES.durationInput, {durationFormat: 'mm'}),
        ];
      }
    } else {
      if (trainee === null) {
        listComponent.overrideOptions.columns = [
          COLUMNS.DATE_TIME("Date", "startTime"),
          COLUMNS.LABEL("Nom", "trainee.label"),
          COLUMNS.DATE_TIME("Fin", "endTime"),
          COLUMNS.NUMBER("Abs. total", "trainee.absences.length"),
          UNJUSTIFIED_ABSENCES,
          COLUMNS.DELETE
        ];
        listComponent.editableCellDefinitions = [
          new EditableCellDefinition(0, EDITABLE_TYPES.dateTimeInput),
          new EditableCellDefinition(2, EDITABLE_TYPES.dateTimeInput),
        ];
      } else {
        listComponent.overrideOptions.columns = [
          COLUMNS.DATE_TIME("Date", "startTime"),
          COLUMNS.DATE_TIME("Fin", "endTime"),
          Object.assign({title: "Just.", data: "justified"}, COLUMNS.CHECK_BOX),
          {title: "Justification", data: "justification"},
          COLUMNS.DELETE
        ];
        listComponent.editableCellDefinitions = [
          new EditableCellDefinition(0, EDITABLE_TYPES.dateTimeInput),
          new EditableCellDefinition(1, EDITABLE_TYPES.dateTimeInput),
          new EditableCellDefinition(2, EDITABLE_TYPES.checkBox),
          new EditableCellDefinition(3, EDITABLE_TYPES.textInput),
        ];
      }
    }
    return listComponent;
  }

  public static moduleListLayout(formation: Formation): ListComponent<Module> {
    const listLayout = new ListComponent<Module>();
    listLayout.service = api.moduleService;
    listLayout.dataSource$ = formation.modules$;
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL('Intitulé', "label"),
        COLUMNS.NUMBER('Coeff.', "coefficient"),
        COLUMNS.COLOR("color"),
        COLUMNS.DELETE
      ]
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.numberInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.colorPicker),
    ];
    const query = new ModuleQuery();
    query.formation = formation;
    listLayout.createAction = () => moduleService.createByQuery(query);
    return listLayout;
  }

  public static vacationListLayout(formation: Formation): ListComponent<Availability> {
    const listLayout = new ListComponent<Availability>();
    listLayout.service = api.availabilityService;
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL("Titre", "label"),
        COLUMNS.DATE_TIME("Deb.", 'startTime', DATE_FORMAT),
        COLUMNS.DATE_TIME("Fin", 'endTime', DATE_FORMAT),
        {
          title: 'Global ?',
          data: 'global',
          render: (data) => IconsService.onOff(data),
          width: "40px",
          className: "align-center"
        },
        COLUMNS.DELETE
      ],
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.dateInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.dateInput),
      new EditableCellDefinition(3, null)
    ];
    listLayout.dataSource$ = formation.allVacations$;
    const query = new AvailabilityQuery();
    query.setParentAndClass(formation);
    query.open = false;
    listLayout.createAction = () => availabilityService.createByQuery(query);
    return listLayout;
  }

  public static examTypesListLayout(): ListComponent<ExamType> {
    const listLayout = new ListComponent<ExamType>();
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL('Intitulé', "label"),
        COLUMNS.NUMBER('Coeff.', "coefficient"),
        COLUMNS.DELETE
      ]
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.numberInput),
    ];
    listLayout.service = api.examTypeService;
    listLayout.createAction = () => api.examTypeService.createByQuery();
    return listLayout;
  }

  public static examListLayout(training: Training): ListComponent<Exam> {
    const listLayout = new ListComponent<Exam>();
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL('Intitulé', "label"),
        COLUMNS.DATE_TIME('Date', "dateTime", DATE_FORMAT),
        {
          title: "Type", data: "examType", render: (examType) => {
            return (examType !== null) ? examType.label : ''
          }
        },
        COLUMNS.EDIT,
        COLUMNS.DELETE,
      ]
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.dateInput),
      new EditableCellDefinition(2, EDITABLE_TYPES.select, {
        options$: api.examTypeService.fetchAll$,
        emptyLabel: '-- Type --'
      }),
    ];
    listLayout.service = api.examService;
    listLayout.dataSource$ = training.exams$;
    const query = new ExamQuery();
    query.training = training;
    listLayout.createAction = () => api.examService.createByQuery(query);
    listLayout.editAction = (object: Exam) => {
      routerService.edit(object);
    };
    return listLayout;
  }

  public static examScoreListLayout(exam: Exam = null, trainee: Trainee = null): ListComponent<ExamScore> {
    const listLayout = new ListComponent<ExamScore>();
    const columns = [];
    const examScoreQuery = new ExamScoreQuery();
    if (exam !== null) {
      examScoreQuery.exam = exam;
      columns[0] = COLUMNS.LABEL('Etudiant', "trainee.label");
      listLayout.editableCellDefinitions = [
        new EditableCellDefinition(1, EDITABLE_TYPES.numberInput),
      ];
    } else if (trainee !== null) {
      examScoreQuery.trainee = trainee;
      columns[0] = COLUMNS.LABEL('Exam', "exam.label");
    }
    columns[1] = COLUMNS.NUMBER('Note', "score");

    listLayout.overrideOptions = {
      columns: columns,
    };

    listLayout.service = api.examScoreService;
    if (exam !== null) {
      listLayout.dataSource$ = api.examScoreService.getByExam(exam);
    } else if (trainee !== null) {
      listLayout.dataSource$ = api.examScoreService.getByTrainee(trainee);
    }
    listLayout.createAction = null;
    return listLayout;
  }

  public static absenceSynthesisList() {
    const listComponent = new ListComponent<Trainee>();
    listComponent.overrideOptions = {
      searching: true,
    };
    this.setPaging(listComponent.overrideOptions);

    listComponent.overrideOptions.columns = [
      COLUMNS.MAILTO_LINK("Nom", "label", "email"),
      COLUMNS.NUMBER("Abs. total", "absences.length"),
      {
        title: "Non just.", data: "unjustifiedAbsences.length",
        render: (data) => (Number(data) < 2) ? data : '<b class="text-danger" style="font-size: 18px !important">' + data + '</b>',
        width: "40px", className: "align-center"
      }, {
        title: "Retards", data: null,
        render: (trainee: Trainee) => trainee.delays.length.toString() + ' <i>(' + trainee.delaysDuration.format('HH:mm', {trim: false}) + ')</i>',
        width: "40px", className: "align-center"
      },
      COLUMNS.EDIT,
    ];
    listComponent.editableCellDefinitions = [];
    listComponent.service = traineeService;
    return listComponent;
  }

  public static trainingListLayoutForSpeaker(speaker: Speaker): ListComponent<Training> {
    const query = new TrainingQuery();
    query.speaker = speaker;
    const listLayout = this.trainingListLayout(query);
    listLayout.dataSource$ = speaker.trainings$.pipe(
      trainingService.sort(),
    );
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL('Intitulé', "label"),
        {
          title: "Formation", data: "formation", render: (formation) => {
            return (formation !== null) ? formation.label : ''
          }
        },
        COLUMNS.TIME("Durée", "duration"),
        COLUMNS.COLOR("color"),
        COLUMNS.DELETE
      ],
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.select, {
        options$: api.formationService.fetchAll$,
        emptyLabel: '-- formation --'
      }),
      new EditableCellDefinition(2, EDITABLE_TYPES.durationInput),
      new EditableCellDefinition(3, EDITABLE_TYPES.colorPicker)
    ];
    return listLayout;
  }

  public static trainingListLayoutForFormation(formation: Formation): ListComponent<Training> {
    const query = new TrainingQuery();
    query.formation = formation;
    const listLayout = this.trainingListLayout(query);
    listLayout.dataSource$ = formation.trainings$.pipe(
      trainingService.sort(),
    );
    listLayout.overrideOptions = {
      columns: [
        COLUMNS.LABEL('Intitulé', "label"),
        {
          title: "Intervenant", data: "speaker", render: (speaker) => {
            return (speaker !== null) ? speaker.label : ''
          }
        }, {
          title: "Module", data: "module", render: (module) => {
            return (module !== null) ? module.label : ''
          }
        },
        COLUMNS.TIME("Durée", "duration"),
        COLUMNS.COLOR("color"),
        COLUMNS.DELETE
      ],
    };
    listLayout.editableCellDefinitions = [
      new EditableCellDefinition(0, EDITABLE_TYPES.textInput),
      new EditableCellDefinition(1, EDITABLE_TYPES.select, {
        options$: api.speakerService.fetchAll$,
        emptyLabel: '-- intervenant --'
      }),
      new EditableCellDefinition(2, EDITABLE_TYPES.select, {
        options$: formation.modules$,
        emptyLabel: '-- module --'
      }),
      new EditableCellDefinition(3, EDITABLE_TYPES.durationInput),
      new EditableCellDefinition(4, EDITABLE_TYPES.colorPicker)
    ];
    return listLayout;
  }

  // noinspection JSUnusedGlobalSymbols
  public static any__ListLayout() {
    const listComponent = new ListComponent<any>();
    listComponent.overrideOptions = {
      columns: []
    };
    listComponent.editableCellDefinitions = [];
    listComponent.service = null;
    listComponent.dataSource$ = null; //   default if service : service.fetchAll$
    listComponent.createAction = null; //  default if service : service.create(service.repository.makeNew())

    return listComponent;
  }

  protected static setPaging(options) {
    Object.assign(options, {
      paging: true,
      pageLength: this.defaultPageLength,
      lengthChange: false,
      pagingType: 'numbers',
    });
  }

  protected static trainingListLayout(query: TrainingQuery): ListComponent<Training> {
    const listLayout = new ListComponent<Training>();
    listLayout.service = api.trainingService;
    listLayout.createAction = () => trainingService.createByQuery(query);
    listLayout.editAction = (training: Training) => {
      routerService.setCurrent(AppURL.getRouteForObjects([training.formation, training]));
    };
    return listLayout;
  }
}