# Blog Manager

## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/RishiSingh2510/pl-static-app-blog-manager.git
    cd pl-static-app-blog-manager
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the application:**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200/` in your browser to see the application.

## How to Run the Application

To run the application, use the Angular CLI command:
```bash
ng serve
```
This will start a development server and you can view the application by navigating to `http://localhost:4200/` in your web browser.

## Design Decisions and Application Structure

### Design Decisions

- **Modular Architecture:** The application is designed with a modular architecture to ensure scalability and maintainability.
- **Shared Services:** Services are shared across different components to promote reusability and reduce code duplication.
- **Interfaces:** TypeScript interfaces are used to define the structure of data models, ensuring type safety and consistency.
- **Pipes:** Custom pipes are implemented to handle data transformation and formatting within templates.

### Application Structure

- **src/app:** Contains the main application module and component files.
- **src/app/services:** Contains shared services used across the application.
- **src/app/interfaces:** Contains TypeScript interfaces for data models.
- **src/app/pipes:** Contains custom pipes for data transformation.
- **src/assets:** Contains static assets such as images and styles.

For more details, refer to the [repository](https://github.com/RishiSingh2510/pl-static-app-blog-manager.git).
