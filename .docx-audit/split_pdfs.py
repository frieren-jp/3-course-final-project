from pathlib import Path

from pypdf import PdfReader, PdfWriter


ROOT = Path(".docx-audit/render")


def split_pdf(label: str) -> None:
    src = ROOT / f"{label}_checked.pdf"
    out_dir = ROOT / f"{label}_pages"
    out_dir.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(src))
    for i, page in enumerate(reader.pages, start=1):
        writer = PdfWriter()
        writer.add_page(page)
        out = out_dir / f"{i:02d}.pdf"
        with out.open("wb") as fh:
            writer.write(fh)
    print(f"{label}: {len(reader.pages)} pages -> {out_dir.resolve()}")


if __name__ == "__main__":
    split_pdf("PM02")
    split_pdf("PM11")
