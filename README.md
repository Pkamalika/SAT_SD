# Online Shopping Platform

An online shopping web application developed using HTML, CSS, JavaScript, Node.js, and Express.js. This project demonstrates Low-Level Design (LLD) concepts and REST API implementation for an e-commerce platform.

Users can search for products, view product details, add items to a shopping cart, place orders, simulate payments, and track delivery status.

## Features

* Search products by name or category
* View product details, prices, and stock availability
* Add products to the shopping cart
* Calculate cart total and item subtotals
* Place orders and generate order IDs
* Simulate payment processing
* Track order and delivery status
* Update delivery status for demonstration
* REST API integration using HTTP methods
* Responsive user interface

## Technologies Used

* HTML5
* CSS3
* JavaScript
* Node.js
* Express.js
* REST APIs
* JSON
* Fetch API

## Project Structure

```text
online-shopping-platform/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── PRACTICAL-RECORD.md
```

## REST API Endpoints

| HTTP Method | Endpoint                     | Description                 |
| ----------- | ---------------------------- | --------------------------- |
| GET         | `/api/health`                | Check API status            |
| GET         | `/api/products`              | Retrieve all products       |
| GET         | `/api/products?search=phone` | Search products             |
| GET         | `/api/products/1`            | Get product details         |
| POST        | `/api/cart`                  | Add a product to the cart   |
| GET         | `/api/cart?userId=101`       | View cart and total amount  |
| POST        | `/api/orders`                | Create an order             |
| POST        | `/api/orders/:id/payment`    | Simulate order payment      |
| GET         | `/api/orders/:id/track`      | Track order delivery        |
| PATCH       | `/api/orders/:id/track`      | Update demo delivery status |

## Application Workflow

1. The customer searches for a product.
2. The application displays matching products.
3. The customer views product details.
4. The customer adds products to the shopping cart.
5. The application calculates the total amount.
6. The customer places an order.
7. The backend generates an order ID.
8. The payment API simulates payment processing.
9. The order status is updated.
10. The customer tracks the delivery using the order ID.

## HTTP Status Codes

* `200 OK` — Request completed successfully.
* `201 Created` — A cart item or order was created.
* `400 Bad Request` — Invalid request, empty cart, or insufficient stock.
* `404 Not Found` — Requested product or order does not exist.

## Testing

The application can be tested using a web browser and Postman.

Example API requests:

* Search products: `GET /api/products?search=phone`
* View product: `GET /api/products/1`
* Add to cart: `POST /api/cart`
* Place order: `POST /api/orders`
* Simulate payment: `POST /api/orders/:id/payment`
* Track delivery: `GET /api/orders/:id/track`

## Limitations

* Product, cart, order, and payment records are stored in server memory.
* Data resets when the server restarts.
* Payment processing is simulated; no real payment gateway is connected.
* Delivery tracking is simulated for demonstration purposes.
* User authentication and production-level security are not implemented.

## Future Enhancements

* User registration and authentication
* MySQL or MongoDB database integration
* Real payment gateway integration
* Product reviews and ratings
* Admin dashboard
* Email and order notifications
* Deployment to a cloud platform

## Learning Outcomes

* Understanding REST API design
* Implementing HTTP methods and status codes
* Connecting frontend and backend
* Handling JSON requests and responses
* Implementing cart and order management
* Understanding basic e-commerce workflows
* Applying Low-Level Design concepts

## Author

Kamalika P

## License

This project was developed for educational and learning purposes.

