import {Observable, of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {ServiceFactory} from "shared/abstract-api";
import {SpeakerService} from "../Service/Speaker.Service";
import {TraineeService} from "../Service/Trainee.Service";
import {Speaker} from "./Speaker.Model";
import {Trainee} from "./Trainee.Model";

export type Role = ("administrator" | "speaker" | "trainee");

export class WpUserModel {

  public hasRole(role: string) {
    return (this.roles.indexOf(role) > -1);
  }

  get isAdmin(): boolean {
    return (this.roles.indexOf("administrator") > -1);
  }

  get isSpeaker(): boolean {
    return (this.roles.indexOf("speaker") > -1);
  }

  get isTrainee(): boolean {
    return (this.roles.indexOf("trainee") > -1);
  }

  public static fromJson$(json: any): Observable<WpUserModel> {
    const wpUser = Object.assign(new WpUserModel(), json);
    const traineeService = ServiceFactory.getService(TraineeService);
    const formationService = ServiceFactory.getService(TraineeService);
    const speakerService = ServiceFactory.getService(SpeakerService);
    return of(wpUser).pipe(
      switchMap(() => {
        if (wpUser.isTrainee && traineeService.rest !== null && formationService.rest !== null) {
          return traineeService.isReady$.pipe(
            // populate speakers from data
            switchMap(() => speakerService.repository.fromJsonArray$(wpUser.data.speakers)),
            // populate trainee from data
            switchMap(() => traineeService.repository.fromJson$(wpUser.data.trainee)),
            map((trainee: Trainee) => {
              wpUser.trainee = trainee;
              return wpUser;
            }),
          );
        }
        if (wpUser.isSpeaker && speakerService.rest !== null && formationService.rest !== null) {
          return speakerService.isReady$.pipe(
            // populate formations from data
            switchMap(() => formationService.repository.fromJsonArray$(wpUser.data.formations)),
            // populate trainee from data
            switchMap(() => speakerService.repository.fromJson$(wpUser.data.speaker)),
            map((speaker: Speaker) => {
              wpUser.speaker = speaker;
              return wpUser;
            }),
          );
        }
        return of(wpUser);
      }),
    );
  }

  public roles: string[];
  public trainee: Trainee = null;
  public speaker: Speaker = null;
  public ready: boolean = true;

  public data: {
    trainee?: any,
    speaker?: any,
    speakers?: any,
    formations?: any,
    formation: any,
    trainings: any,
  };
}
