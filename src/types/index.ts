import { type FileWithPath } from "react-dropzone";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export interface PageParams<T extends object> {
  params: T;
}
