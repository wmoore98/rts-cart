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

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  quantity: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("https://fakestoreapi.com/products")).json();

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );
  console.log(data);

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((acc: number, item) => acc + item.quantity, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      if (prev.find((item) => item.id === clickedItem.id)) {
        return prev.map((item) =>
          item.id === clickedItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...clickedItem, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) =>
      prev.reduce((acc, item) => {
        if (item.id === id) {
          const updatedItem = { ...item, quantity: item.quantity - 1 };
          if (updatedItem.quantity > 0) {
            return [...acc, updatedItem];
          } else {
            return acc;
          }
        } else {
          return [...acc, item];
        }
      }, [] as CartItemType[])
    );
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
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setIsCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
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
