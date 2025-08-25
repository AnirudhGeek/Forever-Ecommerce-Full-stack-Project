import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems); // it will create a copy of cart items and we can access it using cartData variable

    if (cartData[itemId]) {
      //if we have the product entry with the same size
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      // if we have one product entry but we don't have the product entry with the same size then we create a new entry
      else {
        cartData[itemId][size] = 1;
      }
    }
    // if in the cartData we don't have any entry with this itemId, then we create a new entry
    else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      // console.log("Sending request with token:", token);
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      //first for loop will help us to iterate the items
      for (const item in cartItems[items]) {
        // second for loop it will iterate the product size
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if(token){
      try {
        await axios.post(backendUrl+'/api/cart/update',{itemId,size,quantity},{headers:{token}})
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  // useEffect(() => {
  //   // console.log(cartItems);
  // }, [cartItems]);

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      // console.log(response.data)
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async(token)=>{
    try {
      const response = await axios.post(backendUrl+'/api/cart/get',{},{headers:{token}})
      if(response.data.success){
        setCartItems(response.data.cartData)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  } 

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      //if token is not available and in localstorage token is available in that case we'll store the localstorage token in the token state
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"))
    }
  });

  // whenever we add variable state variable or a function within this value object then we can access it in any component using the contextAPI
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
