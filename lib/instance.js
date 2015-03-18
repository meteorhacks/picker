Picker = new PickerImp();
WebApp.rawConnectHandlers.use(function(req, res, next) {
  Picker._dispatch(req, res, next);
});
