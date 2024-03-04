# spl-syntax-highlighter

## Syntax highlighting for Splunk Query Language (spl) in Obsidian

This plugin creates CodeMirror Mode Definition (splunk)

You should be able to clone the repo directly into your plugins directory 
- C:/.../YOUR_VAULT/.obsidian/plugins <-- navigate to here and git clone or clone elsewhere and copy it over

**Use "splunk" when defining the markdown codeblock like below** 

\`\`\`splunk
index=main user=supercerealized
| stats count by user
\`\`\`

### I'll add options to the UI for the plugin later
- In the meantime, if you want to mess with colors edit the CSS file in .obsidian/plugins/spl-syntax-highlighter/styles.css
