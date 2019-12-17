import {Subject} from "rxjs";

export abstract class AbstractExpandableContent {
    protected content_: Subject<string> = new Subject<string>();
    public content$ = this.content_.asObservable();

    public abstract render(obj: any);

    public abstract getInstance(): AbstractExpandableContent;
}

