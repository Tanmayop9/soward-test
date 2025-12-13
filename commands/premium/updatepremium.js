const { EmbedBuilder } = require('discord.js')
const config = require(`${process.cwd()}/config.json`)

module.exports = {
    name: 'updatepremium',
    aliases: ['updateprem', 'upremium'],
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

        const isPremium = await client.db.get(`uprem_${args[0]}`)
        if (!isPremium) {
            return message.channel.send({
                embeds: [embed.setDescription(`${client.emoji.cross} User is not a premium user. Use \`addpremium\` first.`)]
            })
        }

        let time
        if (args[1]) {
            const days = parseInt(args[1])
            time = Date.now() + 86400000 * days
        } else {
            time = await client.db.get(`upremend_${args[0]}`)
        }

        let count
        if (args[2]) {
            count = parseInt(args[2])
        } else {
            count = (await client.db.get(`upremcount_${args[0]}`)) || 0
        }

        await client.db.set(`uprem_${args[0]}`, true)
        await client.db.set(`upremend_${args[0]}`, time)
        await client.db.set(`upremcount_${args[0]}`, count)

        return message.channel.send({
            embeds: [
                embed.setDescription(
                    `${client.emoji.tick} <@${args[0]}>'s premium has been updated\n\n` +
                    `**Premium Count:** \`${count}\`\n` +
                    `**Expires:** <t:${Math.round(time / 1000)}:R>`
                )
            ]
        })
    }
}

