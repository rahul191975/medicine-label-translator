import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type ProcessLabelResult = {
    __kind__: "ok";
    ok: MedicineLabelResult;
} | {
    __kind__: "err";
    err: string;
};
export interface MedicineLabelResult {
    medicationName: string;
    hasEmergencyAlert: boolean;
    emergencyAlertText: string;
    warnings: string;
    howToTake: string;
    storageInstructions: string;
    sideEffects: string;
    purpose: string;
    dosageInstructions: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    processLabel(text: string, language: string): Promise<ProcessLabelResult>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
