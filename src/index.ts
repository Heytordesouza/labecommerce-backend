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
    res.status(200).send(users)
})


//Get All Products
app.get('/products', (req: Request, res: Response) => {
    res.status(200).send(products)
})


//Search Product by name
app.get('/product/search', (req: Request, res: Response) => {
    const q = req.query.q as string

    const result = products.filter((product) => {
       return product.name.toLowerCase().includes(q.toLowerCase())

    })
    res.status(200).send(result)
})


//Create User
app.post('/users', (req: Request, res: Response) => {

    const {id, email, password} = req.body as TUser

    const newUser = {
        id,
        email,
        password
    }

    users.push(newUser)

    res.status(201).send("Cadastro registrado com sucesso")

})


//Create Product
app.post('/products', (req: Request, res: Response) => {

    const {id, name, price, category} = req.body as TProduct

    const newProduct = {
        id,
        name,
        price,
        category
    }

    products.push(newProduct)

    res.status(201).send("Cadastro registrado com sucesso")

})


//Create Purchase
app.post('/purchases', (req: Request, res: Response) => {

    const {userId, productId, quantity, totalPrice} = req.body as TPurchase

    const newPurchases = {
        userId,
        productId,
        quantity,
        totalPrice
    }

    purchases.push(newPurchases)

    res.status(201).send("Cadastro registrado com sucesso")

})


//Get All Purchases "Somente verificar"
app.get('/purchases', (req: Request, res: Response) => {
    res.status(200).send(purchases)
})

/////////////////////////////////////////


//GetProductsById
app.get("/products/:id", (req: Request, res: Response) => {

    const id = req.params.id

    const result = products.find((product) => {
        return product.id === id
    })

    res.status(200).send(result)
})


//GetUserPurchasesByUserId

app.get("/users/:id/purchases", (req: Request, res: Response) => {

    const id = req.params.id

    const result = purchases.find((purchase) => {
        return purchase.userId === id
    })

    res.status(200).send(result)
})


//DeleteUserById

app.delete("/user/:id", (req: Request, res: Response) => {

    const id = req.params.id as string

    const userIndex = users.findIndex((user) => {
        return user.id === id
    })
    
    if(userIndex >= 0) {
        users.splice(userIndex,1)
        res.status(200).send("Item deletado com sucesso")
    }

    res.status(404).send("Item não encontrado")
    
})

//DeleteProductById

app.delete("/product/:id", (req: Request, res: Response) => {

    const id = req.params.id as string

    const productIndex = products.findIndex((product) => {
        return product.id === id
    })
    
    if(productIndex >= 0) {
        products.splice(productIndex,1)
        res.status(200).send("Item deletado com sucesso")
    }

    res.status(404).send("Item não encontrado")
    
})


//EditUserById

app.put("/user/:id", (req: Request, res: Response) => {

    const id = req.params.id as string

    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as string | undefined

    const user = users.find((user) => {
        return user.id === id
    })

    if (user){
        user.email = newEmail || user.id
        user.password = newPassword || user.password
    }

    res.status(200).send("Item editado com sucesso")

})



//EditProductById

app.put("/product/:id", (req: Request, res: Response) => {

    const id = req.params.id as string

    const newName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as Categorys | undefined

    const product = products.find((product) => {
        return product.id === id
    })

    if (product){
        product.name = newName || product.name
        product.price = isNaN(newPrice) ? product.price : newPrice
        product.category = newCategory || product.category
    }

    res.status(200).send("Item editado com sucesso")

})