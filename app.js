const http = require('http');
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
const express = require('express');
const app = express();
const path = require('path');

function Client(id, connection) {
    this.id = id;
    this.connection = connection;
    this.name = null;
    this.getId = function() {
        return this.id;
    };
    this.getConnection = function() {
        return this.connection;
    };
    this.getName = function() {
        return this.name;
    };
    this.setId = function(id) {
        this.id = id;
    };
    this.setConnection = function(connection) {
        this.connection = connection;
    };
    this.setName = function(name) {
        this.name = name
    };
}
function Game(id, clients) {
    this.id = id;
    this.clients = clients;
    this.cardsFlipped = 0;
    this.getId = function() {
        return this.id;
    };
    this.getClients = function() {
        return this.clients;
    };
    this.getCardsFlipped = function() {
        return this.cardsFlipped;
    };
    this.setId = function(id) {
        this.id = id;
    };
    this.setClients = function(clients) {
        this.clients = clients;
    };
    this.setCardsFlipped = function(cardsFlipped) {
        this.cardsFlipped = cardsFlipped;
    };
    this.addClient = function(client) {
        this.clients.push(client);
    };
    this.incrementCardsFlipped = function() {
        this.cardsFlipped++;
    }
}
function clientList(clients) {
    this.clients = clients;
    this.getClients = function() {
        return this.clients;
    };
    this.setClients = function(clients) {
        this.clients = clients;
    };
    this.addClient = function(client) {
        this.clients.push(client);
    };
    this.clientsSize = function(){
        return clients.length
    }
    this.changeClientConnection = function(id, connection) {
        if (this.clients.length > 0) {
            for (i = 0; i < this.clients.length; i++) {
                if (this.clients[i].getId() == id) {
                    this.clients[i].setConnection(connection);
                    //console.log(this.clients[i].getConnection() === connection)
                }
            }
        }
    };
    this.getConnectionFromClient = function(id) {
        let resultConnection = null;
        if (this.clients.length > 0) {
            for (i = 0; i < this.clients.length; i++) {
                if (this.clients[i].getId() === id) {
                    resultConnection = this.clients[i].getConnection();
                }
            }
        }
        return resultConnection;
    };
    this.getClientFromConnection = function(conn) {
        let resultClient = null;
        if (this.clients.length > 0) {
            for (i = 0; i < this.clients.length; i++) {
                if (this.clients[i].getConnection() == conn) {
                    resultClient = this.clients[i].getId();
                }
            }
        }
        return resultClient;
    };
    this.getClientNameFromId = function(id) {
        let resultClientName = null;
        if (this.clients.length > 0) {
            for (i = 0; i < this.clients.length; i++) {
                if (this.clients[i].getId() == id) {
                    resultClientName = this.clients[i].getName();
                }
            }
        }
        return resultClientName;
    };

}
function gameList(games) {
    this.games = games;
    this.bigness = function() {
        return this.games.length;
    }
    this.removeGame = function(gameId){
        if(this.games.length !== 0){
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == gameId) {
                    games.splice(i, 1)
                }
            }
        }
    }
    this.getGames = function() {
        return this.games;
    };
    this.setGames = function(games) {
        this.games = games;
    };
    this.addGame = function(game) {
        this.games.push(game);
    };
    this.addClientToGame = function(gameId, clientId){
        if(this.games.length !== 0){
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == gameId) {
                    this.games[i].addClient(new Client(clientId))
                }
            }
        }
    }
    this.getGameFromId = function(gameId) {
        let gam = null;
        if(this.games.length !== 0){
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == gameId) {
                    gam = games[i];
                }
            }
        }
        return gam;
    };
    this.getClientsFromId = function(id) {
        let playerRet = [];
        let flag = false;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == id) {
                    flag = true;
                    resDemo = this.games[i].getClients();
                    for (j = 0; j < resDemo.length; j++) {
                        playerRet.push(resDemo[j].getId());
                    }
                }
            }
        }
        if (flag) {
            return playerRet;
        }
        else {
            return null;
        }
    };
    this.findFirstJoinableGame = function() {
        let retId = null;
        if (this.games.length !== 0) {
            for (i = 0; i < games.length; i++) {
                clientRun = this.games[i].getClients().length;
                if (clientRun == 1) {
                    retId = games[i];
                    break;
                }
            }
        }
        return retId;
    };
    this.waitForOpponent = function(id) {
        let check = true;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == id) {
                    check = (this.games[i].getClients().length === 1);
                }
            }
        }
        return check;
    };
    this.howManyWaiting = function(id) {
        let count = 0;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == id) {
                    if (this.games[i].getClients().length === 1) {
                        count++;
                    }
                }
            }
        }
        return count;
    };
    this.closeFromGame = function(id) {
        let check = true;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == id) {
                    check = (this.games[i].getClients().length === 2);
                }
            }
        }
        return check;
    };
    this.findOpponent = function(gameId, clientId) {
        let opponent = null;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                if (this.games[i].getId() == gameId) {
                   if (this.games[i].getClients().length == 2) {
                       for (let j = 0; j < 2; j++) {
                           if (clientId != this.games[i].getClients()[j].getId()) {
                               opponent = this.games[i].getClients()[j].getId()
                           }
                       }
                   }
                }
            }
        }
        return opponent;
    }
    this.getGameClientIsIn = function(id) {
        let indexGame = null;
        if (this.games.length !== 0) {
            for (i = 0; i < this.games.length; i++) {
                for (j = 0; j < this.games[i].getClients().length; j++) {
                    if (this.games[i].getClients()[j].getId() == id) {
                        indexGame = games[i].getId();
                    }
                }
            }
        }
        return indexGame;
    };
}

