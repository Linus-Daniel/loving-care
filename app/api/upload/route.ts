import { auth } from "@clerk/nextjs/server";
import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const fileRoute = createUploadthing();

async function requireUploadUser() {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }

  return { clerkId: session.userId };
}

export const uploadRouter = {
  imageUploader: fileRoute({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(requireUploadUser)
    .onUploadComplete(async ({ file, metadata }) => ({ url: file.ufsUrl, name: file.name, uploadedBy: metadata.clerkId })),
  documentUploader: fileRoute({
    pdf: { maxFileSize: "8MB", maxFileCount: 4 },
    text: { maxFileSize: "2MB", maxFileCount: 4 },
  })
    .middleware(requireUploadUser)
    .onUploadComplete(async ({ file, metadata }) => ({ url: file.ufsUrl, name: file.name, uploadedBy: metadata.clerkId })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});
