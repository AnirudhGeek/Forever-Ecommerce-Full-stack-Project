//here we will authenticate whenever the user add the product to the cart, update the product to the cart data or user will place the order
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized, Login again",
    });
  }

  try {
    //if the token is available then we'll decode the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    // in useController.js when we have created the token then we have added 1 object ie id(user's id)
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export default authUser;
