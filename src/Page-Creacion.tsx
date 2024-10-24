import React from 'react';

const PageCreacion = () => {
  return (
    <div className="page-creacion">
      <div className="table-container">
        <div className="edit-button">
          <button>
            <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.88 7.293l-.708-.707a1.002 1.002 0 00-1.414 0L6.586 16H5v1.586l9.172-9.172a1.002 1.002 0 011.414 0l.707.708a1.002 1.002 0 010 1.414L8.828 19H7v-1.828l9.172-9.172a1.002 1.002 0 011.414 0z" fill="#000"/>
            </svg>
          </button>
        </div>
        <div className="custom-table">
          {/* Puedes agregar el contenido o gráficos dentro de las celdas */}
          <table>
            <thead>
              <tr>
                <th>Table 1</th>
              </tr>
            </thead>
            <tbody>
              {/* Genera celdas vacías */}
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(5)].map((_, colIndex) => (
                    <td key={colIndex}></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PageCreacion;
