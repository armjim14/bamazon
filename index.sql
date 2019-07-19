drop DATABASE if exists store;

create DATABASE store;

use store;

drop table if exists bitems;

create table bitems (
    itemID int auto_increment PRIMARY key not null,
    itemName VARCHAR(50) not null,
    dept VARCHAR(50) not NULL,
    price decimal(4,2) not null,
    quantity int(6) not null
);

insert into bitems (itemName, dept, price, quantity)
values ("name", "dept", 20.00, 10);

insert into bitems (itemName, dept, price, quantity)
values ("bike", "outdoors", 50, 20);