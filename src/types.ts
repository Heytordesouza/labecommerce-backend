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
    paid: number
    delivered_at: string
    buyed_id: string
 }