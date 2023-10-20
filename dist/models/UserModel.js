"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    password: String,
    lastName: {
        type: String,
        default: "lastName",
    },
    location: {
        type: String,
        default: "my city",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    avatar: String,
    avatarPublicId: String,
});
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
exports.default = (0, mongoose_1.model)("User", userSchema);
