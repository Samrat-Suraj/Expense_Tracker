"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const parser_1 = __importDefault(require("datauri/parser"));
const parser = new parser_1.default();
const DataUri = (file) => {
    let extName = path_1.default.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
exports.default = DataUri;
