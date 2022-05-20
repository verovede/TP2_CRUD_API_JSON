import express from 'express';
import fs from 'fs';

// LEVANTAR UN SERVIDOR WEB:
const PORT = 3000;

// INSTANCIAR LA APP
const app = express();

//start server
app.listen(PORT, () => {
    console.log(`Puerto ${PORT} escuchando!`)
})

// util functions

const PATH = './inventors.json';

const persistir = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(PATH, stringifyData)
}
const leer = () => {
    const jsonData = fs.readFileSync(PATH, 'utf-8')
    return JSON.parse(jsonData)
}

const ulitmoId = () => {
    const inventors = leer();
    var idMayor = 0;
    for (const inventor of inventors) {
        if (inventor._id > idMayor) {
            idMayor = inventor._id
        }
    }
    return idMayor;
}



// GET 
app.get('/', function (req, res) {
    res.send("Hola Inventores");
});


// GET : llamar a los inventores
app.get('/api/listaInventores', function (req, res) {
    res.json(leer());
});


// GET : buscar inventor
app.get('/api/buscarInventor/:id', (req, res) => {

    const inventorId = parseInt(req.params.id);
    res.json(leer().filter(inventor => inventor._id === inventorId))
})


// DELETE : borar inventor
app.use(express.json())
app.get('/api/borrarInventor/:id', (req, res) => {

    const idBorrar = parseInt(req.params.id);
    const aBorrar = leer().findIndex(inventor => inventor._id === idBorrar)

    if (aBorrar >= 0) {
        const inventores = leer();
        inventores.splice(aBorrar, 1);
        persistir(inventores);
        res.send(`Id ${idBorrar} borrado`);
    } else {
        res.send(`Id ${idBorrar} no existe`);
    }
})


// POST : insertar inventor
app.use(express.json())
app.post('/api/insertarInventor/', (req, res) => {
    const inventorNuevo = req.body;
    inventorNuevo._id = ulitmoId() + 1;
    const inventors = leer();
    inventors.push(inventorNuevo)
    persistir(inventors)
    res.json(inventorNuevo)
})

//ACTUALIZAR
app.use(express.json())
app.post('/api/actualizarInventor/', (req, res) => {
    const inventorActualizado = req.body;    
    const indexToUpdate = leer().findIndex(inventor => inventor._id === inventorActualizado._id)    
    const inventors = leer();
    inventors[indexToUpdate] = inventorActualizado
    persistir(inventors)
    res.json(inventorActualizado)
})
