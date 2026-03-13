import { jsPDF } from "jspdf";
import { FIELDS } from "./constants";

export const downloadWishlist = (wishlist = []) => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;

  let y = margin;

  const addPageIfNeeded = (nextLineHeight = 16) => {
    if (y + nextLineHeight > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const safeStr = (v) => (v == null ? "" : String(v));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Wishlist", margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y);
  y += 18;

  doc.setDrawColor(200);
  doc.line(margin, y, pageW - margin, y);
  y += 18;

  if (!wishlist.length) {
    doc.setFontSize(12);
    doc.text("No movies in your wishlist.", margin, y);
    doc.save("wishlist.pdf");
    return;
  }

  wishlist.forEach((movie, idx) => {
    const title = safeStr(movie?.[FIELDS.TITLE]);
    const year = safeStr(movie?.[FIELDS.YEAR]);
    const genre = safeStr(movie?.[FIELDS.GENRE]);
    const age = safeStr(movie?.[FIELDS.AGE_GROUP]);
    const ratingVal = movie?.[FIELDS.RATING];
    const rating =
      typeof ratingVal === "number"
        ? ratingVal.toFixed(1)
        : safeStr(ratingVal);
    const desc = safeStr(movie?.[FIELDS.DESCRIPTION]);

    addPageIfNeeded(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    const header = `${idx + 1}. ${title}${year ? ` (${year})` : ""}`;
    const headerLines = doc.splitTextToSize(header, contentW);
    doc.text(headerLines, margin, y);
    y += headerLines.length * 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const metaParts = [
      genre ? `Genre: ${genre}` : null,
      age ? `Age: ${age}` : null,
      rating ? `IMDb: ${rating}` : null,
    ].filter(Boolean);

    if (metaParts.length) {
      addPageIfNeeded(16);
      const meta = metaParts.join("   •   ");
      const metaLines = doc.splitTextToSize(meta, contentW);
      doc.text(metaLines, margin, y);
      y += metaLines.length * 12 + 6;
    } else {
      y += 6;
    }

    if (desc) {
      addPageIfNeeded(20);
      doc.setFontSize(11);
      const descLines = doc.splitTextToSize(desc, contentW);
      doc.text(descLines, margin, y);
      y += descLines.length * 14 + 10;
    } else {
      y += 8;
    }

    addPageIfNeeded(14);
    doc.setDrawColor(230);
    doc.line(margin, y, pageW - margin, y);
    y += 14;
  });

  doc.save("wishlist.pdf");
};
