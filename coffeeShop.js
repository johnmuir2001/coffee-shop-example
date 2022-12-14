// importing the inquirer package - make sure you have it installed in you 
// package.json and a node_modules folder is there
// If you need a node_modules folder generated then run the command npm install
import inquirer from "inquirer";

// object holding menu contents
let menu = {
    coffee: 3,
    tea: 2.5,
    latte: 2,
    coke: 1.5, 
    water: 1,
    crisps: 0.5,
    scone: 2.5,
    brownie: 2.5,
    sandwhich: 3,
}

// this array holds the items in the menu object without prices to be used for the 
// users choice
let menuItems = ["- Go To Checkout -"]

// this is a for in loop that loops through an object
for (const key in menu) {
    // key represents the name of the item in the menu
    menuItems.push(key)
}

// the CoffeeShop class that will store a customers name, order, and total cost
class CoffeeShop {
    constructor(name) {
        this.name = name
        this.order = []
        this.total = 0
    }

    // this method loops through the order array and adds the price thats stored in 
    // the menu object for each item in the array
    calculateTotal() {
        this.total = 0
        for (let i = 0; i < this.order.length; i++) {
            this.total += menu[this.order[i]]
        }
        return this.total
    }

    // this setter adds an item to the order array
    set updateOrder(newItem){
        this.order.push(newItem)
    }
}

// list of questions to ask user before setting up instance of CoffeeShop class
// use inquirer to prompt the questions in the terminal
const response = await inquirer.prompt([
    {
        type: 'input',
        name: 'getName',
        message: "What's your name?"
    }
])

// create instance of CoffeeShop class passing the name typed in the terminal
// by the user
let customer = new CoffeeShop(response.getName)

// function to run when the order has been made and user can pay
const checkout = async () => {
    // log the total order and cost to user
    // the map method is used to get a list of all the ordered items as well as
    // the cost for each one and total cost is calculated
    console.log(`
        You ordered:
        ${customer.order.map((item) => {
            return `${item} - £${menu[item].toFixed(2)}`
        })}

        Total: 
        £${ customer.calculateTotal().toFixed(2) }
    `)

    // asks user to pay in terminal, checks to see if they typed a number or if 
    // they can afford the order
    const pay = await inquirer.prompt([{
        type: 'input',
        name: 'totalMoney',
        message: "Please pay here",
        validate(value) {
            if(isNaN(value)){
                return "Please enter a number"
            } else if(customer.total > value){
                return "You don't have enough money"
            } else {
                return true
            }
        }
    }])

    // console logs the receipt
    console.log(`
        Thank you ${customer.name}
        Order:      ${customer.order.map((item) => {
            return `${item} - £${menu[item].toFixed(2)}`
        })}
        Total:      £${customer.total.toFixed(2)}
        You Paid:   £${parseInt(pay.totalMoney).toFixed(2)}
        Change:     £${(parseInt(pay.totalMoney) - customer.total).toFixed(2)}
    `)
}

// asks user what they want to order
const askForOrder = async () => {
    // the choices are an array stored in the menuItems variable
    const order = await inquirer.prompt([
        {
            type: 'list',
            name: 'getOrder',
            message: "What would you like to order?",
            choices: menuItems
        }
    ])
    // if the user selects - Go To Checkout - then run the checkout function and
    // the return word exits this askForOrder function
    // if they don't select - Go To Checkout - then add what they do select to the
    // order array
    if(order.getOrder === "- Go To Checkout -"){
        checkout()
        return;
    } else {
        customer.updateOrder = order.getOrder
    }

    // call the function again to create a loop where it keeps asking for the order
    // until the user selects - Go To Checkout -
    askForOrder()
}
askForOrder()