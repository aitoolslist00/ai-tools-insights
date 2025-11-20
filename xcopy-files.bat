@echo off
echo Copying files...
xcopy "f:\my work\programming\vercel\ai-tools-update" "F:\temp-repo-clone" /E /I /H /Y /EXCLUDE:f:\my work\programming\vercel\ai-tools-update\xcopy-exclude.txt
echo Copy completed!
dir /B "F:\temp-repo-clone" | find /C /V ""
