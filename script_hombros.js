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

// Generar las cards dinámicamente
function generarTablaEjercicios() {
  const container = document.getElementById('exercisesContainer');
  container.innerHTML = '';

  ejercicios.forEach((ejercicio, index) => {
    const card = document.createElement('div');
    card.className = 'exercise-card';
    
    // Aplicar clases especiales para ejercicios de descanso
    if (ejercicio.tipo === 'descanso') {
      card.classList.add('descanso-card');
    }    card.innerHTML = `
      <div class="card-header">
        <div class="fase-badge fase-${ejercicio.tipo}">${ejercicio.fase}</div>
        <div class="timer ${ejercicio.tipo === 'descanso' ? 'descanso-timer' : ''}" data-time="${ejercicio.tiempo}">
          ${formatearTiempo(ejercicio.tiempo)}
        </div>
      </div>
      
      <div class="exercise-name ${ejercicio.tipo === 'descanso' ? 'descanso-text' : ''}">${ejercicio.nombre}</div>
      
      <div class="controls-section">
        <button class="btn-iniciar" onclick="iniciar(this)">Iniciar</button>
        <button class="btn-pausa" onclick="pausar(this)" style="display: none;">⏸️</button>
        <button class="btn-detener" onclick="detener(this)" style="display: none;">⏹️</button>
        <button class="btn-completar" onclick="completar(this)">✅ Marcar</button>
      </div>
    `;

    container.appendChild(card);
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
  const cards = document.querySelectorAll('.exercise-card');
  
  for (let card of cards) {
    const completedBtn = card.querySelector('.btn-completar');
    if (!completedBtn.classList.contains('done')) {
      const phase = card.querySelector('.fase-badge').textContent;
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
  const card = btn.closest('.exercise-card');
  const timerCell = card.querySelector(".timer");
  const cardIndex = Array.from(card.parentElement.children).indexOf(card);
  
  // Si ya existe un timer en ejecución para esta card, no hacer nada
  if (timerStates[cardIndex] && timerStates[cardIndex].isRunning) {
    return;
  }

  const seconds = parseInt(timerCell.getAttribute("data-time"));
  let timeLeft = timerStates[cardIndex] ? timerStates[cardIndex].timeLeft : seconds;

  const beep = document.getElementById("beep");
  const pausaBtn = card.querySelector('.btn-pausa');
  const detenerBtn = card.querySelector('.btn-detener');

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
    if (!timerStates[cardIndex] || !timerStates[cardIndex].isRunning) {
      clearInterval(interval);
      return;
    }

    timerCell.textContent = formatTime(timeLeft);
    timeLeft--;

    // Actualizar el estado
    timerStates[cardIndex].timeLeft = timeLeft;

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
      delete timerStates[cardIndex];
      
      // Reproducir sonido
      beep.play().catch(() => {});
      
      // Auto-completar el ejercicio
      const completarBtn = card.querySelector('.btn-completar');
      if (!completarBtn.classList.contains('done')) {
        completar(completarBtn);
      }
    }
  }, 1000);

  // Guardar el estado del timer
  timerStates[cardIndex] = {
    interval: interval,
    timeLeft: timeLeft,
    isRunning: true,
    isPaused: false
  };
}

function pausar(btn) {
  const card = btn.closest('.exercise-card');
  const cardIndex = Array.from(card.parentElement.children).indexOf(card);
  const timerCell = card.querySelector(".timer");
  const iniciarBtn = card.querySelector('.btn-iniciar');

  if (!timerStates[cardIndex]) return;
  if (timerStates[cardIndex].isPaused) {
    // Reanudar - crear nuevo interval con el tiempo restante
    timerStates[cardIndex].isRunning = true;
    timerStates[cardIndex].isPaused = false;
    btn.textContent = "⏸️";
    timerCell.classList.remove('paused');
    timerCell.classList.add('running');
    iniciarBtn.textContent = "⏳ Corriendo";
    
    const beep = document.getElementById("beep");
    let timeLeft = timerStates[cardIndex].timeLeft;
      // Crear nuevo interval para continuar desde donde se pausó
    const interval = setInterval(() => {
      // Verificar si el timer fue pausado o detenido
      if (!timerStates[cardIndex] || !timerStates[cardIndex].isRunning) {
        clearInterval(interval);
        return;
      }

      timerCell.textContent = formatTime(timeLeft);
      timeLeft--;

      // Actualizar el estado
      timerStates[cardIndex].timeLeft = timeLeft;

      if (timeLeft < 0) {
        clearInterval(interval);
        
        // Completar el ejercicio
        timerCell.textContent = "✅ Completado";
        timerCell.classList.remove('running');
        timerCell.classList.add('completed');
          // Ocultar botones de control
        const pausaBtn = card.querySelector('.btn-pausa');
        const detenerBtn = card.querySelector('.btn-detener');
        pausaBtn.style.display = 'none';
        detenerBtn.style.display = 'none';
        
        // Resetear botón iniciar
        iniciarBtn.disabled = false;
        iniciarBtn.textContent = "Reiniciar";
        
        // Limpiar estado
        delete timerStates[cardIndex];
        
        // Reproducir sonido
        beep.play().catch(() => {});
          // Auto-completar el ejercicio
        const completarBtn = card.querySelector('.btn-completar');
        if (!completarBtn.classList.contains('done')) {
          completar(completarBtn);
        }
      }
    }, 1000);

    // Actualizar el interval en el estado
    timerStates[cardIndex].interval = interval;
      } else {
    // Pausar
    timerStates[cardIndex].isRunning = false;
    timerStates[cardIndex].isPaused = true;
    btn.textContent = "▶️";
    timerCell.classList.remove('running');
    timerCell.classList.add('paused');
    iniciarBtn.textContent = "⏸️ Pausado";
  }
}

function detener(btn) {
  const card = btn.closest('.exercise-card');
  const cardIndex = Array.from(card.parentElement.children).indexOf(card);
  const timerCell = card.querySelector(".timer");
  const iniciarBtn = card.querySelector('.btn-iniciar');
  const pausaBtn = card.querySelector('.btn-pausa');

  // Limpiar el timer si existe
  if (timerStates[cardIndex]) {
    clearInterval(timerStates[cardIndex].interval);
    delete timerStates[cardIndex];
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
  const card = btn.closest('.exercise-card');
  
  btn.classList.toggle("done");
  
  if (!wasCompleted) {
    completedExercises++;
    btn.textContent = "✅ Hecho";
    // Agregar clase completed a la tarjeta para hacerla más oscura
    card.classList.add('completed');
  } else {
    completedExercises--;
    btn.textContent = "✅ Marcar";
    // Remover clase completed de la tarjeta
    card.classList.remove('completed');
    
    // Reset timer if uncompleting
    const cardIndex = Array.from(card.parentElement.children).indexOf(card);
    const timerCell = card.querySelector(".timer");
    const originalTime = parseInt(timerCell.getAttribute("data-time"));
    
    // Detener cualquier timer en ejecución
    if (timerStates[cardIndex]) {
      clearInterval(timerStates[cardIndex].interval);
      delete timerStates[cardIndex];
    }
    
    // Resetear apariencia
    timerCell.textContent = formatearTiempo(originalTime);
    timerCell.classList.remove('completed', 'running', 'paused');
    
    // Resetear botones
    const startBtn = card.querySelector('.btn-iniciar');
    const pausaBtn = card.querySelector('.btn-pausa');
    const detenerBtn = card.querySelector('.btn-detener');
    
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
