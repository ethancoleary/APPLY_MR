from PIL import Image
from pathlib import Path

def reduce_images_in_folder(folder, target_width=512, target_height=512):
    """Reduce all images in folder to specified dimensions"""
    folder_path = Path(folder)

    image_files = list(folder_path.glob('*.png')) + \
                  list(folder_path.glob('*.jpg')) + \
                  list(folder_path.glob('*.jpeg'))

    if not image_files:
        print(f"No images found in {folder}")
        return

    for img_path in image_files:
        with Image.open(img_path) as img:
            # Resize to target dimensions
            resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            # Overwrite the original file
            resized_img.save(img_path)

    print(f"Completed! Reduced {len(image_files)} images in {folder}")

def process_all_new_folders():
    """Process all NEW folders to reduce image sizes"""

    # Define all NEW folders
    folders = [
        r"Round1\easy\deck1NEW",
        r"Round1\easy\deck2NEW",
        r"Round1\easy\deck3NEW",
        r"Round1\hard\deck1NEW",
        r"Round1\hard\deck2NEW",
        r"Round1\hard\deck3NEW",
        r"Round2\Mix1\deck1NEW",
        r"Round2\Mix1\deck2NEW",
        r"Round2\Mix1\deck3NEW",
        r"Round2\Mix1\deck4NEW",
        r"Round2\Mix1\deck5NEW",
        r"Round2\Mix1\deck6NEW",
        r"Round2\Mix1\deck7NEW",
        r"Round2\Mix2\deck1NEW",
        r"Round2\Mix2\deck2NEW",
        r"Round2\Mix2\deck3NEW",
        r"Round2\Mix2\deck4NEW",
        r"Round2\Mix2\deck5NEW",
        r"Round2\Mix2\deck6NEW",
        r"Round2\Mix2\deck7NEW",
        r"Round3\deck1NEW",
        r"Round3\deck2NEW",
        r"Round3\deck3NEW",
        r"Round3\deck4NEW",
        r"Round3\deck5NEW",
        r"Round3\deck6NEW",
        r"Round3\deck7NEW",
    ]

    target_size = 512
    total = len(folders)

    print(f"Reducing all images to {target_size}x{target_size} pixels")
    print(f"Processing {total} folders...\n")
    print("=" * 80)

    for i, folder in enumerate(folders, 1):
        print(f"\n[{i}/{total}] Processing: {folder}")
        try:
            reduce_images_in_folder(folder, target_size, target_size)
        except Exception as e:
            print(f"ERROR processing {folder}: {e}")

    print("\n" + "=" * 80)
    print(f"All done! All images reduced to {target_size}x{target_size} pixels")
    print("=" * 80)

if __name__ == "__main__":
    process_all_new_folders()
