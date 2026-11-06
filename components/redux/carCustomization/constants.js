export const SET_TYRE = "SET_TYRE";
export const SET_STEERING = "SET_STEERING";
export const SET_SPOILER = "SET_SPOILER";
export const SET_FRONT_BUMPER = "SET_FRONT_BUMPER";
export const SET_REAR_BUMPER = "SET_REAR_BUMPER";


export const RESET_CUSTOMIZATION = "RESET_CUSTOMIZATION";
export const SET_INITIAL_CUSTOMIZATION =
  "SET_INITIAL_CUSTOMIZATION";

export const INITIAL_CAR_CUSTOMIZATION_STATE = {
  tyre: "sport",
  steering: "standard",
  spoiler: "none",
  rearBumper: "",
  frontBumper: "",
  customizationData : []
};

export const CAR_CUSTOMIZATION_OPTIONS = {
  tyre: [
    { label: "Standard", value: "standard" },
    { label: "Sport", value: "sport" },
    { label: "Racing", value: "racing" },
  ],

  steering: [],

  spoiler: [],

  frontBumper: [],

  rearBumper: [],
};