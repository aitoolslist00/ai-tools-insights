import shutil
import os
from pathlib import Path

src = r"f:\my work\programming\vercel\ai-tools-update"
dst = r"F:\temp-repo-clone"

exclude_dirs = {'.git', 'node_modules', 'dist', '.astro', '.vscode', '__pycache__'}
exclude_files = {'copy_files.py', 'temp-copy.bat'}

def should_exclude(path, src_root):
    rel_path = os.path.relpath(path, src_root)
    path_parts = Path(rel_path).parts
    return any(ex in path_parts for ex in exclude_dirs)

print(f"Copying from {src} to {dst}...")
copied = 0

for root, dirs, files in os.walk(src):
    # Remove excluded directories from dirs list to prevent walking into them
    dirs[:] = [d for d in dirs if d not in exclude_dirs]
    
    if should_exclude(root, src):
        continue
    
    # Calculate relative path and create destination directory
    rel_path = os.path.relpath(root, src)
    if rel_path == '.':
        dst_dir = dst
    else:
        dst_dir = os.path.join(dst, rel_path)
    
    os.makedirs(dst_dir, exist_ok=True)
    
    # Copy files
    for file in files:
        if file in exclude_files:
            continue
        
        src_file = os.path.join(root, file)
        dst_file = os.path.join(dst_dir, file)
        
        try:
            shutil.copy2(src_file, dst_file)
            copied += 1
            if copied % 100 == 0:
                print(f"Copied {copied} files...")
        except Exception as e:
            print(f"Error copying {src_file}: {e}")

print(f"\nCopy complete! {copied} files copied.")

# List some files in destination
print("\nSample files in destination:")
dst_files = list(Path(dst).glob('*'))[:10]
for f in dst_files:
    print(f"  - {f.name}")
