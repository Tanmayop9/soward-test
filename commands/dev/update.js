/**
 * @author Tanmay
 * @recoded Nerox Studios
 * @version v2-alpha-1
 * @description Manage bot updates
 */

module.exports = {
    name: 'update',
    aliases: ['updater', 'upgrade'],
    category: 'dev',
    premium: false,
    cooldown: 10,
    run: async (client, message, args) => {
        // Owner only command
        if (!client.config.owner.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | This command is owner only!`),
                ],
            });
        }

        const subcommand = args[0]?.toLowerCase();

        if (!subcommand || subcommand === 'status') {
            // Show update status
            const currentCommit = await client.autoUpdater.getCurrentCommit();
            const latestCommit = await client.autoUpdater.getLatestCommit();

            const embed = client.util
                .embed()
                .setColor(client.color)
                .setTitle('🔄 Auto-Updater Status')
                .addFields([
                    {
                        name: 'Current Version',
                        value: `\`${client.version}\``,
                        inline: true,
                    },
                    {
                        name: 'Current Commit',
                        value: `\`${currentCommit?.substring(0, 7) || 'Unknown'}\``,
                        inline: true,
                    },
                    {
                        name: 'Auto-Update',
                        value: client.autoUpdater.config.enabled ? '✅ Enabled' : '❌ Disabled',
                        inline: true,
                    },
                    {
                        name: 'Auto-Apply',
                        value: client.autoUpdater.config.autoApply
                            ? '✅ Enabled'
                            : '❌ Disabled',
                        inline: true,
                    },
                    {
                        name: 'Check Interval',
                        value: `${client.autoUpdater.config.checkInterval / 60000} minutes`,
                        inline: true,
                    },
                    {
                        name: 'Branch',
                        value: `\`${client.autoUpdater.config.branch}\``,
                        inline: true,
                    },
                ]);

            if (latestCommit && currentCommit !== latestCommit.sha) {
                embed.addFields([
                    {
                        name: '🆕 Update Available',
                        value: latestCommit.message,
                    },
                    {
                        name: 'Latest Commit',
                        value: `\`${latestCommit.sha.substring(0, 7)}\` by ${latestCommit.author}`,
                    },
                ]);
                embed.setColor(0x00ff00);
            } else {
                embed.setDescription('✅ Bot is up to date!');
            }

            return message.channel.send({ embeds: [embed] });
        }

        if (subcommand === 'check') {
            // Check for updates
            const msg = await message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.process} | Checking for updates...`),
                ],
            });

            const updateInfo = await client.autoUpdater.checkForUpdates();

            if (!updateInfo) {
                return msg.edit({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Failed to check for updates`
                            ),
                    ],
                });
            }

            if (updateInfo.upToDate) {
                return msg.edit({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | Bot is up to date!`),
                    ],
                });
            }

            return msg.edit({
                embeds: [
                    client.util
                        .embed()
                        .setColor(0x00ff00)
                        .setTitle('🆕 Update Available')
                        .setDescription(updateInfo.message)
                        .addFields([
                            {
                                name: 'Current',
                                value: `\`${updateInfo.current.substring(0, 7)}\``,
                                inline: true,
                            },
                            {
                                name: 'Latest',
                                value: `\`${updateInfo.latest.substring(0, 7)}\``,
                                inline: true,
                            },
                            {
                                name: 'Author',
                                value: updateInfo.author,
                                inline: true,
                            },
                        ]),
                ],
            });
        }

        if (subcommand === 'apply') {
            // Apply update
            const updateInfo = await client.autoUpdater.checkForUpdates();

            if (!updateInfo || updateInfo.upToDate) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.tick} | Bot is already up to date!`),
                    ],
                });
            }

            const msg = await message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.process} | Applying update...\nThis may take a few moments.`
                        ),
                ],
            });

            const success = await client.autoUpdater.applyUpdate(updateInfo);

            if (success) {
                return msg.edit({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(0x00ff00)
                            .setDescription(
                                `${client.emoji.tick} | Update applied successfully!\n\nBot will restart in 30 seconds...`
                            ),
                    ],
                });
            }

            return msg.edit({
                embeds: [
                    client.util
                        .embed()
                        .setColor(0xff0000)
                        .setDescription(
                            `${client.emoji.cross} | Failed to apply update. Rollback initiated.`
                        ),
                ],
            });
        }

        // Show help
        return message.channel.send({
            embeds: [
                client.util
                    .embed()
                    .setColor(client.color)
                    .setTitle('🔄 Update Command')
                    .setDescription(
                        'Manage bot updates\n\n' +
                            '**Subcommands:**\n' +
                            '`status` - Show update status\n' +
                            '`check` - Check for updates\n' +
                            '`apply` - Apply available update'
                    ),
            ],
        });
    },
};
