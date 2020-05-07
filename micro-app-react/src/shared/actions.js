function emptyAction() {
  console.warn("Current execute action is empty!");
}

class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };
  
  setActions(actions) {
    this.actions = actions;
  }

  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;