// Array de ejercicios - Fácil de mantener y modificar
const ejercicios = [
  // CALENTAMIENTO
  { fase: 'Calentamiento', nombre: 'Rotaciones de hombros', tiempo: 30, tipo: 'calentamiento' },
  { fase: 'Calentamiento', nombre: 'Círculos de brazos adelante', tiempo: 30, tipo: 'calentamiento' },
  { fase: 'Calentamiento', nombre: 'Círculos de brazos atrás', tiempo: 30, tipo: 'calentamiento' },
  { fase: 'Calentamiento', nombre: 'Cruces de brazos dinámicos', tiempo: 30, tipo: 'calentamiento' },
  
  // FUERZA
  { fase: 'Fuerza', nombre: 'Press militar con mancuernas', tiempo: 45, tipo: 'fuerza' },
  { fase: 'Fuerza', nombre: 'Descanso', tiempo: 30, tipo: 'descanso' },
  { fase: 'Fuerza', nombre: 'Elevaciones laterales', tiempo: 45, tipo: 'fuerza' },
  { fase: 'Fuerza', nombre: 'Descanso', tiempo: 30, tipo: 'descanso' },
  { fase: 'Fuerza', nombre: 'Elevaciones frontales', tiempo: 45, tipo: 'fuerza' },
  { fase: 'Fuerza', nombre: 'Descanso', tiempo: 30, tipo: 'descanso' },
  { fase: 'Fuerza', nombre: 'Pájaros (deltoides posterior)', tiempo: 45, tipo: 'fuerza' },
  { fase: 'Fuerza', nombre: 'Descanso', tiempo: 30, tipo: 'descanso' },
  { fase: 'Fuerza', nombre: 'Press Arnold', tiempo: 45, tipo: 'fuerza' },
  { fase: 'Fuerza', nombre: 'Descanso', tiempo: 30, tipo: 'descanso' },
  { fase: 'Fuerza', nombre: 'Encogimientos de hombros', tiempo: 45, tipo: 'fuerza' },
  
  // CARDIO
  { fase: 'Cardio', nombre: 'Bicicleta estática', tiempo: 360, tipo: 'cardio' },
  
  // ENFRIAMIENTO
  { fase: 'Enfriamiento', nombre: 'Estiramiento cruzado de brazo', tiempo: 30, tipo: 'enfriamiento' },
  { fase: 'Enfriamiento', nombre: 'Estiramiento brazo detrás cabeza', tiempo: 30, tipo: 'enfriamiento' },
  { fase: 'Enfriamiento', nombre: 'Estiramiento doorway pecho', tiempo: 45, tipo: 'enfriamiento' },
  { fase: 'Enfriamiento', nombre: 'Rotaciones suaves de hombros', tiempo: 30, tipo: 'enfriamiento' },
  { fase: 'Enfriamiento', nombre: 'Respiración profunda', tiempo: 60, tipo: 'enfriamiento' }
];

let completedExercises = 0;
const totalExercises = ejercicios.length;

// Objeto para almacenar los estados de los timers
let timerStates = {};

// Generar la tabla dinámicamente
function generarTablaEjercicios() {
  const tbody = document.getElementById('ejerciciosTableBody');
  tbody.innerHTML = '';

  ejercicios.forEach((ejercicio, index) => {
    const row = document.createElement('tr');
    
    // Aplicar clases especiales para ejercicios de descanso
    if (ejercicio.tipo === 'descanso') {
      row.classList.add('descanso-row');
    }

    row.innerHTML = `
      <td class="fase-cell fase-${ejercicio.tipo}">${ejercicio.fase}</td>
      <td class="ejercicio-cell ${ejercicio.tipo === 'descanso' ? 'descanso-text' : ''}">${ejercicio.nombre}</td>
      <td class="timer ${ejercicio.tipo === 'descanso' ? 'descanso-timer' : ''}" data-time="${ejercicio.tiempo}">
        ${formatearTiempo(ejercicio.tiempo)}
      </td>
      <td><button class="btn-iniciar" onclick="iniciar(this)">Iniciar</button></td>
      <td>
        <button class="btn-pausa" onclick="pausar(this)" style="display: none;">⏸️</button>
        <button class="btn-detener" onclick="detener(this)" style="display: none;">⏹️</button>
      </td>
      <td><button class="btn-completar" onclick="completar(this)">✅</button></td>
    `;

    tbody.appendChild(row);
  });

  // Actualizar el tiempo total
  actualizarTiempoTotal();
}

