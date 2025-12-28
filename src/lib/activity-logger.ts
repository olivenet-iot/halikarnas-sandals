import { prisma } from "./db";

interface LogActivityParams {
  userId: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  request?: Request;
}

export async function logActivity({
  userId,
  action,
  entity,
  entityId,
  details,
  request,
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress: request?.headers.get("x-forwarded-for") || undefined,
        userAgent: request?.headers.get("user-agent") || undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

// Action types for consistency
export const ActivityActions = {
  // Products
  PRODUCT_CREATE: "PRODUCT_CREATE",
  PRODUCT_UPDATE: "PRODUCT_UPDATE",
  PRODUCT_DELETE: "PRODUCT_DELETE",
  PRODUCT_BULK_IMPORT: "PRODUCT_BULK_IMPORT",
  PRODUCT_EXPORT: "PRODUCT_EXPORT",

  // Orders
  ORDER_CREATE: "ORDER_CREATE",
  ORDER_UPDATE: "ORDER_UPDATE",
  ORDER_STATUS_CHANGE: "ORDER_STATUS_CHANGE",
  ORDER_CANCEL: "ORDER_CANCEL",

  // Inventory
  STOCK_UPDATE: "STOCK_UPDATE",
  BULK_STOCK_UPDATE: "BULK_STOCK_UPDATE",

  // Users
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  USER_DELETE: "USER_DELETE",

  // Categories
  CATEGORY_CREATE: "CATEGORY_CREATE",
  CATEGORY_UPDATE: "CATEGORY_UPDATE",
  CATEGORY_DELETE: "CATEGORY_DELETE",

  // Collections
  COLLECTION_CREATE: "COLLECTION_CREATE",
  COLLECTION_UPDATE: "COLLECTION_UPDATE",
  COLLECTION_DELETE: "COLLECTION_DELETE",

  // Coupons
  COUPON_CREATE: "COUPON_CREATE",
  COUPON_UPDATE: "COUPON_UPDATE",
  COUPON_DELETE: "COUPON_DELETE",

  // Settings
  SETTINGS_UPDATE: "SETTINGS_UPDATE",

  // Banners
  BANNER_CREATE: "BANNER_CREATE",
  BANNER_UPDATE: "BANNER_UPDATE",
  BANNER_DELETE: "BANNER_DELETE",

  // Pages
  PAGE_CREATE: "PAGE_CREATE",
  PAGE_UPDATE: "PAGE_UPDATE",
  PAGE_DELETE: "PAGE_DELETE",

  // Auth
  ADMIN_LOGIN: "ADMIN_LOGIN",
  ADMIN_LOGOUT: "ADMIN_LOGOUT",
} as const;
