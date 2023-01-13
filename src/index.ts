import express, { Request, Response } from 'express'
import cors from 'cors'

import { users, products, purchases } from './database'
import { TUser, TProduct, TPurchase, Categorys } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})



//Get All Users
app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).send(users)

    } catch (error) {
        res.send(error.message)

    }
})


//Get All Products
app.get('/products', (req: Request, res: Response) => {
    try {
        res.status(200).send(products)

    } catch (error) {
        res.send(error.message)
        
    }
})


//Search Product by name
app.get('/product/search', (req: Request, res: Response) => {
    try {
        const q = req.query.q as string

        if(q !== undefined){

            if(q.length <= 0){
                res.status(400)
                throw new Error ("'Query Params' inválido. Deve ter no mínimo 1 caractere.")
            }
        }

        const result = products.filter((product) => {
        return product.name.toLowerCase().includes(q.toLowerCase())

        })

        res.status(200).send(result)

    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  
})


//Create User
app.post('/users', (req: Request, res: Response) => {

    try {
        const {id, email, password} = req.body 

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string");
        }

        if(typeof email !== "string"){
            res.status(400)
            throw new Error("O Email deve ser uma string");
        }

        if(typeof password !== "string"){
            res.status(400)
            throw new Error("A Senha deve ser uma string");
        }

        const newUser = {
            id,
            email,
            password
        }


        if(newUser.id !== undefined){
            
            users.filter((user) => {
                if(newUser.id === user.id){
                res.status(400)
                throw new Error ("'Id' inválido. Esse Id já existe, crie outro.")
            }})
        }

        if(newUser.email !== undefined){

            users.filter((user) => {
                if(user.email === newUser.email){
                    res.status(400)
                    throw new Error ("'Email' inválido. Esse email já existe, crie outro.")
            }})
        }
        
        if(newUser.password.length <= 3){
            res.status(400)
            throw new Error ("Digite uma senha com pelo menos 4 caracteres")
        }

    users.push(newUser)

    res.status(201).send("Cadastro registrado com sucesso")

    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  

})


//Create Product
app.post('/products', (req: Request, res: Response) => {

    try {
        const {id, name, price, category} = req.body 

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string");
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("O nome deve ser uma string");
        }

        if(typeof price !== "number"){
            res.status(400)
            throw new Error("O preço deve ser um número");
        }

        if(category !== Categorys.ACCESSORIES &&
           category !== Categorys.CLOTHES_AND_SHOES &&
           category !== Categorys.ELECTRONICS){
            res.status(400)
            throw new Error("A Categoria só deve ser 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'");
        }

        const newProduct = {
            id,
            name,
            price,
            category
        }

        if(newProduct.id !== undefined){
            
            products.filter((product) => {
                if(newProduct.id === product.id){
                res.status(400)
                throw new Error ("'Id' inválido. Esse Id já existe, crie outro.")
            }})
        }

    products.push(newProduct)

    res.status(201).send("Cadastro registrado com sucesso")
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  
})


//Create Purchase
app.post('/purchases', (req: Request, res: Response) => {

    try {
        const {userId, productId, quantity, totalPrice} = req.body 

        if(typeof userId !== "string"){
            res.status(400)
            throw new Error("O userId deve ser uma string");
        }

        if(typeof productId !== "string"){
            res.status(400)
            throw new Error("O productId deve ser uma string");
        }

        if(typeof quantity !== "number"){
            res.status(400)
            throw new Error("A Quantidade deve ser um número");
        }

        if(typeof totalPrice !== "number"){
            res.status(400)
            throw new Error("O Total deve ser um número");
        }

        const newPurchases = {
            userId,
            productId,
            quantity,
            totalPrice
        }

        if(newPurchases.userId !== undefined){

            const result = users.find((user) => newPurchases.userId === user.id)
                
                if(!result){
                res.status(400)
                throw new Error ("'Id' de usuário inválido. Esse Usuário não existe.")
            }
        }
        

        if(newPurchases.productId !== undefined){

            const result = products.find((product) => newPurchases.productId === product.id)
                
                if(!result){
                res.status(400)
                throw new Error ("'Id' de produto inválido. Esse produto não existe.")
            }
        }

        if(newPurchases.quantity && newPurchases.totalPrice !== undefined){

            products.filter((product) => {
                if(newPurchases.productId === product.id){
                    if(product.price * newPurchases.quantity !== newPurchases.totalPrice){
                        res.status(400)
                        throw new Error ("Valor Total inválido. O Total está com valor errado, verifique a quantidade e o valor unitário.")
                    }
                
            }})
        }

        purchases.push(newPurchases)

        res.status(201).send("Cadastro registrado com sucesso")
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  
})


//Get All Purchases "Somente verificar"
app.get('/purchases', (req: Request, res: Response) => {
    res.status(200).send(purchases)
})

/////////////////////////////////////////


//GetProductsById
app.get("/products/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const result = products.find((product) => product.id === id)

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string")
        }

        if(id !== undefined){

            if(!result){
                res.status(400)
                throw new Error ("'Id' não encontrado.")
            }
        }
        
       res.status(200).send(result)
       
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  
})


