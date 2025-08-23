import type { AnalysisResult } from '../types';

export const sampleAnalysisResult: AnalysisResult = {
  businessSummary: "This application is an e-commerce platform designed for selling custom-printed apparel. Users can browse products, customize designs, and place orders. Administrators can manage products, view orders, and handle customer accounts.",
  architecture: {
    layers: [
      {
        name: "End-User",
        description: "Provides the user interface and core application logic.",
        modules: ["ApparelStore_UI"]
      },
      {
        name: "Core",
        description: "Contains business logic and data for core concepts.",
        modules: ["ProductManagement_CS", "OrderProcessing_BL"]
      },
      {
        name: "Foundation",
        description: "Provides reusable, application-agnostic services.",
        modules: ["Stripe_IS", "Authentication_LIB"]
      }
    ]
  },
  entities: [
    {
      name: "User",
      description: "Stores customer account information.",
      attributes: [
        { name: "Id", dataType: "Long Integer", isPrimaryKey: true },
        { name: "Name", dataType: "Text" },
        { name: "Email", dataType: "Email", isForeignKey: false },
        { name: "PasswordHash", dataType: "Text" },
        { name: "CreatedAt", dataType: "DateTime" }
      ]
    },
    {
      name: "Product",
      description: "Stores information about apparel products available for sale.",
      attributes: [
        { name: "Id", dataType: "Long Integer", isPrimaryKey: true },
        { name: "Name", dataType: "Text" },
        { name: "Description", dataType: "Text" },
        { name: "BasePrice", dataType: "Currency" },
        { name: "ImageUrl", dataType: "Text" }
      ]
    },
    {
      name: "Order",
      description: "Represents a customer's order.",
      attributes: [
        { name: "Id", dataType: "Long Integer", isPrimaryKey: true },
        { name: "UserId", dataType: "Long Integer", isForeignKey: true },
        { name: "OrderDate", dataType: "DateTime" },
        { name: "TotalAmount", dataType: "Currency" },
        { name: "StatusId", dataType: "Integer", isForeignKey: true }
      ]
    },
    {
        name: "OrderItem",
        description: "Represents a single item within an order.",
        attributes: [
          { name: "Id", dataType: "Long Integer", isPrimaryKey: true },
          { name: "OrderId", dataType: "Long Integer", isForeignKey: true },
          { name: "ProductId", dataType: "Long Integer", isForeignKey: true },
          { name: "Quantity", dataType: "Integer" },
          { name: "Price", dataType: "Currency" }
        ]
    }
  ],
  relationships: [
    { fromEntity: "User", toEntity: "Order", type: "1-to-Many", description: "A User can place multiple Orders." },
    { fromEntity: "Order", toEntity: "OrderItem", type: "1-to-Many", description: "An Order consists of multiple OrderItems." },
    { fromEntity: "Product", toEntity: "OrderItem", type: "1-to-Many", description: "A Product can be in multiple OrderItems." }
  ],
  staticEntities: [
    {
      name: "OrderStatus",
      description: "Represents the possible statuses of an order.",
      attributes: [
        { name: "Id", dataType: "Integer" },
        { name: "Label", dataType: "Text" },
        { name: "Order", dataType: "Integer" }
      ],
      records: [
        { "Id": 1, "Label": "Pending", "Order": 1 },
        { "Id": 2, "Label": "Processing", "Order": 2 },
        { "Id": 3, "Label": "Shipped", "Order": 3 },
        { "Id": 4, "Label": "Delivered", "Order": 4 },
        { "Id": 5, "Label": "Cancelled", "Order": 5 }
      ]
    }
  ],
  asynchronousProcesses: {
    timers: [
      {
        name: "DailySalesReportTimer",
        schedule: "Daily at 01:00 AM",
        description: "Generates the previous day's sales report and emails it to the admin group."
      }
    ],
    bptProcesses: [
      {
        name: "HighValueOrderApproval",
        trigger: "Creation of an Order record with TotalAmount > $1,000.",
        steps: [
          "Assign approval task to a manager.",
          "Wait for manager's decision (Approve/Reject).",
          "If approved, proceed with payment processing.",
          "If rejected, update order status to 'Cancelled' and notify the user."
        ]
      }
    ]
  },
  endpoints: [
    {
      name: "GetProducts",
      method: "GET",
      path: "/api/products",
      parameters: ["search (text)", "sortBy (text)"],
      description: "Retrieves a list of available products, with optional search and sorting.",
      requestExample: "",
      responseExample: "[{\"id\": 1, \"name\": \"Classic T-Shirt\", \"price\": 19.99}]"
    },
    {
      name: "CreateOrder",
      method: "POST",
      path: "/api/orders",
      parameters: ["items (array)"],
      description: "Creates a new order from a list of items in the cart.",
      requestExample: "{\"userId\": 123, \"items\": [{\"productId\": 1, \"quantity\": 2}]}",
      responseExample: "{\"orderId\": 987, \"status\": \"Pending\", \"total\": 39.98}"
    }
  ],
  roles: [
    { name: "Administrator", description: "Can manage products, orders, and user accounts." },
    { name: "RegisteredUser", description: "Can browse products, place orders, and view their order history." }
  ],
  pages: [
    { name: "Home Page", description: "Displays featured products and categories.", role: "Public" },
    { name: "Product Listing", description: "Shows a grid of all available products with filters.", role: "Public" },
    { name: "Product Detail", description: "Shows details for a single product and allows customization.", role: "RegisteredUser" },
    { name: "Shopping Cart", description: "Displays items added to the cart and proceeds to checkout.", role: "RegisteredUser" },
    { name: "Admin Dashboard", description: "Provides an overview of sales and recent orders.", role: "Administrator" }
  ],
  siteProperties: [
    { name: "PaymentGatewayApiKey", dataType: "Text", defaultValue: "\"pk_test_...\"", description: "API Key for the third-party payment provider." },
    { name: "DefaultPageSize", dataType: "Integer", defaultValue: "12", description: "Number of products to show per page on the product listing." }
  ],
  thirdPartyRecommendations: [
    {
      serviceName: "Stripe API",
      useCase: "Processing customer payments during checkout.",
      recommendation: "Stripe provides a robust, secure, and well-documented API for handling online payments, which is essential for an e-commerce platform."
    },
    {
        serviceName: "Amazon S3",
        useCase: "Storing high-resolution product images and user-uploaded custom designs.",
        recommendation: "Amazon S3 is a scalable and cost-effective solution for storing and serving large amounts of static files like images, ensuring fast load times for customers."
    }
  ]
};
