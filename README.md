# Velora WhatsApp Store Demo

A responsive storefront demo with:
- Homepage and branding
- Product categories
- Product cards
- Product detail modal
- Add to cart
- Quantity controls
- Cart subtotal/total
- Checkout form
- WhatsApp order generation

## Run it

No Node.js is required.

1. Extract the ZIP.
2. Open `index.html` in Chrome/Edge.
3. Test the full flow:
   Home → Product → Add to Cart → Cart → Checkout → Order on WhatsApp.

## Important

This demo uses sample products because the WhatsApp catalog URL does not expose the catalog product data to the browser.

### Replace the products

Open `app.js` and edit the `products` array.

Each product looks like:

{
  id: 1,
  name: "Product name",
  category: "Category",
  price: 799,
  oldPrice: 999,
  discount: 20,
  description: "Product description",
  colors: ["#d7e0da", "#d8d0c4"]
}

For real product photos, the product card can later be changed to use image URLs/files.

### Change WhatsApp number

At the top of `app.js`:

const WHATSAPP_NUMBER = "916375801927";

This is currently based on the WhatsApp catalog link you supplied. Replace it if the shop uses another WhatsApp number.

## Demo note

The checkout intentionally does not collect online payment. It prepares the complete order and opens WhatsApp, which is exactly the ordering flow requested.
