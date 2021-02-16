export interface Cartable {
  id: number;
  price: number;
}

export interface CartedItem extends Cartable {
  quantity: number;
}

export interface CartInterface<T extends CartedItem> {
  // list: CartedItem[];
  // add(itemToAdd: Cartable, quantityToAdd?: number): void;
  // remove(itemIdToRemove: number, quantityToRemove?: number): void;
  // getItem(id: number): CartedItem | undefined;
  // getAmount(arg: CartedItem[]): number;
  // getAmount(arg: CartedItem): number;
  // getAmount(arg: number): number | undefined;
  list: T[];
  itemCount: number;
  add(itemToAdd: Cartable, quantityToAdd?: number): void;
  remove(itemIdToRemove: number, quantityToRemove?: number): void;
  getItem(id: number): T | undefined;
  getAmount(arg: T[]): number;
  getAmount(arg: T): number;
  getAmount(arg: number): number | undefined;
}

export class Cart<T extends CartedItem> implements CartInterface<T> {
  private _list: T[] = [];

  add(itemToAdd: Cartable, quantityToAdd: number = 1) {
    this.raiseExceptionIfQuantityNotPositiveInteger(quantityToAdd);

    if (this._list.find((item) => item.id === itemToAdd.id)) {
      this._list = this._list.map((item) =>
        item.id === itemToAdd.id
          ? this.getUpdatedItem(item, quantityToAdd)
          : item
      );
    } else {
      this._list = [
        ...this._list,
        { ...itemToAdd, quantity: quantityToAdd },
      ] as T[];
    }
  }

  remove(itemIdToRemove: number, quantityToRemove: number = 1) {
    this.raiseExceptionIfItemIdNotInList(itemIdToRemove);
    this.raiseExceptionIfQuantityNotPositiveInteger(quantityToRemove);

    this._list = this._list.reduce((acc, item) => {
      if (item.id === itemIdToRemove) {
        if (item.quantity > quantityToRemove) {
          return [...acc, this.getUpdatedItem(item, -quantityToRemove)];
        } else if (item.quantity === quantityToRemove) {
          return acc;
        } else {
          throw new Error(
            `Quantity to remove(${quantityToRemove}) exceeds quantity in cart(${item.quantity}). You cannot remove more items than are in the cart.`
          );
        }
      } else {
        return [...acc, item];
      }
    }, [] as T[]);
  }

  get list() {
    return [...this._list];
  }

  getItem(id: number): T | undefined {
    const result = this._list.find((item) => item.id === id);
    return result ? { ...result } : undefined;
  }

  getAmount(arg: T[]): number;
  getAmount(arg: T): number;
  getAmount(arg: number): number | undefined;
  getAmount(arg: number | T[] | T): number | undefined {
    if (Array.isArray(arg)) {
      return arg.reduce((acc, item) => this.getAmount(item), 0);
    } else if (
      typeof arg === "object" &&
      typeof arg.price === "number" &&
      typeof arg.quantity === "number"
    ) {
      return Math.round(arg.price * arg.quantity * 100) / 100;
    } else if (typeof arg === "number") {
      const item = this.getItem(arg);
      if (item) {
        return this.getAmount(item);
      } else {
        return undefined;
      }
    } else {
      throw new Error(`Invalid argument passed to getAmount.`);
    }
  }

  get itemCount() {
    return this._list.reduce((acc: number, item) => acc + item.quantity, 0);
  }

  private raiseExceptionIfItemIdNotInList(id: number) {
    if (!this._list.find((item) => item.id === id)) {
      throw new Error(`Item with id ${id} not found`);
    }
  }

  private raiseExceptionIfQuantityNotPositiveInteger(quantity: number) {
    if (quantity < 0 || Math.floor(quantity) !== quantity) {
      throw new Error("Quantity must be a positive integer");
    }
  }

  private getUpdatedItem(item: T, qty: number) {
    return {
      ...item,
      quantity: item.quantity + qty,
    };
  }
}
