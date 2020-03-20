
(function () {
  function dispatch(action) {
    if (!window.store) return;

    return window.store.dispatch(action);
  }

  function subscribe(fn) {
    if (!window.store) return;

    return window.store.subscribe(fn);
  }

  function getState() {
    if (!window.store) return;

    return window.store.getState();
  }

  var count = $("#count");
  count.html(getState());

  $(".add").click(function () {
    dispatch({ type: "INCREMENT" })
  });

  $(".dec").click(function () {
    dispatch({ type: "DECREMENT" })
  });

  subscribe(function () {
    count.html(getState());
  });
}())