//hashmaps for multiple games and clients
//created clients object where clientId are keys and the connection are values
let clients = new clientList([]);
let clientPoints = []
//NOTE FOR ZANYAR:created games object where gameId is key and the value can be what is useful for the game state
let games = new gameList([]);
let name = null
let isGame = false
let numberOfFlips = 0

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));
//loads in main page
app.set('view engine', 'ejs')
app.get('/', (req, res)=>{

    res.render('splash', {
        data:clients.clientsSize()+1, 
        gameNum:games.getGames().length,
        flips:numberOfFlips
    })
})


app.get('/:gameId', (req, res)=>{
    //console.log(req.params)
    
    let gameExists = false

    games.getGames().forEach(g => {
        //console.log(g.getId())
        //console.log(g.getId() == req.params.gameId)
        if(g.getId() == req.params.gameId){
            gameExists = true
        }
        if('favicon.ico' == req.params.gameId){
            gameExists = true
        }
    })

    let gameId = req.params.gameId
    let players = games.getClientsFromId(gameId)
    
    if (!(players === null)) {
        let limitReached = players.length >2
        //console.log(gameExists)
        //console.log(!limitReached)
        if(gameExists && !limitReached){
            res.sendFile(__dirname+'\\public\\game.html')
            //console.log(games)
        }
        else{
            res.sendFile(__dirname+'\\public\\error.html')
        }
    }
    else{
        res.sendFile(__dirname+'\\public\\error.html')
    }
})

app.listen(5001, ()=>{
    console.log("connection established on 5001");
})
app.on("open", ()=>{
  console.log("application opened")
})

