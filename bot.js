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
            `Olá, ${name.split(" ")[0]}! Bem-vindo, eu sou bot do Projeto Solidário de doação e Descarte de Eletrônicos. PC Solidário: Transformando Lixo Eletrônico em Esperança!`
        );
        
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(
            msg.from,
            `Por favor, escolha uma das opções abaixo:\n\n1 - Sobre o projeto\n2 - Como doar\n3 - Ajuda`
        );
    }

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await client.sendMessage(msg.from, 'Você selecionou *Sobre o projeto*.');
        
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, `Você sabia que muitos dispositivos eletrônicos que descartamos ainda podem ter uma nova vida?`);

        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, `O objetivo do nosso projeto: coletamos lixo eletrônico, reciclamos e transformamos em novos computadores. Cada equipamento que recuperamos é uma oportunidade de levar tecnologia a quem mais precisa.`);

        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, `Acreditamos que todos merecem acesso à informação e à educação. Por isso, fazemos esses computadores para comunidades carentes, ajudando a abrir portas para um futuro melhor.`);
        await delay(1000);
        await chat.sendStateTyping();
        await client.sendMessage(msg.from, `Se você tem eletrônicos parados em casa, não jogue fora! Traga para o PC Solidário e faça parte dessa corrente do bem. Juntos, podemos transformar lixo em oportunidades e construir um mundo mais justo e sustentável.`);
    }

    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await client.sendMessage(msg.from, `Você selecionou *Como doar*.`);
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(msg.from, 
            "Agradecemos seu interesse em contribuir com nosso projeto! Atualmente, oferecemos duas formas para realizar a doação de equipamentos eletrônicos usados."
        );
        await delay(2000);
        
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "🔹 *Entrega no local:*\n" +
            "Você pode deixar sua doação em nossa unidade do *Senac*, localizada no seguinte endereço:\n\n" +
            "📍 *R. Aristides Lobo, 1058 - Campina, Belém - PA, 66017-010*.\n\n" +
            "📅 *Horário de funcionamento:*\n" +
            "🕘 Segunda a sexta-feira, das *8h às 20h*."
        );
        await delay(2000);
        
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "🔹 *Agendamento para coleta:*\n" +
            "Caso não seja possível entregar os equipamentos presencialmente, oferecemos a opção de coleta em domicílio. Para isso, solicitamos o preenchimento de um formulário com suas informações."
        );
        await delay(2000);
        
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "Para agendar a coleta, por favor, preencha o formulário no link abaixo:\n\n" +
            "📌 [Inserir link do formulário aqui]\n\n" +
            "Após o envio, nossa equipe entrará em contato para confirmar os detalhes da retirada."
        );
    
        await delay(2000);
        
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "Se tiver alguma dúvida, estamos à disposição para ajudar.\n\n" +
            "Agradecemos imensamente sua colaboração e apoio ao projeto! 🤝"
        );
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
