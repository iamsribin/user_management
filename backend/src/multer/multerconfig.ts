// import { log } from "console";
// import multer from "multer";
// import path from "path";
// import fs from "fs";

// const uploadDir = path.join(__dirname, "public");
// console.log(uploadDir,"uploadddd");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });

// export default upload;

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
// src/multer/multerconfig.ts

import multer from "multer";
import path from "path";
import fs from "fs";

// Define the upload directory relative to the project root
const uploadDir = path.join(process.cwd(), "src", "public");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Export the multer instance
const upload = multer({ storage });

export default upload;

// Also export the upload directory path for use in other files
export const PUBLIC_DIR = uploadDir;