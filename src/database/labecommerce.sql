-- Active: 1673886148608@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (id,email,password)
VALUES ('01','janaina@email.com','calor123'),
('02','tuninho@email.com','frio123'),
('03','chegadebananinha@email.com','chegadepokemons');

SELECT * FROM users; 

DROP TABLE users;

--Create User
INSERT INTO users (id,email,password)
VALUES ('04','verao@email.com','quente123');

--Delete User by id
DELETE FROM users
WHERE id = '04';

--Edit User by id
UPDATE users
SET password = 'neve123'
WHERE id = '02';

--Get All Users ordenando pelo email de forma crescente
SELECT * FROM users
ORDER BY email ASC;



CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

INSERT INTO products (id,name,price,category)
VALUES ('01','Blusa',30,'Moda'),
('02','Relógio',120,'Acessórios'),
('03','Boné',20,'Acessórios'),
('04','Tênis',100,'Calçados'),
('05','Monitor',1000,'Eletroeletrônico');

SELECT * FROM products;

DROP TABLE products;


--Search Product by name
SELECT * FROM products
WHERE name LIKE '%Monitor';

--Create Product
INSERT INTO products (id,name,price,category)
VALUES ('06','Teclado',90,'Informática');

--Get Products by id
SELECT * FROM products
WHERE id = '04';

--Delete Products by id
DELETE FROM products
WHERE id = '06';

--Edit Products by id
UPDATE products
SET price = 900
WHERE id = '05';

--Get All Products versão 1
--retorna o resultado ordenado pela coluna price em ordem crescente
--limite o resultado em 20 iniciando pelo primeiro item

SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;


--Get All Products versão 2
--mocke um intervalo de preços, por exemplo entre 100.00 e 300.00
--retorna os produtos com preços dentro do intervalo mockado em ordem crescente

SELECT * FROM products
WHERE price >= 100 AND price <=120
ORDER BY price ASC;


-- Exercicios SQL I

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT NULL,
    buyed_id TEXT NOT NULL,
    FOREIGN KEY (buyed_id) REFERENCES users(id)
);

INSERT INTO purchases (id, total_price, paid, delivered_at, buyed_id)
VALUES 
('01', '500', '0', NULL, '02'),
('02', '900', '1', NULL, '01'),
('03', '800', '1', NULL, '02'),
('04', '200', '0', NULL, '01');

UPDATE purchases
SET delivered_at = '18/01/2019'
WHERE id = '02';

UPDATE purchases
SET delivered_at = '18/01/2019'
WHERE id = '03';


SELECT * FROM purchases;

DROP TABLE purchases;

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyed_id = users.id;
