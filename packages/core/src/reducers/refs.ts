import {
  ADD_RESOLVED_REFS,
  AddResolvedRefsAction,
  REMOVE_RESOLVED_REF,
  RemoveResolvedRefAction,
  SET_IS_RESOLVING,
  SetIsResolvingsAction
} from '../actions';

type ValidRefsActions =
  | AddResolvedRefsAction
  | RemoveResolvedRefAction
  | SetIsResolvingsAction;

export const resolvedRefsReducer = (state = { refs: {}, isResolving: false }, action: ValidRefsActions) => {
  switch (action.type) {
    case ADD_RESOLVED_REFS:
      return {
        refs: action.refs,
        isResolving: false
      };
    case SET_IS_RESOLVING:
      return {
        ...state,
        isResolving: true
      };
    case REMOVE_RESOLVED_REF:
      const newState: any = { ...state };
      delete newState.refs[action.ref];
      return newState;
    default:
      return state;
  }
};