//GetUserPurchasesByUserId

app.get("/users/:id/purchases", (req: Request, res: Response) => {

        try {
            const id = req.params.id
            const result = purchases.find((purchase) => purchase.userId === id)
    
            if(typeof id !== "string"){
                res.status(400)
                throw new Error("O userId deve ser uma string");
            }
    
            if(id !== undefined){
    
                if(!result){
                    res.status(400)
                    throw new Error ("'Id' não encontrado.")
                }
            }
    
            res.status(200).send(result)
    
        } catch (error:any) {
            console.log(error)
    
            if(res.statusCode === 200){
                res.status(500)
            }
            res.send(error.message)
        }  
})
    


//DeleteUserById

app.delete("/user/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id as string
        const userIndex = users.findIndex((user) => user.id === id)
        
        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string");
        }

        if(id !== undefined){

            if(userIndex >= 0) {
                users.splice(userIndex,1)
                res.status(200).send("Item deletado com sucesso")
        }
        }

    res.status(404).send("Item não encontrado")
        
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }  
})

//DeleteProductById

app.delete("/product/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const productIndex = products.findIndex((product) => product.id === id) 

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string");
        }

        if(id !== undefined){

            if(productIndex >= 0) {
                products.splice(productIndex,1)
                res.status(200).send("Item deletado com sucesso")
            }
        }
      
    res.status(404).send("Item não encontrado")
        
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }   
})


//EditUserById

app.put("/user/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id 

        const newEmail = req.body.email 
        const newPassword = req.body.password 

        if(typeof newEmail !== "string"){
            res.status(400)
            throw new Error("Email deve ser uma string");
        }

        if(typeof newPassword !== "string"){
            res.status(400)
            throw new Error("Email deve ser uma string");
        }

        if(users !== undefined) {

            const user = users.find((user) => user.id === id)
            
            if (user){
                user.email = newEmail || user.id
                user.password = newPassword || user.password

                res.status(200).send("Item editado com sucesso")
            }
        }

    res.status(404).send("Id não encontrado")
    
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }    
})




//EditProductById

app.put("/product/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id 

        const newName = req.body.name 
        const newPrice = req.body.price  
        const newCategory = req.body.category 

        if(typeof newName !== "string"){
            res.status(400)
            throw new Error("Email deve ser uma string");
        }

        if(typeof newPrice !== "number"){
            res.status(400)
            throw new Error("'Price' deve ser um número");
        }

        if(newCategory !== Categorys.ACCESSORIES &&
        newCategory !== Categorys.CLOTHES_AND_SHOES &&
        newCategory !== Categorys.ELECTRONICS){
            res.status(400)
            throw new Error("A Categoria só deve ser 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'");
        }


        if(id !== undefined){

            const product = products.find((product) => product.id === id) 

            if (product){
                product.name = newName || product.name
                product.price = isNaN(newPrice) ? product.price : newPrice
                product.category = newCategory || product.category

                res.status(200).send("Item editado com sucesso")
            }
        }
        
        res.status(404).send("Id não encontrado")
        
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }    
})