import express, { Request, Response } from 'express'
import cors from 'cors'

import { users, products, purchases } from './database'
import { TUser, TProduct, TPurchase } from './types'

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