var mysql = require("mysql");
var inq = require("inquirer");

var conn = mysql.createConnection({
    host: "localhost",
    port: 0000,
    user: "root",
    password: "",
    database: "store"
})

function sendover(){
    conn.connect((err) => {
        if (err) throw err;
        start();
    })
}

function start(){
    inq.prompt([
        {
            type: "list",
            name: "option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then((res) => {
            switch(res.option){
                case "View Products for Sale":
                    viewItems();
                    break;
                case "View Low Inventory":
                    viewLow()
                    break;
                case "Add to Inventory":
                    addToLow();
                    break;
                case "Add New Product":
                    postItem();
                    break;
                default: break;
            }
    })
}

sendover();

function viewItems(){
    conn.query("SELECT * FROM bitems", (err, data) => {
        if (err) throw err;
        console.log("---------------\n");
        console.log("ID | NAME | DEPARTMENT | PRICE | QUANTITY ")
        for ( e in data ){
            console.log(`${data[e].itemID} | ${data[e].itemName} | ${data[e].dept} | ${data[e].price} | ${data[e].quantity}`);
        }
        console.log("\n---------------");
        start();
    })
}

function viewLow(){
    conn.query("select * from bitems where quantity < 6", (err, data) => {
        if (err) throw err;
        if (data.length == 0){
            console.log("\n You have no items that are low in quantity \n ");
            start();
        } else {
            console.log("---------------\n");
            console.log("ID | NAME | DEPARTMENT | PRICE | QUANTITY ");
            for ( e in data ){
                console.log(`${data[e].itemID} | ${data[e].itemName} | ${data[e].dept} | ${data[e].price} | ${data[e].quantity}`);
            }
            console.log("\n---------------");
            start();
        }
    })
}

function addToLow(){
    inq.prompt([
        {
            type: "confirm",
            name: "low",
            message: "Do you wish to see what items are low in quantity?"
        }
    ]).then((res) => {
        if (!res.low){
            inq.prompt([
                {
                    name: "id",
                    message: "Do you have the item ID?"
                }
            ]).then((res2) => {
                if (res2.id){
                    nextAdd();
                } else {
                    viewItems();
                }
            })
        } else {
            viewLow();
        }
    })
}

function nextAdd(){
    inq.prompt([
        {
            type: "number",
            name: "id",
            message: "What is the ID number?"
        },
        {
            type: "number",
            name: "amount",
            message: "How much more would you like to add?"
        }
    ]).then((res) => {
        if (isNaN(res.id)) {
            console.log("Please enter a valid ID");
            nextAdd();
        } else if (isNaN(res.amount)) {
            console.log("Please enter a valid amount");
            nextAdd();
        } else {
            var id = parseInt(res.id);
            var amount = parseInt(res.amount);
            conn.query(`SELECT * FROM bitems WHERE itemID = ${id}`, (err, data) => {
                if (err) throw err;
                nextAddTwo(id, amount, data[0].quantity);
            })
        }
    })
}

function nextAddTwo(id, amount, quan){
    var both = amount + quan;
    conn.query(`UPDATE bitems SET quantity = ${both} WHERE itemID = ${id}`, (err, data) => {
        console.log("\n\ Quantity was updated \n")
        start();
    })
}