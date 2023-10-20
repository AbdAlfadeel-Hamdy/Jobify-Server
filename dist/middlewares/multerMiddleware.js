"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination(req, file, callback) {
        callback(null, "public/uploads");
    },
    filename(req, file, callback) {
        const fileName = file.originalname;
        callback(null, fileName);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
