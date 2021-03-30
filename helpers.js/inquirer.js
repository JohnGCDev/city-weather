const inquirer = require("inquirer");
require("colors");

const menuOpts = [{
    type: "list",
    name: "opcion",
    message: "¿Qué desea hacer?",
    choices: [{
            value: "1",
            name: `${"1.".green} Buscar ciudad`,
        },
        {
            value: "2",
            name: `${"2.".green} Historial`,
        },
        {
            value: "0",
            name: `${"0.".green} Salir`,
        },
    ],
}, ];

const inputEnter = [{
    type: "input",
    name: "enter",
    message: `Pulse ${"ENTER".green} para continuar`,
}, ];

const inquirerMenu = async() => {
    console.clear();
    console.log("=====================================".green);
    console.log("      Selecccione una opción".white);
    console.log("=====================================\n".green);

    const { opcion } = await inquirer.prompt(menuOpts);
    return opcion;
};

const pausa = async() => {
    console.log("\n");
    return await inquirer.prompt(inputEnter);
};

const leerInput = async(message) => {
    const question = [{
        type: "input",
        name: "desc",
        message,
        validate(value) {
            if (value.length === 0) {
                return "Por favor ingrese un valor";
            }
            return true;
        },
    }, ];

    const { desc } = await inquirer.prompt(question);
    return desc;
};

const confirmar = async(message) => {
    const question = [{
        type: "confirm",
        name: "ok",
        message,
    }, ];
    const { ok } = await inquirer.prompt(question);
    return ok;
};

const listarLugares = async(lugares = []) => {
    const choices = lugares.map((lu, idx) => {
        return {
            value: lu.id,
            name: `${(++idx + ".").green} ${lu.nombre}`,
        };
    });
    choices.unshift({
        value: "0",
        name: `${"0.".green} Cancelar`,
    });

    const lugarOpc = [{
        type: "list",
        name: "lugarID",
        message: "Seleccione lugar:",
        choices,
    }, ];
    const { lugarID } = await inquirer.prompt(lugarOpc);
    return lugarID;
};

const listadoTareasCompletar = async(tareas = []) => {
    const choices = tareas.map((tar, idx) => {
        return {
            value: tar.id,
            name: `${(++idx + ".").green} ${tar.desc}`,
            checked: tar.completadoEn,
        };
    });
    const tereasOpc = [{
        type: "checkbox",
        name: "ids",
        message: "Seleccione la(s) tarea(s) a completar",
        choices,
    }, ];
    const { ids } = await inquirer.prompt(tereasOpc);
    return ids;
};

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    confirmar,
    listarLugares,
    listadoTareasCompletar,
};