// Formatear tiempo para mostrar
function formatearTiempo(segundos) {
  if (segundos >= 60) {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    if (segsRestantes === 0) {
      return `${minutos} min`;
    } else {
      return `${minutos}:${segsRestantes.toString().padStart(2, '0')} min`;
    }
  } else {
    return `${segundos} seg`;
  }
}

// Calcular y actualizar tiempo total
function actualizarTiempoTotal() {
  const tiempoTotalSegundos = ejercicios.reduce((total, ejercicio) => total + ejercicio.tiempo, 0);
  const minutos = Math.floor(tiempoTotalSegundos / 60);
  const segundos = tiempoTotalSegundos % 60;
  const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;
  
  document.getElementById('totalTime').textContent = tiempoFormateado;
}

function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const completedCount = document.getElementById('completedCount');
  const percentage = (completedExercises / totalExercises) * 100;
  
  progressFill.style.width = percentage + '%';
  completedCount.textContent = completedExercises;
}

function updateCurrentPhase() {
  const currentPhase = document.getElementById('currentPhase');
  const rows = document.querySelectorAll('tbody tr');
  
  for (let row of rows) {
    const completedBtn = row.querySelector('.btn-completar');
    if (!completedBtn.classList.contains('done')) {
      const phase = row.querySelector('.fase-cell').textContent;
      currentPhase.textContent = phase;
      return;
    }
  }
  currentPhase.textContent = '¡Completado!';
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function iniciar(btn) {
  const row = btn.parentElement.parentElement;
  const timerCell = row.querySelector(".timer");
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  
  // Si ya existe un timer en ejecución para esta fila, no hacer nada
  if (timerStates[rowIndex] && timerStates[rowIndex].isRunning) {
    return;
  }

  const seconds = parseInt(timerCell.getAttribute("data-time"));
  let timeLeft = timerStates[rowIndex] ? timerStates[rowIndex].timeLeft : seconds;

  const beep = document.getElementById("beep");
  const pausaBtn = row.querySelector('.btn-pausa');
  const detenerBtn = row.querySelector('.btn-detener');

  // Mostrar botones de control
  pausaBtn.style.display = 'inline-block';
  detenerBtn.style.display = 'inline-block';

  // Deshabilitar botón iniciar y cambiar texto
  btn.disabled = true;
  btn.textContent = "⏳ Corriendo";
  timerCell.classList.add('running');
  timerCell.classList.remove('paused');

  const interval = setInterval(() => {
    // Verificar si el timer fue pausado o detenido
    if (!timerStates[rowIndex] || !timerStates[rowIndex].isRunning) {
      clearInterval(interval);
      return;
    }

    timerCell.textContent = formatTime(timeLeft);
    timeLeft--;

    // Actualizar el estado
    timerStates[rowIndex].timeLeft = timeLeft;

    if (timeLeft < 0) {
      clearInterval(interval);
      
      // Completar el ejercicio
      timerCell.textContent = "✅ Completado";
      timerCell.classList.remove('running');
      timerCell.classList.add('completed');
      
      // Ocultar botones de control
      pausaBtn.style.display = 'none';
      detenerBtn.style.display = 'none';
      
      // Resetear botón iniciar
      btn.disabled = false;
      btn.textContent = "Reiniciar";
      
      // Limpiar estado
      delete timerStates[rowIndex];
      
      // Reproducir sonido
      beep.play().catch(() => {});
      
      // Auto-completar el ejercicio
      const completarBtn = row.querySelector('.btn-completar');
      if (!completarBtn.classList.contains('done')) {
        completar(completarBtn);
      }
    }
  }, 1000);

  // Guardar el estado del timer
  timerStates[rowIndex] = {
    interval: interval,
    timeLeft: timeLeft,
    isRunning: true,
    isPaused: false
  };
}

function pausar(btn) {
  const row = btn.parentElement.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const timerCell = row.querySelector(".timer");
  const iniciarBtn = row.querySelector('.btn-iniciar');

  if (!timerStates[rowIndex]) return;

  if (timerStates[rowIndex].isPaused) {
    // Reanudar - crear nuevo interval con el tiempo restante
    timerStates[rowIndex].isRunning = true;
    timerStates[rowIndex].isPaused = false;
    btn.textContent = "⏸️";
    timerCell.classList.remove('paused');
    timerCell.classList.add('running');
    iniciarBtn.textContent = "⏳ Corriendo";
    
    const beep = document.getElementById("beep");
    let timeLeft = timerStates[rowIndex].timeLeft;
    
    // Crear nuevo interval para continuar desde donde se pausó
    const interval = setInterval(() => {
      // Verificar si el timer fue pausado o detenido
      if (!timerStates[rowIndex] || !timerStates[rowIndex].isRunning) {
        clearInterval(interval);
        return;
      }

      timerCell.textContent = formatTime(timeLeft);
      timeLeft--;

      // Actualizar el estado
      timerStates[rowIndex].timeLeft = timeLeft;

      if (timeLeft < 0) {
        clearInterval(interval);
        
        // Completar el ejercicio
        timerCell.textContent = "✅ Completado";
        timerCell.classList.remove('running');
        timerCell.classList.add('completed');
        
        // Ocultar botones de control
        const pausaBtn = row.querySelector('.btn-pausa');
        const detenerBtn = row.querySelector('.btn-detener');
        pausaBtn.style.display = 'none';
        detenerBtn.style.display = 'none';
        
        // Resetear botón iniciar
        iniciarBtn.disabled = false;
        iniciarBtn.textContent = "Reiniciar";
        
        // Limpiar estado
        delete timerStates[rowIndex];
        
        // Reproducir sonido
        beep.play().catch(() => {});
        
        // Auto-completar el ejercicio
        const completarBtn = row.querySelector('.btn-completar');
        if (!completarBtn.classList.contains('done')) {
          completar(completarBtn);
        }
      }
    }, 1000);

    // Actualizar el interval en el estado
    timerStates[rowIndex].interval = interval;
    
  } else {
    // Pausar
    timerStates[rowIndex].isRunning = false;
    timerStates[rowIndex].isPaused = true;
    btn.textContent = "▶️";
    timerCell.classList.remove('running');
    timerCell.classList.add('paused');
    iniciarBtn.textContent = "⏸️ Pausado";
  }
}

function detener(btn) {
  const row = btn.parentElement.parentElement;
  const rowIndex = Array.from(row.parentElement.children).indexOf(row);
  const timerCell = row.querySelector(".timer");
  const iniciarBtn = row.querySelector('.btn-iniciar');
  const pausaBtn = row.querySelector('.btn-pausa');

  // Limpiar el timer si existe
  if (timerStates[rowIndex]) {
    clearInterval(timerStates[rowIndex].interval);
    delete timerStates[rowIndex];
  }

  // Resetear la celda del timer
  const originalTime = parseInt(timerCell.getAttribute("data-time"));
  timerCell.textContent = formatearTiempo(originalTime);
  timerCell.classList.remove('running', 'paused', 'completed');

  // Ocultar botones de control
  pausaBtn.style.display = 'none';
  btn.style.display = 'none';

  // Resetear botón iniciar
  iniciarBtn.disabled = false;
  iniciarBtn.textContent = "Iniciar";
  pausaBtn.textContent = "⏸️";
}

function completar(btn) {
  const wasCompleted = btn.classList.contains("done");
  btn.classList.toggle("done");
  
  if (!wasCompleted) {
    completedExercises++;
    btn.textContent = "✅ Hecho";
  } else {
    completedExercises--;
    btn.textContent = "✅";
    
    // Reset timer if uncompleting
    const row = btn.parentElement.parentElement;
    const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    const timerCell = row.querySelector(".timer");
    const originalTime = parseInt(timerCell.getAttribute("data-time"));
    
    // Detener cualquier timer en ejecución
    if (timerStates[rowIndex]) {
      clearInterval(timerStates[rowIndex].interval);
      delete timerStates[rowIndex];
    }
    
    // Resetear apariencia
    timerCell.textContent = formatearTiempo(originalTime);
    timerCell.classList.remove('completed', 'running', 'paused');
    
    // Resetear botones
    const startBtn = row.querySelector('.btn-iniciar');
    const pausaBtn = row.querySelector('.btn-pausa');
    const detenerBtn = row.querySelector('.btn-detener');
    
    startBtn.textContent = "Iniciar";
    startBtn.disabled = false;
    pausaBtn.style.display = 'none';
    detenerBtn.style.display = 'none';
    pausaBtn.textContent = "⏸️";
  }
  
  updateProgress();
  updateCurrentPhase();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  generarTablaEjercicios();
  updateProgress();
  updateCurrentPhase();
});
