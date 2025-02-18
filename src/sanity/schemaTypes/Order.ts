import { v4 as uuidv4 } from "uuid";

const orderSchema = {
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    {
      name: "customer",
      type: "object",
      title: "Customer Details",
      fields: [
        { name: "firstName", type: "string", title: "First Name" },
        { name: "lastName", type: "string", title: "Last Name" },
        { name: "email", type: "string", title: "Email" },
        { name: "phone", type: "string", title: "Phone" },
      ],
    },
    {
      name: "shippingAddress",
      type: "object",
      title: "Shipping Address",
      fields: [
        { name: "address1", type: "string", title: "Address Line 1" },
        { name: "address2", type: "string", title: "Address Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "zipCode", type: "string", title: "Zip Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    },
    {
      name: "orderItems",
      type: "array",
      title: "Order Items",
      of: [
        {
          type: "object",
          title: "Order Item",
          fields: [
            {
              name: "_key",
              type: "string",
              title: "Unique Key",
              initialValue: () => uuidv4(),
              readOnly: true,
            },
            {
              name: "product",
              type: "reference",
              to: [{ type: "product" }],
              title: "Product",
            },
            { name: "quantity", type: "number", title: "Quantity" },
            { name: "price", type: "number", title: "Price" },
          ],
        },
      ],
    },
    { name: "subtotal", type: "number", title: "Subtotal" },
    { name: "total", type: "number", title: "Total" },
    {
      name: "status",
      type: "string",
      title: "Order Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "orderDate",
      type: "datetime",
      title: "Order Date",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        calendarTodayLabel: "Today",
      },
    },
    {
      name: "discount",
      title: "Discount",
      type: "number",
      validation: (Rule: { min: (arg0: number) => any; }) => Rule.min(0),
    },
  ],
};

export default orderSchema;
