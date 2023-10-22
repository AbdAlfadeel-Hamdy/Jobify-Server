"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JobModel_1 = __importDefault(require("./models/JobModel"));
const UserModel_1 = __importDefault(require("./models/UserModel"));
(async () => {
    try {
        if (!process.env.MONGO_URL)
            throw new Error("MongoDB URL is not valid.");
        await mongoose_1.default.connect(process.env.MONGO_URL);
        const user = await UserModel_1.default.findOne({ email: "testuser@test.com" });
        const dataFile = await (0, promises_1.readFile)("./utils/mockData.json");
        const jsonData = JSON.parse(dataFile.toString());
        const jobs = jsonData.map((job) => ({ ...job, createdBy: user === null || user === void 0 ? void 0 : user._id }));
        await JobModel_1.default.deleteMany({ createdBy: user === null || user === void 0 ? void 0 : user._id });
        await JobModel_1.default.create(jobs);
        console.log("Data loaded successfully!!!");
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
