from PIL import Image
from pathlib import Path

def find_global_max_dimensions(folders):
    """Find the maximum width and height across all images in all folders"""
    max_width = 0
    max_height = 0
    total_images = 0

    print("Scanning all folders to find global maximum dimensions...\n")

    for folder in folders:
        folder_path = Path(folder)
        if not folder_path.exists():
            print(f"Warning: {folder} does not exist, skipping...")
            continue

        image_files = list(folder_path.glob('*.png')) + \
                      list(folder_path.glob('*.jpg')) + \
                      list(folder_path.glob('*.jpeg'))

        for img_path in image_files:
            with Image.open(img_path) as img:
                width, height = img.size
                max_width = max(max_width, width)
                max_height = max(max_height, height)
                total_images += 1

    print(f"Scanned {total_images} images across {len(folders)} folders")
    print(f"Global maximum dimensions: {max_width}x{max_height}\n")

    return max_width, max_height

def resize_images_in_folder(source_folder, target_folder, target_width, target_height):
    """Resize all images in source_folder to specified dimensions"""
    # Get all image files
    image_files = list(Path(source_folder).glob('*.png')) + \
                  list(Path(source_folder).glob('*.jpg')) + \
                  list(Path(source_folder).glob('*.jpeg'))

    if not image_files:
        print(f"No images found in {source_folder}")
        return

    # Create target folder if it doesn't exist
    Path(target_folder).mkdir(parents=True, exist_ok=True)

    # Resize and save all images
    for img_path in image_files:
        with Image.open(img_path) as img:
            # Resize to target dimensions
            resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)

            # Save to target folder with same filename
            output_path = Path(target_folder) / img_path.name
            resized_img.save(output_path)

    print(f"Completed! All {len(image_files)} images saved to {target_folder}")

def process_all_folders():
    """Process all folders containing images and create NEW versions"""

    # Define all folders to process
    folders = [
        r"Round1\easy\deck1",
        r"Round1\easy\deck2",
        r"Round1\easy\deck3",
        # Round1/hard
        r"Round1\hard\deck1",
        r"Round1\hard\deck2",
        r"Round1\hard\deck3",
        # Round2/Mix1
        r"Round2\Mix1\deck1",
        r"Round2\Mix1\deck2",
        r"Round2\Mix1\deck3",
        r"Round2\Mix1\deck4",
        r"Round2\Mix1\deck5",
        r"Round2\Mix1\deck6",
        r"Round2\Mix1\deck7",
        # Round2/Mix2
        r"Round2\Mix2\deck1",
        r"Round2\Mix2\deck2",
        r"Round2\Mix2\deck3",
        r"Round2\Mix2\deck4",
        r"Round2\Mix2\deck5",
        r"Round2\Mix2\deck6",
        r"Round2\Mix2\deck7",
        # Round3
        r"Round3\deck1",
        r"Round3\deck2",
        r"Round3\deck3",
        r"Round3\deck4",
        r"Round3\deck5",
        r"Round3\deck6",
        r"Round3\deck7",
    ]

    # First, find global maximum dimensions
    global_width, global_height = find_global_max_dimensions(folders)

    if global_width == 0 or global_height == 0:
        print("Error: Could not find any valid images!")
        return

    print("=" * 80)
    print(f"Now resizing all images to {global_width}x{global_height}")
    print("=" * 80)

    total = len(folders)
    for i, folder in enumerate(folders, 1):
        # Create target folder name by appending NEW to the last folder name
        folder_path = Path(folder)
        folder_name = folder_path.name
        target_folder = folder_path.parent / (folder_name + "NEW")

        print(f"\n[{i}/{total}] Processing: {folder}")
        try:
            resize_images_in_folder(str(folder), str(target_folder), global_width, global_height)
        except Exception as e:
            print(f"ERROR processing {folder}: {e}")

    print("\n" + "=" * 80)
    print(f"All done! Processed {total} folders.")
    print(f"All images resized to {global_width}x{global_height}")
    print("=" * 80)

if __name__ == "__main__":
    process_all_folders()
