const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let qrCodeData = null; // Armazena o QR Code temporariamente

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

client.on('qr', async (qr) => {
    console.log("Novo QR Code gerado!");
    qrCodeData = await qrcode.toDataURL(qr); // Converte para uma imagem base64
});

client.on('ready', () => {
    console.log('Tudo certo! WhatsApp conectado.');
    qrCodeData = null; // Remove o QR Code depois da conexão
});

client.initialize();

// Servir a página HTML
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>QR Code do WhatsApp</title>
                <script>
                    function atualizarQRCode() {
                        fetch('/qrcode')
                            .then(res => res.json())
                            .then(data => {
                                if (data.qr) {
                                    document.getElementById('qrcode').src = data.qr;
                                }
                            });
                    }
                    setInterval(atualizarQRCode, 5000);
                    atualizarQRCode();
                </script>
            </head>
            <body>
                <h1>Escaneie o QR Code para conectar</h1>
                <img id="qrcode" src="" />
            </body>
        </html>
    `);
});

// Rota para fornecer o QR Code em tempo real
app.get('/qrcode', (req, res) => {
    res.json({ qr: qrCodeData });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

const delay = ms => new Promise(res => setTimeout(res, ms)); // Função para criar delay entre ações

// Funil de atendimento para o projeto solidário de descarte de eletrônico
client.on('message', async msg => {
    // Verifica se a mensagem contém cumprimentos ou solicita o menu
    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        const contact = await msg.getContact();
        const name = contact.pushname;
        // Mensagem de saudação adaptada para o projeto solidário
        await client.sendMessage(
            msg.from,
            `Olá, ${name.split(" ")[0]}! Bem-vindo ao Projeto Solidário de Descarte de Eletrônicos.\nPor favor, escolha uma das opções abaixo:\n\n1 - Descarte Externo\n2 - Descarte Interno\n3 - Ajuda`
        );
        await delay(3000);
        await chat.sendStateTyping();
        await delay(5000);
    }

    // Opção 1 - Descarte Externo
    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(
            msg.from,
            `Você selecionou *Descarte Externo*.\n\nSe você possui equipamentos eletrônicos para descarte em locais externos, por favor, informe a sua localização e o tipo de equipamento que deseja descartar. Em breve, um de nossos voluntários entrará em contato para agendar a coleta.`
        );
    }

    // Opção 2 - Descarte Interno
    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(
            msg.from,
            `Você selecionou *Descarte Interno*.\n\nCaso os seus equipamentos eletrônicos estejam em sua residência ou empresa e você prefira deixá-los em um ponto de coleta, acesse nosso site para verificar os locais disponíveis ou responda com a sua cidade para obter mais informações.`
        );
    }

    // Opção 3 - Ajuda
    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();
        await delay(3000);
        await chat.sendStateTyping();
        await delay(3000);
        await client.sendMessage(
            msg.from,
            `Você selecionou *Ajuda*.\n\nSe precisar de esclarecimentos adicionais ou tiver dúvidas sobre o processo de descarte, por favor, responda com sua pergunta ou entre em contato com nossa equipe pelo telefone (XX) XXXX-XXXX. Estamos aqui para ajudar!`
        );
    }
});
