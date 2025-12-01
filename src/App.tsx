import { useState } from "react";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("single");
  const [names, setNames] = useState("");
  const [columns, setColumns] = useState([[""]]);

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
          .print-columns { display: flex; gap: 20px; }
          .print-col { margin-right: 10px; }
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
          </div>

          <div className="print-area">
            <pre>{names}</pre>
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
          </div>

          <div className="print-area">
            <h2>Names (Columns):</h2>

            <div className="print-columns">
              {columns.map((col, i) => (
                <div key={i} className="print-col">
                  {col.map((cell, r) => (
                    <div key={r}>{cell}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* PRINT ONLY */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute; top: 0; left: 0; width: 100%; padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
