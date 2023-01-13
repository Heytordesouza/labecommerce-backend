import { TUser } from "./types";
import { TProduct } from "./types";
import { TPurchase } from "./types";

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
      category: "Blusa"
    },
    { id:  "02",
      name: "Blusa Flamengo 2023 Branco",
      price: 300,
      category: "Blusa"
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