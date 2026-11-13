import {
  SET_TYRE,
  SET_STEERING,
  SET_SPOILER,
  SET_FRONT_BUMPER,
  SET_REAR_BUMPER,
  RESET_CUSTOMIZATION,
  SET_INITIAL_CUSTOMIZATION
} from "./constants";

export const setTyre = (value) => ({
  type: SET_TYRE,
  payload: value,
});

export const setSteering = (value) => ({
  type: SET_STEERING,
  payload: value,
});

export const setSpoiler = (value) => ({
  type: SET_SPOILER,
  payload: value,
});

export const setFrontBumper = (value) => ({
  type: SET_FRONT_BUMPER,
  payload: value,
});

export const setRearBumper = (value) => ({
  type: SET_REAR_BUMPER,
  payload: value,
});

export const resetCustomization = () => ({
  type: RESET_CUSTOMIZATION,
});

export const setInitialCustomization = (payload) => ({
  type: SET_INITIAL_CUSTOMIZATION,
  payload,
});