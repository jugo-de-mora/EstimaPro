import React from 'react';
import './SubirPage.css'; // Asegúrate de crear este archivo para los estilos.

const ManualPage: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Manual de Usuario - Aplicativo de Estimaciones</h1>

      {/* Tarjeta de Navegación */}
      <div className="card">
        <h2>Navegación en el Menú Lateral</h2>
        <p>En el lado izquierdo de la pantalla, encontrarás el menú de navegación para moverte entre las secciones del aplicativo:</p>
        <ul>
          <li><strong>SEED E.M</strong>: Título del aplicativo.</li>
          <li><strong>←</strong>: Regresa a la pantalla anterior.</li>
          <li><strong>+ CREAR</strong>: Despliega opciones para crear nuevas actividades o tareas.</li>
          <li><strong>INICIO</strong>: Lleva a la página principal.</li>
          <li><strong>MANUAL</strong>: Explicación a detalle de la página.</li>
        </ul>
      </div>

      {/* Tarjeta del Panel Principal */}
      <div className="card">
        <h2>Panel Principal</h2>
        <p>El panel principal contiene una tabla para organizar las estimaciones de cada actividad del proyecto, con una columna para cada área.</p>
      </div>

      {/* Tarjeta de Columnas de la Tabla */}
      <div className="card">
        <h2>Creación de Estimación</h2>
        <p>La tabla está dividida en diferentes columnas:</p>
        <ul>
          <li><strong>Categoría</strong>: Tipo o categoría de la tarea.</li>
          <li><strong>Actividad o HU</strong>: Descripción de la actividad o historia de usuario.</li>
          <li><strong>Criterio de aceptación</strong>: Condición para considerar la tarea completa.</li>
          <li><strong>Total</strong>: Estimación total en horas o días.</li>
          <li><strong>Áreas (Project Manager, Diseño, etc.)</strong>: Tiempo estimado para cada equipo.</li>
        </ul>
      </div>

      {/* Tarjeta de Funciones Adicionales */}
      <div className="card">
        <h2>Funciones Adicionales</h2>
        <ul>
          <li><strong>+ Columna</strong>: Agrega una columna adicional a la tabla.</li>
          <li><strong>- Columna</strong>: Elimina la última columna de la tabla.</li>
        </ul>
        <p>Haz clic en cualquier celda de la tabla para ingresar o editar la información.</p>
      </div>

      {/* Tarjeta de Guardar Cambios */}
      <div className="card">
        <h2>Guardar Cambios</h2>
        <p>Revisa toda la información ingresada en la tabla antes de guardar los cambios en el sistema.</p>
      </div>

      {/* Tarjeta de Ayuda y Soporte */}
      <div className="card">
        <h2>Manual de Usuario</h2>
        <p>Si quieres conocer mas sobre el aplicativo, usa el botón <strong>MANUAL</strong> en el menú lateral.</p>
      </div>
    </div>
  );
};

export default ManualPage;