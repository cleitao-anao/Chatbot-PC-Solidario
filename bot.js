const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu"
        ],
        headless: true
    }
});

client.on('qr', qr => {
    console.log("Novo QR Code gerado!");
    qrcode.generate(qr, { small: true }); // Exibe o QR Code no terminal
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
});

client.initialize();

const delay = ms => new Promise(res => setTimeout(res, ms));

// Funil de atendimento para o projeto solidário de descarte de eletrônico
client.on('message', async msg => {
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola|bao|bão|Bão|bão|opa|Opa)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        await client.sendMessage(
            msg.from,
            `Olá, ${name.split(" ")[0]}! Bem-vindo ao Projeto Solidário de doação e Descarte de Eletrônicos.PCTI PC Solidário: Transformando Lixo Eletrônico em Esperança!`
        );
        
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(
            msg.from,
            `Por favor, escolha uma das opções abaixo:\n\n1 - Descarte Externo\n2 - Descarte Interno\n3 - Ajuda`
        );
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, `Você selecionou *Descarte Externo*.`);
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, `Você selecionou *Descarte Interno*.`);
    }

    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(
            msg.from,
            `Você selecionou *Ajuda*.\n\nSe precisar de esclarecimentos adicionais ou tiver dúvidas sobre o processo de descarte, por favor, responda com sua pergunta ou entre em contato com nossa equipe pelo telefone (XX) XXXX-XXXX. Estamos aqui para ajudar!`
        );
    }
});
