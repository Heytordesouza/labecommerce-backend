import express, { Request, Response } from 'express'
import cors from 'cors'

import { users, products, purchases } from './database'
import { TUser, TProduct, TPurchase, Descriptions, TPurchasesProducts, TProductsInPurchase } from './types'
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

    // await db ("purchases")
    //         .select("purchases.id AS purchaseID", 

      const result = await db("users")
      .select("users.id", "users.name", "users.email", "users.password", "users.created_at AS createdAt")

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

    res.status(201).send({message: "Cadastro realizado com sucesso"})

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
        const {id, name, price, description, imageUrl} = req.body 

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
            throw new Error("A Descrição só deve ser 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'");
        }

        if(typeof imageUrl !== "string"){
            res.status(400)
            throw new Error("O link da imagem deve ser uma string");
        }

        const newProduct = {
            id,
            name,
            price,
            description,
            imageUrl
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

    await db("products").insert({id, name, price, description, image_url: imageUrl})

    // products.push(newProduct)

    res.status(201).send({message: "Produto cadastrado com sucesso"})
    
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


//Get All Products Funcionalidade 1 e 2
app.get('/products', async(req: Request, res: Response) => {
    try {
    //  const result = await db.raw(`SELECT * FROM products`)

    const searchTerm = req.query.q as string | undefined

    if (searchTerm === undefined) {
        const result = await db("products")
        .select("products.id", "products.name", "products.price", "products.description", "products.image_url AS imageUrl")
        res.status(200).send(result)
    } else {
        const result = await db("products")
        .select("products.id", "products.name", "products.price", "products.description", "products.image_url AS imageUrl")
        .where("name", "LIKE", `%${searchTerm}%`)
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



//EditProductById
app.put("/products/:id", async (req: Request, res: Response) => {

    try {

        const id = req.params.id 

        const newId = req.body.id
        const newName = req.body.name 
        const newPrice = req.body.price  
        const newDescription= req.body.description
        const newImageUrl= req.body.imageUrl

        if(typeof newId !== "string"){
            res.status(400)
            throw new Error("O id deve ser uma string");
        }

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

        if(typeof newImageUrl !== "string"){
            res.status(400)
            throw new Error("A imageUrl deve ser uma string");
        }


        const [ product ]: TProduct[] | undefined[] = await db("products").where({ id: id })


        if(!product){
            res.status(404)
            throw new Error("'id' não encontrada")
        }


        const newProduct: TProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: isNaN(newPrice) ? product.price : newPrice,
            description: newDescription|| product.description,
            image_url: newImageUrl || product.image_url 
        }

        await db("products").update(newProduct).where({ id: id })

        res.status(200).send({message: "Produto atualizado com sucesso"})
            
    } catch (error:any) {
        console.log(error)

        if(res.statusCode === 200){
            res.status(500)
        }
        res.send(error.message)
    }    
})


//Create Purchase
app.post('/purchases', async (req: Request, res: Response) => {

    try {
        const {id, totalPrice, buyer, products} = req.body 

        const [filterUser]:TUser[] | undefined[] = await db("users").where({id:buyer})

        if (id !== undefined){
            if(typeof id !== "string"){
                res.status(400)
                throw new Error("O id deve ser uma string.");
            }
        } else {
            res.status(400);
            throw new Error ("Favor, inserir id.");
        }


        if (totalPrice !== undefined){
            if(typeof totalPrice !== "number"){
                res.status(400)
                throw new Error("O totalPrice deve ser um número");
            }
        } else {
            res.status(400);
            throw new Error ("Valor final da compra não informado.");
        }
        
        // if (paid !== undefined){
        //     if (typeof paid !== "number"){
        //         res.status(400);
        //         throw new Error ("Confirmação de compra inválido! Favor, informar um numero.");
        //     }

        // } else {
        //     res.status(400);
        //     throw new Error ("Confirmação de compra não informado.");
        // }


        if (buyer === undefined){
            res.status(400);
            throw new Error ("Id de cliente não informado.");
        }


        if (products[0].id !== undefined){
            if (typeof products[0].id !== "string"){
                res.status(400);
                throw new Error ("'id' de produto inválido! Favor, informar uma string.");
            }

        } else {
            res.status(400);
            throw new Error ("'id' de produto não informado.");
        }


        if (products[0].quantity !== undefined){
            if (typeof products[0].quantity !== "number"){
                res.status(400);
                throw new Error ("Quantidade de produtos inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error ("Valor final da compra não informado.");
        }


        if(!filterUser){
            res.status(400);
            throw new Error ("Id de cliente não existe.");
        }

        const newPurchase: TPurchase = {
            id,  
            total_price: totalPrice,
            buyer
        }

        const newPurchasesProducts:TPurchasesProducts={
            purchase_id:id, 
            product_id: products[0].id,
            quantity: products[0].quantity,
        }

        await db("purchases").insert(newPurchase)
        await db("purchases_products").insert(newPurchasesProducts)
	
	    res.status(201).send({message: "Pedido realizado com sucesso"});
    
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


//Delete purchase by id
app.delete("/purchases/:id", async (req: Request, res: Response) => {
    try {
        const idToDelete = req.params.id


        const [ purchaseIdAlreadyExists ]: TPurchase[] | undefined[] = await db("purchases").where({ id: idToDelete })

        if (!purchaseIdAlreadyExists) {
            res.status(404)
            throw new Error("'id' não encontrado")
        }

        await db("purchases").del().where({ id: idToDelete })

        res.status(200).send({ message: "Pedido cancelado com sucesso" })

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


// //Get Purchase by id

// app.get('/purchases/:id', async (req: Request, res: Response) => {
//     try {
//         const idToPurchase = req.params.id

//         if(!idToPurchase){
//             res.status(400)
//             throw new Error("É necessário informar um id")
//         }

//         const [purchase] = await db("purchases").where({id: idToPurchase})

//         if(!purchase){
//             res.status(404)
//             throw new Error("'id' não encontrada")
//         } 
//         // SELECT * FROM purchases
//         // INNER JOIN users
//         // ON purchases.buyed_id = users.id;
//         if(purchase){

//             const cart = await db ("purchases")
//             .select("purchases.id AS purchaseID", 
//             "purchases.total_price",
//             "purchases.paid AS isPaid",
//             "purchases.createdAt",
//             "purchases.buyed_id",
//             "users.name", 
//             "users.email")
//             .innerJoin("users","purchases.buyed_id","=","users.id")
//             .where({purchaseID: idToPurchase})

//             const purchasesProducts = await db("purchases_products")
//             .select("purchases_products.product_id AS purchases_productsId",
//             "products.name",
//             "products.price",
//             "products.description",
//             "products.image_url",
//             "purchases_products.quantity")
//             .innerJoin("products","products.id","=","purchases_productsId")
//             .where({purchases_productsId: idToPurchase})

//             const result = {...cart, productsList:purchasesProducts}
//             res.status(200).send(result)
//         }

//     } catch (error) {
//         console.log(error)

//         if (req.statusCode === 200) {
//             res.status(500)
//         }

//         if (error instanceof Error) {
//             res.send(error.message)
//         } else {
//             res.send("Erro inesperado")
//         }
//     }

// })


// //Get Purchase by id
app.get('/purchase/:id', async(req:Request, res:Response)=>{
    try {

        const id = req.params.id

        const [purchase]:TPurchase[] = await db.select("purchases.*","users.name", "users.email")
        .from("purchases")
        .leftJoin("users","users.id","=","purchases.buyer")
        .where({"purchases.id":id})
        
        const products = await db.select("products.*", "purchases_products.quantity")
        .from("purchases_products")
        .leftJoin("products","purchases_products.product_id","=","products.id")
        .where({"purchases_products.purchase_id":id})

        const productsInPurchase:TProductsInPurchase[] =[{...purchase, products: products}]

        res.status(200).send(productsInPurchase)

        // const id = req.params.id

        // if(!id){
        //     res.status(400)
        //     throw new Error("É necessário informar um id")
        // }


        // const [purchase]:TPurchase[] = await db ("purchases")
        // .select("purchases.id AS purchaseID",
        // "purchases.buyer AS buyerId",
        // "users.name AS buyerName",
        // "users.email AS buyerEmail",
        // "purchases.total_price AS totalPrice",
        // "purchases.created_at AS createdAt",
        // "purchases.paid")
        // .from("purchases")
        // .leftJoin("users","users.id","=","purchases.buyer")
        // .where({"purchases.id":id})

        // if(!purchase){
        //     res.status(404)
        //     throw new Error("'id' não encontrada")
        // } 
        
        // const products = await db
        // .select(
        //     "products.id",
        //     "products.name",
        //     "products.price",
        //     "products.description",
        //     "products.image_url AS imageUrl", 
        //     "purchases_products.quantity")
        // .from("purchases_products")
        // .leftJoin("products","purchases_products.product_id","=","products.id")
        // .where({"purchases_products.purchase_id":id})

        // const productsInPurchase:TProductsInPurchase[] =[{...purchase, products: products}]

        // res.status(200).send(productsInPurchase)

    } catch (error) {
        console.log(error)

        if(res.statusCode === 200){
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