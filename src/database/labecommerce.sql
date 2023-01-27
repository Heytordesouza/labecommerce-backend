-- Active: 1673886148608@@127.0.0.1@3306

-- CREATE TABLE users (
--     id TEXT PRIMARY KEY UNIQUE NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     password TEXT NOT NULL
-- );

-- INSERT INTO users (id,email,password)
-- VALUES ('01','janaina@email.com','calor123'),
-- ('02','tuninho@email.com','frio123'),
-- ('03','chegadebananinha@email.com','chegadepokemons');

-- SELECT * FROM users; 

-- DROP TABLE users;

-- --Create User
-- INSERT INTO users (id,email,password)
-- VALUES ('04','verao@email.com','quente123');

-- --Delete User by id
-- DELETE FROM users
-- WHERE id = '04';

-- --Edit User by id
-- UPDATE users
-- SET password = 'neve123'
-- WHERE id = '02';

-- --Get All Users ordenando pelo email de forma crescente
-- SELECT * FROM users
-- ORDER BY email ASC;



-- CREATE TABLE products (
--     id TEXT PRIMARY KEY UNIQUE NOT NULL,
--     name TEXT NOT NULL,
--     price REAL NOT NULL,
--     category TEXT NOT NULL
-- );

-- INSERT INTO products (id,name,price,category)
-- VALUES ('01','Blusa',30,'Moda'),
-- ('02','Relógio',120,'Acessórios'),
-- ('03','Boné',20,'Acessórios'),
-- ('04','Tênis',100,'Calçados'),
-- ('05','Monitor',1000,'Eletroeletrônico');

-- SELECT * FROM products;

-- DROP TABLE products;


-- --Search Product by name
-- SELECT * FROM products
-- WHERE name LIKE '%Monitor';

-- --Create Product
-- INSERT INTO products (id,name,price,category)
-- VALUES ('06','Teclado',90,'Informática');

-- --Get Products by id
-- SELECT * FROM products
-- WHERE id = '04';

-- --Delete Products by id
-- DELETE FROM products
-- WHERE id = '06';

-- --Edit Products by id
-- UPDATE products
-- SET price = 900
-- WHERE id = '05';

-- --Get All Products versão 1
-- --retorna o resultado ordenado pela coluna price em ordem crescente
-- --limite o resultado em 20 iniciando pelo primeiro item

-- SELECT * FROM products
-- ORDER BY price ASC
-- LIMIT 20 OFFSET 0;


-- --Get All Products versão 2
-- --mocke um intervalo de preços, por exemplo entre 100.00 e 300.00
-- --retorna os produtos com preços dentro do intervalo mockado em ordem crescente

-- SELECT * FROM products
-- WHERE price >= 100 AND price <=120
-- ORDER BY price ASC;


-- -- Exercicios SQL I

-- CREATE TABLE purchases (
--     id TEXT PRIMARY KEY UNIQUE NOT NULL,
--     total_price REAL NOT NULL,
--     paid INTEGER NOT NULL,
--     delivered_at TEXT NULL,
--     buyed_id TEXT NOT NULL,
--     FOREIGN KEY (buyed_id) REFERENCES users(id)
-- );

-- INSERT INTO purchases (id, total_price, paid, delivered_at, buyed_id)
-- VALUES 
-- ('01', '500', '0', NULL, '02'),
-- ('02', '900', '1', NULL, '01'),
-- ('03', '800', '1', NULL, '02'),
-- ('04', '1000', '0', NULL, '01');

-- UPDATE purchases
-- SET delivered_at = '18/01/2019'
-- WHERE id = '02';

-- UPDATE purchases
-- SET delivered_at = '18/01/2019'
-- WHERE id = '03';


-- SELECT * FROM purchases;

DROP TABLE users;

-- SELECT * FROM purchases
-- INNER JOIN users
-- ON purchases.buyed_id = users.id;




-- -- Exercicios SQL 2

-- CREATE TABLE purchases_products (
--     purchase_id TEXT NOT NULL,
--     product_id TEXT NOT NULL,
--     quantity INTEGER NOT NULL
-- );

-- INSERT INTO purchases_products (purchase_id, product_id, quantity)
-- VALUES 
-- ('03', '04', 8),
-- ('04', '03', 10),
-- ('01', '1000', 1);


-- SELECT * FROM purchases_products
-- INNER JOIN purchases
-- ON purchases_products.purchase_id = purchases.id;


-------------------------------------------------------------------
-------------------------------------------------------------------

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

INSERT INTO users (id,name,email,password)
VALUES ('01','Janaina','janaina@email.com','calor123'),
('02','Tuninho','tuninho@email.com','frio123'),
('03','Fabrício','fabricio@email.com','neve123'),
('04','Gabrielly','gabrielly@email.com','chuva123'),
('05','Thaís','thais@email.com','nublado123');

----------------------------

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL
);

INSERT INTO products (id,name,price,description,image_url)
VALUES ('01','Blusa',30,'Roupas e calçados','https://a-static.mlcdn.com.br/800x560/blusa-branca-unissex-de-poliester-fashion/michadeiguacu/323a2950c08f11eb81644201ac18500e/7c7c6b562541f7ad8569842c36fe8d2d.jpg'),
('02','Relógio',350,'Acessórios','https://m.media-amazon.com/images/I/61lGuSTY9DL._AC_SX522_.jpg'),
('03','Boné',20,'Acessórios','https://cdnsmarterapp.azureedge.net/public/1/image/padrao/neperbon036.webp'),
('04','Tênis',100,'Roupas e calçados','https://60398.cdn.simplo7.net/static/60398/sku/masculino-tenis-qix-full--p-1616792098974.jpg'),
('05','Monitor',1000,'Eletrônicos','https://m.media-amazon.com/images/I/41-543-JSgL._AC_.jpg');

---------------------------

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    buyer TEXT NOT NULL,
    FOREIGN KEY (buyer) REFERENCES users(id)
);

INSERT INTO purchases (id, total_price, paid, buyer)
VALUES 
('01', '500', '0', '02'),
('02', '900', '0', '03'),
('03', '1000', '0', '01'),
('04', '120', '0', '05'),
('05', '60', '0', '04');

----------------------------------------

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES 
('01', '04', 5),
('02', '02', 2),
('03', '05', 1),
('04', '01', 4),
('05', '03', 3);

SELECT * FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id;

-----------------------------------------------------------------------------------

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer = users.id;
















