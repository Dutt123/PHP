import Shopify from "shopify-api-node";

export const shopify = new Shopify({
  shopName: "kohlerindia",
  accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  timeout: 300000,
  autoLimit: true,
});

shopify.on("callLimits", (limits) => {
  console.log("CALL_LIMITS", limits);
});