httpServer.listen(5000, ()=>{
    console.log("connection established");
})
//websockets are upgraded http connections
const wsServer = new websocketServer({
    "httpServer":httpServer
})
let firstCounter = 0
let secondCounter = 0
let cardId1 = null
let cardId2 = null
let cardNum1 = null
let cardNum2 = null
let ordering = null
wsServer.on("request", request=>{
     const connection = request.accept(null, request.origin);
     connection.on("open", ()=>{
       console.log("connection opened")
      });
      connection.on("close", ()=>{
        console.log("connection closed")
        let opponent = games.findOpponent(games.getGameClientIsIn(clients.getClientFromConnection(connection)), clients.getClientFromConnection(connection))
        //games.removeGame(games.getGameClientIsIn(clients.getClientFromConnection(connection)))
        const payLoad = {
            "method":"opponentleft"
        }
        if (opponent !== null && opponent !== undefined) {
             clients.getConnectionFromClient(opponent).send(JSON.stringify(payLoad))
        }

       });
     connection.on("message", (message)=>{
        //message recived from browser (stored in result)
        const result = JSON.parse(message.utf8Data);
        let clientId = null
        if(result.method === "onStart"){
            if(result.side === "splash"){
                clientId = generateId();
                clients.addClient(new Client(clientId, connection))
                const payLoad = {
                    "clientId":clientId,
                     "method":"onStart"
                 }
                 connection.send(JSON.stringify(payLoad))
            }
            if(result.side === "game"){
                let gameId = result.gameId.substring(1)
                let players = games.getClientsFromId(gameId)
                if(players.length == 1){
                    ordering = randomOrdering()
                }
                clientId = result.clientId
                clients.changeClientConnection(clientId, connection)
                //console.log(clients.getConnectionFromClient(clientId) === connection)
                let payLoad = {
                     "method":"onStart",
                     "ordering":ordering,
                     "name":name,
                     "initialTurn":0,
                     "status":true
                 }

                 let status = games.waitForOpponent(gameId)
                 let counter = 0
                 if (status) {
                     players.forEach(c => {
                        //console.log(clients.getConnectionFromClient(c) === connection)
                        payLoad.initialTurn = counter
                        let nm = clients.getClientNameFromId(c)
                        if (nm == null) {
                            nm = 'Player'
                        }
                        payLoad.name = nm
                        counter++; 
                        clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                        //console.log("done with inform", c)
                    })
                 }
                 if (!status) {
                    players.forEach(c => {
                        //console.log(clients.getConnectionFromClient(c) === connection)
                        payLoad.status = false
                        let nm = clients.getClientNameFromId(c)
                        if (nm == null) {
                            nm = 'Player'
                        }
                        payLoad.name = nm
                        payLoad.initialTurn = counter
                        counter++; 
                        clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                        //console.log("done with inform", c)
                    })
                 }

                 console.log("done with game")
            }

        }
        if(result.method === "closeGame"){
            let gameId = result.gameId
            games.removeGame(gameId)
        }
        if (result.method === "jump") {
            let cli = result.clientId
            let gameId = result.gameId.substring(1)
            let opponent = games.findOpponent(gameId, cli)
            const payLoad = {
                "method":"jump",
                "opponent":true
            }
            let players = games.getClientsFromId(gameId)
            if (players !== null) {
                players.forEach(c => {
                    if(c.getId() != cli){
                        clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                    }
                })
            }

        }
        if(result.method === "join"){          
            const clientId = result.clientId;
            name = result.name;
            let joinable = games.findFirstJoinableGame();

            if (joinable === null) {
                //console.log('AHSKJDHQOIWDHASKJDHQ')
                const gameId = generateId();
                let newCli = new Client(clientId)
                newCli.setName(name)
                games.addGame(new Game(gameId, [newCli]))
                let players = games.getClientsFromId(gameId)
                const payLoad = {
                "method":"join",
                "gameId":gameId,
                "players":players
                }
                
                if (players !== null) {
                    players.forEach(c => {
                        clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                    })
                }
            }

            else{
                //add client to a clients list in a game
                games.addClientToGame(joinable.getId(), clientId)
                let players = games.getClientsFromId(joinable.getId())
                const payLoad = {
                "method":"join",
                "gameId":joinable.getId(),
                "players":players
                }
                
                if (players !== null) {
                    players.forEach(c => {
                        clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                    })
                }
            }

            
            
        }
        if (result.method === "cardsTurned") {
            let gameId = result.gameId.substring(1)
            let clientId = result.clientId
            let points = result.points
            clientPoints.push(clientId, points)
            let players = games.getClientsFromId(gameId)
            let max_index = 0
            let max = 0
            let min = 50
            let min_index = 0
            players.forEach(c => {
                if (clientPoints[c] > max) {
                    max = clientPoints[c]
                    max_index = c
                }
                if (clientPoints[c] < min) {
                    min = clientPoints[c]
                    min_index = c
                }
            })
            let winnerConnection = clients.getConnectionFromClient(max_index)
            let loserConnection = clients.getConnectionFromClient(min_index)
            let winnerPayLoad = {
                "method":"winner"
            }
            let loserPayload = {
                "method":"loser"
            }
            winnerConnection.send(JSON.stringify(winnerPayLoad))
            loserConnection.send(JSON.stringify(loserPayload))
        }
        if(result.method === "listenCard") {
            numberOfFlips++
            const cardId = result.cardId
            const cardNum = result.cardNum
            const turnId = result.turnId
            let payload = null

            if(turnId == 1 && secondCounter<2){
                payLoad = {
                    "method":"listenCard",
                    "cardId":cardId,
                    "cardNum":cardNum,
                    "turnNumber":1,
                    "flipBack":false,
                    "finalTurn":false,
                    "askedTurn":1
                }
                if(secondCounter == 0){
                    cardId1 = cardId
                    cardNum1 = cardNum
                }
                if(secondCounter == 1){
                    cardId2 = cardId
                    cardNum2 = cardNum
                }
                secondCounter++
            }
            if(turnId == 1 && secondCounter>=2){
                //console.log("cardId1", cardId1)
                payLoad = {
                    "method":"listenCard",
                    "cardId":cardId,
                    "cardNum":cardNum,
                    "prevTwoCardNums":[cardNum1,cardNum2],
                    "turnNumber":0,
                    "flipBack":cardId1 != cardId2,
                    "finalTurn":true,
                    "askedTurn":1
                }
                //console.log("cardNums", cardNum1, cardNum2)
                secondCounter=0
                cardNum1 = null
                cardNum2 = null
            }

            if(turnId == 0 && firstCounter<2){
                payLoad = {
                    "method":"listenCard",
                    "cardId":cardId,
                    "cardNum":cardNum,
                    "turnNumber":0,
                    "flipBack":false,
                    "finalTurn":false,
                    "askedTurn":0
                }
                if(firstCounter == 0){
                    cardId1 = cardId
                    cardNum1 = cardNum
                }
                if(firstCounter == 1){
                    cardId2 = cardId
                    cardNum2 = cardNum
                }
                firstCounter++
                //console.log("firstcounter", firstCounter)
            }
            let flag = false;
            if(turnId == 0 && firstCounter>=2){
                //console.log("cardId1", cardId1)
                payLoad = {
                    "method":"listenCard",
                    "cardId":cardId,
                    "cardNum":cardNum,
                    "prevTwoCardNums":[cardNum1,cardNum2],
                    "turnNumber":1,
                    "flipBack":cardId1 != cardId2,
                    "finalTurn":true,
                    "askedTurn":0
                }
                //console.log("cardNums", cardNum1, cardNum2)
                flag = (cardNum1 == cardNum2)
                firstCounter = 0
                cardNum1 = null
                cardNum2 = null
            }
            
            let gameId = result.gameId.substring(1)
            //console.log(gameId)
            let players = games.getClientsFromId(gameId)
            //console.log(typeof players)
            let cardsFlipped = games.getGameFromId(gameId).getCardsFlipped();
            if (cardsFlipped == 36) {
                players.forEach(c => {
                    //console.log(clients.getConnectionFromClient(c) === connection)
                    payLoad.method = "cardsTurned"
                    clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                    //console.log("done with inform", c)
                })
            }
            else if (cardsFlipped != 36) {
                players.forEach(c => {
                    //console.log(clients.getConnectionFromClient(c) === connection)
                    if (flag) {
                        games.getGameFromId(gameId).incrementCardsFlipped()
                    }
                    payLoad.method = "listenCard"
                    clients.getConnectionFromClient(c).send(JSON.stringify(payLoad))
                    //console.log("done with inform", c)
                })
            }
            

        }

     })

 })

 //generates random 6 digit number (very low chance of collision)
 function generateId(){
     return Math.floor(100000 + Math.random() * 900000);
 }
 function randomOrdering() {
    let c = []
    c.push(1+Math.floor(Math.random()*18))
    while(c.length < 36) {
        let a = 1+Math.floor(Math.random()*18)
        let b = 0
        for (i = 0; i < c.length; i++) {
            if (c[i] === a) {
                b++
            }
        }
        if (b < 2) {
            c.push(a)
        }
    }
    return c
}
