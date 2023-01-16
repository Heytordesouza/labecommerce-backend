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
('05','Geladeira',1800,'Eletrodoméstico');

SELECT * FROM products;

DROP TABLE products;





