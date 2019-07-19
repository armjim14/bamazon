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
        getPerson();
    })
}

function getPerson(){
    console.log("\n Hello There \n")
    inq.prompt([
        {
            type: "list",
            name: "who",
            message: "what is your role?",
            choices: ["Customer", "Manager"]
        }
    ]).then((res) => {
        switch(res.who){
            case "Customer":
                start();
                break;
            case "Manager":
                start2();
                break;
            default: break;
        }
    })
}

function start(){
    inq.prompt([
        {
            type: "list",
            name: "option",
            choices: ["View Products for Sale", "Buy a Product", "Switch Role"]
        }
    ]).then((res) => {
        if ( res.option == "View Products for Sale" ){
            viewItems(1);
        } else if ( res.option == "Buy a Product" ) {
            buyItem();
        } else {
            getPerson();
        }
    })
}

function buyItem(){
    inq.prompt([
        {
            name: "id", 
            message: "Do you have the products ID?"
        }
    ]).then( (res) => {
        if (res.id){
            inq.prompt([
                {
                    name: "num",
                    message: "What is the products ID you wish to buy from?"
                },
                {
                    name: "amount",
                    message: "How many would you like to buy?"
                }
            ]).then( (res2) => {
                if ( isNaN(res2.num) ){
                    console.log("\n Please enter a valid ID \n");
                    buyItem();
                } else if ( isNaN(res2.amount) ){
                    console.log("\n Please enter a valid amount \n");
                    buyItem();
                } else {
                    var idd = parseInt(res2.num);
                    var amount = parseInt(res2.amount);
                    conn.query(`SELECT * FROM bitems WHERE itemID = ${idd}`, (err, data) => {
                        if (err) throw err;

                        if ( amount > data[0].quantity ){
                            console.log("\n Insufficient quantity! \n");
                            start();
                        } else {
                            buyFinal(idd, amount, data[0].quantity);
                        }
                    })
                }
            })
        } else {
            viewItems(1);
        }
    })
}

function buyFinal(id, am, qu){
    var both = qu - am;
    conn.query(`UPDATE bitems SET quantity = ${both} WHERE itemID = ${id}`, (err, data) => {
        if (err) throw err;
        console.log("\n Your Purchase went through \n");
        start();
    })
}

function start2(){
    inq.prompt([
        {
            type: "list",
            name: "option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Switch Role"]
        }
    ]).then((res) => {
            switch(res.option){
                case "View Products for Sale":
                    viewItems(2);
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
                case "Switch Role":
                        getPerson();
                        break;
                default: break;
            }
    })
}

sendover();

function viewItems(num){
    conn.query("SELECT * FROM bitems", (err, data) => {
        if (err) throw err;
        console.log("---------------\n");
        console.log("ID | NAME | DEPARTMENT | PRICE | QUANTITY ")
        for ( e in data ){
            console.log(`${data[e].itemID} | ${data[e].itemName} | ${data[e].dept} | ${data[e].price} | ${data[e].quantity}`);
        }
        console.log("\n---------------");
        if (num == 1){
            start();
        } else {
            start2();
        }
    })
}

function viewLow(){
    conn.query("select * from bitems where quantity < 6", (err, data) => {
        if (err) throw err;
        if (data.length == 0){
            console.log("\n You have no items that are low in quantity \n ");
            start2();
        } else {
            console.log("---------------\n");
            console.log("ID | NAME | DEPARTMENT | PRICE | QUANTITY ");
            for ( e in data ){
                console.log(`${data[e].itemID} | ${data[e].itemName} | ${data[e].dept} | ${data[e].price} | ${data[e].quantity}`);
            }
            console.log("\n---------------");
            start2();
        }
    })
}

function addToLow(){
    inq.prompt([
        {
            type: "confirm",
            name: "low",
            message: "Do you wish to see what Product are low in quantity?"
        }
    ]).then((res) => {
        if (!res.low){
            inq.prompt([
                {
                    name: "id",
                    message: "Do you have the Product ID?"
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
        start2();
    })
}

function postItem(){
    inq.prompt([
        {
            name: "name",
            message: "What is the name of the product?"
        },
        {
            name: "dept",
            message: "What is the departments name?"
        },
        {
            name: "price",
            message: "What is the price?"
        },
        {
            type: "number",
            name: "quan",
            message: "What is the quantity amount that you have?"
        }
    ]).then((res) => {
        if ( isNaN(res.quan) ){
            console.log("\n Please enter a valid quantity amount \n")
        } else if (isNaN(res.quan)){
            console.log("\n Please enter a valid price \n")
        } else {
            var quan2 = parseInt(res.quan);
            var price2 = parseFloat(res.price);
            conn.query(`INSERT INTO bitems (itemName, dept, price, quantity) VALUES ('${res.name}', '${res.dept}', ${price2}, ${quan2})`, (err, data) => {
                if (err) throw err;
                console.log("\n Product was added! \n");
                start2();
            })
        }
    })
}