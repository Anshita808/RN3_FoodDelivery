const express = require("express");
const { OrderModel } = require("../models/order.model");

const orderRoute = express.Router();

orderRoute.post("/orders",async(req,res)=>{
    try {
        const {user,restaurant,items,totalPrice,deliveryAddress} = req.body;

        const order = new OrderModel({
            user,restaurant,items,totalPrice,deliveryAddress,status:"placed",
        });
       await order.save();
       res.status(201).send({msg:"Order placed Successfull",order})

    } catch (error) {
        res.status(400).send(error);
    }
})
orderRoute.get("order/:id",async(req,res)=>{
    try {
        const {id} = req.params
        const order = await OrderModel.findById(id)
        res.status(200).send(order)
    } catch (error) {
        res.status(400).send(error);
    }
});

orderRoute.patch("orders/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const {status} = req.body;
        const order = await OrderModel.findById(id);
        if(!order){
            return res.status(404).send({msg:"item not available."});
        }
        order.status = status;
        await order.save();
        res.status(200).send({msg:"status is update"});
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = {orderRoute}