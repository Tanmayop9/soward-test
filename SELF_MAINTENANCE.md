# Self-Maintenance System Documentation

## 🤖 Overview

The Friday Discord Bot now includes advanced self-maintenance capabilities that enable semi-automated updates and feature management while maintaining safety and stability.

## ⚠️ Important Safety Notice

The self-maintenance system is designed with **safety-first** principles:

- ✅ **Automatic Backups** - Creates backups before every update
- ✅ **Health Checks** - Validates bot health after updates
- ✅ **Automatic Rollback** - Reverts changes if update fails
- ✅ **Manual Approval Option** - Can require manual approval for updates
- ✅ **Gradual Rollouts** - Features can be rolled out to subset of servers
- ✅ **Comprehensive Logging** - All actions are logged and notified

## 🔄 Auto-Update System

### How It Works

1. **Periodic Checks**: Bot checks GitHub repository for new commits
2. **Notification**: Sends notification when update is available
3. **Backup Creation**: Creates compressed backup of current state
4. **Update Application**: Pulls latest code and installs dependencies
5. **Health Check**: Validates bot is still functioning correctly
6. **Restart**: Schedules bot restart to apply changes
7. **Rollback**: If anything fails, automatically reverts to backup

### Configuration

Add these environment variables to your `.env` file:

```bash
# Enable automatic update checking
AUTO_UPDATE_ENABLED=true

# Automatically apply updates (WARNING: Use with caution)
AUTO_APPLY_UPDATES=false

# Check for updates every hour
UPDATE_CHECK_INTERVAL=3600000

# Your GitHub repository
GITHUB_REPO=Tanmayop9/soward-test

# Branch to track
UPDATE_BRANCH=main
```

### Safety Recommendations

**For Production:**
```bash
AUTO_UPDATE_ENABLED=true
AUTO_APPLY_UPDATES=false  # Manual approval required
```

**For Staging/Testing:**
```bash
AUTO_UPDATE_ENABLED=true
AUTO_APPLY_UPDATES=true   # Automatic updates
```

**For Development:**
```bash
AUTO_UPDATE_ENABLED=false # Manual updates only
```

### Manual Update Commands

Even with auto-updates disabled, you can manually manage updates:

```bash
# Check current update status
&update status

# Check for available updates
&update check

# Apply available update (owner only)
&update apply
```

### Update Process Flow

```
┌─────────────────┐
│  Check for      │
│  Updates        │
└────────┬────────┘
         │
         ├─ No Update Available ──> Log & Continue
         │
         ├─ Update Available ──┐
         │                     │
         │           ┌─────────▼─────────┐
         │           │  Send             │
         │           │  Notification     │
         │           └─────────┬─────────┘
         │                     │
         │           ┌─────────▼─────────┐
         │           │  Auto-Apply?      │
         │           └─────────┬─────────┘
         │                     │
         │           ├─ No ──> Wait for Manual
         │           │
         │           ├─ Yes ──┐
         │                    │
         │          ┌─────────▼─────────┐
         │          │  Create Backup    │
         │          └─────────┬─────────┘
         │                    │
         │          ┌─────────▼─────────┐
         │          │  Apply Update     │
         │          └─────────┬─────────┘
         │                    │
         │          ┌─────────▼─────────┐
         │          │  Health Check     │
         │          └─────────┬─────────┘
         │                    │
         │          ├─ Pass ──┐
         │          │         │
         │          │    ┌────▼────────┐
         │          │    │  Notify     │
         │          │    │  Success    │
         │          │    └────┬────────┘
         │          │         │
         │          │    ┌────▼────────┐
         │          │    │  Schedule   │
         │          │    │  Restart    │
         │          │    └─────────────┘
         │          │
         │          ├─ Fail ──┐
         │                    │
         │          ┌─────────▼─────────┐
         │          │  Rollback         │
         │          └─────────┬─────────┘
         │                    │
         │          ┌─────────▼─────────┐
         │          │  Notify Failure   │
         │          └───────────────────┘
         │
         └──────────> Continue Operation
```

## 🚩 Feature Flag System

### Purpose

Feature flags allow you to:
- Enable/disable features without code changes
- Gradually roll out new features to a percentage of servers
- Test features with specific servers before full rollout
- Quickly disable problematic features
- Track feature usage and adoption

### How It Works

Features are assigned a **rollout percentage** (0-100%):
- **0%**: Feature is disabled for all servers
- **50%**: Feature is enabled for ~50% of servers
- **100%**: Feature is enabled for all servers

Server selection is **deterministic** based on guild ID hash, ensuring consistent experience for each server.

### Built-in Features

```javascript
{
  // Auto-update features
  auto_update: {
    enabled: false,
    description: 'Automatic bot updates',
    rollout: 0,
    beta: true
  },
  
  // AI features
  ai_commands: {
    enabled: false,
    description: 'AI-powered commands',
    rollout: 0,
    beta: true
  },
  
  // Performance features
  enhanced_caching: {
    enabled: true,
    description: 'Enhanced caching system',
    rollout: 100,
    beta: false
  },
  
  // Monitoring
  advanced_metrics: {
    enabled: true,
    description: 'Advanced performance metrics',
    rollout: 100,
    beta: false
  }
}
```

### Feature Management Commands

```bash
# List all features and their status
&features list

# Enable a feature for all servers
&features enable enhanced_caching 100

# Enable feature for 25% of servers (gradual rollout)
&features enable ai_commands 25

# Increase rollout to 50%
&features rollout ai_commands 50

# Disable a feature
&features disable ai_commands

# Check feature status and usage
&features status ai_commands
```

