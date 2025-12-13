# 🤖 Fully Autonomous Bot System

## Overview

Friday Bot is now **fully autonomous** - it manages itself completely without owner intervention. The bot automatically updates, announces changes, manages features, and schedules commands.

## 🚀 Quick Setup

### 1. Configure Environment

```bash
# Enable full autonomy
AUTO_UPDATE_ENABLED=true
AUTO_APPLY_UPDATES=true
UPDATE_CHECK_INTERVAL=3600000  # Check every hour

# Your GitHub repository
GITHUB_REPO=Tanmayop9/soward-test
UPDATE_BRANCH=main
```

### 2. Setup Support Server

Run this command in your support server:

```
&botsetup support #announcements
```

This tells the bot where to announce updates automatically.

### 3. Enable Autonomy Mode

```
&botsetup autonomy on
```

**That's it!** The bot now runs completely on its own.

## 🎯 What the Bot Does Automatically

### ✅ Auto-Updates
- Checks GitHub every hour for new commits
- Automatically pulls latest code
- Creates backup before updating
- Runs health checks after update
- Automatically restarts if needed
- Rolls back if anything fails

### ✅ Auto-Announcements
- Announces updates in support server
- Shows what features/commands were added
- Includes sneak peek of next update
- Announces to all servers with notice channels configured

### ✅ Auto-Command Management
- Enables/disables commands on schedule
- Example: Enable `ping` command every Saturday
- Disabled commands are completely hidden
- No trace of disabled commands in help menu

### ✅ Auto-Feature Management
- Enables/disables features dynamically
- Gradual rollout to percentage of servers
- Tracks usage statistics
- Beta feature testing

## 📅 Command Scheduling Example

Enable a command every weekend:

```bash
# Schedule ping command
# Enable on Saturday midnight, disable on Sunday midnight
&cmdschedule schedule ping "0 0 * * 6" "0 0 * * 0"
```

### Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─ Day of week (0-6, 0=Sunday)
│ │ │ └─── Month (1-12)
│ │ └───── Day of month (1-31)
│ └─────── Hour (0-23)
└───────── Minute (0-59)
```

### Common Schedules

```bash
# Every Saturday at midnight
"0 0 * * 6"

# Every Sunday at midnight
"0 0 * * 0"

# Every day at 9 AM
"0 9 * * *"

# Every Monday at 6 PM
"0 18 * * 1"

# First day of month at midnight
"0 0 1 * *"
```

## 📢 Announcement System

### Add Sneak Peek for Next Update

```bash
# Add a teaser for upcoming feature
&announce peek add giveaway "Giveaway Command" "Create and manage server giveaways with role requirements and multiple winners"
```

### View All Sneak Peeks

```bash
&announce peek list
```

### Mark as Released

```bash
# When you actually add the feature
&announce peek release giveaway
```

### Send Custom Announcement

```bash
&announce custom "Important Update" "The bot will undergo maintenance on Saturday"
```

### Set Notice Channel (Per Server)

```bash
&announce setchannel #updates
```

## 🎮 Feature Management

### List All Features

```bash
&features list
```

### Enable Feature for All Servers

```bash
&features enable ai_commands 100
```

### Gradual Rollout (Beta Testing)

```bash
# Enable for 10% of servers first
&features enable new_feature 10

# Increase to 25%
&features rollout new_feature 25

# Full rollout
&features rollout new_feature 100
```

### Disable Feature

```bash
&features disable problematic_feature
```

## 🔄 Update Management

### Check Update Status

```bash
&update status
```

### Manually Check for Updates

```bash
&update check
```

### Force Apply Update

```bash
&update apply
```

### View Update History

```bash
&announce history
```

## 📊 Bot Configuration Status

```bash
&botsetup status
```

Shows:
- Autonomy mode status
- Auto-update configuration
- Support server setup
- Announcement channel
- System health

## 🎨 Example Update Announcement

When bot updates itself, it automatically sends this to support server and all configured notice channels:

```
@everyone 🎊 Bot Update Released!

🎉 Friday Updated to v2.1.0!
Add giveaway system and improve performance

📝 New Commands Added
• giveaway create - Create a new giveaway
• giveaway end - End a giveaway early
• giveaway reroll - Reroll giveaway winner

