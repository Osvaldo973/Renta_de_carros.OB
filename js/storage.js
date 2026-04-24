/**
 * storage.js - Sistema de almacenamiento local para Fuertes Rent-Car (Versión GitHub)
 * Este archivo simula una base de datos utilizando localStorage.
 */

const DB_KEY = 'fuertes_rentcar_vehiculos';
const SESSION_KEY = 'fuertes_rentcar_session';

// Datos iniciales para que el sitio no esté vacío
const INITIAL_CARS = [
    {
        id: 1,
        modelo: 'Honda CR-V',
        año: 2023,
        descripcion: 'SUV premium con máxima comodidad y tecnología de punta. Ideal para viajes familiares.',
        precio_dia: 4500,
        estado: 'disponible',
        categoria: 'SUV',
        imagen_url: ['img/honda_crv_2023.png']
    },
    {
        id: 2,
        modelo: 'Toyota Hilux',
        año: 2022,
        descripcion: 'La pick-up más resistente para cualquier terreno. Potencia y confiabilidad asegurada.',
        precio_dia: 5500,
        estado: 'disponible',
        categoria: 'Pick-up',
        imagen_url: ['https://images.unsplash.com/photo-1618335829737-2228915674e0?q=80&w=800&auto=format&fit=crop']
    },
    {
        id: 3,
        modelo: 'Hyundai Santa Fe',
        año: 2024,
        descripcion: 'Elegancia y espacio. Un vehículo diseñado para impresionar en la ciudad.',
        precio_dia: 5000,
        estado: 'alquilado',
        categoria: 'SUV Luxury',
        imagen_url: ['https://images.unsplash.com/photo-1701384351634-934304892c90?q=80&w=800&auto=format&fit=crop']
    }
];

const ADMIN_USER = {
    username: 'admin',
    password: 'admin123',
    fullname: 'Administrador'
};

// Inicializar base de datos
function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_CARS));
    }
}

// Vehículos
function getVehicles(onlyAvailable = false) {
    initDB();
    let cars = JSON.parse(localStorage.getItem(DB_KEY));
    if (onlyAvailable) {
        return cars.filter(c => c.estado === 'disponible');
    }
    return cars;
}

function saveVehicle(vehicle) {
    let cars = getVehicles();
    if (vehicle.id) {
        // Update
        const index = cars.findIndex(c => c.id == vehicle.id);
        if (index !== -1) {
            cars[index] = { ...cars[index], ...vehicle };
        }
    } else {
        // Create
        vehicle.id = Date.now(); // Generar ID único basado en timestamp
        cars.push(vehicle);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(cars));
    return { status: 'success' };
}

function deleteVehicle(id) {
    let cars = getVehicles();
    cars = cars.filter(c => c.id != id);
    localStorage.setItem(DB_KEY, JSON.stringify(cars));
    return { status: 'success' };
}

// Autenticación
function login(username, password) {
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            username: ADMIN_USER.username,
            fullname: ADMIN_USER.fullname,
            loginTime: Date.now()
        }));
        return { status: 'success', user: ADMIN_USER.fullname };
    }
    return { status: 'error', message: 'Usuario o contraseña incorrectos' };
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

function checkAuth() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
}

// Utilidad para subir imagen (convertir a Base64)
async function uploadImageLocal(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve({ status: 'success', url: reader.result });
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
