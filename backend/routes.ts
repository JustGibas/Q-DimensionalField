import userRoutes from "./routes/userRoutes.ts";
import productRoutes from "./routes/productRoutes.ts";

const router = new Router();

router.use(userRoutes.routes());
router.use(userRoutes.allowedMethods());
router.use(productRoutes.routes());
router.use(productRoutes.allowedMethods());

export default router;
