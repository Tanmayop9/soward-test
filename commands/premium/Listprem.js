const { EmbedBuilder } = require('discord.js');
const config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'listpremium',
    aliases: ['listprem', 'premusers'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!config.premium.includes(message.author.id)) return;

        const embed = client.util.embed().setColor(client.color);

        // Fetch all keys from the database
        const keys = await client.db.all();

        // Filter keys that start with 'uprem_' and have value true
        const premiumUsers = keys.filter(key => key.ID.startsWith('uprem_') && key.data === true);

        if (premiumUsers.length === 0) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(`${client.emoji.cross} No premium users found`)
                ]
            });
        }

        // Create a list of premium user details
        const premiumUserList = await Promise.all(premiumUsers.map(async user => {
            const userId = user.ID.split('_')[1];
            const userEnd = await client.db.get(`upremend_${userId}`);
            const userCount = await client.db.get(`upremcount_${userId}`);

            return `${client.emoji.dot} <@${userId}>\n  **Count:** \`${userCount}\` **Expires:** <t:${Math.round(userEnd / 1000)}:R>`;
        }));

        return message.channel.send({
            embeds: [
                embed
                    .setTitle('Premium Users')
                    .setDescription(premiumUserList.join('\n\n'))
            ]
        });
    }
};

