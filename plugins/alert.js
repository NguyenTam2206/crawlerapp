export default (context, inject) => {
  const alert = async (type, message) => {
    context.store.commit("setAlert", {
      type,
      message
    });
    setTimeout(() => {
      context.store.commit("setAlert", {
        type: null,
        message: null
      });
    }, 3000);
  };
  // Create global function
  inject("alert", alert);
  context.$alert = alert;
};
