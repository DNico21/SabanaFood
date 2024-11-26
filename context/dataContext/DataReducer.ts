import { DataState } from "./DataContext";

type ActionsProps =
  | { type: "SET_POSTS"; payload: any[] }
  | { type: "SET_MESSAGES"; payload: any[] };

export const dataReducer = (state: DataState, actions: ActionsProps): DataState => {
  switch (actions.type) {
    case "SET_POSTS":
      return { ...state, posts: actions.payload };
    case "SET_MESSAGES":
      return { ...state, messages: actions.payload };
    default:
      return state;
  }
};