import { Request, Response } from "express";
import Users from "../Model/userModel";
import { error, log } from "console";

const AdminController = {
  fetch_User_Admin: async (req: Request, res: Response) => {
    try {
      // console.log(req.query)
      const { search } = req.query;
      let query: any = { role: { $ne: "Admin" } };
      if (search) {
        query.name = { $regex: new RegExp(search as string, "i") };
      }
      const data = await Users.find(query);
      res.json({ data: data });
    } catch (err) {
      console.log(err);
    }
  },
  EditUserName: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { username, email } = req.body;
      const userIs = await Users.findOne({ email: email });
      if (userIs) {
        await Users.updateOne({ email: email }, { $set: { name: username } });
        res.json({ success: true });
      } else {
        res.json({ ErrorEdit: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
  Add_New_User: async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { name, email, password } = req.body;
      const CheckUserIn = await Users.findOne({ email: email });
      if (CheckUserIn) {
        res.json({ CheckError: true });
      } else {
        const userData = new Users({
          name: name,
          email,
          role: "User",
          password: password,
        });
        const user = await userData.save();
        res.json({ success: true });
      }
    } catch (err) {
      console.log(err);
    }
  },
  Delete_User: async (req: Request, res: Response) => {
    try {
      console.log(req.body)
      const {data}=req.body
      const userIn=await Users.findOne({_id:data})
      if(userIn?.status=='Active'){
        await Users.updateOne({_id:data},{$set:{status:'Block'}})
        res.json({success:true})
      }else if(userIn?.status=='Block'){
        await Users.updateOne({_id:data},{$set:{status:'Active'}})
        res.json({success:true})
      }else{
        console.error('user id is not correct',error);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

export default AdminController;
