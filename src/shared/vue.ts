import Vue from "vue";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

interface VueComponent {
  readonly $el: Element;

  loaded?(): void;

  mounted?(): void;

  beforeDestroy?(): void;

  destroyed?(): void;
}

export {Component, Prop, Vue, VueComponent};
