CREATE DATABASE recetas_db;
USE recetas_db;
CREATE TABLE recetas(
id int auto_increment primary key,
nombre varchar(40),
ingredientes varchar(1000),
instrucciones longtext
)