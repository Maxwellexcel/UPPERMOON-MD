const config = require("../config.js");
const { DataTypes, Op } = require("sequelize");
const database = config.DATABASE;

const GreetingsDB = database.define("GreetingsDB", {
    chat: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
});

async function getMessage(chat, type) {
    try {
        const result = await GreetingsDB.findOne({ where: { chat, type } });
        return result ? result.dataValues.message : false;
    } catch (error) {
        console.error(`Error retrieving message: ${error}`);
        return false;
    }
}

async function setMessage(chat, type, message) {
    try {
        const [record, created] = await GreetingsDB.findOrCreate({
            where: { chat, type },
            defaults: { message, status: true }
        });

        if (!created) {
            await record.update({ message, status: true });
        }

        return true;
    } catch (error) {
        console.error(`Error setting message: ${error}`);
        return false;
    }
}

async function toggleStatus(chat, type) {
    try {
        const record = await GreetingsDB.findOne({ where: { chat, type } });
        if (!record) return false;

        const newStatus = !record.dataValues.status;
        await record.update({ status: newStatus });

        return true;
    } catch (error) {
        console.error(`Error toggling status: ${error}`);
        return false;
    }
}

async function delMessage(chat, type) {
    try {
        const record = await GreetingsDB.findOne({ where: { chat, type } });
        if (!record) return false;

        await record.destroy();
        return true;
    } catch (error) {
        console.error(`Error deleting message: ${error}`);
        return false;
    }
}

async function getStatus(chat, type) {
    try {
        const record = await GreetingsDB.findOne({ where: { chat, type } });
        return record ? record.dataValues.status : false;
    } catch (error) {
        console.error(`Error getting status: ${error}`);
        return false;
    }
}

module.exports = { getMessage, setMessage, toggleStatus, delMessage, getStatus };
