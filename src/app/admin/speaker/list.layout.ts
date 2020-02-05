import download from "downloadjs";
import Api from "modules/Api/Api.module";
import {Formation} from "modules/Api/Model/Formation";
import {Speaker} from "modules/Api/Model/Speaker";
import {combineLatest, from} from "rxjs";
import {map, switchMap, take} from "rxjs/operators";
import moment from "shared/moment";
import {Component, Vue} from "shared/vue";
import WithRender from "./list.layout.html";

@WithRender
@Component({
  components: {},
})
export class SpeakersList extends Vue {
  public listComponent$ = () => from(import(/* webpackChunkName: "admin" */ "./speaker.list"));

  public exportExcel() {
    combineLatest([Api.speakerService.fetchAll$, Api.formationService.fetchAll$]).pipe(
      take(1),
      switchMap(([speakers, formations]) => {
        const allSpeakersDurations$ = speakers.map((speaker: Speaker) => {
          const durationsByFormation$ = formations.map((formation: Formation) =>
            speaker.getTrainingHoursByFormation(formation).pipe(
              map((duration: moment.Duration) => ({formation: formation, duration: duration})),
            ),
          );
          return combineLatest(durationsByFormation$).pipe(
            map((durationsAndFormations: []) => ({speaker: speaker, durationsAndFormations: durationsAndFormations})),
          );
        });
        return combineLatest(allSpeakersDurations$).pipe(
          map((res) => ({formations: formations, speakersDurations: res})),
        );
      }),
    ).subscribe(({formations, speakersDurations}) => {
      let csv = "";
      csv += ";" + formations.map((formation: Formation) => formation.label).join(";") + ";Total" + "\n";
      speakersDurations.map((speakerAndDuration) => {
        csv += speakerAndDuration.speaker.firstName + " " + speakerAndDuration.speaker.lastName + ";";
        const totalDuration = moment.duration();
        speakerAndDuration.durationsAndFormations.map((durationAndFormation: { formation: Formation, duration: moment.Duration }) => {
          totalDuration.add(durationAndFormation.duration);
          csv += durationAndFormation.duration.format("HH:mm", {trim: false}) + ";";
        });
        csv += totalDuration.format("HH:mm", {trim: false});
        csv += "\n";
      });
      download(csv, "HeuresFormateurs" + moment().format("Y_MM_DD-HH_mm") + ".csv", "application/csv");
    });
  }
}

