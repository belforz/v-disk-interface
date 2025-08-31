import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiUsers = axios.create({
  baseURL: import.meta.env.VITE_API_USERS,
  headers:{
    "Content-Type": "application/json",
  }
})

export const apiCarts = axios.create({
  baseURL: import.meta.env.VITE_API_CARTS,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiOrders = axios.create({
  baseURL: import.meta.env.VITE_API_ORDERS,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiEmails = axios.create({
  baseURL: import.meta.env.VITE_API_EMAIL,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiVinyls = axios.create({
  baseURL: import.meta.env.VITE_API_VINYLS,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiAuth = axios.create({
  baseURL: import.meta.env.VITE_API_LOGIN,
  headers: {
    "Content-Type": "application/json",
  }
})

export const apiCheckout = axios.create({
  baseURL: import.meta.env.VITE_API_CHECKOUT,
  headers: {
    "Content-Type": "application/json",
  }
})
