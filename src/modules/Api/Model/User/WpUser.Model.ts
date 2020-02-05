import {Observable, of} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";
import {formationService} from "../Formation";
import {sessionService} from "../Session";
import {Speaker, speakerService} from "../Speaker";
import {Trainee, traineeService} from "../Trainee";
import {trainingService} from "../Training";

export type Role = ("administrator" | "speaker" | "trainee");

export class WpUserModel {

  public hasRole(roles: Role[]): boolean {
    return roles.filter((role: Role) => this.roles.indexOf(role) > -1).length > 0;
  }

  public get isAdmin(): boolean {
    return (this.roles.indexOf("administrator") > -1);
  }

  public get isSpeaker(): boolean {
    return (this.roles.indexOf("speaker") > -1);
  }

  public get isTrainee(): boolean {
    return (this.roles.indexOf("trainee") > -1);
  }

  public static fromJson$(json: any): Observable<WpUserModel> {
    const wpUser = Object.assign(new WpUserModel(), json);
    return of(wpUser).pipe(
      switchMap(() => {
        if (wpUser.isTrainee && traineeService.rest !== null && speakerService.rest !== null) {
          return traineeService.isReady$.pipe(
            // populate speakers from data
            switchMap(() => speakerService.repository.fromJsonArray$(wpUser.data.speakers)),
            tap(() =>  speakerService.repository.populated = true),
            // populate trainee from data
            switchMap(() => traineeService.repository.fromJson$(wpUser.data.trainee)),
            tap(() => {
              traineeService.repository.populated = true;
              formationService.repository.populated = true;
              trainingService.repository.populated = true;
              sessionService.repository.populated = true;
            }),
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
            tap(() =>  formationService.repository.populated = true),
            // populate trainee from data
            switchMap(() => speakerService.repository.fromJson$(wpUser.data.speaker)),
            tap(() => {
              trainingService.repository.populated = true;
              sessionService.repository.populated = true;
            }),
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
