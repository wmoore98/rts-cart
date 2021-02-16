import { Cart, Cartable } from "./Cart";

describe("Cart works as expected", () => {
  test("can instantiate a cart", () => {
    const cart = new Cart();

    expect(cart).toBeDefined();
    expect(cart).toBeInstanceOf(Cart);
  });

  test("class Cart implements CartInterface", () => {
    const cart = new Cart();

    expect(cart).toHaveProperty("list");
    expect(cart.list).toBeInstanceOf(Array);
    expect(cart.list.length).toEqual(0);
    expect(cart).toHaveProperty("itemCount");
    expect(cart.itemCount).toEqual(0);
    expect(cart).toHaveProperty("add");
    expect(cart.add).toBeInstanceOf(Function);
    expect(cart).toHaveProperty("remove");
    expect(cart.remove).toBeInstanceOf(Function);
    expect(cart).toHaveProperty("getItem");
    expect(cart.getItem).toBeInstanceOf(Function);
    expect(cart).toHaveProperty("getAmount");
    expect(cart.getAmount).toBeInstanceOf(Function);
  });

  test("can add a new item to cart, quantity added defaults to 1", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };

    cart.add(item);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(1);
  });

  test("can add a new item to cart, accepts quantity added as parameter", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;

    cart.add(item, qtyToAdd);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(qtyToAdd);
  });

  test("can add an existing item to cart, quantity added defaults to 1", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    cart.add(item);

    cart.add(item);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(2);
  });

  test("can add an existing item to cart, accepts quantity added as parameter", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd1 = 5;
    const qtyToAdd2 = 7;
    cart.add(item, qtyToAdd1);

    cart.add(item, qtyToAdd2);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(qtyToAdd1 + qtyToAdd2);
  });

  test("can remove an item from cart, quantity removed defaults to 1", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    cart.add(item, qtyToAdd);

    cart.remove(item.id);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(qtyToAdd - 1);
  });

  test("can remove an item from cart, accepts quantity removed as a parameter", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    const qtyToRemove = 3;
    cart.add(item, qtyToAdd);

    cart.remove(item.id, qtyToRemove);

    expect(cart.list.length).toEqual(1);
    expect(cart.list[0].id).toEqual(item.id);
    expect(cart.list[0].price).toEqual(item.price);
    expect(cart.list[0].quantity).toEqual(qtyToAdd - qtyToRemove);
  });

  test("removes item from list when quantity reaches 0", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    const qtyToRemove = 5;
    cart.add(item, qtyToAdd);

    cart.remove(item.id, qtyToRemove);

    expect(cart.list.length).toEqual(0);
  });

  test("throws exception if quantity to remove exceeds quantity in cart", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    const qtyToRemove = 6;
    cart.add(item, qtyToAdd);

    expect(() => cart.remove(item.id, qtyToRemove)).toThrow(/exceeds/);
  });

  test("throws exception if quantity added is not positive integer", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = -5;

    expect(() => cart.add(item, qtyToAdd)).toThrow(/positive integer/);
  });

  test("throws exception if quantity removed is not positive integer", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    const qtyToRemove = 4.5;
    cart.add(item, qtyToAdd);

    expect(() => cart.remove(item.id, qtyToRemove)).toThrow(/positive integer/);
  });

  test("throws exception if item to be removed is not in list", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    const qtyToAdd = 5;
    const qtyToRemove = 4;
    cart.add(item, qtyToAdd);

    expect(() => cart.remove(2, qtyToRemove)).toThrow(/not found/);
  });

  test("accurately tracks multiple items in list in order of insertion", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10 },
      { id: 2, price: 20 },
      { id: 3, price: 30 },
    ];
    items.forEach((item) => cart.add(item));

    expect(cart.list.length).toEqual(items.length);
    for (let i = 0; i < items.length; i++) {
      expect(cart.list[i].id).toEqual(items[i].id);
      expect(cart.list[i].price).toEqual(items[i].price);
      expect(cart.list[i].quantity).toEqual(1);
    }
  });

  test("can get a specific item from list by id", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10 },
      { id: 2, price: 20 },
      { id: 3, price: 30 },
    ];
    items.forEach((item) => cart.add(item));

    for (let i = 0; i < items.length; i++) {
      const item = cart.getItem(items[i].id);
      expect(item?.id).toEqual(items[i].id);
      expect(item?.price).toEqual(items[i].price);
      expect(item?.quantity).toEqual(1);
    }
  });

  test("returns undefined if item not found", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10 },
      { id: 2, price: 20 },
      { id: 3, price: 30 },
    ];
    items.forEach((item) => cart.add(item));

    const item = cart.getItem(items.length + 1);

    expect(item).toBeUndefined();
  });

  test("make sure that changes to returned item DO NOT change the original - cannot directly mutate items in list", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    cart.add(item);

    const retrievedItem = cart.getItem(item.id);
    // workaround Typescript complaining that retrievedItem may be undefined
    if (!retrievedItem) {
      return;
    }
    retrievedItem.price *= 2;

    expect(retrievedItem.price).toEqual(item.price * 2);
    expect(cart.getItem(item.id)?.price).toEqual(item.price);
  });

  test("make sure that changes to returned list DO NOT change the original - cannot directly mutate list", () => {
    const cart = new Cart();
    const item: Cartable = { id: 1, price: 10 };
    cart.add(item);

    const retrievedList = cart.list;
    retrievedList.pop();

    expect(retrievedList.length).toEqual(0);
    expect(cart.list.length).toEqual(1);
  });

  test("can get the item amount, i.e., price * quantity, rounded to two decimal places by id", () => {
    const price = 10.33;
    const qtyToAdd = 5;
    const cart = new Cart();
    const item: Cartable = { id: 1, price };
    cart.add(item, qtyToAdd);

    const amount = cart.getAmount(item.id);

    expect(amount).toEqual(Math.round(price * qtyToAdd * 100) / 100);
  });

  test("can get the item amount, i.e., price * quantity, rounded to two decimal places by passing item", () => {
    const price = 10.33;
    const qtyToAdd = 5;
    const cart = new Cart();
    const item: Cartable = { id: 1, price };
    cart.add(item, qtyToAdd);
    const retrievedItem = cart.getItem(item.id);
    // workaround Typescript complaining that retrievedItem may be undefined
    if (!retrievedItem) {
      return;
    }

    const amount = cart.getAmount(retrievedItem);

    expect(amount).toEqual(Math.round(price * qtyToAdd * 100) / 100);
  });

  test("can get the total cart amount, i.e., price * quantity, rounded to two decimal places by passing cart list", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10.33 },
      { id: 2, price: 20.98 },
      { id: 3, price: 30.16 },
    ];
    items.forEach((item, i) => cart.add(item, i + 1));
    const expectedAmount = cart.list.reduce(
      (acc, item) => Math.round(item.price * item.quantity * 100) / 100,
      0
    );

    const amount = cart.getAmount(cart.list);

    expect(amount).toEqual(expectedAmount);
  });

  test("returns undefined if invalid item id passed to getAmount()", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10 },
      { id: 2, price: 20 },
      { id: 3, price: 30 },
    ];
    items.forEach((item) => cart.add(item));

    const amount = cart.getAmount(items.length + 1);

    expect(amount).toBeUndefined();
  });

  test("can get total count of items in cart", () => {
    const cart = new Cart();
    const items: Cartable[] = [
      { id: 1, price: 10 },
      { id: 2, price: 20 },
      { id: 3, price: 30 },
    ];
    items.forEach((item, i) => cart.add(item, i + 1));

    const count = cart.itemCount;

    expect(count).toEqual(6);
  });
});
