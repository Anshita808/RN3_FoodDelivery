const express = require("express");
const { connection } = require("./db");
const { UserRoute } = require("./routes/user.routes");
const { restaurantRoute } = require("./routes/resturant.routes");
const { orderRoute } = require("./routes/order.routes");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use("/user",UserRoute);
app.use("/api/restaurants",restaurantRoute)
app.use("/api/orders",orderRoute)

app.listen(process.env.PORT, async()=>{
    try {
        await connection
        console.log("db is connected");
    } catch (error) {
        console.log(error);
    }
    console.log("server is running");
})