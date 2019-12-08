import {forkJoin, Observable, pipe} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
import {DexieRestService, Repository} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Speaker} from "../Model/Speaker.Model";
export {Speaker};
export class SpeakerService extends DexieRestService<Speaker> {
  public repository: Repository<Speaker> = new Repository<Speaker>(Speaker);

  public defaultSort = () => pipe(
    map((speakers: Speaker[]) => speakers.sort((speaker1, speaker2) => {
      if (speaker1.lastName === "") {
        return -1;
      }
      if (speaker2.lastName === "") {
        return 1;
      }
      return (speaker1.lastName.toLowerCase() > speaker2.lastName.toLowerCase()) ? 1 : -1;
    })),
  );

  public getByFormation(formation: Formation, forExams: boolean = false): Observable<Speaker[]> {
    return this.list().pipe(
      switchMap((speakers: Speaker[]) => forkJoin(speakers.map(
          (speaker) => speaker.trainings$.pipe(
            take(1),
            map((trainings) => {
              const filteredTrainings = trainings.filter((training) =>
                  training.formation.isSame(formation) && (!forExams || training.canHaveExams),
              );
              if (filteredTrainings.length > 0) {
                return speaker;
              } else {
                return null;
              }
            }),
          ),
      ))),
      map((speakers: Speaker[]) => speakers.filter((speaker) => speaker !== null)),
    );
  }
}
