import {Observable, pipe} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import {Formation} from "../Model/Formation.Model";
import {Trainee} from "../Model/Trainee.Model";

export class TraineeQuery extends AbstractApiQuery<Trainee> {
  public searchedString: string = null;
  public formation: Formation = null;
  protected equals = ["formation"];
}

// tslint:disable-next-line:max-classes-per-file
export class TraineeService extends DexieRestService<Trainee> {
  public repository = new Repository(Trainee);

  public defaultSort = () => pipe(
    map((trainees: Trainee[]) => trainees.sort((trainee1, trainee2) => {
      if (trainee1.lastName === "") {
        return -1;
      }
      if (trainee2.lastName === "") {
        return 1;
      }
      return (trainee1.lastName.toLowerCase() > trainee2.lastName.toLowerCase()) ? 1 : -1;
    })),
  );

  public searchString = (searchedString: string) => pipe(
    map((trainees: Trainee[]) => trainees.filter((trainee: Trainee) =>
      (trainee.lastName + " " + trainee.firstName).toLowerCase().includes(searchedString.toLowerCase()),
    )),
  );

  public getByFormation(formation: Formation) {
    const query = new TraineeQuery();
    query.formation = formation;
    return this.list(query);
  }

  public list(query: TraineeQuery = null): Observable<Trainee[]> {
    if (query && query.searchedString) {
      const searchedString = query.searchedString;
      delete query.searchedString;
      return this.list(query).pipe(
        this.searchString(searchedString),
      );
    }
    return super.list(query).pipe(
      this.defaultSort(),
    );
  }
}
