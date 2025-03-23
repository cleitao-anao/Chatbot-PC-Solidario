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
        const name = contact.pushname.split(" ")[0];
    
        await client.sendMessage(
            msg.from,
            `🌟 Olá, ${name}! Seja bem-vindo(a)! 🌟\n\n` +
            `Eu sou o bot do *PC Solidário*, um projeto que transforma lixo eletrônico em esperança! ♻️💻\n\n` +
            `Quer saber mais? Escolha uma opção abaixo digitando o número correspondente:\n\n` +
            `1️⃣ *Sobre o Projeto*\n` +
            `2️⃣ *Como Doar*\n` +
            `3️⃣ *Ajuda e Suporte*\n\n` +
            `📩 Basta responder com o número da opção desejada! 😉`
        );
    }
    

    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        
        await client.sendMessage(msg.from, 
            `🌱 *Sobre o Projeto* 🌱\n\n` +
            `Muitos eletrônicos descartados ainda podem ter uma nova vida! ♻️\n\n` +
            `Nosso projeto transforma lixo eletrônico em computadores para comunidades carentes, dando acesso à tecnologia e educação. 📚💻\n\n` +
            `Tem aparelhos parados? Doe para o *PC Solidário* e ajude a construir um futuro melhor! 🚀✨`
        );
    }
    
    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
    
        await client.sendMessage(msg.from, `✨ *Como Doar* ✨`);
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "Obrigado por querer fazer parte do *PC Solidário*! 💙\n\n" +
            "Temos duas formas simples para você doar seus eletrônicos usados e ajudar a transformar vidas. Confira abaixo! ⬇️"
        );
    
        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "📍 *Entrega no Local*\n" +
            "Prefere levar sua doação até a gente? Você pode entregar diretamente na nossa unidade do *Senac*.\n\n" +
            "📌 *Endereço:* R. Aristides Lobo, 1058 - Campina, Belém - PA, 66017-010\n" +
            "🕘 *Horário:* Segunda a sexta-feira, das 8h às 20h.\n\n" +
            "Traga seu eletrônico e ajude a construir um futuro melhor! 🚀"
        );
    
        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "🚚 *Agendamento para Coleta*\n" +
            "Não pode ir até lá? Podemos buscar sua doação! Para isso, basta ter *3 ou mais eletrônicos* para doação.\n\n" +
            "📋 Para agendar, preencha o formulário no link abaixo:\n" +
            "🔗 [*Solicitar Coleta*](https://forms.gle/hbL3B7Do1CRmCVGu5)\n\n" +
            "Após o envio, entraremos em contato para combinar os detalhes da retirada. 😉"
        );
    
        await delay(2000);
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(msg.from, 
            "Qualquer dúvida, estamos à disposição! 💬\n\n" +
            "A sua doação faz a diferença. Obrigado por apoiar essa causa incrível! 🙌💙"
        );
    }
    


    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
    
        await delay(1000);
        await chat.sendStateTyping();
        await delay(1000);
    
        await client.sendMessage(
            msg.from,
            `🆘 *Ajuda e Suporte* 🆘\n\n` +
            `Precisa de mais informações sobre doações ou descarte responsável? Estamos aqui para ajudar! 💙\n\n` +
            `❓ Tem alguma dúvida? Basta enviar sua pergunta aqui mesmo e nossa equipe responderá o mais rápido possível.\n\n` +
            `📞 Se preferir, fale conosco diretamente pelo telefone: *(XX) XXXX-XXXX*.\n\n` +
            `Conte com a gente! 🤝`
        );
    }
    


});
