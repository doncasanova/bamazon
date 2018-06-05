var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3206,
  user: "root",
  password: "root",
  database: "bamazon_db",

});

function getProductsByName() {
  connection.query("SELECT * FROM products", function (err, res) {
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].products_name);
            }
            return choiceArray
          },
          message: "What are you looking for?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many woud you like?"
        }
      ])
      .then(function (answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].products_name === answer.choice) {
            chosenItem = res[i];
          }
        }

        var totalQuantity = parseInt(answer.quantity)
        var productInStock = chosenItem.stock_quantity

        if (chosenItem.stock_quantity >= totalQuantity) {
          console.log('your item:  ' + answer.choice)
          console.log('your total due: ' + chosenItem.price * totalQuantity)
          // update product quantities 
          var updateQuantity = productInStock - totalQuantity

          updateProductQuantity(updateQuantity, answer.choice)
        } else {
          console.log('Sorry we only have ' + chosenItem.stock_quantity + ' in stock. ')
        }
        connection.end();
      });
  });
}


getProductsByName()

//-----------------------------------------------------------------------------------
//example
// var updateQuantity = 10;
// var productName = "rawhide bone";


function updateProductQuantity(updateQuantity, productName) {
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: updateQuantity
      },
      {
        products_name: productName
      }
    ],

  );
  // connection.end();
}
// updateProduct(updateQuantity, productName)