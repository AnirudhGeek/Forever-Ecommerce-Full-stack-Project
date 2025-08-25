import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // if in the cartData the item is available and the size is also available
        cartData[itemId][size] += 1;
      } else {
        // if in the cartData the item is available and the size is not available
        cartData[itemId][size] = 1;
      }
    } else {
      //and if in the cartData we don't have any product with this productId then
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Mark the nested object as modified and save the document
    userData.markModified("cartData");
    await userData.save(); // Use .save() for better reliability

    //adding updated cartData to the userCartData
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      message: "Added to Cart",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({
      success: true,
      message: "Cart Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({
      success: true,
      cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addToCart, updateCart, getUserCart };
