import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/** WellPath palette, as RGB tuples for jsPDF. */
const WP = {
  ink: [45, 43, 50] as [number, number, number],
  muted: [107, 103, 114] as [number, number, number],
  sage: [124, 154, 110] as [number, number, number],
  sageTint: [237, 245, 235] as [number, number, number],
  border: [232, 228, 238] as [number, number, number],
  borderStrong: [209, 203, 217] as [number, number, number],
};

export type PdfRow = {
  label: string;
  type: "time" | "check";
  values: (string | boolean)[];
};

export type PdfPlan = {
  title: string;
  weekLabel: string;
  weekValue: string;
  summary: { label: string; value: string }[];
  instructions: string;
  dayHeaders: string[];
  habitColLabel: string;
  rows: PdfRow[];
};

export function generatePlanPdf(plan: PdfPlan, filename: string): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  let y = 16;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...WP.ink);
  doc.text(plan.title, marginX, y);

  // Week
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...WP.muted);
  doc.text(`${plan.weekLabel}: ${plan.weekValue}`, marginX, y);

  // Summary line(s)
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(...WP.muted);
  const summaryText = plan.summary.map((s) => `${s.label}: ${s.value}`).join("    |    ");
  doc.text(summaryText, marginX, y);
  doc.setTextColor(...WP.ink);

  y += 6;

  const head = [[plan.habitColLabel, ...plan.dayHeaders]];
  const body = plan.rows.map((r) => [
    r.label,
    ...r.values.map((v) => (r.type === "time" ? (typeof v === "string" ? v : "") : "")),
  ]);

  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2.5,
      valign: "middle",
      textColor: WP.ink,
      lineColor: WP.border,
      lineWidth: 0.2,
      minCellHeight: 11,
    },
    headStyles: {
      fillColor: WP.sage,
      textColor: 255,
      halign: "center",
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: (pageWidth - marginX * 2) * 0.34, halign: "left", fontStyle: "bold" },
    },
    bodyStyles: { halign: "center" },
    margin: { left: marginX, right: marginX },
    didParseCell: (data) => {
      // Center the day columns; keep the habit column left-aligned.
      if (data.section === "body" && data.column.index > 0) {
        data.cell.styles.halign = "center";
      }
    },
    didDrawCell: (data) => {
      if (data.section !== "body" || data.column.index === 0) return;
      const row = plan.rows[data.row.index];
      if (!row || row.type !== "check") return;
      const value = row.values[data.column.index - 1];

      // Draw a checkbox square centered in the cell.
      const size = 5;
      const cx = data.cell.x + data.cell.width / 2;
      const cy = data.cell.y + data.cell.height / 2;
      const x = cx - size / 2;
      const yy = cy - size / 2;
      const checked = value === true;
      doc.setDrawColor(...(checked ? WP.sage : WP.borderStrong));
      doc.setFillColor(...WP.sageTint);
      doc.setLineWidth(checked ? 0.5 : 0.3);
      doc.rect(x, yy, size, size, checked ? "FD" : "S");
      if (checked) {
        doc.setLineWidth(0.6);
        doc.line(x + 1, cy, cx - 0.3, yy + size - 1);
        doc.line(cx - 0.3, yy + size - 1, x + size, yy + 0.8);
      }
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFontSize(9);
  doc.setTextColor(...WP.muted);
  doc.text(plan.instructions, marginX, finalY + 7);

  doc.save(filename);
}
