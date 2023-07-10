const express = require("express");
const { RestaurantModel } = require("../models/restaurant.model");


const restaurantRoute = express.Router();

restaurantRoute.post("/restaurants",async(req,res)=>{
    try {
        const {name,address,menu} = req.body;
        const restaurant = new RestaurantModel({name,address,menu});
        await restaurant.save()
        res.status(200).send({msg:"Restaurant Added Successfully.",restaurant});
    } catch (error) {
        res.status(400).send(error);
    }
})

restaurantRoute.get("/restaurants",async(req,res)=>{
    try {
        const restaurant = await RestaurantModel.find();
        res.status(200).send(restaurant);
    } catch (error) {
        res.status(400).send(error);
    }
});

restaurantRoute.get("restaurants/:id",async(req,res)=>{
    try {
        const {id} = req.params;
        const restaurant = await RestaurantModel.findById(id);
        res.status(200).send(restaurant)
    } catch (error) {
        res.status(400).send(error);
    }
});

restaurantRoute.get("/restaurants/:id/menu",async(req,res)=>{
    try {
        const {id} = req.params;
        const restaurant = await RestaurantModel.findById(id);
        res.status(200).send(restaurant.menu)
    } catch (error) {
        res.status(400).send({msg:error});
    }
})

restaurantRoute.post("/restaurants/:id/menu",async(req,res)=>{
    try {
        const {id} = req.params;
        const {name, description, price,image} = req.body;
        const restaurant = await RestaurantModel.findById(id);
        if(!restaurant){
            return res.status(404).send({msg:"Restaurant is not Available."});

        }
         const newItem = {
            name,
            description,
            price,
            image
         }
         restaurant.menu.push(newItem)
         await restaurant.save()
         res.status(200).send({msg:"Item Added",newItem});

    } catch (error) {
        res.status(400).send({msg:error});
    }
})

restaurantRoute.delete("/restaurants/:restId/menu/:itemId",async(req,res)=>{
    try {
        const {restId,itemId} = req.params;
        const {name, description,price,image} = req.body;
        const restaurant = await RestaurantModel.findById(restId);
        if(!restaurant){
            return res.status(404).send({msg:"Restaurant not available!"});

        }
        const item = restaurant.menu.findIndex(
            (item) => item._id.toString() === itemId
        );
        if(item===-1){
            return res.status(404).send({msg:"menu items are not founded."});
        }
        restaurant.menu.splice(item,1);
        await restaurant.save();
        res.status(202).send({msg:"item has been Deleted."});

    } catch (error) {
        res.status(400).send({msg:error});
    }

})

module.exports = {restaurantRoute}