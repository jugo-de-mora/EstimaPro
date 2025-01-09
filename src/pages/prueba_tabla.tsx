import React, { useState, FocusEvent } from "react";
import "./TableWithFloatingButtons.css";

const SubirPage: React.FC = () => {
  const [focusedRow, setFocusedRow] = useState<number | null>(null);

  // Maneja el evento de foco en el input
  const handleFocus = (index: number) => {
    setFocusedRow(index);
  };

  // Maneja el evento de pérdida de foco en el input
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    // Verifica si el foco se movió fuera del contenedor del input
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocusedRow(null);
    }
  };

  return (
    <div className="table-container">
      <table className="custom-table">
        <tbody>
          {[1, 2, 3].map((row, index) => (
            <tr key={index} className="table-row">
              <td>
                <div
                  className="input-container"
                  onBlur={(event) => handleBlur(event)}
                >
                  <input
                    type="text"
                    className="cell-input"
                    placeholder={`Row ${row}`}
                    onFocus={() => handleFocus(index)}
                  />
                  {focusedRow === index && (
                    <div className="floating-buttons">
                      <button className="floating-button">Action 1</button>
                      <button className="floating-button">Action 2</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubirPage;
