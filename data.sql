CREATE DATABASE recetas_db;

USE recetas_db;

CREATE TABLE recetas(
id int auto_increment primary key,
nombre varchar(40),
ingredientes varchar(1000),
instrucciones longtext
)

CREATE TABLE usuarios_db (
id int auto_increment primary key,
email varchar(100) unique,
nombre varchar(40),
password varchar(100) 
);