//there will be 4 controllers functions => 1. add product
//      => 2. total product list
//      => 3. remove product
//      => 4. getting the single product details

import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

//function for add product=>to add a product we will create a middleware using multer so that if we send any file as form data then that file will be parsed using multer
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      bestseller,
      category,
      subCategory,
      sizes,
    } = req.body;

    //after that we have to get the products image that we will get from the req.files
    const image1 = req.files.image1 && req.files.image1[0]; //image1 will be an array and we have to get the first element
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // console.log(name, description, price, category, subCategory, bestseller);
    // console.log(image1, image2, image3, image4);

    //now we have to store these data and images on the database but we can't store the images ,
    //so we have to upload these images to cloudinary and from cloudinary we will get the URL and we will store that URL in the database

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    //now we have to upload all this images into cloudinary
    let imagesURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    console.log(imagesURL);

    //saving all this data in mongoDb database
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      //sizes will be one array so that when we send this array using form data so before sending that we have to convert these sizes using JSON.stringify method into string . When we'll get the string then we have to again parse it and convert in 1 array. NOTE => we are sending like this because we cannot send the array directly as the form data
      //so from frontend we will send the sizes that will be converted into string and here we are converting it from string to array using JSON.parse
      image: imagesURL,
      date: Date.now(),
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

//function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id)
    res.json({
      success : true,
      message : "Product remove"
    })
  } catch (error) {
    console.log(error)
    res.json({
      success : false,
      message : error.message
    })
  }
};

//function for single product info
const singleProduct = async (req, res) => {
  try {
    const {productId} = req.body
    const product = await productModel.findById(productId)
    res.json({
      success : true,
      product
    })
  } catch (error) {
    console.log(error)
    res.json({
      success : false,
      message : error.message 
    })
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
