import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { CategoryRouter } from '../app/modules/menu/category/category.route';
import { VariantRouter } from '../app/modules/menu/variant/variant.route';
import { ToppingRouter } from '../app/modules/menu/topping/topping.route';
import { ProductRouter } from '../app/modules/menu/product/product.route';
import { OfferRouter } from '../app/modules/promotion/offer/offer.route';
import { CouponRouter } from '../app/modules/promotion/coupon/coupon.route';
import { DiscountRouter } from '../app/modules/promotion/discount/discount.route';

const router = express.Router();

const routes = [
  { path: '/auth',                       route: AuthRouter },
  { path: '/users',                      route: UserRouter },
  // ── Admin ──────────────────────────────────────────────
  { path: '/admin',                      route: AdminRoutes },
  { path: '/admin/menu/categories',      route: CategoryRouter },
  { path: '/admin/menu/variants',        route: VariantRouter },
  { path: '/admin/menu/toppings',        route: ToppingRouter },
  { path: '/admin/menu/products',        route: ProductRouter },
  { path: '/admin/promotions/offers',    route: OfferRouter },
  { path: '/admin/promotions/coupons',    route: CouponRouter },
  { path: '/admin/promotions/discounts',  route: DiscountRouter },
];

routes.forEach((element) => {
  if (element?.path && element?.route) {
    router.use(element?.path, element?.route);
  }
});

export default router;
