declare module "file-icon" {
  interface CommonOptions {
    size?: number;
  }

  interface FileOptions extends CommonOptions {
    destination?: string;
  }

  interface BufferOptions extends CommonOptions {}

  type InputType = string | number;

  function file(input: InputType, options?: FileOptions): Promise<void>;
  function buffer(input: InputType, options?: BufferOptions): Promise<Buffer>;
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
  dropdown(options: unknown): void;
}
