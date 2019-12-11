import {absenceService} from "./Model/Absence";
import {availabilityService} from "./Model/Availability";
import {examService} from "./Model/Exam";
import {examScoreService} from "./Model/ExamScore";
import {examTypeService} from "./Model/ExamType";
import {formationService} from "./Model/Formation";
import {moduleService} from "./Model/Module";
import {sessionService} from "./Model/Session";
import {speakerService} from "./Model/Speaker";
import {traineeService} from "./Model/Trainee";
import {trainingService} from "./Model/Training";
import {UserService} from "./Model/User/User.Service";

const Api = {
  absenceService: absenceService,
  availabilityService : availabilityService,
  examService : examService,
  examScoreService: examScoreService,
  examTypeService: examTypeService,
  formationService: formationService,
  moduleService: moduleService,
  sessionService: sessionService,
  speakerService: speakerService,
  traineeService: traineeService,
  trainingService: trainingService,
  userService: new UserService(),
};

export {Api};



