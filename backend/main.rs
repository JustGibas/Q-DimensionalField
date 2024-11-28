/**
 * This file sets up the Oak application, configures middleware, and defines routes.
 * The application listens on a specified port and handles incoming HTTP requests.
 * 
 * Configuration options:
 * - Application: The Oak application instance.
 * - Router: The Oak router instance.
 * - userRouter: The router for user-related routes.
 * - productRouter: The router for product-related routes.
 * - authMiddleware: The middleware for handling authentication.
 * - errorMiddleware: The middleware for handling errors.
 * - PORT: The port number on which the server listens.
 */

use actix_web::{web, App, HttpServer, Responder};
use actix_web::middleware::{Logger, ErrorHandlers};
use actix_web::web::Json;
use serde::Deserialize;
use std::env;

#[derive(Deserialize)]
struct User {
    id: String,
    name: String,
    email: String,
}

#[derive(Deserialize)]
struct Product {
    id: String,
    name: String,
    price: f64,
}

async fn get_user(user: web::Path<String>) -> impl Responder {
    // Implement the logic to get a user by ID
    format!("User ID: {}", user)
}

async fn get_product(product: web::Path<String>) -> impl Responder {
    // Implement the logic to get a product by ID
    format!("Product ID: {}", product)
}

async fn add_user(user: Json<User>) -> impl Responder {
    // Implement the logic to add a new user
    format!("Added user: {}", user.name)
}

async fn add_product(product: Json<Product>) -> impl Responder {
    // Implement the logic to add a new product
    format!("Added product: {}", product.name)
}

async fn update_user(user: web::Path<String>, updated_user: Json<User>) -> impl Responder {
    // Implement the logic to update an existing user
    format!("Updated user: {}", user)
}

async fn update_product(product: web::Path<String>, updated_product: Json<Product>) -> impl Responder {
    // Implement the logic to update an existing product
    format!("Updated product: {}", product)
}

async fn delete_user(user: web::Path<String>) -> impl Responder {
    // Implement the logic to delete a user by ID
    format!("Deleted user: {}", user)
}

async fn delete_product(product: web::Path<String>) -> impl Responder {
    // Implement the logic to delete a product by ID
    format!("Deleted product: {}", product)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .wrap(ErrorHandlers::default())
            .route("/users/{id}", web::get().to(get_user))
            .route("/products/{id}", web::get().to(get_product))
            .route("/users", web::post().to(add_user))
            .route("/products", web::post().to(add_product))
            .route("/users/{id}", web::put().to(update_user))
            .route("/products/{id}", web::put().to(update_product))
            .route("/users/{id}", web::delete().to(delete_user))
            .route("/products/{id}", web::delete().to(delete_product))
    })
    .bind("0.0.0.0:8000")?
    .run()
    .await
}
