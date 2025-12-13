/**
 * @author Tanmay
 * @recoded Nerox Studios
 * @version v2-alpha-1
 * @description Manage feature flags
 */

module.exports = {
    name: 'features',
    aliases: ['feature', 'flags'],
    category: 'dev',
    premium: false,
    cooldown: 5,
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

        if (!subcommand || subcommand === 'list') {
            // List all features
            const report = client.featureManager.getStatusReport();

            const embed = client.util
                .embed()
                .setColor(client.color)
                .setTitle('🚩 Feature Flags')
                .setDescription(
                    `Total: ${report.totalFeatures} | Enabled: ${report.enabled} | Beta: ${report.beta}`
                );

            const enabled = report.features.filter((f) => f.enabled);
            const disabled = report.features.filter((f) => !f.enabled);

            if (enabled.length > 0) {
                embed.addFields([
                    {
                        name: '✅ Enabled Features',
                        value: enabled
                            .map(
                                (f) =>
                                    `\`${f.name}\` - ${f.rollout} ${f.beta ? '(Beta)' : ''}\n${f.description}`
                            )
                            .join('\n\n'),
                    },
                ]);
            }

            if (disabled.length > 0) {
                embed.addFields([
                    {
                        name: '❌ Disabled Features',
                        value: disabled
                            .map((f) => `\`${f.name}\` - ${f.description}`)
                            .join('\n'),
                    },
                ]);
            }

            return message.channel.send({ embeds: [embed] });
        }

        if (subcommand === 'enable') {
            const featureName = args[1];
            const rollout = parseInt(args[2]) || 100;

            if (!featureName) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Usage: \`features enable <name> [rollout%]\``
                            ),
                    ],
                });
            }

            const success = await client.featureManager.enableFeature(featureName, rollout);

            if (success) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(0x00ff00)
                            .setDescription(
                                `${client.emoji.tick} | Feature \`${featureName}\` enabled with ${rollout}% rollout`
                            ),
                    ],
                });
            }

            return message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(0xff0000)
                        .setDescription(
                            `${client.emoji.cross} | Failed to enable feature \`${featureName}\``
                        ),
                ],
            });
        }

        if (subcommand === 'disable') {
            const featureName = args[1];

            if (!featureName) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Usage: \`features disable <name>\``
                            ),
                    ],
                });
            }

            const success = await client.featureManager.disableFeature(featureName);

            if (success) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(0x00ff00)
                            .setDescription(
                                `${client.emoji.tick} | Feature \`${featureName}\` disabled`
                            ),
                    ],
                });
            }

            return message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(0xff0000)
                        .setDescription(
                            `${client.emoji.cross} | Failed to disable feature \`${featureName}\``
                        ),
                ],
            });
        }

        if (subcommand === 'rollout') {
            const featureName = args[1];
            const rollout = parseInt(args[2]);

            if (!featureName || isNaN(rollout)) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Usage: \`features rollout <name> <percentage>\``
                            ),
                    ],
                });
            }

            const success = await client.featureManager.updateRollout(featureName, rollout);

            if (success) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(0x00ff00)
                            .setDescription(
                                `${client.emoji.tick} | Feature \`${featureName}\` rollout updated to ${rollout}%`
                            ),
                    ],
                });
            }

            return message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(0xff0000)
                        .setDescription(
                            `${client.emoji.cross} | Failed to update rollout for \`${featureName}\``
                        ),
                ],
            });
        }

        if (subcommand === 'status') {
            const featureName = args[1];

            if (!featureName) {
                return message.channel.send({
                    embeds: [
                        client.util
                            .embed()
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.cross} | Usage: \`features status <name>\``
                            ),
                    ],
                });
            }

            const stats = client.featureManager.getUsageStats(featureName);
            const enabled = client.featureManager.isEnabled(featureName, message.guild.id);

            return message.channel.send({
                embeds: [
                    client.util
                        .embed()
                        .setColor(client.color)
                        .setTitle(`🚩 Feature: ${featureName}`)
                        .addFields([
                            {
                                name: 'Status',
                                value: enabled ? '✅ Enabled' : '❌ Disabled',
                                inline: true,
                            },
                            {
                                name: 'Total Usage',
                                value: stats.totalUsage.toString(),
                                inline: true,
                            },
                            {
                                name: 'Unique Guilds',
                                value: stats.uniqueGuilds.toString(),
                                inline: true,
                            },
                            {
                                name: 'This Guild',
                                value: enabled ? '✅ Enabled' : '❌ Disabled',
                            },
                        ]),
                ],
            });
        }

        // Show help
        return message.channel.send({
            embeds: [
                client.util
                    .embed()
                    .setColor(client.color)
                    .setTitle('🚩 Features Command')
                    .setDescription(
                        'Manage feature flags\n\n' +
                            '**Subcommands:**\n' +
                            '`list` - List all features\n' +
                            '`enable <name> [rollout%]` - Enable a feature\n' +
                            '`disable <name>` - Disable a feature\n' +
                            '`rollout <name> <percentage>` - Update rollout\n' +
                            '`status <name>` - Show feature status'
                    ),
            ],
        });
    },
};
