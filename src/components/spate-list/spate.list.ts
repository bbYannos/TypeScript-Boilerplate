import {Observable, Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {LabeledInterface} from "shared/abstract-api/classes/models";
import {Component, Vue, VueComponent} from "shared/vue";
import "./spate.list.css";
import WithRender from "./spate.list.html";

@WithRender
@Component
export class SpateList extends Vue implements VueComponent {
  protected source$ub: Subscription;
  public loading: boolean = true;

  public setSource$(source$: Observable<LabeledInterface[]>) {
    if (this.source$ub) {
      this.source$ub.unsubscribe();
      this.source$ub = null;
    }
    this.loading = true;
    this.source$ub = source$.pipe(takeUntil(this.close_)).subscribe((elements) => {
      this.loading = false;
      this.elements = elements;
    });
  }

  public getLabel: (object: LabeledInterface) => string = (object) => {
    return object.label;
  };

  protected close_: Subject<void> = new Subject();

  public elements = [];

  public beforeDestroy(): void {
    this.close_.next();
    this.close_.complete();
  }
}

Vue.component("spate-list", SpateList);
