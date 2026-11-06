import {
  SET_TYRE,
  SET_STEERING,
  SET_SPOILER,
  SET_FRONT_BUMPER,
  SET_REAR_BUMPER,
  RESET_CUSTOMIZATION,
  INITIAL_CAR_CUSTOMIZATION_STATE,
  SET_INITIAL_CUSTOMIZATION
} from "./constants";

export default function carCustomizationReducer(
  state = INITIAL_CAR_CUSTOMIZATION_STATE,
  action
) {
  switch (action.type) {
    case SET_INITIAL_CUSTOMIZATION:
      return {
        ...state,
        ...action.payload,
      };
      
    case SET_TYRE:
      return {
        ...state,
        tyre: action.payload,
      };

    case SET_STEERING:
      return {
        ...state,
        steering: action.payload,
      };

    case SET_SPOILER:
      return {
        ...state,
        spoiler: action.payload,
      };

    case SET_FRONT_BUMPER:
      return {
        ...state,
        frontBumper: action.payload,
      };

    case SET_REAR_BUMPER:
      return {
        ...state,
        rearBumper: action.payload,
      };

    case RESET_CUSTOMIZATION:
      return {
        ...state,
      };

    default:
      return state;
  }
}