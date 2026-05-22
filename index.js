const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const path = require('path');

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
                
                .card { background: rgba(20, 20, 35, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); width: 100%; max-width: 420px; padding: 40px 30px; border-radius: 30px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); text-align: center; position: relative; }
                
                .crown-icon { font-size: 50px; color: #8b5cf6; margin-bottom: 15px; filter: drop-shadow(0 0 15px #8b5cf6); }
                
                h2 { font-size: 28px; font-weight: 800; letter-spacing: 2px; margin-bottom: 5px; color: #fff; text-transform: uppercase; }
                .sub-title { font-size: 11px; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 30px; font-weight: 600; }
                
                /* Tab Buttons */
                .tab-container { background: #0c0c14; padding: 6px; border-radius: 15px; display: flex; margin-bottom: 25px; border: 1px solid rgba(255, 255, 255, 0.02); }
                .tab-btn { flex: 1; padding: 14px; border: none; border-radius: 11px; font-size: 14px; font-weight: 600; cursor: pointer; transition: 0.3s; }
                .tab-btn.active { background: #1e1e2f; color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
                .tab-btn.inactive { background: transparent; color: #64748b; }
                
                /* Input Container */
                .input-container { background: #0c0c14; border-radius: 15px; padding: 18px; display: flex; align-items: center; margin-bottom: 10px; border: 1px solid rgba(255, 255, 255, 0.03); transition: 0.3s; }
                .input-container:focus-within { border-color: #8b5cf6; box-shadow: 0 0 15px rgba(139, 92, 246, 0.2); }
                .input-container i { color: #64748b; font-size: 20px; margin-right: 15px; }
                .input-container input { background: transparent; border: none; color: #fff; font-size: 17px; width: 100%; outline: none; letter-spacing: 1px; }
                
                .notice { font-size: 11px; color: #64748b; margin-bottom: 30px; text-align: center; }
                
                /* Main Action Button */
                .submit-btn { background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%); color: #fff; width: 100%; padding: 18px; border: none; border-radius: 15px; font-size: 15px; font-weight: 700; letter-spacing: 1px; uppercase; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4); text-transform: uppercase; }
                .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(139, 92, 246, 0.6); }
                
                /* Result Output Area */
                #result { margin-top: 25px; font-size: 22px; font-weight: 800; color: #a855f7; letter-spacing: 3px; min-height: 30px; filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.5)); }
                
                .footer-text { margin-top: 35px; font-size: 11px; color: #64748b; letter-spacing: 1px; text-transform: uppercase; }
                .footer-text span { font-family: 'Georgia', serif; font-style: italic; color: #e2e8f0; font-size: 13px; letter-spacing: 0.5px; text-transform: none; display: block; margin-top: 5px; }
            </style>
        </head>
        <body>

            <div class="card">
                <div class="crown-icon"><i class="fa-solid fa-crown"></i></div>
                <h2>APEX MD PRO</h2>
                <div class="sub-title">Premium Device Linking Suite</div>
                
                <div class="tab-container">
                    <button class="tab-btn active">Phone Number</button>
                    <button class="tab-btn inactive" onclick="alert('QR Scan දැනට සක්‍රීය නැත. කරුණාකර Phone Number ක්‍රමය භාවිතා කරන්න.')">QR Scan</button>
                </div>
                
                <div class="input-container">
                    <i class="fa-solid fa-phone"></i>
                    <input type="text" id="number" placeholder="9476xxxxxxx">
                </div>
                <div class="notice">*Enter number with country code (no + sign)</div>
                
                <button class="submit-btn" onclick="getPairCode()">Get Pairing Code</button>
                
                <div id="result"></div>
                
                <div class="footer-text">
                    Developed By
                    <span>MR Apex Dev</span>
                </div>
            </div>

            <script>
                async function getPairCode() {
                    const num = document.getElementById('number').value.trim();
                    const resultDiv = document.getElementById('result');
                    if(!num) return alert('කරුණාකර ඔබගේ වට්ස්ඇප් අංකය ඇතුළත් කරන්න!');
                    
                    resultDiv.style.color = '#94a3b8';
                    resultDiv.innerText = 'GENERATING... 🔄';
                    
                    try {
                        const res = await fetch('/code?number=' + num);
                        const data = await res.json();
                        if(data.code) {
                            resultDiv.style.color = '#38bdf8';
                            resultDiv.innerText = data.code;
                        } else {
                            resultDiv.style.color = '#ef4444';
                            resultDiv.innerText = "FAILED ❌";
                        }
                    } catch(e) {
                        resultDiv.style.color = '#ef4444';
                        resultDiv.innerText = "ERROR ❌";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Pair Code Generator Logic
app.get('/code', async (req, res) => {
    let phoneNum = req.query.number;
    if (!phoneNum) return res.json({ error: 'Number is required' });
    phoneNum = phoneNum.replace(/[^0-9]/g, '');

    try {
        const { state } = await useMultiFileAuthState(path.join(__dirname, 'auth_info'));
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' })
        });

        if (!sock.authState.creds.registered) {
            await delay(2000);
            const code = await sock.requestPairingCode(phoneNum);
            return res.json({ code: code });
        } else {
            return res.json({ error: 'Already registered' });
        }
    } catch (err) {
        return res.json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
