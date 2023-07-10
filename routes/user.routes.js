const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");


const UserRoute = express.Router();

UserRoute.post("/register",async(req,res)=>{
    try {
        const {name,email,password,address} = req.body;

        const isuserPresent = await UserModel.findOne({email:email});
    
        if(isuserPresent){
            return res.status(301).send({msg:"User Present"})
        }
        const hashed = await bcrypt.hash(password,6);

        const newUser = new UserModel({
            name,email,password:hashed,address,
        });
        await newUser.save();
        res.status(201).send({msg:"Registration Successfully.",newUser});
        
    } catch (error) {
        res.status(400).send(error);
    }
  
})

  UserRoute.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const isuserPresent = await UserModel.findOne({email:email});

        if(!isuserPresent){
            return res.status(401).send({msg:"User unavailable"});
        }
        const ispassCorrect = await bcrypt.compare(password,isuserPresent.password);

        if(!ispassCorrect){
            return res.status(401).send({msg:"Wrong Credentials."});
        }

        const token = jwt.sign({userId: isuserPresent._id},"admin",{
            expiresIn:"1hr",
        });
        res.status(201).send({msg:"User Login Successfully.",token});

    } catch (error) {
        res.status(400).send(error);
    }
  })

  UserRoute.put("/user/:id/reset",async(req,res)=>{
    try {
        const {id} = req.params;
        const {currentPassword, newPassword} = req.body;

        const user = await UserModel.findById(id);
        if(!user){
            return res.status(401).send({msg:"User unavailable"});
        }

        const ispassCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if(!ispassCorrect){
            return res.status(401).send({msg:"Wrong Credientials."})
        }

        const hashed = await bcrypt.hash(newPassword,6);
        user.password = hashed;
        await user.save();
        res.status(204);
    } catch (error) {
        res.status(400).send({msg:error});
    }
  });

module.exports = {UserRoute}