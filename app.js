const express = require("express");
const app = express();
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const path = require("path");
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB error :${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
//     SCENARIO 1
app.get("/todos/", async (request, response) => {
  let { status, priority, search_q } = request.query;
  if (status != undefined) {
    console.log(status);

    const sqlQuery = `
  SELECT *
  FROM todo
  WHERE
    status LIKE '${status}';`;

    const list = await db.all(sqlQuery);
    response.send(list);
  }
  //     SCENARIO 2
  else if (priority != undefined) {
    console.log(priority);

    const sqlQuery = `
  SELECT * 
  FROM todo
  WHERE 
    priority LIKE '%${priority}%';`;

    const list = await db.all(sqlQuery);
    response.send(list);
  }
  //     SCENARIO 3
  else if (priority != undefined && status != undefined) {
    console.log(priority);
    console.log(status);

    const sqlQuery = `
  SELECT * 
  FROM todo
  WHERE 
    priority LIKE '%${priority}%;`;

    const list = await db.all(sqlQuery);
    response.send(list);
  }
  //     SCENARIO 4
  else if (search_q != undefined) {
    console.log(search_q);

    const sqlQuery = `
  SELECT * 
  FROM todo
  WHERE 
    todo LIKE '%${search_q}%';`;

    const list = await db.all(sqlQuery);
    response.send(list);
  }
});

//API 2

app.get("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;

  console.log(todoId);

  const sqlQuery = `
  SELECT *
  FROM todo
  WHERE
    id LIKE ${todoId};`;

  const list = await db.get(sqlQuery);
  response.send(list);
});

//API 3
app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;

  const sqlQuery = `
    INSERT INTO todo (id, todo, priority, status)
    VALUES (${id}, '${todo}', '${priority}', '${status}');`;

  const updatingList = await db.run(sqlQuery);
  response.send("Todo Successfully Added");
});

//API 4
app.put("/todos/:todoId/", async (request, response) => {
  let { todoId } = request.params;
  console.log(todoId);
  const { todo, priority, status } = request.body;
  console.log(todo, priority, status);
  //scenario 1
  if (status != undefined) {
    const query = `
      UPDATE todo 
      SET 
        status='${status}'
    WHERE 
        id = ${todoId};`;
    await db.run(query);
    response.send("Status Updated");
  }
  //scenario 2
  else if (priority != undefined) {
    const query = `
      UPDATE todo 
      SET 
        priority='${priority}'
     WHERE 
        id = ${todoId};`;
    await db.run(query);
    response.send("Priority Updated");
  }
  //scenario 3
  else if (todo != undefined) {
    const query = `
      UPDATE todo 
      SET 
        todo='${todo}'
     WHERE 
        id = ${todoId};`;
    await db.run(query);
    response.send("Todo Updated");
  }
});

//API 5
app.delete("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  console.log(todoId);

  const sqlQuery = `
    DELETE FROM todo 
    WHERE id = ${todoId};`;

  await db.run(sqlQuery);
  response.send("Todo Deleted");
});

module.exports = app;