✨ New Features
• Advanced giveaway system
• Multiple winner support
• Role requirements

⚡ Improvements
• Faster command execution
• Reduced memory usage

👀 Sneak Peek - Coming Next Update
🔜 Music Commands - Play music from YouTube, Spotify, and SoundCloud

Updated by: Tanmay | discord.gg/S7Ju9RUpbT
```

## 🔒 Safety Features

### Automatic Backups
- Creates backup before every update
- Keeps last 5 backups
- Compressed to save space

### Health Checks
- Validates bot is working after update
- Checks database connectivity
- Verifies critical files exist

### Automatic Rollback
- Rolls back if health check fails
- Restores from backup automatically
- Sends failure notification

### Rate Limiting
- 1 second delay between announcements
- Prevents Discord rate limits
- Queues messages properly

## 📝 Workflow Example

### Day 1: Add New Feature
```bash
# Add sneak peek
&announce peek add polls "Poll Command" "Create polls with reactions"

# Code the feature locally
git commit -m "Add poll command"
git push origin main
```

### Day 1 (1 hour later): Bot Auto-Updates
- Bot detects new commit
- Creates backup
- Pulls latest code
- Runs npm install
- Performs health check
- Restarts automatically
- Announces in support server with sneak peek

### Day 2: Gradual Rollout
```bash
# Enable for 10% to test
&features enable polls 10

# Monitor for issues
&features status polls

# Increase gradually
&features rollout polls 25
&features rollout polls 50
&features rollout polls 100
```

### Day 3: Schedule Related Command
```bash
# Disable poll command on weekdays, enable on weekends
&cmdschedule schedule poll "0 0 * * 6" "0 0 * * 1"
```

## 🛠️ Troubleshooting

### Bot Didn't Auto-Update

Check configuration:
```bash
&botsetup status
```

Verify environment variables:
- `AUTO_UPDATE_ENABLED=true`
- `AUTO_APPLY_UPDATES=true`

### No Announcement Received

1. Check support server setup:
```bash
&botsetup status
```

2. Set up if needed:
```bash
&botsetup support #announcements
```

3. For individual servers:
```bash
&announce setchannel #updates
```

### Command Not Hiding When Disabled

The command should be completely invisible:
- Not shown in help menu
- No error message when used
- Acts as if command doesn't exist

If still showing, restart bot:
```bash
&eval process.exit(0)
```

### Update Failed

Bot automatically rolls back. Check:
```bash
&announce history
```

View detailed logs in bot console.

## 🎯 Best Practices

### 1. Test in Staging First
- Use a test server before production
- Enable autonomy in test environment first

### 2. Monitor Announcements
- Keep support server announcement channel monitored
- Set up Discord notifications

### 3. Gradual Rollouts
- Start with 10% for new features
- Monitor for 24 hours before increasing
- Full rollout only after testing

### 4. Schedule Wisely
- Don't disable critical commands
- Consider user timezones
- Test schedules before production

### 5. Backup Regularly
- Bot auto-backs up before updates
- Keep additional manual backups
- Store backups offsite

## 📚 Advanced Configuration

### Custom Update Interval

```bash
# Check every 30 minutes
UPDATE_CHECK_INTERVAL=1800000

# Check every 6 hours
UPDATE_CHECK_INTERVAL=21600000
```

### Specific Branch Tracking

```bash
# Track development branch
UPDATE_BRANCH=dev

# Track specific release branch
UPDATE_BRANCH=v2.0-stable
```

### Multiple Announcement Channels

Bot can announce to:
- Support server (configured via `&botsetup support`)
- All servers with notice channels (configured via `&announce setchannel`)

## 🔐 Security

### Repository Access
- Bot only pulls from configured repository
- Input validation prevents command injection
- No remote code execution

### Backup Security
- Backups exclude node_modules
- Excludes sensitive data folders
- Keeps only last 5 backups

### Update Validation
- Validates repository and branch names
- Sanitizes all user inputs
- Runs health checks before finalizing

## 📞 Support

- **Discord:** https://discord.gg/S7Ju9RUpbT
- **GitHub:** https://github.com/Tanmayop9/soward-test/issues

---

**Version:** v2-alpha-1
**Last Updated:** December 2025
**Status:** ✅ Fully Operational

**The bot now runs itself. Sit back and relax! 🎉**
