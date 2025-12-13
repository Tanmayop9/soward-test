const { EmbedBuilder } = require('discord.js')
const config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'addpremium',
    aliases: ['addprem', 'premium+'],
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

        const days = args[1] ? parseInt(args[1]) : 30
        const count = args[2] ? parseInt(args[2]) : 0
        const time = Date.now() + 86400000 * days

        await client.db.set(`uprem_${args[0]}`, true)
        await client.db.set(`upremend_${args[0]}`, time)
        await client.db.set(`upremcount_${args[0]}`, count)
        await client.db.set(`upremserver_${args[0]}`, [])

        return message.channel.send({
            embeds: [
                embed.setDescription(
                    `${client.emoji.tick} <@${args[0]}> has been added as a premium user\n\n` +
                    `**Premium Count:** \`${count}\`\n` +
                    `**Expires:** <t:${Math.round(time / 1000)}:R>`
                )
            ]
        })
    }
}