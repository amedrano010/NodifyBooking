const express = require("express");

const next = require("next");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src" }); // keep dir: "./src" only if Next app is inside src/
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Middleware
    server.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );
    server.use(express.json());
    server.use(cookieParser());

    // Serve static files from /public
    server.use(express.static(path.join(process.cwd(), "public")));

    // Mongo connection
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => console.log("✅ MongoDB connected"))
        .catch((err) => console.error("❌ MongoDB error", err));

    // API Routes
    server.use("/login", require("./routes/LoginRoutes.js"));
    server.use("/signup", require("./routes/RegisterRoutes.js"));
    server.use("/user", require("./routes/UserRoutes.js"));
    server.use("/appointments", require("./routes/AppointmentsRoutes.js"));
    server.use("/clients", require("./routes/CustomerRoutes.js"));
    server.use("/products", require("./routes/ProductRoutes.js"));
    server.use("/services", require("./routes/ServiceRoutes.js"));
    server.use("/stripe", require("./routes/StripeRoute.js"));
    server.use("/employees", require("./routes/EmployeeRoutes.js"));
    server.use("/stores", require("./routes/StoreRoutes.js"));

    // Catch-all for Next.js
    server.all("*", (req, res) => handle(req, res));

    // Start server
    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`🚀 Server ready on http://localhost:${port}`);
    });
});
