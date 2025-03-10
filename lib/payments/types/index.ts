import { Session, User, Price, Product } from "../../db/schema";

export type CheckoutResult = {
  session: Session;
  redirectUrl: string;
};

export type CheckoutData = {
  price: Price;
  product: Product;
  user: User;
};


