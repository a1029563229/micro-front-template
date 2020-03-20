import { createStore } from "redux";

function counter(state = {
  count: 0,
  text: ""
}, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: ++state.count
      };
    case 'DECREMENT':
      return {
        ...state,
        count: --state.count
      };
    case 'SET_TEXT':
      return {
        ...state,
        text: action.payload
      };
    default:
      return state;
  }
}

const store = createStore(counter);

export default store;