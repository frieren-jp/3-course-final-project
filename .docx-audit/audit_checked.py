from __future__ import annotations

import json
import re
import zipfile
from pathlib import Path

from docx import Document


WORK = Path(".docx-audit")
FILES = {
    "PM02_checked": WORK / "PM02_checked.docx",
    "PM11_checked": WORK / "PM11_checked.docx",
}
MAJOR = {"ЗАДАНИЕ", "ДНЕВНИК", "АТТЕСТАЦИОННЫЙ ЛИСТ", "ХАРАКТЕРИСТИКА", "ОТЧЕТ"}


def attrs(xml: str, tag: str) -> dict[str, str]:
    m = re.search(fr"<w:{tag}\b([^>]*)/?>(?:</w:{tag}>)?", xml)
    if not m:
        return {}
    return dict(re.findall(r"w:([A-Za-z0-9]+)=\"([^\"]*)\"", m.group(1)))


def break_before(p) -> bool:
    if "<w:pageBreakBefore" in p._p.xml:
        return True
    prev = p._p.getprevious()
    while prev is not None:
        xml = prev.xml
        text = "".join(prev.xpath(".//w:t/text()")).strip()
        if "<w:br" in xml and 'w:type="page"' in xml:
            return True
        if text:
            return False
        prev = prev.getprevious()
    return False


def run_issues(run) -> list[str]:
    text = run.text.strip()
    if not text:
        return []
    out = []
    font = run.font
    if font.name and font.name != "Times New Roman":
        out.append(f"font={font.name}")
    if font.size and round(font.size.pt, 2) != 12:
        out.append(f"size={font.size.pt}")
    if run.bold:
        out.append("bold")
    if run.italic:
        out.append("italic")
    if run.underline:
        out.append("underline")
    if font.highlight_color is not None:
        out.append(f"highlight={font.highlight_color}")
    if font.color is not None and font.color.rgb is not None and str(font.color.rgb) != "000000":
        out.append(f"color={font.color.rgb}")
    return out


def audit(label: str, path: Path) -> dict:
    doc = Document(str(path))
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
    ps = list(doc.paragraphs)
    major = []
    for i, p in enumerate(ps):
        if p.text.strip() in MAJOR:
            org_idx = None
            for j in range(i - 1, max(-1, i - 12), -1):
                if "Автономная некоммерческая" in ps[j].text:
                    org_idx = j
                    break
            major.append(
                {
                    "idx": i,
                    "text": p.text.strip(),
                    "block_start_idx": org_idx,
                    "block_break_before": break_before(ps[org_idx]) if org_idx is not None else None,
                }
            )
    report_idx = next((i for i, p in enumerate(ps) if p.text.strip() == "ОТЧЕТ"), None)
    body = []
    if report_idx is not None:
        for i, p in enumerate(ps[report_idx + 1 :], start=report_idx + 1):
            text = p.text.strip()
            if not text or text in {"Дата сдачи отчета", "Подпись руководителя практики"}:
                continue
            fmt = p.paragraph_format
            issues = []
            for run in p.runs:
                issues.extend(run_issues(run))
            body.append(
                {
                    "idx": i,
                    "text": text[:80],
                    "alignment": str(p.alignment),
                    "line_spacing": fmt.line_spacing,
                    "first_line_indent_cm": None if fmt.first_line_indent is None else round(fmt.first_line_indent.cm, 3),
                    "space_before_pt": None if fmt.space_before is None else round(fmt.space_before.pt, 2),
                    "space_after_pt": None if fmt.space_after is None else round(fmt.space_after.pt, 2),
                    "issues": sorted(set(issues)),
                }
            )
    return {
        "label": label,
        "path": str(path.resolve()),
        "sections": len(doc.sections),
        "sectPr_count": xml.count("<w:sectPr"),
        "pgSz": attrs(xml, "pgSz"),
        "pgMar": attrs(xml, "pgMar"),
        "xml_counts": {
            "highlight": xml.count("<w:highlight"),
            "shading": xml.count("<w:shd"),
            "trHeight": xml.count("<w:trHeight"),
            "caps": xml.count("<w:caps"),
            "smallCaps": xml.count("<w:smallCaps"),
        },
        "major": major,
        "report_body_issue_count": sum(1 for item in body if item["issues"]),
        "report_body_sample": body[:12],
    }


def main() -> None:
    data = [audit(label, path) for label, path in FILES.items()]
    out = WORK / "checked_audit.json"
    out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(out.resolve())


if __name__ == "__main__":
    main()
