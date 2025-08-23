
import type { AnalysisResult } from '../types';

export const sampleAnalysisResult: AnalysisResult = {
  businessSummary: "This application is an e-commerce platform designed for selling custom-printed apparel. Users can browse products, customize designs, and place orders. Administrators can manage products, view orders, and handle customer accounts.",
  architecture: {
    layers: [
      {
        name: "End-User",
        description: "This layer contains all the elements the user interacts with, such as screens, UI widgets, and client-side logic. It's responsible for the presentation and user experience.",
        modules: [
            { name: "ApparelStore_UI", description: "Handles all user-facing screens like product listings, shopping cart, and checkout." }
        ]
      },
      {
        name: "Core",
        description: "This layer encapsulates the application's core business logic and data. It defines the main business concepts and rules, ensuring they are consistent and reusable across the application.",
        modules: [
            { name: "ProductManagement_CS", description: "Manages core product entities and provides services for creating, reading, updating, and deleting products." },
            { name: "OrderProcessing_BL", description: "Contains the business logic for handling the entire order lifecycle, from creation to payment and fulfillment." }
        ]
      },
      {
        name: "Foundation",
        description: "This layer provides reusable, application-agnostic services and components. It often includes integrations with external systems or shared libraries that can be used across multiple applications.",
        modules: [
            { name: "ApparelStore_Th", description: "Contains the base theme and styles for the entire application, ensuring a consistent look and feel." },
            { name: "Stripe_IS", description: "Integrates with the Stripe payment gateway to handle payment processing securely." },
            { name: "Authentication_LIB", description: "Provides a reusable library for user authentication and session management." }
        ]
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
  serviceActions: [
    {
      name: "GetProducts",
      description: "Retrieves a list of available products, with optional search and sorting.",
      inputs: ["search (text)", "sortBy (text)"],
      outputs: ["ProductList (List of Product Record)"]
    },
    {
      name: "CreateOrder",
      description: "Creates a new order from a list of items in the cart.",
      inputs: ["userId (Long Integer)", "items (List of OrderItem Record)"],
      outputs: ["orderId (Long Integer)", "isSuccess (Boolean)"]
    }
  ],
  consumedRestApis: [
    {
        name: "ProcessPayment",
        method: "POST",
        path: "https://api.stripe.com/v1/charges",
        parameters: ["amount (integer)", "currency (string)", "source (string)", "description (string)"],
        description: "Consumes the Stripe API to process a credit card payment for an order.",
        requestExample: "{\"amount\": 3998, \"currency\": \"usd\", \"source\": \"tok_visa\", \"description\": \"Charge for order 987\"}",
        responseExample: "{\"id\": \"ch_123...\", \"status\": \"succeeded\"}"
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
  ],
  pluginRecommendations: [
    {
      name: "Ultimate PDF",
      description: "Recommended for generating and downloading PDF reports, such as order invoices or sales summaries, which is a common requirement for an e-commerce platform."
    }
  ]
};