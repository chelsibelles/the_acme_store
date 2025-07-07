const {
  client,
  createTables,
  createUser,
  createProduct,
} = require("./server/db");

async function seed() {
  try {
    await client.connect();
    console.log("Connected to DB");

    await createTables();
    console.log("Tables created");

    const user1 = await createUser({
      username: "alice",
      password: "password1",
    });
    const user2 = await createUser({
      username: "bob",
      password: "password2",
    });
    console.log("Users created:", user1, user2);

    const product1 = await createProduct({ name: "Widget" });
    const product2 = await createProduct({ name: "Gadget" });
    const product3 = await createProduct({ name: "Thingamajig" });
    console.log("Products created:", product1, product2, product3);

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await client.end();
    console.log("Disconnected from DB");
  }
}

seed();
