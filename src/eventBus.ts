import mitt from "mitt";

type Events = {
  "add-message": { text: string; duration: number };
};

const eventBus = mitt<Events>();

export  default eventBus