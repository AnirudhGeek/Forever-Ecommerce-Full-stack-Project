import mongoose from "mongoose";

//schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
});

//model
const productModel =
  mongoose.models.product || mongoose.model("product", productSchema); //so now if the product model is already available then it will be used otherwise the it will create new model throught the given schema. This will make sure that there will be no multiple models of the same name and hence cause an error

export default productModel;
