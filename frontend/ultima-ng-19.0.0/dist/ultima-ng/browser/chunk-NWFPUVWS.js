import "./chunk-4MWRP73S.js";

// src/app/pages/ecommerce/ecommerce.routes.ts
var ecommerce_routes_default = [
  {
    path: "product-overview",
    data: { breadcrumb: "Product Overview" },
    loadComponent: () => import("./chunk-YQOQHCRV.js").then((c) => c.ProductOverview)
  },
  {
    path: "product-list",
    data: { breadcrumb: "Product List" },
    loadComponent: () => import("./chunk-KCF4E7GX.js").then((c) => c.ProductList)
  },
  {
    path: "new-product",
    data: { breadcrumb: "New Product" },
    loadComponent: () => import("./chunk-W4HHFCSF.js").then((c) => c.NewProduct)
  },
  {
    path: "shopping-cart",
    data: { breadcrumb: "Shopping Cart" },
    loadComponent: () => import("./chunk-YJMM2OQK.js").then((c) => c.ShoppingCart)
  },
  {
    path: "checkout-form",
    data: { breadcrumb: "Checkout Form" },
    loadComponent: () => import("./chunk-DLWBY3UP.js").then((c) => c.CheckoutForm)
  },
  {
    path: "order-history",
    data: { breadcrumb: "Order History" },
    loadComponent: () => import("./chunk-SY4DR62N.js").then((c) => c.OrderHistory)
  },
  {
    path: "order-summary",
    data: { breadcrumb: "Order Summary" },
    loadComponent: () => import("./chunk-ABJ3Q2US.js").then((c) => c.OrderSummary)
  }
];
export {
  ecommerce_routes_default as default
};
//# sourceMappingURL=chunk-NWFPUVWS.js.map
