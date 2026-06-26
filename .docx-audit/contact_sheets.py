from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(".docx-audit/render/page_screens")
OUT = Path(".docx-audit/render")


def make(label: str, cols: int = 3, thumb_w: int = 360) -> Path:
    paths = sorted(ROOT.glob(f"{label}_*.png"))
    thumbs = []
    for p in paths:
        img = Image.open(p).convert("RGB")
        scale = thumb_w / img.width
        img = img.resize((thumb_w, int(img.height * scale)), Image.LANCZOS)
        thumbs.append((p.stem.split("_")[-1], img))
    if not thumbs:
        raise RuntimeError(f"No pages for {label}")
    gap = 18
    label_h = 28
    rows = (len(thumbs) + cols - 1) // cols
    cell_h = thumbs[0][1].height + label_h
    sheet = Image.new("RGB", (cols * thumb_w + (cols + 1) * gap, rows * cell_h + (rows + 1) * gap), "white")
    draw = ImageDraw.Draw(sheet)
    for idx, (num, img) in enumerate(thumbs):
        row, col = divmod(idx, cols)
        x = gap + col * (thumb_w + gap)
        y = gap + row * (cell_h + gap)
        draw.text((x, y), f"{label} page {num}", fill=(0, 0, 0))
        sheet.paste(img, (x, y + label_h))
    out = OUT / f"{label}_contact.jpg"
    sheet.save(out, quality=92)
    return out


if __name__ == "__main__":
    for label in ("PM02", "PM11"):
        print(make(label).resolve())
