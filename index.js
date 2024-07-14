import {Server} from 'socket.io'
const port = process.env.PORT || 3000;

const io = new Server({
    cors: {
        // origin: 'https://r3f-multiplayer.vercel.app/',
        origin: '*',
    }
})


io.listen(port)

console.log("port : ",port)

const characters =[]

function generateRandomPosition() {
    return [Math.random() * 3, 0, Math.random()* 3]
}

function generateRandomHexColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

io.on('connect', (socket) => {
    console.log('User connected')

    socket.on('move', (position) => {
        const character = characters.find(c => c.id === socket.id)
        if(character) {
            character.position = position
            // character.rotation = data.rotation
            io.emit('characters', characters)
        }
    })

    characters.push({
        id: socket.id,
        position: generateRandomPosition(),
        rotation: {x: 0, y: 0, z: 0},
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
        username: 'Guest'
    })

    socket.emit('message',"welcome to the Game")

    io.emit('characters', characters)

    socket.on('disconnect', () => {
        console.log('User disconnected')
        characters.splice(characters.findIndex(c => c.id === socket.id), 1)
        io.emit('characters', characters)
    })
 })