# bAmazon

bAmazon is a NodeJS application utilising MySQL.  It is implemented as three stand-alone modules (`customer.js`, `manager.js` and `supervisor.js`) simulating customer and management functionality of an on-line store.  Each of the modules use the well-known modules `inquirer` to interact with the user and `mysql` to interact with a simple MySQL database.

Because this is a command line application, there is no web page to link to.  But I do have a [video on Google Drive](https://drive.google.com/file/d/1svFBwxUiMarvr9xwfNUmFmG9upzF5xrZ/view) that you can view. 

Feel free to clone it (or fork, if you prefer) to test it.  There are a few dependenciesm so be sure to run `npm install` before running any of the modules.  You'll find the database schema in `schema.sql` and two seed files are provided to load initial data.

## customer.js

`customer.js` uses select and update queries to access and modify a database simulating a customer purchase.

## manager.js

`manager.js` uses select, insert and update queries to modify the database allowing a user to perform several queries, adjust inventory and add additional products.

## supervisor.js

`supervisor.js` implements two functions.  The first joins two tables to retrieve performance statistics.

```
select d.department,
       d.overhead,
       sum(p.sales) as total_sales,
       sum(p.sales) - overhead as total_profit
from departments d 
left join products p on d.department = p.department
group by department;
```
Produces [this output](![grab1](https://user-images.githubusercontent.com/37744208/47331283-81985180-d649-11e8-8e9f-d95f9b5ba19c.png)
) on the console screen using `console.table`.

The second allows the user to update the `departments` table.

