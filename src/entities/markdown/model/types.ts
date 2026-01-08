export interface MarkdownContent {
  raw: string;
  html: string;
}

export interface MarkdownPreviewState {
  text: string;
  html: string;
  copied: boolean;
}
