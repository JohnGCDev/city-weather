require('dotenv').config();
const { pausa, inquirerMenu, leerInput, listarLugares } = require("./helpers.js/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    const busquedas = new Busquedas();
    let opt = '';
    do{
        opt = await inquirerMenu();
        switch(opt){
            case '1':
                // Mostrar mensaje
                const lugar = await leerInput('Ciudad:');
                //Buscar lugares
                const lugares = await busquedas.ciudades(lugar);
                // Seleccione lugar
                const idSeleccionado = await listarLugares(lugares);
                if(idSeleccionado == '0') continue;
                // Obteniendo objeto correspondiente al id seleccionado
                const lugarSeleccionado = lugares.find(l => l.id === idSeleccionado);
                // Guardar en DB
                busquedas.agregarHistorial(lugarSeleccionado.nombre);
                // Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                //Mostrar resultados
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green);
                console.log('Lat:', lugarSeleccionado.lat);
                console.log('Lng:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);
                break;
            case '2':
                busquedas.getCapitalizeHistorial.forEach((lugar, idx) => {
                    console.log(`${(++idx + '.').green} ${lugar}`);
                });
                break;
            default:
                break;
        }
        if(opt !== '0') await pausa();
    }while(opt !== '0');
}

main();