### Using Features in Code

```javascript
// Check if feature is enabled for current guild
if (client.featureManager.isEnabled('ai_commands', message.guild.id)) {
  // Execute AI-powered logic
  await executeAICommand(message);
  
  // Track usage
  client.featureManager.trackUsage('ai_commands', message.guild.id);
} else {
  // Use fallback logic
  await executeLegacyCommand(message);
}
```

### Gradual Rollout Strategy

**Phase 1: Beta Testing (0-10%)**
```bash
&features enable new_feature 10
```
- Monitor for errors
- Gather user feedback
- Fix issues quickly

**Phase 2: Limited Release (10-25%)**
```bash
&features rollout new_feature 25
```
- Validate scalability
- Monitor performance impact
- Gather more feedback

**Phase 3: Wider Release (25-50%)**
```bash
&features rollout new_feature 50
```
- Ensure stability at scale
- Monitor resource usage
- Fine-tune performance

**Phase 4: General Availability (50-100%)**
```bash
&features rollout new_feature 100
```
- Full rollout to all servers
- Continue monitoring
- Mark as stable (beta: false)

### Emergency Disable

If a feature causes issues:

```bash
# Immediately disable for all servers
&features disable problematic_feature
```

The change takes effect immediately without requiring restart.

## 📊 Monitoring and Notifications

### Webhook Notifications

The system sends notifications for:
- ✅ Updates available
- ✅ Update applied successfully
- ❌ Update failed
- ⚠️ Rollback performed
- 🚩 Feature changes

Configure webhooks in `config.json`:
```json
{
  "ERROR_WEBHOOK_URL": "your-webhook-url"
}
```

### Logs

All self-maintenance actions are logged:
```
[INFO] Auto-updater initialized
[INFO] Checking for updates...
[INFO] Update available: Fix critical bug
[INFO] Starting update process...
[INFO] Backup created: backup-2025-12-13.tar.gz
[INFO] Pulling latest changes...
[INFO] Installing dependencies...
[INFO] Health check passed
[INFO] Update applied successfully!
```

## 🔒 Security Considerations

### Access Control

- All update and feature commands are **owner-only**
- Requires Discord user ID to be in `config.owner` array
- No remote code execution - only pulls from your repository

### Backup Security

- Backups exclude sensitive directories (`node_modules`, `data-sets`)
- Stored locally in `backups/` directory
- Automatically cleaned (keeps last 5 backups)

### Update Validation

- Git authentication required
- Only pulls from specified branch
- Health checks prevent broken updates from running
- Automatic rollback on failure

## 🔧 Troubleshooting

### Update Check Fails

```bash
# Check GitHub API access
curl https://api.github.com/repos/Tanmayop9/soward-test/commits/main

# Check git configuration
git remote -v
git status
```

### Update Application Fails

1. Check logs for specific error
2. Verify git permissions
3. Ensure `npm install` can run
4. Check disk space for backups

### Rollback Issues

If automatic rollback fails:

```bash
# Manual rollback
git reset --hard HEAD~1
npm install --production
pm2 restart friday-bot
```

### Feature Not Working

```bash
# Check feature status
&features status feature_name

# Verify it's enabled for your server
&features list

# Check logs for errors
```

## 📈 Best Practices

### For Updates

1. **Test First**: Always test updates in staging environment
2. **Manual Approval**: Keep `AUTO_APPLY_UPDATES=false` in production
3. **Monitor Logs**: Watch logs during and after updates
4. **Backup Verification**: Regularly verify backups are created
5. **Rollback Plan**: Know how to manually rollback if needed

### For Feature Flags

1. **Start Small**: Begin with low rollout percentages
2. **Monitor Impact**: Watch metrics and errors
3. **Gradual Increase**: Slowly increase rollout
4. **Quick Disable**: Be ready to disable if issues arise
5. **Document Features**: Keep feature descriptions updated

### For Production

1. **Use Process Manager**: PM2, systemd, or similar for auto-restart
2. **Monitor Health**: Use health check endpoint
3. **Set Up Alerts**: Configure webhook notifications
4. **Regular Backups**: Keep backups of database
5. **Test Updates**: Always test in staging first

## 🎯 Usage Examples

### Example 1: Safe Production Setup

```bash
# .env configuration
AUTO_UPDATE_ENABLED=true
AUTO_APPLY_UPDATES=false
UPDATE_CHECK_INTERVAL=3600000

# Workflow:
# 1. Bot checks for updates hourly
# 2. Sends notification when update available
# 3. Owner reviews and manually applies with &update apply
```

### Example 2: New Feature Rollout

```bash
# Add new AI feature
&features enable ai_chat 0

# Test with a few servers (10%)
&features rollout ai_chat 10

# Monitor for 24 hours, then increase
&features rollout ai_chat 25

# Continue monitoring, gradually increase
&features rollout ai_chat 50
&features rollout ai_chat 100

# Mark as stable
# Update feature config in code: beta: false
```

### Example 3: Emergency Response

```bash
# Issue detected with new feature
&features disable problematic_feature

# Issue resolved, re-enable gradually
&features enable problematic_feature 10
# Monitor and increase as safe
```

## 📞 Support

For issues or questions:
- Discord: https://discord.gg/S7Ju9RUpbT
- GitHub Issues: https://github.com/Tanmayop9/soward-test/issues

---

**Remember**: Self-maintenance features are powerful but should be used responsibly. Always prioritize stability and user experience over automation.
