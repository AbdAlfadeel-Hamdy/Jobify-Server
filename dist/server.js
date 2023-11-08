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
const helmet_1 = __importDefault(require("helmet"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const cloudinary_1 = require("cloudinary");
// Routers
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const jobRouter_1 = __importDefault(require("./routes/jobRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
// Middlewares
const errorHandlerMiddleware_1 = __importDefault(require("./middlewares/errorHandlerMiddleware"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
// Reading Environment Variables
dotenv.config();
// Running Express
const app = (0, express_1.default)();
// Cors
const corsOptions = {
    origin: "https://jobify-e5da.onrender.com",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
// Setting Up Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
// Morgan Middleware for Development
if (process.env.NODE_ENV === "development")
    app.use((0, morgan_1.default)("dev"));
// Body Parser
app.use(express_1.default.json());
// Cookies Parser
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/jobs", authMiddleware_1.authenticateUser, jobRouter_1.default);
app.use("/api/v1/users", authMiddleware_1.authenticateUser, userRouter_1.default);
// Not Found Route
app.use("*", (req, res, next) => {
    res.status(404).json({ message: "Route not found." });
});
// Global Error Handling Middleware
app.use(errorHandlerMiddleware_1.default);
// Connecting to Database and Running Server
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
