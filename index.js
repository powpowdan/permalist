import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "password",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
  { id: 3, title: "studyhard" }
];

app.get("/", async(req, res) => {
 //define items from the database
 try {
  const result = await db.query('SELECT * FROM items ORDER BY id ASC');  
   items = result.rows
} catch (err) {
  console.error('Error fetching todos:', err);
  res.status(500).json({ error: 'An error occurred while fetching todos.' });
}
  res.render("index.ejs", { 
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem; 
  try {
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]);  
  } catch (err) {
    console.error('Error inserting new item:', err); 
    res.status(500).json({ error: 'An error occurred while adding the item.' });
  }
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
//get the body input.
//db statement to update
//redirect 
const item = req.body.updatedItemId; 
const newTxt = req.body.updatedItemTitle; 
try {
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [newTxt, item]); 
} catch (err) {
  console.error('Error updating item:', err); 
  res.status(500).json({ error: 'An error occurred while updating the item.' });
}
res.redirect("/");


});

app.post("/delete", async (req, res) => { 
let itemid = req.body.deleteItemId
console.log("item id is " + itemid );
try {
  await db.query("DELETE FROM items WHERE id = $1", [itemid]);
  res.redirect("/");
} catch (err) {
  console.log("did not work: "+err);
} 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
