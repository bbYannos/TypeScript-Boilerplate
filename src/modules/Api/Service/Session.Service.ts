import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AbstractApiQuery, DexieRestService, Repository} from "shared/abstract-api";
import moment from "shared/moment/moment";
import {Formation, Session, Training} from "../Model";

export {Session};

export class SessionQuery extends AbstractApiQuery<Session> {
  public startTime: moment.Moment = null;
  public endTime: moment.Moment = null;
  public formation?: Formation = null;
  public training: Training = null;
  protected equals = ["training"];
}

// tslint:disable-next-line:max-classes-per-file
export class SessionService extends DexieRestService<Session> {
  public repository = new Repository(Session);

  /* Used By FullCalendarComponent: requestWithParent -> Component -> create(request) -> ObjectWithParent **/
  public createByQuery(query: SessionQuery): Observable<Session> {
    const session = this.queryToObject(query);
    return this.create(session);
  }

  public objectToQuery(session: Session): SessionQuery {
    const query = new SessionQuery();
    query.startTime = session.startTime.clone();
    query.endTime = session.endTime.clone();
    query.training = session.training;
    return query;
  }

  public queryToObject(query: SessionQuery): Session {
    const session = this.repository.makeNew();
    session.startTime = query.startTime.clone();
    session.endTime = query.endTime.clone();
    session.training = query.training;
    return session;
  }

  public getByTraining(training: Training): Observable<Session[]> {
    const query = new SessionQuery();
    query.training = training;
    return this.list(query).pipe(map(
      (sessions: Session[]) => sessions.sort(
        (session1, session2) => (session1.startTime.isBefore(session2.startTime)) ? -1 : 1,
      )),
    );
  }

  public createAllByQueries(queries: SessionQuery[]): Observable<Session[]> {
    const creates$ = queries.map((query) => this.createByQuery(query));
    return forkJoin(creates$);
  }

  public deleteAll(sessions: Session[]): Observable<boolean[]> {
    const deletes$ = sessions.map((session) => this.delete(session));
    return forkJoin(deletes$);
  }
}

export const sessionService = new SessionService();
