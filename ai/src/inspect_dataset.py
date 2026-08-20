from pathlib import Path
from PIL import Image


# ============================================================
# Configuration
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

X_DIR = BASE_DIR / "dataset" / "raw" / "X"
Y_DIR = BASE_DIR / "dataset" / "raw" / "Y"


# ============================================================
# Helpers
# ============================================================

def get_image_info(path: Path):
    with Image.open(path) as image:
        return {
            "size": image.size,
            "mode": image.mode,
            "format": image.format,
        }


# ============================================================
# Dataset inspection
# ============================================================

def main():
    x_images = sorted(X_DIR.glob("*.png"))
    y_images = sorted(Y_DIR.glob("*.png"))

    print("=" * 60)
    print("Dream2Build Dataset Inspection")
    print("=" * 60)

    print(f"\nX images found: {len(x_images)}")
    print(f"Y images found: {len(y_images)}")

    # --------------------------------------------------------
    # Check expected count
    # --------------------------------------------------------

    if len(x_images) != 121:
        print(f"WARNING: Expected 121 X images, found {len(x_images)}")

    if len(y_images) != 121:
        print(f"WARNING: Expected 121 Y images, found {len(y_images)}")

    # --------------------------------------------------------
    # Check pairs
    # --------------------------------------------------------

    missing_targets = []
    valid_pairs = []

    for i in range(1, 122):
        x_path = X_DIR / f"{i}.png"
        y_path = Y_DIR / f"{i} (2).png"

        if not x_path.exists():
            print(f"Missing X image: {x_path.name}")
            continue

        if not y_path.exists():
            missing_targets.append(i)
            continue

        valid_pairs.append((x_path, y_path))

    print(f"\nValid pairs: {len(valid_pairs)}")
    print(f"Missing targets: {len(missing_targets)}")

    if missing_targets:
        print("Missing target IDs:", missing_targets)

    # --------------------------------------------------------
    # Inspect first pair
    # --------------------------------------------------------

    if valid_pairs:
        x_path, y_path = valid_pairs[0]

        x_info = get_image_info(x_path)
        y_info = get_image_info(y_path)

        print("\n" + "-" * 60)
        print("First Pair")
        print("-" * 60)

        print(f"\nInput:")
        print(f"  File:     {x_path.name}")
        print(f"  Size:     {x_info['size']}")
        print(f"  Mode:     {x_info['mode']}")
        print(f"  Format:   {x_info['format']}")

        print(f"\nTarget:")
        print(f"  File:     {y_path.name}")
        print(f"  Size:     {y_info['size']}")
        print(f"  Mode:     {y_info['mode']}")
        print(f"  Format:   {y_info['format']}")

        # ----------------------------------------------------
        # Check whether dimensions match
        # ----------------------------------------------------

        dimension_mismatches = []

        for x_path, y_path in valid_pairs:
            x_info = get_image_info(x_path)
            y_info = get_image_info(y_path)

            if x_info["size"] != y_info["size"]:
                dimension_mismatches.append(
                    (x_path.name, y_path.name, x_info["size"], y_info["size"])
                )

        print("\n" + "-" * 60)
        print("Dimension Check")
        print("-" * 60)

        if not dimension_mismatches:
            print("All X/Y pairs have matching dimensions.")
        else:
            print(
                f"Found {len(dimension_mismatches)} dimension mismatches:"
            )

            for mismatch in dimension_mismatches[:10]:
                print(
                    f"  {mismatch[0]} ↔ {mismatch[1]}: "
                    f"{mismatch[2]} vs {mismatch[3]}"
                )

    print("\n" + "=" * 60)
    print("Inspection complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
