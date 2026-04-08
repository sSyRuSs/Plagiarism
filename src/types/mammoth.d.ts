declare module 'mammoth/mammoth.browser' {
  export interface ExtractionMessage {
    type: string;
    message: string;
  }

  export interface ExtractionResult {
    value: string;
    messages: ExtractionMessage[];
  }

  export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<ExtractionResult>;
}
