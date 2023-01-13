import { TUser } from "./types";
import { TProduct } from "./types";
import { TPurchase } from "./types";
import { Categorys } from "./types";

export const users: TUser[] = [
    { id:  "1981",
      email: "ammal@gmail.com",
      password: "flamengo123"
    },
    { id:  "2019",
      email: "flamengo@gmail.com",
      password: "flamengo12345"
    }
]

export const products: TProduct[] = [
    { id:  "01",
      name: "Blusa Flamengo 2023",
      price: 350,
      category: Categorys.CLOTHES_AND_SHOES
    },
    { id:  "02",
      name: "Pulseira Flamengo Branco",
      price: 30,
      category: Categorys.ACCESSORIES
    },
]

export const purchases: TPurchase[] = [
    { userId:  "1981",
      productId: "01",
      quantity: 2,
      totalPrice: 700
    },
    { userId:  "2019",
      productId: "02",
      quantity: 3,
      totalPrice: 900
    },
]

export function createUser(id:string, email:string, password:string): string {
    users.push({id, email, password})
    return ("Cadastro realizado com sucesso")
  }
  
  
  export function getAllUsers(): TUser[] {
    return users
  }
  
  export function createProduct(id:string, name:string, price:number, category: Categorys): string {
    products.push({id, name, price, category})
    return ("Produto criado com sucesso")
  }
  
  export function getAllProducts(): TProduct[] {
    return products
  }
  
  export function getProductById(idToSearch:string): TProduct[] | undefined {
     return products.filter(
      (product) => {
        return product.id === idToSearch 
      }
    )
  }
  
  export const queryProductsByName = (q:string): TProduct[] => {
    return products.filter(
      (product) => {
      return product.name.toLowerCase().includes(q.toLowerCase())
      }
    )
  }
  
  export function createPurchase(userId:string, productId:string, quantity:number, totalPrice:number): string {
    purchases.push({userId, productId, quantity, totalPrice})
    return ("Compra realizada com sucesso")
  }
  
  export function getAllPurchasesFromUserId(userIdToSearch:string) :TPurchase[] {
    return purchases.filter(
      (purchase) => {
        return purchase.userId.toLowerCase().includes(userIdToSearch.toLowerCase())
      }
    )
  }