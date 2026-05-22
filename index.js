const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

// Plugins තියාගන්න Global Object එකක් හදමු
global.plugins = {};

// Plugins ෆෝල්ඩර් එකෙන් කමාන්ඩ්ස් ඔටෝ ලෝඩ් කරන ෆන්ක්ෂන් එක
function loadPlugins() {
    const pluginsPath = path.join(__dirname, 'plugins');
    if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath);

    const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
        try {
            // පරණ කැෂේ මකලා අලුතින්ම ලෝඩ් කරනවා
            delete require.cache[require.resolve(path.join(pluginsPath, file))];
            const plugin = require(path.join(pluginsPath, file));
            global.plugins[file] = plugin;
            console.log(`Plugin Loaded Successfully: ${file} 🟢`);
        } catch (e) {
            console.error(`Error loading plugin ${file}:`, e);
        }
    }
}

async function connectToWhatsApp() {
    loadPlugins(); // බොට් ස්ටාර්ට් වෙද්දීම ප්ලගින්ස් ලෝඩ් කරනවා
    
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if(qr) {
            console.log('--- ᴀᴘᴇx ᴍᴅ: sᴄᴀɴ ᴛʜɪs ǫʀ ᴄᴏᴅᴇ ---');
            qrcode.generate(qr, { small: true });
        }
        
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('සම්බන්ධතාවය බිඳ වැටුණා. නැවත උත්සාහ කරමින්...', shouldReconnect);
            if(shouldReconnect) {
                connectToWhatsApp();
            }
        } else if(connection === 'open') {
            console.log('✨ Apex MD v3.0 සාර්ථකව වට්ස්ඇප් සමඟ සම්බන්ධ වුණා! ✅');
        }
    });

    // මැසේජ් හැන්ඩ්ලර් එක (මැසේජ් එකක් ආවාම ක්‍රියාත්මක වන කොටස)
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return; // බොට් තමන්ගේම මැසේජ් වලට රිප්ලයි කිරීම වැලැක්වීම

        const from = msg.key.remoteJid;
        const messageType = Object.keys(msg.message)[0];
        
        // මැසේජ් එකේ තියෙන Text එක වෙන් කර ගැනීම
        let body = '';
        if (messageType === 'conversation') {
            body = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        }

        const prefix = '.'; // අපේ බොට්ගේ ප්‍රධාන කමාන්ඩ් ලකුණ
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);

        // යූසර් රිප්ලයි කරපු මැසේජ් එකක්ද (Quoted Message) කියලා බලනවා
        const isReply = msg.message.extendedTextMessage?.contextInfo?.quotedMessage ? true : false;
        
        // රිප්ලයි කරපු මැසේජ් එකේ තිබ්බ Text එක ගන්නවා (මෙනු කැටගරි අල්ලන්න)
        let repliedText = '';
        if (isReply) {
            const quotedMsg = msg.message.extendedTextMessage.contextInfo.quotedMessage;
            repliedText = quotedMsg.conversation || quotedMsg.extendedTextMessage?.text || quotedMsg.imageMessage?.caption || '';
        }

        // හැම ප්ලගින් ෆයිල් එකක් හරහාම මේ දත්ත ටික Pass කරනවා
        for (const file in global.plugins) {
            const plugin = global.plugins[file];
            if (typeof plugin === 'function') {
                try {
                    await plugin(sock, msg, { from, body, isCmd, command, args, prefix, isReply, repliedText });
                } catch (err) {
                    console.error(`Error in plugin ${file}:`, err);
                }
            }
        }
    });
}

connectToWhatsApp();
