import { Application } from "@oakserver/oak";
import { userRouter } from "./routes/userRoutes.ts";
import { productRouter } from "./routes/productRoutes.ts";
import { authMiddleware } from "./middlewares/authMiddleware.ts";
import { errorMiddleware } from "./middlewares/errorMiddleware.ts";

const app = new Application();

app.use(authMiddleware);
app.use(errorMiddleware);

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
app.use(productRouter.routes());
app.use(productRouter.allowedMethods());

const PORT = 8000;
console.log(`Server is running on port ${PORT}`);
await app.listen({ port: PORT });
