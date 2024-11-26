//AuthReducer.ts

import { AuthState } from "./AuthContext";

// Define una interfaz para las acciones
interface LoginAction {
  type: "login";
  payload: any; // Puedes especificar mejor el tipo de `payload` si conoces la estructura del usuario
}

interface UpdateUserAction {
  type: "updateUser";
  payload: any; // Igual aquí, puedes definir mejor el tipo si conoces los campos del usuario
}

// Tipo que agrupa todas las acciones posibles
type AuthActions = LoginAction | UpdateUserAction;

export const authReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
      };
    case "updateUser":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};
