const fs = require('fs');
const axios = require("axios");

class Busquedas {
    historial = [];
    path = './db/database.json';

    constructor() {
        // Leer DB si existe
        this.leerDB();
    }
    get getParamsMapBox() {
        return {
            access_token: process.env.MAPBOX_KEY || '',
            limit: 5,
            language: "es",
        };
    }
    get getParamsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY || '',
            units: 'metric',
            lang: 'es'
        };
    }
    get getCapitalizeHistorial(){
        if(this.historial.length == 0) return [];
        return this.historial.map(lugar => {
            return lugar.replace(/(^\w{1})|(\s+\w{1})/g, l => l.toUpperCase());
        });
    }

    async ciudades(lugar = "") {
        try {
            // petición http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.getParamsMapBox,
            });

            const resp = await instance.get();
            // Retornar ciudades que coincidan con el lugar
            return resp.data.features.map(lugar => ({ // Regresando un objeto de forma implícita
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {
            return [];
        }
    }
    async climaLugar(lat, lon) {
        try{
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.getParamsWeather, lat, lon}
            });

            const {data} = await instance.get();
            return {
                desc: data.weather[0].description,
                min: data.main.temp_min,
                max: data.main.temp_max,
                temp: data.main.temp
            };
        }catch(error){
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        // Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())) return;
        // Inserción
        this.historial.unshift(lugar.toLocaleLowerCase());
        // Mantener un historial de solo 6 lugares como máximo
        this.historial = this.historial.splice(0, 6);
        // Grabar DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.path, JSON.stringify(payload));
    }

    leerDB(){
        // Verificar que la base de datos exista
        if(fs.existsSync(this.path)){
            const info = fs.readFileSync(this.path, {encoding: 'utf-8'});
            const data = JSON.parse(info);
            this.historial = [...data.historial];
        }
    }
}

module.exports = Busquedas;