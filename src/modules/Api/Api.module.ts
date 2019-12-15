import {ServiceFactory} from "../../shared/abstract-api";
import {IsVinRestBDD} from "./isVinBDD.Rest";
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
import {UserService, WpUserModel} from "./Model/User/User.Service";
import {downloadService} from "./Service/Download.Service";

export {WpUserModel};
export const Api = {
  absenceService: absenceService,
  availabilityService: availabilityService,
  downloadService: downloadService,
  examService: examService,
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

ServiceFactory.restDB = new IsVinRestBDD();
for (const key in Api) {
  ServiceFactory.initService(Api[key]);
}

export default Api;



