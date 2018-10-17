// Implements the "supervisor" functions for bAmazon.

const chalk = require("chalk");
const inquirer = require("inquirer");
const mysql = require("mysql");
const connection = mysql.createConnection (
{   host:      "localhost",
    user:       "root",
    password:   "root",
    database:  "bamazon"
});

function profitStatement (query)
{   // The "supervisor" function to inquire profitability
    
    var query = "select d.department, d.overhead, sum(p.sales) as total_sales, sum(p.sales) - overhead as total_profit " +
                "from departments d " +
                "left join products p on d.department = p.department " +
                "group by department;";
    
    connection.query (query, function (error, results)
    {   if (error) throw error;

        var rLength = results.length;
    
        console.log ("department".padEnd(25),
                     "overhead".padEnd (15),
                     "total sales".padEnd(15),
                     "total profit");

        for (var i=0; i<rLength; i++)
        {   console.log (results[i].department.padEnd(25),
                         results[i].overhead.toString().padEnd(15),
                         results[i].total_sales ? results[i].total_sales.toString().padEnd(15) : "               ",
                         results[i].total_profit ? results[i].total_profit.toString().padEnd(10) : " ");
        }
    });
}

function newDepartment ()
{   // Allows "supervisors" to insert departments

    inquirer
    .prompt (
    [   {   name:       "department",
            type:       "input",
            message:    "Name of the new department",
        },
        {   name:       "overhead",
            type:       "input",
            message:    "Department overhead",
            validate:   function (overhead)
            {   if (!overhead)
                {   console.log (chalk.red("\nMust enter a quantity\n"));
                    return false;
                }
                if (isNaN (overhead))
                {   console.log (chalk.red("\nOverhead must be an integer"));
                    return false;
                }
                if (overhead<=0)
                {   console.log (chalk.red("\nOverheaad must not be greater than 0"));
                    return false;
                }
                return true;
            }
        }
    ])
    .then (function (answer)
    {   // finally insert the new product into the database

        var department = answer.department;
console.log ("department: ", answer.department);
console.log ("overhead: ", answer.overhead);
        connection.query ("insert into departments (department, overhead) values('" +
                          answer.department + "', " +
                          answer.overhead + ");",
        function (error, result)
        {   if (error) throw error;

            console.log (chalk.green("New department ", department, " added."));
        }) 
    })
}

function supervisor ()
{   var allowedActions = [  "View product sales by department",
                            "Create new dapartment"
                         ];

    inquirer
    .prompt (
    {   name:   "action",
        type:   "list",
        message:    "Select an action to perform",
        choices:    allowedActions
    })
    .then (function (answer)
    {   console.log ("\n==============================\nbAmazon!\nSupervisor Functions\n------------------------------\n");

        switch (answer.action)
        {   case "View product sales by department":
            {   console.log ("\nView product sales by department\n")
                profitStatement ()
                
                break;
            }
            case "Create new dapartment":
            {   console.log ("\nCreate new dapartment\n")
                newDepartment ();

                break;
            }
        }
    })
    .catch (function (error)
    {   console.log ("An error occured");
        throw error;
    })
}

supervisor();