module.exports = async (sock, msg, { from, body, isCmd, command, prefix, isReply, repliedText }) => {
    
    // 1. ප්‍රධාන මෙනුව ලබාදීම (#menu, .menu, හෝ නිකන්ම menu ගැහුවොත්)
    if (command === 'menu' || body === '.menu' || body === '#menu') {
        
        // ඔයාගේ බොට් බැනර් එකේ ලින්ක් එක මෙතනට දාන්න (දැනට මම ලස්සන default එකක් දැම්මා)
        const menuImageUrl = 'https://i.imgur.com/8N4pZ2h.jpeg'; 

        const menuText = `✨ ᴀᴘᴇx ᴍᴅ ᴠᴇʀsɪᴏɴ 𝟹.𝟶 ✨
   𝖲𝗒𝗌𝗍𝖾mem 𝖲𝗍𝖺𝗍𝗎𝗌: 𝖠𝖼𝗍𝗂𝗏𝖾 𝖮𝗇  🚀

┌─── ❖ 🎛️ 𝖲𝖸𝖲𝖳𝖤𝖬 𝖨𝖭𝖥𝖮 ❖ ───┐
│ 
│ 🛠️  𝖯𝗋𝖾𝖿𝗂𝗑   :  [ ${.} ]
│ 
│ 👑  𝖢𝗋𝖾𝖺𝗍𝗈𝗋  :  A𝗉𝖾𝗑 
│ 
└───────────────────────────┘

┌─── ❖ 📂 𝖬𝖠𝖨𝖭 𝖬𝖤𝖭𝖴 ❖ ───┐
│
│  [𝟢𝟣]  🧠  𝖠𝖨  𝖢𝗈𝗆𝗆𝖺𝗇𝖽𝗌
│  [𝟢𝟛]  📥  𝖬𝗈𝖵𝗂𝖾 & 𝖬𝖾𝖽𝗂𝖺  𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋
│  [𝟢𝟛]  👥  𝖦𝗋𝗈𝗎𝗉  𝖬𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍
│  [𝟢𝟦]  ⚙️  𝖢𝗈𝗋𝖾  𝖲𝗒𝗌𝗍𝖾𝗆
│  [𝟢𝟧]  👑  𝖮𝗐𝗇𝖾𝗋  𝖯𝖺𝗇𝖾𝗅
│  [𝟢𝟨]  🛠️  𝖴internal  𝖳𝗈𝗈𝗅𝗌
│
└───────────────────────────┘

📝 *𝖱𝖾𝗉??𝗒  𝗐𝗂𝗍𝗁  𝗍𝗁𝖾  𝖭𝗎??𝖻𝖾𝗋  𝗍??  𝗇𝖺𝗏𝗂𝗀𝖺??𝖾.*
🎬 𝖯𝗈𝗐𝖾𝗋𝖾𝖽  𝖻𝗒  𝖬𝗈𝗏𝗂𝖾  𝖯𝖺𝗋𝖺𝖽𝗂𝗌𝖾  𝖭𝖾𝗍𝗐𝗈𝗋𝗄`;

        // Image එකයි Text එකයි එකතු කරලා වට්ස්ඇප් එකට යැවීම
        await sock.sendMessage(from, { 
            image: { url: menuImageUrl }, 
            caption: menuText 
        }, { quoted: msg });
    }

    // 2. යූසර් මෙනු එකට "2" කියලා රිප්ලයි කළොත් (Movie & Downloader Menu)
    // මෙතනදී "✨ ᴀᴘᴇx ᴍᴅ ᴠᴇʀsɪᴏɴ 𝟹.𝟶 ✨" කොටස මඟින් බොට් අඳුරගන්නවා මේ රිප්ලයි කළේ අපේ මෙනු එකටමයි කියලා.
    if (isReply && repliedText.includes('ᴀᴘᴇx ᴍᴅ ᴠᴇʀsɪᴏɴ') && body.trim() === '2') {
        
        const downloadMenu = `📥 *𝖬𝖮𝖵𝖨𝖤 & 𝖬𝖤𝖣𝖨𝖠 𝖣𝖮𝖶𝖭𝖫𝖮A𝖣𝖤𝖱* 📥

*Commands:*
🎬  ${.}movie <නම> - Movie සෙවීම සහ බාගත කිරීම
📹  ${.}video <link> - YouTube/FB වීඩියෝ බාගත කිරීම
🎵  ${.}song <නම/link> - සින්දු බාගත කිරීම

_නැවත ප්‍රධාන මෙනුවට යාමට ${.}menu ටයිප් කරන්න._`;

        await sock.sendMessage(from, { text: downloadMenu }, { quoted: msg });
    }
};
