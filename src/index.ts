import { users, products, purchases, createUser, getAllUsers, createProduct, 
    getAllProducts, getProductById, queryProductsByName, createPurchase, getAllPurchasesFromUserId } from "./database"
import { Categorys } from "./types"

console.log(createUser("2023", "nadanão@email.com", "chegadebananinha"))

console.log(getAllUsers())
    
console.log(createProduct("200", "Blusa retrô", 200, Categorys.CLOTHES_AND_SHOES))
    
console.log(getAllProducts())
    
console.log(getProductById("01"))
    
console.log(queryProductsByName("Blusa Flamengo 2023"))
    
console.log(createPurchase("2019", "01", 2, 700))
    
console.log(getAllPurchasesFromUserId("2019"))