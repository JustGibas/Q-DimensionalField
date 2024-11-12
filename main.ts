import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { userRouter } from "./routes/userRoutes.ts";
import { productRouter } from "./routes/productRoutes.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = new Application();

// Middleware
app.use(authMiddleware);
app.use(errorMiddleware);

// Routes
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(productRouter.routes());
app.use(productRouter.allowedMethods());

// Start the server
const PORT = 8000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
