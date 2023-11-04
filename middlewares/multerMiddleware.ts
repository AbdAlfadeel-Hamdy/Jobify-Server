import path from "path";
import multer from "multer";
import DataParser from "datauri/parser";

const storage = multer.memoryStorage();

const parser = new DataParser();

const upload = multer({ storage });

export const formatImage = (file: Express.Multer.File) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};

export default upload;
