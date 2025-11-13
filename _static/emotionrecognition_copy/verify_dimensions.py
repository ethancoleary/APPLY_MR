from PIL import Image
from pathlib import Path

# Check a few random NEW folders
test_folders = [
    r"Round1\easy\deck1NEW",
    r"Round2\Mix1\deck4NEW",
    r"Round3\deck7NEW"
]

for folder in test_folders:
    print(f"\nChecking {folder}:")
    folder_path = Path(folder)
    images = list(folder_path.glob('*.png'))[:3]  # Check first 3 images

    for img_path in images:
        with Image.open(img_path) as img:
            print(f"  {img_path.name}: {img.size[0]}x{img.size[1]}")
