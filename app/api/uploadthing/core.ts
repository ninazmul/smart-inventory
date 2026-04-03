import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(
    async ({ file, metadata }) => {
      console.log("Upload complete:", file.ufsUrl, metadata);
      return { uploadedAt: new Date().toISOString(), fileUrl: file.ufsUrl };
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
