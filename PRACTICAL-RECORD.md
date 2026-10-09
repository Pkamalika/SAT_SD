# Practical Record: Online Shopping Platform (Round 2 – LLD)

## Aim
To design and implement REST APIs for an e-commerce application supporting product search, product details, cart management, order placement, simulated payment, and delivery tracking.

## Procedure
1. Create a Node.js project and install Express.
2. Create product, cart, order, payment, and tracking API routes.
3. Build the frontend using HTML, CSS, and JavaScript.
4. Connect frontend actions to REST endpoints using Fetch API.
5. Validate cart quantity and product stock.
6. Place an order and simulate payment.
7. Retrieve and update delivery status using the Track Order API.
8. Test API requests and responses using the browser and Postman.

## API summary
| Task | Method | URI |
|---|---|---|
| Search Product | GET | `/api/products?search=phone` |
| Get Product Details | GET | `/api/products/1` |
| Add to Cart | POST | `/api/cart` |
| Place Order | POST | `/api/orders` |
| Payment (demo) | POST | `/api/orders/{orderId}/payment` |
| Track Order | GET | `/api/orders/{orderId}/track` |
| Update delivery demo status | PATCH | `/api/orders/{orderId}/track` |

## Place Order request
`POST /api/orders`
```json
{ "userId": 101 }
```
The user must have at least one item in the cart.

## Place Order successful response
HTTP `201 Created`
```json
{
  "message": "Order created. Complete payment to confirm it.",
  "orderId": 1001,
  "totalAmount": 30000,
  "status": "PENDING_PAYMENT",
  "paymentStatus": "PENDING",
  "paymentEndpoint": "/api/orders/1001/payment"
}
```
Values shown are examples; actual order ID and amount depend on the current session.

## HTTP status codes
- `200 OK`: Request succeeded.
- `201 Created`: Cart item or order created.
- `400 Bad Request`: Invalid request, empty cart, or invalid payment method.
- `404 Not Found`: Product or order does not exist.

## Sequence flow
Customer → Search Product → View Product → Add to Cart → Place Order → Simulated Payment → Delivery Tracking.

## Result
The Online Shopping Platform REST API application was implemented with a frontend and Express.js backend. It supports product searching, product details, cart operations, order placement, simulated payment, and delivery tracking. Payment is simulated and the application uses in-memory data for demonstration.
