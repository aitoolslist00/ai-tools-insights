@echo off
robocopy "f:\my work\programming\vercel\ai-tools-update" "F:\temp-repo-clone" /E /XD node_modules .git dist .astro .vscode -p /R:1 /W:1
echo Copy completed!
dir "F:\temp-repo-clone" /B
