// Implements the "manager" functions for bAmazon.

const chalk = require("chalk");
const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection (
{   host:      "localhost",
    user:       "root",
    password:   "root",
    database:  "bamazon"
});

function performSelect (query)
{   connection.query (query, function (error, results)
    {   if (error) throw error;

        var rLength = results.length;
    
        console.log ("department".padEnd(25),
                     "product".padEnd (25),
                     "price".padEnd(10),
                     "qty available");

        for (var i=0; i<rLength; i++)
        {   console.log (results[i].product.padEnd (25),
                         results[i].department.padEnd(25),
                         results[i].price.toString().padEnd(10),
                         results[i].quantity);
        }

        connection.end();
    });
}

function adjustInventory ()
{   // Allows a "manager" to add to inventory

    connection.query ("select product from products order by product", function (error, results)
    {   // first get a list of products in the system
        
        if (error) throw error;
    
        var products = [];
        var rLength = results.length;
    
        for (var i=0; i<rLength; i++)
        {   products.push (results[i].product);
        }
    
        inquirer
        .prompt (
        [   {   name:       "product",
                type:       "list",
                message:    "Which product do you want to update?",
                choices:    products
            },
            {   name:       "quantity",
                type:       "input",
                message:    "Enter an adjustment quantity",
                validate:   function (quantity)
                {   if (!quantity)
                    {   console.log (chalk.red("\nMust enter a quantity\n"));
                        return false;
                    }
                    if (isNaN (quantity))
                    {   console.log (chalk.red("Quantity must be an integer\n"));
                        return false;
                    }
                    return true;
                }
            }
        ])
        .then (function (answer)
        {   // finally update the database
        
            var product = answer.product;

            // It appears the '?' syntax will not let me set a value with something like
            // 'quantity = quantity + 3' (which if you look into it is the MySQL recommended method because
            // it only requires one uppate rather than a select and an update.)  When I try something like
            // { quantity: "quantity + 3" } set quantity in the database to 0.  So I need to get the current
            // value of quantity so I can calculate the new value.

            connection.query ("select quantity from products where product = '" + answer.product + "';",
            {   product:    answer.product
            },
            function (err, response)
            {   if (err) throw err;

                var qty = parseInt(response[0].quantity) + parseInt(answer.quantity);

                connection.query ("update products set ? where ?",
                [   {   quantity: qty
                    },
                    {   product: product
                    }
                ],
                function (error, result)
                {   if (error) throw error;
            
                    console.log (chalk.green(product, " has been successfully updated"));
                    var query = "select * from products where product='" + product + "';";
                    performSelect (query)
                })
            })
        })
    })
}

function newProduct ()
{   // Allows "managers" to insert records in the product table representing new products

    inquirer
    .prompt (
    [   {   name:       "product",
            type:       "input",
            message:    "Enter a name for the new product",
        },
        {   name:       "department",
            type:       "input",
            message:    "What department stocks this item?",
        },
        {   name:       "quantity",
            type:       "input",
            message:    "Enter initial stock quantity",
            validate:   function (quantity)
            {   if (!quantity)
                {   console.log (chalk.red("\nMust enter a quantity\n"));
                    return false;
                }
                if (isNaN (quantity))
                {   console.log (chalk.red("\nQuantity must be an integer"));
                    return false;
                }
                if (quantity<0)
                {   console.log (chalk.red("\nQuantity must not be negative"));
                    return false;
                }
                return true;
            }
        },
        {   name:       "price",
            type:       "input",
            message:    "Enter a price",
            validate:   function (quantity)
            {   if (!quantity)
                {   console.log (chalk.red("\nMust enter a quantity\n"));
                    return false;
                }
                if (isNaN (quantity))
                {   console.log (chalk.red("\nQuantity must be a number"));
                    return false;
                }
                if (quantity<0)
                {   console.log (chalk.red("\nQuantity must not be negative"));
                    return false;
                }
                return true;
            }
        }
    ])
    .then (function (answer)
    {   // finally insert the new product into the database

        var product = answer.product;

        connection.query ("insert into products (product, department, quantity, price) values(?, ?, ?, ?);",
        [   answer.product, 
            answer.department,
            answer.quantity,
            answer.price
        ],
        function (error, result)
        {   if (error) throw error;

            console.log (chalk.green("New Product ", product, " added."));
            connection.end();
        }) 
    })
}

function manager ()
{   var allowedActions = [  "View products for sale",
                            "View low inventory",
                            "Add to inventory",
                            "Add new product"
                         ];

    inquirer
    .prompt (
    {   name:   "action",
        type:   "list",
        message:    "Select an action to perform",
        choices:    allowedActions
    })
    .then (function (answer)
    {   console.log ("\n==============================\nbAmazon!\nManager Functions\n------------------------------\n");

        switch (answer.action)
        {   case "View products for sale":
            {   console.log ("\nView products for sale\n")
                performSelect ("select * from products order by department, product;")
                
                break;
            }
            case "View low inventory":
            {   console.log ("\nView low inventory\n")
                performSelect ("select * from products where quantity < 5 order by department, product;");
                
                break;
            }
            case "Add to inventory":
            {   console.log ("\nAdd to inventory\n",
            "Add new product\n")
                adjustInventory();
                break;
            }
            case "Add new product":
            {   console.log ("\nAdd new product\n")
                newProduct ();
                break;
            }
        }
    })
    .catch (function (error)
    {   console.log ("An error occured");
        throw error;
    })
}

manager();