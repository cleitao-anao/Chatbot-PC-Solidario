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




const delay = ms => new Promise(res => setTimeout(res, ms)); // Função que usamos para criar o delay entre uma ação e outra

// Funil

client.on('message', async msg => {

    if (msg.body.match(/(menu|Menu|dia|tarde|noite|oi|Oi|Olá|olá|ola|Ola)/i) && msg.from.endsWith('@c.us')) {

        const chat = await msg.getChat();

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        const contact = await msg.getContact(); //Pegando o contato
        const name = contact.pushname; //Pegando o nome do contato
        await client.sendMessage(msg.from,'Olá! '+ name.split(" ")[0] + 'Sou o assistente virtual da empresa tal. Como posso ajudá-lo hoje? Por favor, digite uma das opções abaixo:\n\n1 - Como funciona\n2 - Valores dos planos\n3 - Benefícios\n4 - Como aderir\n5 - Outras perguntas'); //Primeira mensagem de texto
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(5000); //Delay de 5 segundos
    
        
    }




    if (msg.body !== null && msg.body === '1' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Nosso serviço oferece consultas médicas 24 horas por dia, 7 dias por semana, diretamente pelo WhatsApp.\n\nNão há carência, o que significa que você pode começar a usar nossos serviços imediatamente após a adesão.\n\nOferecemos atendimento médico ilimitado, receitas\n\nAlém disso, temos uma ampla gama de benefícios, incluindo acesso a cursos gratuitos');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'COMO FUNCIONA?\nÉ muito simples.\n\n1º Passo\nFaça seu cadastro e escolha o plano que desejar.\n\n2º Passo\nApós efetuar o pagamento do plano escolhido você já terá acesso a nossa área exclusiva para começar seu atendimento na mesma hora.\n\n3º Passo\nSempre que precisar');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');


    }

    if (msg.body !== null && msg.body === '2' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, '*Plano Individual:* R$22,50 por mês.\n\n*Plano Família:* R$39,90 por mês, inclui você mais 3 dependentes.\n\n*Plano TOP Individual:* R$42,50 por mês, com benefícios adicionais como\n\n*Plano TOP Família:* R$79,90 por mês, inclui você mais 3 dependentes');

        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');
    }

    if (msg.body !== null && msg.body === '3' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();


        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Sorteio de em prêmios todo ano.\n\nAtendimento médico ilimitado 24h por dia.\n\nReceitas de medicamentos');
        
        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');

    }

    if (msg.body !== null && msg.body === '4' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Você pode aderir aos nossos planos diretamente pelo nosso site ou pelo WhatsApp.\n\nApós a adesão, você terá acesso imediato');


        await delay(3000); //delay de 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Link para cadastro: https://site.com');


    }

    if (msg.body !== null && msg.body === '5' && msg.from.endsWith('@c.us')) {
        const chat = await msg.getChat();

        await delay(3000); //Delay de 3000 milisegundos mais conhecido como 3 segundos
        await chat.sendStateTyping(); // Simulando Digitação
        await delay(3000);
        await client.sendMessage(msg.from, 'Se você tiver outras dúvidas ou precisar de mais informações, por favor, fale aqui nesse whatsapp ou visite nosso site: https://site.com ');


    }








});