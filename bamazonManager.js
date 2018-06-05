// addToInventory(updateQuantity, productName)


var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3206,
  user: "root",
  password: "root",
  database: "bamazon_db",

});

function getProductsForSale() {
  connection.query('SELECT * from products;',
    function (err, results) {
      if (err) throw err;
      console.log(results)
    });
  connection.end();
}

function viewLowInventory() {
  console.log('These items are below saftey stock levels ')
  var query = connection.query(
    "SELECT * FROM products WHERE stock_quantity <= 2",
    function (err, results) {
      if (err) throw err;
      console.log(results)
    });
  connection.end();
}

function addToInventory() {
  console.log('update the quantity of a product')
  inquirer
  .prompt([
    {
      name: "item",
      type: "input",
      message: "What is the product name?"
    },
    {
      name: "quantity",
      type: "input",
      message: "Increase the quantity by?",
    validate: function (value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }
])
.then(function (answer) {
  var query = connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE products_name = ?",
    [
      answer.quantity, answer.item
      
    ],
    function (err, results) {
      if (err) throw err;
      console.log(results)
    });
  connection.end();
});
}

function addNewProduct() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What is the product name?"
      },
      {
        name: "department",
        type: "input",
        message: "What department will sell this?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the price for this unit?"
      },
      {
        name: "quantity",
        type: "input",
        message: "Starting Quantity?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          item_id: 100010,
          products_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function (err) {
          if (err) throw err;
          console.log("Your product was created successfully!");
          // re-prompt the user for if they want to bid or post
        }
      );
      connection.end();
    });
}

// check box function for enduser to request a action
function checkBox() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "whatIwant",
        message: "What would you like to do??",
        choices: ["list-all-products", "check-low-inventory", "add-quantities-to-inventory", "add a new product"]
      }
    
    ]).then(function (inquirerResponse) {
      // If the inquirerResponse confirms, we display the inquirerResponse's username and pokemon from the answers.
      console.log("this is inquirers useful info " + inquirerResponse.whatIwant)

      switch (inquirerResponse.whatIwant) {
        case `list-all-products`:
          getProductsForSale();
          break;

        case `check-low-inventory`:
          viewLowInventory();
          break;

        case `add-quantities-to-inventory`:
          addToInventory()
          break;

        case `add a new product`:
          addNewProduct()
          break;
      }
    });
}

checkBox()