"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
// Public
const path_1 = __importDefault(require("path"));
// Routers
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const jobRouter_1 = __importDefault(require("./routes/jobRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
// Middlewares
const errorHandlerMiddleware_1 = __importDefault(require("./middlewares/errorHandlerMiddleware"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
dotenv.config();
const app = (0, express_1.default)();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// const __dirname = dirname(fileURLToPath(import.meta.url));
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.static(path_1.default.resolve("./public")));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/jobs", authMiddleware_1.authenticateUser, jobRouter_1.default);
app.use("/api/v1/users", authMiddleware_1.authenticateUser, userRouter_1.default);
app.use("*", (req, res, next) => {
    res.status(404).json({ message: "Route not found." });
});
app.use(errorHandlerMiddleware_1.default);
const port = 5100;
if (!process.env.MONGO_URL) {
    console.log("MongoDB URL is not valid.");
    process.exit(1);
}
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => {
    app.listen(port, () => {
        console.log(`Server running on PORT ${port}...`);
    });
})
    .catch((err) => {
    console.log(err);
    process.exit(1);
});
