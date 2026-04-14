"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPassToEmail = exports.sendVerificationToEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const EnvVars_1 = __importDefault(require("./EnvVars"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: EnvVars_1.default.NODEMAILER_USER,
        pass: EnvVars_1.default.NODEMAILER_PASS,
    },
});
transporter.verify((error, success) => {
    if (error) {
        console.log("Email not ready to send Mail");
    }
    else {
        console.log("Nodemailer ready to send email");
    }
});
const sendEmail = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    yield transporter.sendMail({
        from: `Your Expansio. ${EnvVars_1.default.NODEMAILER_USER}`,
        to,
        subject,
        html: body
    });
});
const sendVerificationToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verificationUrl = `${EnvVars_1.default.FRONTEND_URL}/verify-email/${token}`;
    let html = `
        <a 
          href="${verificationUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Verify Email
        </a>
        `;
    yield sendEmail(to, "Please Verify Your Email Address", html);
});
exports.sendVerificationToEmail = sendVerificationToEmail;
const sendResetPassToEmail = (to, token) => __awaiter(void 0, void 0, void 0, function* () {
    let resetUrl = `${EnvVars_1.default.FRONTEND_URL}/reset-password/${token}`;
    let html = `
        <a 
          href="${resetUrl}" 
          style="display: inline-block; padding: 10px 20px; margin: 20px 0; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px;"
        >
          Reset Password
        </a>
        `;
    yield sendEmail(to, "Please Reset Your Email Password", html);
});
exports.sendResetPassToEmail = sendResetPassToEmail;
