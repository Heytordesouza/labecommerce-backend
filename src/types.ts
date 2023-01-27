export enum Descriptions {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
}

export type TUser = {
    id: string
    name: string
    email: string
    password: string
}
     
 export type TProduct = {
    id: string
    name: string
    price: number
    description: Descriptions
    image_url: string
}
 
 export type TPurchase = {
    id: string
    total_price: number
    buyer: string
}

export type TProductsInPurchase = {
   id:string
   buyer: string
   total_price: number
   products:TProduct[]
}

export type TPurchasesProducts = {
   purchase_id: string, 
   product_id: string,
   quantity:number,
}