# Database schema

NexaCheckout uses **MongoDB + Mongoose** at runtime. The application models are in `backend/models/`.

`schema.sql` is included because the assignment explicitly requires a checked-in `.sql` schema artifact. It documents the equivalent relational structure of the two runtime collections (`users` and `checkouts`); it is not executed by the MongoDB application.

For the runtime MongoDB structure, see:
- `backend/models/User.js`
- `backend/models/Checkout.js`
