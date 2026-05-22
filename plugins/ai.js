const axios = require('axios');

module.exports = async (sock, msg, { from, body, isCmd, command, args, prefix, isReply, repliedText }) => {
    
    // 1. ප්‍රධාන මෙනු එකෙන් "1" එබුවොත් AI මෙනු එක දීම
    if (isReply && repliedText.includes('ᴀᴘᴇx ᴍᴅ wa bot') && body.trim() === '1') {
        
        const aiMenuText = `🧠 *ᴀᴘᴇx ᴍᴅ ᴀɪ sᴍᴀʀᴛ ᴀssɪsᴛᴀɴᴛ* 🧠
   _ඔබට අවශ්‍ය ඕනෑම දෙයක් AI වෙතින් අසා දැනගන්න_ 🤖

┌───────────────────────────┐
│
│  ℹ️ *ප්‍රශ්න ඇසීමට:*
│  මෙම පණිවිඩයට (Reply) ඔබගේ ප්‍රශ්නය 
│  සිංහලෙන් හෝ ඉංග්‍රීසියෙන් ලියා එවන්න.
│
│  *උදාහරණයක්:* _ලෝකයේ දිගම ගඟ කුමක්ද?_
│
└───────────────────────────┘

_ආපසු ප්‍රධාන මෙනුවට යාමට ${.}menu ටයිප් කරන්න._`;

        return await sock.sendMessage(from, { text: aiMenuText }, { quoted: msg });
    }

    // 2. යූසර් AI මෙනු එකට ප්‍රශ්නයක් රිප්ලයි කළොත් හෝ .ai කියලා කමාන්ඩ් එකෙන් ඇහුවොත්
    const isAiReply = isReply && repliedText.includes('ᴀᴘᴇx ᴍᴅ ᴀɪ sᴍᴀʀᴛ');
    
    if (command === 'ai' || isAiReply) {
        
        const query = command === 'ai' ? args.join(' ') : body.trim();
        if (!query || query === '1') return; 

        await sock.sendMessage(from, { text: `🤖 *Apex AI* ඔබගේ ප්‍රශ්නය ගැන සිතමින් පවතී... 🧠` }, { quoted: msg });

        try {
            const response = await axios.get(`https://api.sandipbaruwal.com.np/gptgo?text=${encodeURIComponent(query)}`);
            const aiResponse = response.data.choices[0].text;

            const finalReply = `🧠 *APEX AI ANSWER:* \n\n${aiResponse}\n\n🎬 _Powered by Movie Paradise Network_`;
            await sock.sendMessage(from, { text: finalReply }, { quoted: msg });

        } catch (error) {
            console.error(error);
            await sock.sendMessage(from, { text: `❌ කනගාටුයි, AI සර්වර් එක මේ වෙලාවේ කාර්යබහුලයි. පසුව උත්සාහ කරන්න.` }, { quoted: msg });
        }
    }
};
