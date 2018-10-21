// simple node application that interacts with MySQL database, using inquirer to interact with the user

const chalk = require("chalk");
const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection (
{   host: "localhost",

    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon"
});

function placeOrder ()
{   connection.query ("select product, department, price, quantity from products order by product;", function (error, results)
    {   if (error) throw error;

        console.log ("\n==============================\nbAmazon!\nAvailable for purchase:\n------------------------------");

        var rLength = results.length;
        var products = [];

        for (var i=0; i<rLength; i++)
        {   console.log (results[i].product.padEnd (25),
                         results[i].department.padEnd(25),
                         "price: $", results[i].price.toString().padEnd(10),
                         "qty available: ", results[i].quantity);

            products.push (results[i].product);
        }

        var what2Buy = "";

        inquirer
        .prompt(
        {   name:   "purchase",
            type:   "list",
            message: "What would you like to buy?",
            choices: products
        })
        .then(function(answer)
        {   what2Buy = answer.purchase;

            inquirer
            .prompt (
            {   name:   "quantity",
                type:   "input",
                message: "How many " + what2Buy + "s do you want?"
            })
            .then(function(answer)
            {   var qty2Buy = answer.quantity;

                connection.query ("select quantity, price, sales from products where ?;",
                {   product: what2Buy
                }, function (error, results)
                {   if (error) throw error;

                    if (qty2Buy > results[0].quantity)
                    {   // Not enough product on hand.  Tell the customer about it and prompt for another
                        // order (Or maybe not.  The function logs several lines to the console and pushes this
                        // message off the screen.  May be better to just quit the application here?)

                        console.log (chalk.red("Sorry, we don't have ", qty2Buy, " ", what2Buy, " on hand."));
                        console.log (chalk.red("Unable to complete this transaction"));
                    
                        // placeOrder();
                    }
                    else
                    {   // Product is in stock.  "Complete" the purchase...
                        var cost = qty2Buy * results[0].price;

                        connection.query ("update products set ? where ?",
                        [   {   quantity: (results[0].quantity - qty2Buy),
                                sales: (results[0].sales + (qty2Buy * results[0].price))
                            },
                            {   product: what2Buy
                            }
                        ],  function (error, results)
                        {   if (error) throw error;
                        
                            if (qty2Buy > 1) what2Buy += "s";
                            console.log (chalk.green("Your purchase has been completed."));
                            console.log ("You bought ", qty2Buy, " ", what2Buy, " for $", cost)
                            console.log ("Thank you for your business");
                        })
                    }

                    connection.end();
                })
            })
        })
    })
};

placeOrder ();
