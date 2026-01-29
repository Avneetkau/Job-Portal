import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB  from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controller/webhooks.js';
import companyRoutes from './router/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './router/jobRoutes.js';
import userRoutes from './router/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

//Initialize  Express
const app = express();



//Database
await connectDB();
await connectCloudinary();

//Middleware
app.use(cors());
app.use(clerkMiddleware());

app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
app.use(express.json());

//Routes
app.get('/',(req,res)=>res.send('API is  Working'));
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.use('/api/company', companyRoutes);
app.use('/api/jobs',jobRoutes);
app.use('/api/users', userRoutes);


//PORT
const PORT = process.env.PORT || 5000;

//sentry
Sentry.setupExpressErrorHandler(app);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})