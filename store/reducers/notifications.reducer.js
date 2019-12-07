import * as actions from '../actions/notifications.actions';

const initialState = {
  loading: false,
  error: null,
  notifications: [],
  notificationsCount: null,
};

export default function notificationsReducer(state = initialState, action) {
  const newState = {
    ...state,
    error: null,
  };
  switch (action.type) {
    case actions.NOTIFICATIONS_BY_USER_START:
      return {
        ...newState,
        loading: true,
      };
    case actions.NOTIFICATIONS_BY_USER_SUCCESS:
      return {
        ...newState,
        notifications: action.notifications,
        loading: false,
      };
    case actions.NOTIFICATIONS_BY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
        loading: false,
      };
    case actions.NOTIFICATIONS_COUNT_BY_USER_SUCCESS:
      return {
        ...newState,
        notificationsCount: action.notificationsCount,
      };
    case actions.NOTIFICATIONS__COUNTBY_USER_FAILURE:
      return {
        ...newState,
        error: action.error,
      };
    default:
      return newState;
  }
}
