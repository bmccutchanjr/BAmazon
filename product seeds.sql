use bamazon;

insert into products (product, department, price, quantity)
values ("paper", "office supplies", 2.5, 20),
       ("pencils", "office supplies", 1.25, 25),
       ("pants", "clothes", 35.0, 15),
       ("socks", "clothes", 4.5, 20),
       ("shirts", "clothes", 20.0, 25),
       ("shoes", "clothes", 45.0, 20),
       ("laptop", "electronics", 555, 5),
       ("iphone", "electronics", 700, 5),
       ("fit bit", "electronics", 75, 5),
       ("ear buds", "electronics", 5, 25),
       ("aspirin", "health", 5, 50);

select * from products;
