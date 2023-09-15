import { diskStorage } from "multer";
import { v4 as uuid } from "uuid";

export const multerConfig = {};

export const multerOptions = {
  //   limits: {},
  //   fileFilter: (req: any, file: any, cb: any) => {},
  storage: diskStorage({
    destination: "./public/avartar",
    filename: (req, file, cb) => {
      cb(null, `${uuid()}-${file.originalname}`);
    },
  }),
};
