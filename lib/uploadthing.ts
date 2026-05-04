"use client";

import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

import type { UploadRouter } from "@/app/api/upload/route";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();

export type UploadedClientFile = {
  name: string;
  url?: string;
  ufsUrl?: string;
  serverData?: {
    url?: string;
    name?: string;
    uploadedBy?: string;
  };
};

export function uploadedFileUrl(file: UploadedClientFile) {
  return file.serverData?.url ?? file.ufsUrl ?? file.url ?? "";
}
