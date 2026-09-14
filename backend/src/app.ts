import cors from "cors";
import express from "express";
import { corsOrigins, env } from "./env.js";
import { errorHandler } from "./middleware/error.js";
import { authRateLimiter, securityHeaders } from "./middleware/security.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminBlogsRouter, publicBlogsRouter } from "./modules/blogs/blogs.routes.js";
import { customerRouter } from "./modules/customer/customer.routes.js";
import { publicVendorsRouter } from "./modules/public-vendors/public-vendors.routes.js";
import { vendorRouter } from "./modules/vendor/vendor.routes.js";

export const app = express();

app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(securityHeaders);
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    if (!origin && env.NODE_ENV !== "production") {
      callback(null, true);
      return;
    }

    if (origin && corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("CORS origin not allowed"));
  }
}));
app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
app.use(authRateLimiter);

app.use("/api/auth", authRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/vendors", publicVendorsRouter);
app.use("/api/blogs", publicBlogsRouter);
app.use("/api/customer", customerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/blogs", adminBlogsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);
