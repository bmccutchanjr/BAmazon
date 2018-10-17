drop database if exists bAmazon;
create database bAmazon;
use bAmazon;

create table products
(   id          int         not null
                            auto_increment
                            unique,

    product     varchar(20)     not null,

    department  varchar(20)     not null,

    price       float (5,2)     default 1.0,

    quantity    smallint(6)     default 0,

    sales       float (8,2)     default 0,

    primary key (id)
);

create table departments
(   id          int         not null
                            auto_increment
                            unique,
                            
    department  varchar(20) not null,
    
    overhead    smallint(5) not null,
    
    primary key (id)
);
