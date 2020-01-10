import Vue from "vue";
import Component from "vue-class-component";
interface VueComponent {
  readonly $el: Element;
  loaded?(): void;
  mounted?(): void;
  destroyed?(): void;
}

export {Vue, Component, VueComponent};
