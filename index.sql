ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
SET SQL_SAFE_UPDATES = 0;

drop database store;

create database store;

use store;

drop table if exists items;

create table items (
    itemID int auto_increment PRIMARY key not null,
    itemName VARCHAR(50) not null,
    dept VARCHAR(50) not NULL,
    price decimal(4,2) not null,
    quantity int(6) not null,
    sale int(6) not null
);

insert into items (itemName, dept, price, quantity, sale)
values ("socks", "clothing", 9.99, 25, 0);