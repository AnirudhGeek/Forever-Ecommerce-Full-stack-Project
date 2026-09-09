import "dotenv/config";
import mongoose from "mongoose";
import productModel from "./models/productModel.js";

const sampleProducts = [
  {
    name: "Women Round Neck Cotton Top",
    description: "A lightweight, pullover shirt, close-fitting and with a round neckline and short sleeves.",
    price: 100,
    image: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Men Round Neck Pure Cotton T-shirt",
    description: "A lightweight, comfortable cotton t-shirt with modern styling.",
    price: 150,
    image: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Girls Casual Cotton Top",
    description: "Comfortable and stylish round neck cotton top for casual wear.",
    price: 120,
    image: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestseller: false,
    date: Date.now(),
  },
  {
    name: "Men Slim Fit Casual Denim Jacket",
    description: "Classic denim jacket crafted from durable denim fabric.",
    price: 250,
    image: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Men",
    subCategory: "Winterwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Women Classic Trench Coat",
    description: "Elegant warm winter outerwear coat with belt.",
    price: 320,
    image: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Women",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Men Regular Fit Chino Trousers",
    description: "Comfortable flat-front chino trousers perfect for formal or casual styling.",
    price: 180,
    image: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    bestseller: false,
    date: Date.now(),
  },
  {
    name: "Women High Rise Flared Jeans",
    description: "Flattering high-rise wide-leg denim jeans for an effortless retro look.",
    price: 210,
    image: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    date: Date.now(),
  },
  {
    name: "Kids Warm Winter Puffer Jacket",
    description: "Quilted insulated jacket to keep kids warm during cold winter days.",
    price: 160,
    image: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=60"
    ],
    category: "Kids",
    subCategory: "Winterwear",
    sizes: ["S", "M", "L"],
    bestseller: false,
    date: Date.now(),
  }
];

const seedDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MONGODB_URI is not set in backend/.env");
      process.exit(1);
    }
    if (uri.endsWith("/")) uri = uri.slice(0, -1);

    await mongoose.connect(uri, { dbName: "e-commerce" });
    console.log("Connected to MongoDB for seeding...");

    const count = await productModel.countDocuments();
    if (count > 0 && !process.argv.includes("--force")) {
      console.log(`Database already has ${count} products. Use 'npm run seed -- --force' to overwrite.`);
      process.exit(0);
    }

    if (process.argv.includes("--force")) {
      await productModel.deleteMany({});
      console.log("Cleared existing products.");
    }

    await productModel.insertMany(sampleProducts);
    console.log(`Successfully seeded ${sampleProducts.length} sample products into 'e-commerce' database!`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDB();
