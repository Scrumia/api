/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "SecuritiesController.login");

Route.group(() => {
  Route.post("/logout", "SecuritiesController.logout");

  // Adventurers
  Route.get("/adventurers", "AdventurersController.index");
  Route.get("/adventurer/:adventurerId", "AdventurersController.getById");

  // Requests
  Route.get("/requests", "RequestsController.index");
  Route.post("/requests", "RequestsController.create");
  Route.get("/requests/:requestId", "RequestsController.requestId");
  Route.delete(
    "/requests/:requestId/adventurers/:adventurerId",
    "RequestsController.removeAdventurer"
  );

}).middleware("auth");
