Picker = new PickerImp();
WebApp.connectHandlers.use(function(req, res, next) {
  Picker._dispatch(req, res, next);
});