import express from 'express';
import { USER_ROLES } from '../../../../enums/user';
import auth from '../../../middleware/auth';
import validateRequest from '../../../middleware/validateRequest';
import { ToppingController } from './topping.controller';
import { ToppingValidation } from './topping.validation';

const router = express.Router();

// ─── Topping Categories ────────────────────────────────────────────────────
router.get('/categories', ToppingController.getToppingCategories);
router.get('/categories/:id', ToppingController.getToppingCategoryById);

router.post(
  '/categories',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ToppingValidation.createToppingCategorySchema),
  ToppingController.createToppingCategory
);

router.patch(
  '/categories/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ToppingValidation.updateToppingCategorySchema),
  ToppingController.updateToppingCategory
);

router.delete(
  '/categories/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ToppingController.deleteToppingCategory
);

router.patch(
  '/categories/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ToppingController.toggleToppingCategoryStatus
);

// ─── Topping Items ─────────────────────────────────────────────────────────
router.get('/items', ToppingController.getToppingItems);
router.get('/items/:id', ToppingController.getToppingItemById);

router.post(
  '/items',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ToppingValidation.createToppingItemSchema),
  ToppingController.createToppingItem
);

router.patch(
  '/items/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validateRequest(ToppingValidation.updateToppingItemSchema),
  ToppingController.updateToppingItem
);

router.delete(
  '/items/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ToppingController.deleteToppingItem
);

router.patch(
  '/items/:id/status',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ToppingController.toggleToppingItemStatus
);

export const ToppingRouter = router;
