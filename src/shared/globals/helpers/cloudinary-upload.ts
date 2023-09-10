import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

export function uploads(
  imagePath: string,
  pulicId: string,
  overwrite: boolean,
  invalidate: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath,
      {
        pulicId,
        overwrite,
        invalidate
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) reject(error);
        resolve(result);
      }
    );
  });
}
