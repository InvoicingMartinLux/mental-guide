import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  doc.text(plan.title, marginX, y);

  // Week
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`${plan.weekLabel}: ${plan.weekValue}`, marginX, y);

  // Summary line(s)
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(80);
  const summaryText = plan.summary.map((s) => `${s.label}: ${s.value}`).join("    |    ");
  doc.text(summaryText, marginX, y);
  doc.setTextColor(0);

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
      lineColor: [180, 180, 180],
      lineWidth: 0.2,
      minCellHeight: 11,
    },
    headStyles: {
      fillColor: [34, 110, 82],
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
      doc.setDrawColor(120);
      doc.setLineWidth(0.3);
      doc.rect(x, yy, size, size);
      if (value === true) {
        doc.setLineWidth(0.6);
        doc.line(x + 1, cy, cx - 0.3, yy + size - 1);
        doc.line(cx - 0.3, yy + size - 1, x + size, yy + 0.8);
      }
    },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(plan.instructions, marginX, finalY + 7);

  doc.save(filename);
}
