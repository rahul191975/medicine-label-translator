module {
  public type MedicineLabelResult = {
    medicationName : Text;
    purpose : Text;
    dosageInstructions : Text;
    howToTake : Text;
    warnings : Text;
    sideEffects : Text;
    storageInstructions : Text;
    hasEmergencyAlert : Bool;
    emergencyAlertText : Text;
  };

  public type ProcessLabelResult = {
    #ok : MedicineLabelResult;
    #err : Text;
  };
};
