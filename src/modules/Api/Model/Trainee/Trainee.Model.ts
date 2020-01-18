import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ChildrenListFactory} from "shared/abstract-api/classes/relations/children-list.factory";
import {JsonObject, JsonProperty, RelationConverter} from "shared/json2typescript";
import moment from "shared/moment/moment";
import {Absence} from "../Absence/Absence.Model";
import {Formation} from "../Formation/Formation.Model";
import {Training} from "../Training";
import {User} from "../User/User.Model";

@JsonObject("Trainee")
export class Trainee extends User {
  public constructorName: string = "Trainee";

  @JsonProperty("formation", RelationConverter, true)
  public formation: Formation = null;

  public allAbsences$: Observable<Absence[]> = null;

  public get absences$() {
    return this.allAbsences$.pipe(
      map((allAbsences: Absence[]) => allAbsences.filter((absence) => !absence.delay)),
    );
  }

  public get delays$() {
    return this.allAbsences$.pipe(
      map((allAbsences: Absence[]) => allAbsences.filter((absence) => absence.delay)),
    );
  }

  // used in DataTableColumn Render : AbsencesListComponent
  public get allAbsences(): Absence[] {
    return ChildrenListFactory.getChildrenListForProperty(this, "allAbsences$").list.toArray() as Absence[];
  }

  public get absences(): Absence[] {
    return this.allAbsences.filter((absence: Absence) => !absence.delay);
  }

  public get delays(): Absence[] {
    return this.allAbsences.filter((absence: Absence) => absence.delay);
  }

  public get delaysDuration() {
    const duration = moment.duration();
    this.delays.forEach((delay: Absence) => {
      duration.add(delay.duration);
    });
    return duration;
  }

  // used in DataTableColumn Render : AbsencesListComponent
  // noinspection JSUnusedGlobalSymbols
  public get unjustifiedAbsences() {
    return this.absences.filter((absence: Absence) => ! absence.justified);
  }
}
