const { default: makeWASocket, useMultiFileAuthState, delay, disconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// ✨ Premium Dark Web UI Setup (ඔයා එවපු ස්ක්‍රීන්ෂොට් එක වගේමයි 😍)
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>APEX MD - PREMIUM PAIRING SUITE</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-shadow: none; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                body { background: linear-gradient(135deg, #09090e 0%, #111126 100%); color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }
                .card { background: rgba(20, 20, 35, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); width: 100%; max-width: 420px; padding: 40px 30px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); text-align: center; }
                .crown-icon { font-size: 50px; color: #8b5cf6; margin-bottom: 15px; filter: drop-shadow(0 0 15px #8b5cf6); }
                h2 { font-size: 28px; font-weight: 800; letter-spacing: 2px; margin-bottom: 5px; text-transform: uppercase; }
                .sub-title { font-size: 11px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 30px; font-weight: 600; }
                .tab-container { background: #0c0c14; padding: 6px; border-radius: 15px; display: flex; margin-bottom: 25px; }
                .tab-btn { flex: 1; padding: 14px; border: none; border-radius: 11px; font-size: 14px; font-weight: 600; }
                .tab-btn.active { background: #1e1e2f; color: #fff; }
                .input-container { background: #0c0c14; border-radius: 15px; padding: 18px; display: flex; align-items: center; margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.03); }
                .input-container i { color: #64748b; font-size: 20px; margin-right: 15px; }
                .input-container input { background: transparent; border: none; color: #fff; font-size: 17px; width: 100%; outline: none; }
                .notice { font-size: 11px; color: #64748b; margin-bottom: 30px; }
                .submit-btn { background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%); color: #fff; width: 100%; padding: 18px; border: none; border-radius: 15px; font-size: 15px; font-weight: 700; cursor: pointer; text-transform: uppercase; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4); }
                #result { margin-top: 25px; font-size: 22px; font-weight: 800; color: #a855f7; letter-spacing: 3px; }
                .footer-text { margin-top: 35px; font-size: 11px; color: #64748b; }
                .footer-text span { color: #e2e8f0; font-size: 13px; display: block; margin-top: 5px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="crown-icon"><i class="fa-solid fa-crown"></i></div>
                <h2>APEX MD PRO</h2>
                <div class="sub-title">Premium Device Linking Suite</div>
                <div class="tab-container"><button class="tab-btn active">Phone Number</button></div>
                <div class="input-container"><i class="fa-solid fa-phone"></i><input type="text" id="number" placeholder="9476xxxxxxx"></div>
                <div class="notice">*Enter number with country code (no + sign)</div>
                <button class="submit-btn" onclick="getPairCode()">Get Pairing Code</button>
                <div id="result"></div>
                <div class="footer-text">Developed By<span>MR Apex Dev</span></div>
            </div>
            <script>
                async function getPairCode() {
                    const num = document.getElementById('number').value.trim();
                    const resultDiv = document.getElementById('result');
                    if(!num) return alert('කරුණාකර අංකයක් ඇතුළත් කරන්න!');
                    resultDiv.innerText = 'GENERATING... 🔄';
                    try {
                        const res = await fetch('/code?number=' + num);
                        const data = await res.json();
                        if(data.code) { resultDiv.innerText = data.code; } 
                        else { resultDiv.innerText = "FAILED ❌"; }
                    } catch(e) { resultDiv.innerText = "ERROR ❌"; }
                }
            </script>
        </body>
        </html>
    `);
});

// Pair Code Generator සහ GitHub එකට සෙෂන් එක යැවීම
app.get('/code', async (req, res) => {
    let phoneNum = req.query.number;
    if (!phoneNum) return res.json({ error: 'Number is required' });
    phoneNum = phoneNum.replace(/[^0-9]/g, '');

    try {
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info'));
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' })
        });

        if (!sock.authState.creds.registered) {
            await delay(2000);
            const code = await sock.requestPairingCode(phoneNum);
            
            // වට්ස්ඇප් එකෙන් ලොග් වුණාම සෙෂන් දත්ත GitHub එකට අප්ලෝඩ් කරන ඉවෙන්ට් එක
            sock.ev.on('creds.update', async () => {
                await saveCreds();
                try {
                    const credsData = fs.readFileSync(path.join(__dirname, 'auth_info/creds.json'), 'utf8');
                    const base64Session = Buffer.from(credsData).toString('base64');
                    
                    // GitHub API එක හරහා ඔයාගේ Repository එකට 'session.txt' කියලා මේක ඔටෝම සේව් වෙනවා!
                    const githubToken = process.env.GH_TOKEN;
                    const repoName = process.env.GH_REPO; // උදා: username/bot-repo
                    
                    if (githubToken && repoName) {
                        await axios.put(`https://api.github.com/repos/${repoName}/contents/session.txt`, {
                            message: "📥 Apex MD Session Auto-Updated",
                            content: base64Session
                        }, { headers: { Authorization: `token ${githubToken}` } });
                        console.log("✅ Session text uploaded to GitHub successfully!");
                    }
                } catch (err) {
                    console.error("GitHub upload error:", err.message);
                }
            });

            return res.json({ code: code });
        } else {
            return res.json({ error: 'Already registered' });
        }
    } catch (err) {
        return res.json({ error: 'Server error' });
    }
});

// 🚀 බොට්ගේ ප්ලගින් ලෝඩරය සහ මැසේජ් හැන්ඩ්ලර් එක (Vercel එක ඇතුළෙන්ම බොට් ලයිව් තියන කොටස)
// [මෙහිදී වට්ස්ඇප් මැසේජ් කියවා ප්ලගින්ස් රන් කරවන කෝඩ් එක ක්‍රියාත්මක වේ]

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
