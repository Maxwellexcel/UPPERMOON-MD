const config = require('../config');
const { parseJid } = require('.');
const { getStatus, getMessage } = require('./database/greetings');

async function Greetings(data, api) {
    const groupData = await api.groupMetadata(data.id);
    
    for (const participant of data.participants) {
        let profilePictureUrl;
        
        try {
            profilePictureUrl = await api.profilePictureUrl(participant);
        } catch (error) {
            console.error('Error fetching profile picture:', error);
            profilePictureUrl = '../config';
        }
        
        switch (data.subject) {
            case 'action': {
                const status = await getStatus(data.id, 'desc');
                
                if (!status) return;
                
                const message = await getMessage(data.id, 'desc');
                console.log(message);
                
                let formattedMessage = message.text
                    .replace(/@user/gi, '@' + participant.split('@')[0])
                    .replace(/@gname/gi, groupData.name)
                    .replace(/@count/gi, groupData.participants.length)
                    .replace(/@gdesc/gi, groupData.desc);
                
                if (/{pp}/.test(formattedMessage)) {
                    api.sendMessage(data.id, {
                        image: { url: profilePictureUrl },
                        caption: formattedMessage.replace(/{pp}/, ''),
                        mentions: parseJid(formattedMessage)
                    });
                } else {
                    api.sendMessage(data.id, {
                        text: formattedMessage,
                        mentions: parseJid(formattedMessage)
                    });
                }
                break;
            }
            case 'message': {
                const status = await getStatus(data.id, 'test');
                
                if (!status) return;
                
                const message = await getMessage(data.id, 'test');
                
                let formattedMessage = message.text
                    .replace(/@user/gi, '@' + participant.split('@')[0])
                    .replace(/@gname/gi, groupData.subject)
                    .replace(/@count/gi, groupData.participants.length)
                    .replace(/@gdesc/gi, groupData.desc);
                
                if (/{pp}/.test(formattedMessage)) {
                    api.sendMessage(data.id, {
                        image: { url: profilePictureUrl },
                        caption: formattedMessage.replace(/{pp}/, ''),
                        mentions: parseJid(formattedMessage)
                    });
                } else {
                    api.sendMessage(data.id, {
                        text: formattedMessage,
                        mentions: parseJid(formattedMessage)
                    });
                }
                break;
            }
        }
    }
}

module.exports = Greetings;
