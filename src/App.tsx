import { useState } from "react";
import { useQuery } from "react-query";
import LinearProgress from "@material-ui/core/LinearProgress";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";

import { StyledButton, Wrapper } from "./App.styles";
import Item from "./Item/Item";
import Cart from "./Cart/Cart";

import { Cart as MyCart } from "./lib/Cart";

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  quantity: number;
};

const myCart = new MyCart<CartItemType>();

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0); // provide a mechanism for React to detect changes in cart
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );
  console.log(data);

  const handleAddToCart = (clickedItem: CartItemType) => {
    myCart.add(clickedItem);
    setItemCount(myCart.itemCount);
  };

  const handleRemoveFromCart = (id: number) => {
    myCart.remove(id);
    setItemCount(myCart.itemCount);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  if (error) {
    console.error(error);
    return <div>😮 Oops. Something went wrong...</div>;
  }

  return (
    <Wrapper>
      <Drawer
        anchor='right'
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      >
        <Cart
          cartItems={myCart.list}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setIsCartOpen(true)}>
        <Badge badgeContent={itemCount} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
