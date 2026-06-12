https://mohdhussainnadaf.github.io/outfit-labs-website/





# Outfit Labs Website

A SauceDemo-style outfit shop made with plain HTML, CSS, and JavaScript.

## Login

Accepted usernames:
- standard_user
- outfit_user
- visual_user
- locked_out_user

Password for all working users:
- secret_sauce

The `locked_out_user` account shows a lockout error.

## Pages

- `index.html` — login page
- `inventory.html` — product listing with sorting and add/remove cart buttons
- `cart.html` — cart page with remove buttons and checkout button
- `checkout.html` — checkout form and order summary
- `complete.html` — order complete page

## How to use your own outfit photos

1. Put your product photos inside:
   `assets/products/`
2. Open `app.js`
3. Find the `PRODUCTS` array near the top.
4. Change each product's `name`, `desc`, `price`, and `image` path.

Example:

```js
{
  id: "red-shirt",
  name: "Red Shirt",
  desc: "Soft cotton shirt for everyday outfits.",
  price: 24.99,
  image: "assets/products/red-shirt.jpg"
}
```

## How to run

Open `index.html` in your browser.

If your browser blocks local storage while opening files directly, use a small local server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```
