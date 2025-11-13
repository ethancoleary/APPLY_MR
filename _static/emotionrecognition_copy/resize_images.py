from PIL import Image
import sys
from pathlib import Path

def resize_images_in_folder(source_folder, target_folder):
    """
    Resize all images in source_folder to the maximum dimensions found
    and save them to target_folder with the same filenames.
    """
    # Get all image files
    image_files = list(Path(source_folder).glob('*.png')) + \
                  list(Path(source_folder).glob('*.jpg')) + \
                  list(Path(source_folder).glob('*.jpeg'))

    if not image_files:
        print(f"No images found in {source_folder}")
        return

    # Find maximum dimensions
    max_width = 0
    max_height = 0

    print(f"Processing: {source_folder}")
    print(f"Analyzing {len(image_files)} images...")
    for img_path in image_files:
        with Image.open(img_path) as img:
            width, height = img.size
            max_width = max(max_width, width)
            max_height = max(max_height, height)

    print(f"Maximum dimensions found: {max_width}x{max_height}")

    # Create target folder if it doesn't exist
    Path(target_folder).mkdir(parents=True, exist_ok=True)

    # Resize and save all images
    print(f"Resizing images to {max_width}x{max_height}...")
    for img_path in image_files:
        with Image.open(img_path) as img:
            # Resize to maximum dimensions
            resized_img = img.resize((max_width, max_height), Image.Resampling.LANCZOS)

            # Save to target folder with same filename
            output_path = Path(target_folder) / img_path.name
            resized_img.save(output_path)

    print(f"Completed! All {len(image_files)} images saved to {target_folder}\n")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        source = sys.argv[1]
        target = sys.argv[2]
    else:
        # Default to Round1\easy\deck1
        source = r"Round1\easy\deck1"
        target = r"Round1\easy\deck1NEW"

    resize_images_in_folder(source, target)
