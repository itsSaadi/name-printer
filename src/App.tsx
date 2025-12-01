import { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function App() {
  const [mode, setMode] = useState("single");
  const [names, setNames] = useState("");
  const [columns, setColumns] = useState([[""]]);

  // ================= PRINT / DOWNLOAD =================
  const handlePrint = () => {
    const printContent = document.querySelector(".print-area")?.innerHTML;
    if (!printContent) return;

    const newWindow = window.open("", "_blank");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Montserrat, sans-serif; padding: 20px; }
            .print-columns { display: flex; gap: 20px; flex-wrap: wrap; }
            .print-col { margin-right: 20px; }
            .print-name { 
              border: 1px dashed #999; 
              padding: 10px; 
              margin: 10px; 
              display: inline-block; 
              min-width: 250px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  const handleDownload = async () => {
    const element = document.querySelector(".print-area") as HTMLElement;
    if (!element) return;

    // Capture the element as a canvas
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });

    // Convert canvas to PNG data URL
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Pass 'PNG' explicitly as type
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("wedding-names.pdf");
  };


  // ================= COLUMN HANDLERS =================
  const addColumn = () => setColumns([...columns, [""]]);

  const deleteColumn = (index: any) => {
    const updated = columns.filter((_, i) => i !== index);
    setColumns(updated.length ? updated : [[""]]);
  };

  const addRow = (colIndex: any) => {
    const newCols = [...columns];
    newCols[colIndex].push("");
    setColumns(newCols);
  };

  const updateCell = (colIndex: any, rowIndex: any, value: any) => {
    const newCols = [...columns];
    newCols[colIndex][rowIndex] = value;
    setColumns(newCols);
  };

  return (
    <div className="container montserrat">

      {/* MODE SWITCH */}
      <div className="mode-switch">
        <button
          onClick={() => setMode("single")}
          className={`switch-btn ${mode === "single" ? "active" : ""}`}
        >
          Single Input
        </button>

        <button
          onClick={() => setMode("columns")}
          className={`switch-btn ${mode === "columns" ? "active" : ""}`}
        >
          Excel-Style Columns
        </button>
      </div>

      {/* ======================== SINGLE INPUT MODE ======================== */}
      {mode === "single" && (
        <>
          <div className="card">
            <textarea
              className="textarea"
              rows={5}
              placeholder="Enter name or multiple names..."
              value={names}
              onChange={(e) => setNames(e.target.value)}
            />

            <button onClick={handlePrint} className="main-btn">
              Print
            </button>
            {/* <button onClick={handleDownload} className="main-btn ml-2">
              Download PDF
            </button> */}
          </div>

          <div className="print-area">
            <div className="print-columns">
              {names
                .split("\n")
                .filter((n) => n.trim() !== "")
                .map((name, i) => (
                  <div key={i} className="print-name">
                    {name}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* ======================== COLUMN MODE ======================== */}
      {mode === "columns" && (
        <>
          <div className="card">
            <h2 style={{ marginBottom: "10px" }}>Excel Style Columns</h2>

            <div className="columns-wrapper">
              {columns.map((col, colIndex) => (
                <div key={colIndex} className="column-box">
                  <div className="column-header">
                    <h4>Column {colIndex + 1}</h4>
                    <button
                      className="delete-col-btn"
                      onClick={() => deleteColumn(colIndex)}
                    >
                      ✕
                    </button>
                  </div>

                  {col.map((cell, rowIndex) => (
                    <input
                      key={rowIndex}
                      value={cell}
                      placeholder="Name"
                      className="cell-input"
                      onChange={(e) =>
                        updateCell(colIndex, rowIndex, e.target.value)
                      }
                    />
                  ))}

                  <button className="add-row-btn" onClick={() => addRow(colIndex)}>
                    + Row
                  </button>
                </div>
              ))}

              <button className="add-col-btn" onClick={addColumn}>
                + Column
              </button>
            </div>

            <button onClick={handlePrint} className="main-btn">
              Print Columns
            </button>
            {/* <button onClick={handleDownload} className="main-btn ml-2">
              Download PDF
            </button> */}
          </div>

          <div className="print-area">
            <h2>Names (Columns):</h2>
            <div className="print-columns">
              {columns.map((col, i) =>
                col.map((cell, r) => (
                  <div key={`${i}-${r}`} className="print-name">
                    {cell}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
