import { Camera, ClipboardPaste, Upload, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

type TabId = "camera" | "type" | "upload";

interface InputTabsProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onImageCapture: (imageText: string) => void;
}

const MAX_CHARS = 2000;

// ── Camera Tab ─────────────────────────────────────────────────────────────
const CameraTab = memo(function CameraTab({
  onCapture,
}: {
  onCapture: (text: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setCameraError(
        "Camera not available. Please use Upload or Type tab instead.",
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      for (const track of stream.getTracks()) {
        track.stop();
      }
    }
    setStream(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, [stream]);

  const snap = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCaptured(dataUrl);
    stopCamera();
    // Simulate OCR with a placeholder extraction message
    onCapture(
      "[Image captured from camera — please verify text below]\n\nPARACETAMOL 500mg tablet",
    );
  }, [onCapture, stopCamera]);

  const retake = useCallback(() => {
    setCaptured(null);
    startCamera();
  }, [startCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
    };
  }, [stream]);

  if (cameraError) {
    return (
      <div
        className="bg-muted/50 rounded-xl p-6 text-center space-y-3"
        role="alert"
      >
        <Camera size={40} className="mx-auto text-muted-foreground" />
        <p className="text-muted-foreground text-base">{cameraError}</p>
      </div>
    );
  }

  if (captured) {
    return (
      <div className="space-y-3">
        <img
          src={captured}
          alt="Captured medicine label"
          className="w-full rounded-xl border border-border object-cover max-h-64"
        />
        <p className="text-sm text-muted-foreground text-center">
          ✅ Image captured. Text pre-filled below.
        </p>
        <button
          type="button"
          onClick={retake}
          data-ocid="camera.retake_button"
          className="touch-target focus-ring w-full flex items-center justify-center gap-2 border border-border rounded-xl py-2 px-4 text-base font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Camera size={18} aria-hidden="true" /> Retake Photo
        </button>
      </div>
    );
  }

  if (stream) {
    return (
      <div className="space-y-3">
        {/* live camera preview — captions not applicable for live viewfinder */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full rounded-xl border border-border bg-black max-h-64 object-cover"
          aria-label="Camera preview"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={snap}
            data-ocid="camera.snap_button"
            className="touch-target focus-ring flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2 px-4 font-semibold text-base hover:opacity-90 transition-opacity"
          >
            📸 Snap Photo
          </button>
          <button
            type="button"
            onClick={stopCamera}
            data-ocid="camera.cancel_button"
            aria-label="Stop camera"
            className="touch-target focus-ring flex items-center justify-center border border-border rounded-xl px-4 py-2 text-base hover:bg-muted transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 py-4">
      <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
        <Camera size={40} className="text-primary" aria-hidden="true" />
      </div>
      <div>
        <p className="font-semibold text-foreground text-lg">
          Scan Medicine Label
        </p>
        <p className="text-muted-foreground text-base mt-1">
          Point your camera at the medicine label
        </p>
      </div>
      <button
        type="button"
        onClick={startCamera}
        data-ocid="camera.start_button"
        className="touch-target focus-ring w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 px-4 font-semibold text-base hover:opacity-90 transition-opacity"
      >
        <Camera size={20} aria-hidden="true" /> Open Camera
      </button>
    </div>
  );
});

// ── Upload Tab ─────────────────────────────────────────────────────────────
const UploadTab = memo(function UploadTab({
  onCapture,
}: {
  onCapture: (text: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreview(url);
      // Simulate OCR using filename
      const nameBase = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      onCapture(
        `[Uploaded image: ${file.name}]\n\nDetected medicine: ${nameBase}\n\nPlease review and edit the text as needed.`,
      );
    },
    [onCapture],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  if (preview) {
    return (
      <div className="space-y-3">
        <img
          src={preview}
          alt="Uploaded medicine label"
          className="w-full rounded-xl border border-border object-contain max-h-64"
        />
        <p className="text-sm text-muted-foreground text-center">
          ✅ Image uploaded. Text pre-filled below.
        </p>
        <button
          type="button"
          onClick={() => {
            setPreview(null);
            if (fileRef.current) fileRef.current.value = "";
          }}
          data-ocid="upload.clear_button"
          className="touch-target focus-ring w-full flex items-center justify-center gap-2 border border-border rounded-xl py-2 px-4 text-base font-medium hover:bg-muted transition-colors"
        >
          <Upload size={18} aria-hidden="true" /> Upload Different Image
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        aria-label="Drop zone for image upload — click or drag and drop"
        data-ocid="upload.dropzone"
        className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors focus-ring ${
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
      >
        <Upload
          size={36}
          className="mx-auto text-muted-foreground mb-3"
          aria-hidden="true"
        />
        <p className="font-semibold text-foreground text-base">
          Drop image here
        </p>
        <p className="text-muted-foreground text-sm mt-1">or click to browse</p>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </div>
  );
});

// ── Main InputTabs Component ────────────────────────────────────────────────
export const InputTabs = memo(function InputTabs({
  inputText,
  onInputChange,
  onImageCapture,
}: InputTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("type");

  const tabs: {
    id: TabId;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "camera",
      label: "Camera",
      shortLabel: "Camera",
      icon: <Camera size={18} />,
    },
    {
      id: "upload",
      label: "Upload",
      shortLabel: "Upload",
      icon: <Upload size={18} />,
    },
    {
      id: "type",
      label: "Type / Paste",
      shortLabel: "Type",
      icon: <ClipboardPaste size={18} />,
    },
  ];

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      onInputChange(text.slice(0, MAX_CHARS));
    } catch {
      // clipboard read failed — user must paste manually
    }
  }, [onInputChange]);

  const handleClear = useCallback(() => {
    onInputChange("");
  }, [onInputChange]);

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Input method"
        className="grid grid-cols-3 gap-1 bg-muted/60 rounded-xl p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            data-ocid={`input.${tab.id}.tab`}
            className={`touch-target focus-ring flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div
        id="tabpanel-camera"
        role="tabpanel"
        aria-labelledby="tab-camera"
        hidden={activeTab !== "camera"}
      >
        {activeTab === "camera" && (
          <CameraTab
            onCapture={(text) => {
              onImageCapture(text);
              setActiveTab("type");
            }}
          />
        )}
      </div>

      <div
        id="tabpanel-upload"
        role="tabpanel"
        aria-labelledby="tab-upload"
        hidden={activeTab !== "upload"}
      >
        {activeTab === "upload" && (
          <UploadTab
            onCapture={(text) => {
              onImageCapture(text);
              setActiveTab("type");
            }}
          />
        )}
      </div>

      <div
        id="tabpanel-type"
        role="tabpanel"
        aria-labelledby="tab-type"
        hidden={activeTab !== "type"}
      >
        <div className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Type or paste your medicine label text here…"
            aria-label="Medicine label text"
            data-ocid="input.text.textarea"
            rows={6}
            className="w-full border border-input rounded-xl px-4 py-3 text-base font-body text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 resize-y min-h-[120px] leading-relaxed transition-colors"
          />
          <div className="flex items-center justify-between gap-2">
            <span
              className="text-xs text-muted-foreground"
              aria-live="polite"
              aria-atomic="true"
            >
              {inputText.length}/{MAX_CHARS} characters
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePaste}
                data-ocid="input.paste_button"
                aria-label="Paste from clipboard"
                className="touch-target focus-ring flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
              >
                <ClipboardPaste size={14} aria-hidden="true" /> Paste
              </button>
              {inputText && (
                <button
                  type="button"
                  onClick={handleClear}
                  data-ocid="input.clear_button"
                  aria-label="Clear text"
                  className="touch-target focus-ring flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <X size={14} aria-hidden="true" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
