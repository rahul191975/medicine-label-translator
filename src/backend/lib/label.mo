import Types "../types/label";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Text "mo:core/Text";

module {
  // Build prompt that instructs AI to return structured JSON
  func buildPrompt(labelText : Text, language : Text) : Text {
    "You are a medical label translator assistant. Analyze the following medicine label text and respond with ONLY a valid JSON object (no markdown, no explanation, just raw JSON).\n\n" #
    "Target language: " # language # "\n\n" #
    "Medicine label text:\n" # labelText # "\n\n" #
    "Return a JSON object with exactly these fields (all values translated to " # language # "):\n" #
    "{\n" #
    "  \"medicationName\": \"<medication name>\",\n" #
    "  \"purpose\": \"<what this medicine is used for>\",\n" #
    "  \"dosageInstructions\": \"<dosage amount and frequency>\",\n" #
    "  \"howToTake\": \"<how to take the medicine, e.g. with food, with water>\",\n" #
    "  \"warnings\": \"<warnings and precautions>\",\n" #
    "  \"sideEffects\": \"<possible side effects>\",\n" #
    "  \"storageInstructions\": \"<how to store the medicine>\",\n" #
    "  \"hasEmergencyAlert\": <true or false — set true if any of these are present: overdose, severe allergy, contraindication, do not use if, poison, immediate danger, seek emergency, fatal, toxic, antidote>,\n" #
    "  \"emergencyAlertText\": \"<if hasEmergencyAlert is true, describe the emergency warning in " # language # "; otherwise empty string>\"\n" #
    "}\n\n" #
    "Important: respond with ONLY the JSON object, no other text.";
  };

  // Extract a quoted string value from a simple JSON fragment
  // Returns the value for the first occurrence of "key": "value"
  func extractText(json : Text, key : Text) : Text {
    let searchKey = "\"" # key # "\"";
    switch (json.split(#text searchKey).next()) {
      case null "";
      case (?_) {
        // Get the part after the key
        let parts = json.split(#text searchKey);
        ignore parts.next(); // skip before-key part
        switch (parts.next()) {
          case null "";
          case (?afterKey) {
            // afterKey looks like: ": \"some value\", ..."
            // Find first quote after colon
            switch (afterKey.split(#text "\"").next()) {
              case null "";
              case (?_) {
                let quoteParts = afterKey.split(#text "\"");
                ignore quoteParts.next(); // skip ": " part
                switch (quoteParts.next()) {
                  case null "";
                  case (?value) value;
                };
              };
            };
          };
        };
      };
    };
  };

  // Extract bool value for "key": true/false
  func extractBool(json : Text, key : Text) : Bool {
    let searchKey = "\"" # key # "\"";
    switch (json.split(#text searchKey).next()) {
      case null false;
      case (?_) {
        let parts = json.split(#text searchKey);
        ignore parts.next();
        switch (parts.next()) {
          case null false;
          case (?afterKey) {
            // afterKey: ": true, ..." or ": false, ..."
            let trimmed = afterKey.trimStart(#predicate(func(c) { c == ' ' or c == ':' or c == '\t' or c == '\n' }));
            trimmed.startsWith(#text "true");
          };
        };
      };
    };
  };

  // Parse the JSON response into MedicineLabelResult
  func parseResponse(json : Text) : ?Types.MedicineLabelResult {
    // Find the outermost JSON object
    let start = switch (json.split(#text "{").next()) {
      case null return null;
      case (?_) {
        let parts = json.split(#text "{");
        ignore parts.next(); // before first {
        switch (parts.next()) {
          case null return null;
          case (?rest) "{" # rest;
        };
      };
    };

    // Check that we have at least some expected fields
    if (not start.contains(#text "medicationName")) {
      return null;
    };

    let medicationName = extractText(start, "medicationName");
    let purpose = extractText(start, "purpose");
    let dosageInstructions = extractText(start, "dosageInstructions");
    let howToTake = extractText(start, "howToTake");
    let warnings = extractText(start, "warnings");
    let sideEffects = extractText(start, "sideEffects");
    let storageInstructions = extractText(start, "storageInstructions");
    let hasEmergencyAlert = extractBool(start, "hasEmergencyAlert");
    let emergencyAlertText = extractText(start, "emergencyAlertText");

    ?{
      medicationName;
      purpose;
      dosageInstructions;
      howToTake;
      warnings;
      sideEffects;
      storageInstructions;
      hasEmergencyAlert;
      emergencyAlertText;
    };
  };

  public func processLabel(text : Text, language : Text, transform : OutCall.Transform) : async Types.ProcessLabelResult {
    let prompt = buildPrompt(text, language);

    // Caffeine AI endpoint
    let url = "https://ai.caffeine.one/v1/chat/completions";
    let requestBody = "{\"model\":\"caffeine-default\",\"messages\":[{\"role\":\"user\",\"content\":" # escapeJson(prompt) # "}],\"temperature\":0.1}";

    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let responseText = await OutCall.httpPostRequest(url, headers, requestBody, transform);

      // Extract content from chat completion response
      // Response format: {"choices":[{"message":{"content":"..."}}]}
      let content = extractContent(responseText);

      switch (parseResponse(content)) {
        case null {
          // Try parsing the raw response in case it's already JSON
          switch (parseResponse(responseText)) {
            case null #err("Failed to parse AI response. Please try again.");
            case (?result) #ok(result);
          };
        };
        case (?result) #ok(result);
      };
    } catch (e) {
      #err("AI service unavailable. Please try again later.");
    };
  };

  // Extract the "content" field from a chat completion JSON response
  func extractContent(json : Text) : Text {
    // Look for "content":"..." in the response
    let contentKey = "\"content\":";
    switch (json.split(#text contentKey).next()) {
      case null json; // fall back to raw response
      case (?_) {
        let parts = json.split(#text contentKey);
        ignore parts.next();
        switch (parts.next()) {
          case null json;
          case (?afterContent) {
            let trimmed = afterContent.trimStart(#predicate(func(c) { c == ' ' or c == '\t' }));
            if (trimmed.startsWith(#text "\"")) {
              // Quoted string: extract between quotes
              let quoteParts = trimmed.split(#text "\"");
              ignore quoteParts.next(); // skip empty before first quote
              switch (quoteParts.next()) {
                case null json;
                case (?value) {
                  // Unescape \" sequences
                  value.replace(#text "\\\"", "\"");
                };
              };
            } else {
              // May start with { directly (for streaming or other formats)
              trimmed;
            };
          };
        };
      };
    };
  };

  // Escape a string for embedding as a JSON string value
  func escapeJson(s : Text) : Text {
    let escaped = s.replace(#text "\\", "\\\\");
    let escaped2 = escaped.replace(#text "\"", "\\\"");
    let escaped3 = escaped2.replace(#text "\n", "\\n");
    let escaped4 = escaped3.replace(#text "\r", "\\r");
    let escaped5 = escaped4.replace(#text "\t", "\\t");
    "\"" # escaped5 # "\"";
  };
};
