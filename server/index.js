const express = require("express");
const path = require("path");
const {
  client,
  createTables,
  createFavorite,
  fetchUsers,
  fetchFavorites,
  fetchProducts,
  destroyFavorite,
} = require("./db");

const server = express();

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to DB");

    await createTables();
    console.log("Tables created");

    server.use(express.json());

    // Serve frontend static files from public folder
    server.use(express.static(path.join(__dirname, "../public")));

    // API routes
    server.get("/api/users", async (req, res, next) => {
      try {
        const users = await fetchUsers();
        res.send(users);
      } catch (err) {
        next(err);
      }
    });

    server.get("/api/products", async (req, res, next) => {
      try {
        const products = await fetchProducts();
        res.send(products);
      } catch (err) {
        next(err);
      }
    });

    server.get("/api/users/:id/favorites", async (req, res, next) => {
      try {
        const favorites = await fetchFavorites({ user_id: req.params.id });
        res.send(favorites);
      } catch (err) {
        next(err);
      }
    });

    server.post("/api/users/:id/favorites", async (req, res, next) => {
      try {
        const favorite = await createFavorite({
          user_id: req.body.user,
          product_id: req.params.id,
        });
        res.status(201).send(favorite);
      } catch (err) {
        next(err);
      }
    });

    server.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
      try {
        await destroyFavorite({ id: req.params.id, user_id: req.params.userId });
        res.sendStatus(204);
      } catch (err) {
        next(err);
      }
    });

    // Error handler middleware
    server.use((err, req, res, next) => {
      res.status(err.status || 500).send({ error: err.message || err });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();
