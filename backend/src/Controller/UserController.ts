import { Request, Response } from "express";
import Users from "../Model/userModel";
import { OAuth2Client } from "google-auth-library";
import { makePassword } from "../utils/RandomGenerate";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { log, profile } from "console";
import path from "path";
import fs from "fs";
import { decode } from "querystring";

interface decode {
  user: string;
  iat: number;
}

const PUBLIC_DIR = path.join(__dirname, "public");
// const PUBLIC_DIR="90";
const client = new OAuth2Client(process.env.CLIENT_ID);
const userController = {
  postSignUp: async (req: Request, res: Response) => {
    try {
      console.log("this is for singup", req.body);
      const { name, email, password } = req.body;
      const IsUser = await Users.findOne({ email: email });

      console.log("🚀 ~ file:IsUser:", IsUser);

      if (IsUser) {
        res.json({ Error: true });
      } else {
        console.log("user waiting for your logic");
        const userData = new Users({
          name: name,
          email,
          role: "User",
          password: password,
        });
        
        //*create user
        const user = await userData.save();

        //*jwt token
        console.log("user", user);

        const token = jwt.sign(
          { user: user._id },
          process.env.ACCESS_TOKEN_SECRET as string
        );

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 100 * 60 * 60 * 24,
          })
          .json({ success: true });
      }
    } catch (err) {
      console.error("Error showing in sing-up", err);
      return res.status(500).json({ error: "Internal server" });
    }
  },
  GoogleChecking: async (req: Request, res: Response) => {
    try {
      console.log(req.body, "this googel ath");
      const { token } = req.body;
      const ticket = (await client.verifyIdToken({
        idToken: token as any,
        audience: process.env.CLIENT_ID,
      })) as any;

      let userDetails;
      const Payload = ticket.getPayload();
      if (Payload) {
        userDetails = {
          email: Payload?.email,
          name: Payload?.name,
          password: makePassword(),
        };
      }
      const userIn = await Users.findOne({ email: userDetails?.email });
      // console.log("🚀 ~ file: UserController.ts:89 ~ GoogleChecking: ~ userIn:", userIn)
      if (!userIn) {
        const saveUser = new Users({
          name: userDetails?.name,
          email: userDetails?.email,
          password: userDetails?.password,
          role: "User",
        });
        const user = await saveUser.save();

        const token = jwt.sign(
          { user: user.id },
          process.env.ACCESS_TOKEN_SECRET as string
        );

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 100 * 60 * 60 * 24,
          })
          .json({ success: true });
      } else {
        if (userIn.status == "Block") {
          return res.json({ statusBlock: true });
        } else {
          const token = jwt.sign(
            { user: userIn.id },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "30d" }
          );
          // console.log("🚀 ~ file: UserController.ts:130 ~ PostLogin: ~ token:", token)
          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 100 * 60 * 60 * 24,
            })
            .json({ success: true });
        }
      }

      console.log("🚀 ~ file: UserController.ts:92 ~ GoogleChecking: ~ userDetails:", userDetails);    
    } catch (err) {
      console.log(err);
    }
  },

  Fetch_User_Data: async (req: Request, res: Response) => {
    try {
      console.log("fetch user is working!!!");

      let token: string | null = null;
      if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      } else if (req.headers && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }
      console.log(token, "token is here");

      if (!token) {
        console.log("null token");

        return res.status(401).json({ msg: "Unauthorized:Token no provided " });
      }
      console.log("token second side is working ");
      //*verify the token

      const verifydecoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as decode;

      //*check the verifyed or not
      if (!verifydecoded) {
        res.status(401).json({ error: "Token is not valid" });
      }
      // console.log(verifydecoded, "this is veryfied decode");
      let userData;

      try {
        userData = await Users.findById(verifydecoded.user);
      } catch (err) {
        console.error("Thhe decode user is not geting ");
      }
      //*find the user
      // const userData=await Users.findById(verifydecoded.user)
      let data = "this is data using fetch";
      res.json(userData);
    } catch (err) {
      console.log(err);
    }
  },
  PostLogin: async (req: Request, res: Response) => {
    console.log("hey", req.body);

    try {
      console.log("hey", req.body);
      const { email, password } = req.body;
      const userExists = await Users.findOne({ email: email });
      if (!userExists) {
        return res.json({ Emailerror: true });
      } else {
        //*check the password
        console.log("password");

        const passwordDNA = await bcrypt.compare(password, userExists.password);
        if (!passwordDNA) {
          return res.json({ PasswordError: true });
        } else if (userExists.status == "Block") {
          return res.json({ statusBlock: true });
        } else {
          console.log("token::::", process.env.ACCESS_TOKEN_SECRET);

          const token = jwt.sign(
            { user: userExists.id },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "30d" }
          );
          // console.log("🚀 ~ file: UserController.ts:130 ~ PostLogin: ~ token:", token)
          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 100 * 60 * 60 * 24,
            })
            .json({ success: true });
        }
      }
    } catch (err) {
      console.log("mistake in serverside login ", err);
    }
  },
  //*Profile data handiling
  PostEditProfile: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { username, email, bio, images } = req.body;
      const userIn = await Users.findOne({ email: email });
      if (userIn) {
        await Users.updateOne(
          { email: email },
          { $set: { name: username, bio: bio, profile: images } }
        );
        res.json({ success: true });
      } else {
        console.error("Mistake in profile update");
      }
    } catch (err) {
      console.log(err);
    }
  },
  uploadProfilePhoto: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const verifydecoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as decode;

      if (!verifydecoded) {
        return res.status(401).json({ error: "Token is not valid" });
      }

      const userfind = await Users.findOne({ _id: verifydecoded.user });
      if (userfind && userfind.profile !== "monkey.jpg") {
        const imageFileName = userfind.profile as string;
        const imagePath = path.join(PUBLIC_DIR, imageFileName);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      const path_name = req.file?.filename;
      if (!path_name) {
        return res.status(400).json({ error: "File not uploaded" });
      }

      await Users.updateOne(
        { _id: verifydecoded.user },
        { $set: { profile: path_name } }
      );

      res.json({ success: true });
    } catch (err) {
      console.log("Error in updating photo:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  Delete_Img: async (req: Request, res: Response) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }
      const verifydecoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as decode;

      if (!verifydecoded) {
        return res.status(401).json({ error: "Token is not valid" });
      }

      console.log(req.body);
      const { id } = req.body;
      const userIn = await Users.findById(verifydecoded.user);

      if (userIn) {
        await Users.updateOne(
          { _id: verifydecoded.user },
          { $set: { profile: null } }
        );
        res.json({ success: true });
      } else {
        // console.log();
        res.json({ ErrorDelete: true });
        console.error("The is not valide");
      }
    } catch (err) {
      console.log(err);
    }
  },
  ResetPassword: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { oldpasswordd, password, email } = req.body;
      const User = await Users.findOne({ email: email });
      // console.log(
      //   "🚀 ~ file: UserController.ts:246 ~ ResetPassword: ~ UsermatchPas:",
      //   UsermatchPas
      // );
      if (!User) {
        res.json({ Usernotget: true });
      } else {
        const passMatch = await bcrypt.compare(oldpasswordd, User.password);
        if (!passMatch) {
          res.json({ NotMach: true });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hassed = await bcrypt.hash(password, salt);
          await Users.updateOne(
            { email: email },
            { $set: { password: hassed } }
          );
          res.json({ success: true });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },
  LogOut: async (req: Request, res: Response) => {
    try {
      console.log("logout the user");
      res.clearCookie("token").send({ something: "logout" });
    } catch (err) {
      console.log(err);
    }
  },
};
export default userController;
