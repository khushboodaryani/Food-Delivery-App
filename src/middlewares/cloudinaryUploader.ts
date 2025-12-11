import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const memoryStorage = multer.memoryStorage();

export const dynamicUpload = (
  fields: { name: string; maxCount?: number }[]
) => multer({ storage: memoryStorage }).fields(fields);

export const cloudinaryUploaderMiddleware = (folder: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (!files || Object.keys(files).length === 0) {
        return next(); // no file → move forward
      }

      for (const fieldName in files) {
        const uploads = await Promise.all(
          files[fieldName].map(async (file) => {
            const url = await uploadToCloudinary(file.buffer, folder);

            return {
              url,
              size: file.size,
              mimetype: file.mimetype,
              originalname: file.originalname,
            };
          })
        );

        // avatar: [{ url: ""}] → avatar: "url"
        req.body[fieldName] =
          uploads.length === 1 ? uploads[0].url : uploads.map((u) => u.url);
      }

      return next();
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);

      // Do NOT return res.json() → leads to TS error
      res.status(500).json({
        success: false,
        message: "Cloudinary Upload failed",
      });

      return; // explicitly return void
    }
  };
};
