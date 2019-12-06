import {AbstractInitService} from "shared/abstract-api";
import "../RelationManager";

import {
  AbsenceService,
  absenceService,
  AvailabilityService,
  availabilityService,
  DownloadService,
  downloadService,
  ExamScoreService,
  examScoreService,
  ExamService,
  examService,
  ExamTypeService,
  examTypeService,
  FormationService,
  formationService,
  ModuleService,
  moduleService,
  SessionService,
  sessionService,
  SpeakerService,
  speakerService,
  TraineeService,
  traineeService,
  TrainingService,
  trainingService,
  WpUserModel,
} from "../Service";
import {LoginManager} from "./Login.Manager";

export class BaseApiManager extends LoginManager {
  public static currentWpUser: WpUserModel = null;

  public static examService: ExamService = examService;
  public static examTypeService: ExamTypeService = examTypeService;
  public static examScoreService: ExamScoreService = examScoreService;
  public static moduleService: ModuleService = moduleService;
  public static formationService: FormationService = formationService;
  public static speakerService: SpeakerService = speakerService;
  public static availabilityService: AvailabilityService = availabilityService;
  public static trainingService: TrainingService = trainingService;
  public static traineeService: TraineeService = traineeService;
  public static sessionService: SessionService = sessionService;
  public static absenceService: AbsenceService = absenceService;
  public static downloadService: DownloadService = downloadService;
  public static get services(): AbstractInitService[] {
    return super.services.concat(
      this.formationService,
      this.speakerService,
      this.moduleService,
      this.availabilityService,
      this.trainingService,
      this.examTypeService,
      this.examService,
      this.examScoreService,
      this.traineeService,
      this.sessionService,
      this.absenceService,
    );
  }
}
