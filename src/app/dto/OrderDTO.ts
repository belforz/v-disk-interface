import { Order } from "../models/order";

export interface ICreateOrderDTO extends Order {

}

export interface IUpdateOrderDTO extends Partial<Order> {

}
