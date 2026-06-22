// Sistema de Administración
const ADMIN_PASSWORD = "Rocio123"; // contraseña de admin 

// Verificar si el usuario es admin
function isAdmin() {
  return localStorage.getItem("adminLogged") === "true";
}

// Login
function loginAdmin() {
  const password = prompt("Ingresa la contraseña de admin:");
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("adminLogged", "true");
    showAdminPanel();
    alert("✓ Acceso de admin activado");
  } else {
    alert("✗ Contraseña incorrecta");
  }
}

// Logout
function logoutAdmin() {
  localStorage.removeItem("adminLogged");
  hideAdminPanel();
  alert("Sesión cerrada");
}

// Mostrar panel de admin
function showAdminPanel() {
  const adminPanel = document.getElementById("adminPanel");
  if (adminPanel) {
    adminPanel.style.display = "block";
  }
  
  // Hacer la tabla editable
  makeTableEditable();
}

// Ocultar panel de admin
function hideAdminPanel() {
  const adminPanel = document.getElementById("adminPanel");
  if (adminPanel) {
    adminPanel.style.display = "none";
  }
  
  // Deshabilitar edición
  makeTableReadOnly();
}

// Hacer tabla editable
function makeTableEditable() {
  const table = document.querySelector("table tbody");
  if (!table) return;
  
  const cells = table.querySelectorAll("td");
  cells.forEach(cell => {
    // No hacemos editable la columna de imagen
    if (cell.querySelector("img")) {
      return;
    }
    
    cell.style.cursor = "pointer";
    cell.style.backgroundColor = "#fffacd";
    cell.addEventListener("click", function() {
      editCell(this);
    });
  });
}

// Hacer tabla solo lectura
function makeTableReadOnly() {
  const table = document.querySelector("table tbody");
  if (!table) return;
  
  const cells = table.querySelectorAll("td");
  cells.forEach(cell => {
    if (cell.querySelector("img")) {
      return;
    }
    cell.style.cursor = "default";
    cell.style.backgroundColor = "white";
  });
}

// Editar celda
function editCell(cell) {
  if (!isAdmin()) return;
  
  const currentValue = cell.textContent;
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentValue;
  input.style.width = "100%";
  input.style.padding = "5px";
  
  cell.innerHTML = "";
  cell.appendChild(input);
  input.focus();
  input.select();
  
  function saveEdit() {
    const newValue = input.value.trim() || currentValue;
    cell.textContent = newValue;
    cell.style.backgroundColor = "#fffacd";
    saveTableData();
  }
  
  input.addEventListener("blur", saveEdit);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") saveEdit();
  });
}

// Guardar datos de la tabla en localStorage
function saveTableData() {
  const table = document.querySelector("table tbody");
  if (!table) return;
  
  const rows = [];
  table.querySelectorAll("tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    const rowData = {
      aerosol: cells[0]?.textContent || "",
      precio: cells[1]?.textContent || "",
      stock: cells[2]?.textContent || ""
    };
    rows.push(rowData);
  });
  
  localStorage.setItem("tableData", JSON.stringify(rows));
  console.log("✓ Datos guardados");
}

// Cargar datos de la tabla desde localStorage
function loadTableData() {
  const savedData = localStorage.getItem("tableData");
  if (!savedData) return;
  
  const rows = JSON.parse(savedData);
  const tbody = document.querySelector("table tbody");
  if (!tbody) return;
  
  const tr = tbody.querySelectorAll("tr");
  rows.forEach((rowData, index) => {
    if (tr[index]) {
      const cells = tr[index].querySelectorAll("td");
      if (cells[0]) cells[0].textContent = rowData.aerosol;
      if (cells[1]) cells[1].textContent = rowData.precio;
      if (cells[2]) cells[2].textContent = rowData.stock;
    }
  });
}

// Agregar fila a la tabla
function addTableRow() {
  if (!isAdmin()) {
    alert("Debes ser admin para hacer esto");
    return;
  }
  
  const tbody = document.querySelector("table tbody");
  if (!tbody) return;
  
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>Nuevo Producto</td>
    <td>$0</td>
    <td>0</td>
    <td><img src="" width="200" height="200" alt="Producto"></td>
  `;
  
  tbody.appendChild(newRow);
  saveTableData();
  makeTableEditable();
  alert("✓ Fila agregada. Haz clic en las celdas para editar.");
}

// Eliminar última fila
function deleteTableRow() {
  if (!isAdmin()) {
    alert("Debes ser admin para hacer esto");
    return;
  }
  
  const tbody = document.querySelector("table tbody");
  const rows = tbody.querySelectorAll("tr");
  if (rows.length > 1) {
    rows[rows.length - 1].remove();
    saveTableData();
    alert("✓ Fila eliminada");
  } else {
    alert("No puedes eliminar la última fila");
  }
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  loadTableData();
  
  if (isAdmin()) {
    showAdminPanel();
  }
});

function validarFormulario(evento) {
    evento.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    const msgOk    = document.getElementById('msg-ok');
    const msgError = document.getElementById('msg-error');

    msgOk.classList.add('oculto');
    msgError.classList.add('oculto');

    if (nombre === '' || email === '' || mensaje === '') {
        msgError.classList.remove('oculto');
    } else {
        msgOk.classList.remove('oculto');
        formContacto.reset();
    }
}

if (formContacto) {
    formContacto.addEventListener('submit', validarFormulario);
}

