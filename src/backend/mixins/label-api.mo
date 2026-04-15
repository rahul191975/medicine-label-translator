import Types "../types/label";
import LabelLib "../lib/label";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin () {
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public func processLabel(text : Text, language : Text) : async Types.ProcessLabelResult {
    await LabelLib.processLabel(text, language, transform);
  };
};
