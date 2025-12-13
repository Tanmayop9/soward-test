const { EmbedBuilder } = require('discord.js')
const config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'removepremium',
    aliases: ['remprem', 'premium-'],
    category: 'Owner',
    run: async (client, message, args) => {
        if (!config.premium.includes(message.author.id)) return
        
        const embed = client.util.embed().setColor(client.color)
        
        if (!args[0]) {
            return message.channel.send({
                embeds: [embed.setDescription(`${client.emoji.cross} Please provide a user ID`)]
            })
        }

        try {
            await client.users.fetch(args[0])
        } catch (error) {
            return message.channel.send({
                embeds: [embed.setDescription(`${client.emoji.cross} Invalid user ID`)]
            })
        }

        const use = await client.db.get(`uprem_${args[0]}`)
        if (!use) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(`${client.emoji.cross} <@${args[0]}> is not a premium user`)
                ]
            })
        }

        await client.db.delete(`uprem_${args[0]}`)
        await client.db.delete(`upremend_${args[0]}`)
        await client.db.delete(`upremcount_${args[0]}`)
        await client.db.delete(`upremserver_${args[0]}`)

        return message.channel.send({
            embeds: [
                embed.setDescription(`${client.emoji.tick} <@${args[0]}> has been removed from premium users`)
            ]
        })
    }
}
