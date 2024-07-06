const axios = require('axios');
const chalk = require('chalk');
const express = require('express');
const http = require('http');

let app = express();

function decodeString(encodedString) {
    return encodedString.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

const PORT = process.env.PORT || 8050;

function startServer() {
    console.log(chalk.yellowBright.bold('Starting...'));

    app.get('/', function (req, res) {
        res.send({ 'status': 'Active' });
    });

    const server = http.createServer(app);

    server.listen(PORT, () => {
        console.log(chalk.yellowBright.bold(`Connected UPPERMOON-MD -- ${PORT}`));
    });
}

async function fetchDataAndMonitor() {
    console.log(chalk.yellowBright.bold('Connected to Api -- x-bot-md-server.mmosnsnn.repl.co'));

    while (true) {
        try {
            let response = await axios.get('http://x-bot-md-server.mmosnsnn.repl.co');
            console.log(chalk.yellow(response.data));
            await sleep(60000); // 60 seconds
        } catch (error) {
            console.error(chalk.red('Error fetching data:', error.message));
        }
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    await startServer();
    await fetchDataAndMonitor();
}

main().catch(err => console.error(chalk.red('Error starting application:', err)));
