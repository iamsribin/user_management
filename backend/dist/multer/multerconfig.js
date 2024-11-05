"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadDir = path_1.default.join(__dirname, "public");
console.log(uploadDir, "uploadddd");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
// C:\Users\jishn\OneDrive\Desktop\Redux\backend\src\public
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "../public"));
//   },
//   filename: function (req, file, cb) {
//     const uniquSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     console.log(req.body, "heeeeeee");
//     cb(
//       null,
//       file.fieldname + "-" + uniquSuffix + path.extname(file.originalname)
//     );
//   },
// });
// const upload = multer({ storage: storage });
// export default upload;
// At the top of your file
