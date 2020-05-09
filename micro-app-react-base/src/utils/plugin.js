export const dispatch = (action) => {
  if (!window.store) return;
  
  return window.store.dispatch(action);
}

export const subscribe = (fn) => {
  if (!window.store) return;

  return window.store.subscribe(fn);
}

export const getState = () => {
  if (!window.store) return {};
  
  return window.store.getState();
}