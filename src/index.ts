import express, { Request, Response } from 'express'
import cors from 'cors'

import { users, products, purchases } from './database'
import { TUser, TProduct, TPurchase, Descriptions } from './types'
import { db } from './database/knex'

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
app.get('/users', async (req: Request, res: Response) => {
    try{
    //   const result = await db.raw(`SELECT * FROM users`)

      const result = await db("users")

      res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



//Search Product by name
app.get("/products/search", async (req: Request, res: Response) => {

    try {

        const name = req.query.name

        // const [result] = await db.raw (`
        // SELECT * FROM products
        // WHERE name LIKE "%${name}%";
        // `)

        const [result] = await db("products").where("name", "LIKE", `%${name}%`);

        if (name.length < 1) {
            res.status(400)
            throw new Error("query deve possuir pelo menos um caractere")
        }

        if (result.length < 1) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    } 
})




//Get All Products
app.get('/products', async(req: Request, res: Response) => {
    try {
    //  const result = await db.raw(`SELECT * FROM products`)

      const result = await db("products")

      res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})






//Create User
app.post('/users', async(req: Request, res: Response) => {

    try {
        const {id, name, email, password} = req.body 

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O Id deve ser uma string");
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("O name deve ser uma string");
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
            name,
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

        if(newUser.name !== undefined){

            if(newUser.name.length === 0){
            res.status(400)
            throw new Error ("Digite um name")
            }
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

    // await db.raw(`
    //     INSERT INTO users(id, name, email, password)
    //     VALUES("${id}", "${name}", "${email}", "${password}")
    // `)

    await db("users").insert({id, name, email, password})
    
        // users.push(newUser)

    res.status(201).send("Usuário registrado com sucesso")

    } catch (error:any) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }  
})


//Create Product
app.post('/products', async (req: Request, res: Response) => {

    try {
        const {id, name, price, description, image_url} = req.body 

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

        if(description !== Descriptions.ACCESSORIES &&
           description !== Descriptions.CLOTHES_AND_SHOES &&
           description !== Descriptions.ELECTRONICS){
            res.status(400)
            throw new Error("A Categoria só deve ser 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'");
        }

        if(typeof image_url !== "string"){
            res.status(400)
            throw new Error("O link da imagem deve ser uma string");
        }

        const newProduct = {
            id,
            name,
            price,
            description,
            image_url
        }

        if(newProduct.id !== undefined){
            
            products.filter((product) => {
                if(newProduct.id === product.id){
                res.status(400)
                throw new Error ("'Id' inválido. Esse Id já existe, crie outro.")
            }})
        }

    // await db.raw(`
    // INSERT INTO products(id, name, price, description, image_url)
    // VALUES("${id}", "${name}", "${price}", "${description}", "${image_url}")
    // `)

    await db("products").insert({id, name, price, description, image_url})

    // products.push(newProduct)

    res.status(201).send("Cadastro registrado com sucesso")
    
    } catch (error:any) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }  
})


//Create Purchase
app.post('/purchases', async (req: Request, res: Response) => {

    try {
        const {id, total_price, paid, buyed_id} = req.body 

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("O id deve ser uma string");
        }

        if(typeof total_price !== "number"){
            res.status(400)
            throw new Error("O total_price deve ser um número");
        }

        if(paid >= 2){
            res.status(400)
            throw new Error("O paid deve ser o número 0 ou 1");
        }
        

        // if(typeof delivered_at !== "string"){
        //     res.status(400)
        //     throw new Error("A delivered_at deve ser uma string");
        // }

        if(typeof buyed_id !== "string"){
            res.status(400)
            throw new Error("O buyed_id deve ser uma string");
        }

        const newPurchases = {
            id, 
            total_price, 
            paid, 
            buyed_id
        }

        if(newPurchases.id !== undefined){

            const result = purchases.find((purchase) => newPurchases.id === purchase.id)
                
                if(result){
                res.status(400)
                throw new Error ("'Id' de purchases inválido. Esse purchase já existe.")
            }
        }
        

        // if(newPurchases.productId !== undefined){

        //     const result = products.find((product) => newPurchases.productId === product.id)
                
        //         if(!result){
        //         res.status(400)
        //         throw new Error ("'Id' de produto inválido. Esse produto não existe.")
        //     }
        // }

        // if(newPurchases.quantity && newPurchases.totalPrice !== undefined){

        //     products.filter((product) => {
        //         if(newPurchases.productId === product.id){
        //             if(product.price * newPurchases.quantity !== newPurchases.totalPrice){
        //                 res.status(400)
        //                 throw new Error ("Valor Total inválido. O Total está com valor errado, verifique a quantidade e o valor unitário.")
        //             }
                
        //     }})
        // }

        // await db.raw(`
        // INSERT INTO purchases (id, total_price, paid, buyed_id)
        // VALUES("${id}", "${total_price}", "${paid}", "${buyed_id}")
        // `)

        await db("purchases").insert({id, total_price, paid, buyed_id})

        // purchases.push(newPurchases)

        res.status(201).send("Cadastro registrado com sucesso")
    
    } catch (error:any) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }  
})


//Get All Purchases "Somente verificar"
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db("purchases")

        res.status(200).send(result)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Get Purchase by id

app.get('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const idToPurchase = req.params.id

        if(!idToPurchase){
            res.status(400)
            throw new Error("É necessário informar um id")
        }

        const [purchase] = await db("purchases").where({id: idToPurchase})

        if(!purchase){
            res.status(404)
            throw new Error("'id' não encontrada")
        } 
        // SELECT * FROM purchases
        // INNER JOIN users
        // ON purchases.buyed_id = users.id;
        if(purchase){

            const cart = await db ("purchases")
            .select("purchases.id AS purchaseID", 
            "purchases.total_price",
            "purchases.paid AS isPaid",
            "purchases.createdAt",
            "purchases.buyed_id",
            "users.name", 
            "users.email")
            .innerJoin("users","purchases.buyed_id","=","users.id")
            .where({purchaseID: idToPurchase})

            const purchasesProducts = await db("purchases_products")
            .select("purchases_products.product_id AS purchases_productsId",
            "products.name",
            "products.price",
            "products.description",
            "products.image_url",
            "purchases_products.quantity")
            .innerJoin("products","products.id","=","purchases_productsId")
            .where({purchases_productsId: idToPurchase})

            const result = {...cart, productsList:purchasesProducts}
            res.status(200).send(result)
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})


/////////////////////////////////////////


//GetProductsById
app.get("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        // const [result] = await db.raw (`
        // SELECT * FROM products
        // WHERE id = "${id}";
        // `)

        const [result] = await db("products").where({id: id})

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

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }  
})


//GetUserPurchasesByUserId

app.get("/users/:id/purchases", async (req: Request, res: Response) => {

        try {
            const id = req.params.id
            // const [result] = await db.raw (`
            // SELECT * FROM purchases
            // WHERE id = "${id}";
            // `)

            const [result] = await db("purchases").where({id: id})
    
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

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
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
        const newDescription= req.body.description

        if(typeof newName !== "string"){
            res.status(400)
            throw new Error("Email deve ser uma string");
        }

        if(typeof newPrice !== "number"){
            res.status(400)
            throw new Error("'Price' deve ser um número");
        }

        if(newDescription!== Descriptions.ACCESSORIES &&
        newDescription!== Descriptions.CLOTHES_AND_SHOES &&
        newDescription!== Descriptions.ELECTRONICS){
            res.status(400)
            throw new Error("A Categoria só deve ser 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'");
        }


        if(id !== undefined){

            const product = products.find((product) => product.id === id) 

            if (product){
                product.name = newName || product.name
                product.price = isNaN(newPrice) ? product.price : newPrice
                product.description= newDescription|| product.description

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