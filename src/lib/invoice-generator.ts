import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  productName: string;
  variantColor: string | null;
  variantSize: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  orderNumber: string;
  createdAt: Date;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingDistrict: string;
  shippingPostalCode: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  items: OrderItem[];
}

export async function generateInvoice(order: Order): Promise<ArrayBuffer> {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(30, 95, 116); // Aegean color
  doc.text("HALIKARNAS", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Premium El Yapimi Sandaletler", 20, 32);

  // Company info
  doc.setFontSize(9);
  doc.text("www.halikarnassandals.com", 20, 40);
  doc.text("info@halikarnassandals.com", 20, 45);
  doc.text("Bodrum, Mugla, Turkiye", 20, 50);

  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("FATURA", 150, 25);

  // Invoice info box
  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(`Fatura No: ${order.orderNumber}`, 150, 35);
  doc.text(
    `Tarih: ${new Date(order.createdAt).toLocaleDateString("tr-TR")}`,
    150,
    42
  );

  // Horizontal line
  doc.setDrawColor(200);
  doc.line(20, 55, 190, 55);

  // Customer info
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("Musteri Bilgileri:", 20, 65);

  doc.setFontSize(10);
  doc.setTextColor(60);
  doc.text(order.shippingName, 20, 73);
  doc.text(order.shippingAddress, 20, 80);
  doc.text(
    `${order.shippingDistrict} / ${order.shippingCity}`,
    20,
    87
  );
  if (order.shippingPostalCode) {
    doc.text(`Posta Kodu: ${order.shippingPostalCode}`, 20, 94);
  }
  doc.text(`Tel: ${order.shippingPhone}`, 20, 101);

  // Items table
  const tableData = order.items.map((item) => [
    `${item.productName}\n${item.variantColor || ""} / ${item.variantSize}`,
    item.quantity.toString(),
    `${item.unitPrice.toLocaleString("tr-TR")} TL`,
    `${item.total.toLocaleString("tr-TR")} TL`,
  ]);

  autoTable(doc, {
    startY: 110,
    head: [["Urun", "Adet", "Birim Fiyat", "Toplam"]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [30, 95, 116],
      textColor: 255,
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
  });

  // Get final Y position after table
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Totals
  doc.setFontSize(10);
  doc.setTextColor(60);

  const totalsX = 140;
  let currentY = finalY;

  doc.text("Ara Toplam:", totalsX, currentY);
  doc.text(
    `${order.subtotal.toLocaleString("tr-TR")} TL`,
    190,
    currentY,
    { align: "right" }
  );

  currentY += 7;
  doc.text("Kargo:", totalsX, currentY);
  doc.text(
    order.shippingCost > 0
      ? `${order.shippingCost.toLocaleString("tr-TR")} TL`
      : "Ucretsiz",
    190,
    currentY,
    { align: "right" }
  );

  if (order.discount > 0) {
    currentY += 7;
    doc.text("Indirim:", totalsX, currentY);
    doc.text(
      `-${order.discount.toLocaleString("tr-TR")} TL`,
      190,
      currentY,
      { align: "right" }
    );
  }

  // Total line
  currentY += 5;
  doc.setDrawColor(200);
  doc.line(totalsX, currentY, 190, currentY);

  currentY += 8;
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("TOPLAM:", totalsX, currentY);
  doc.text(
    `${order.total.toLocaleString("tr-TR")} TL`,
    190,
    currentY,
    { align: "right" }
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    "Halikarnas Sandals - Premium El Yapimi Sandaletler",
    105,
    280,
    { align: "center" }
  );
  doc.text(
    "www.halikarnassandals.com | info@halikarnassandals.com",
    105,
    285,
    { align: "center" }
  );

  return doc.output("arraybuffer");
}
