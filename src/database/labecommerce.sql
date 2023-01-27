-- Active: 1673886148608@@127.0.0.1@3306

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

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer = users.id;
















