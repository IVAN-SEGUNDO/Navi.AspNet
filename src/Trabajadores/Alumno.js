import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ListaAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
                const data = await response.json();
                setAlumnos(data);
            } catch (error) {
                console.error("Error al obtener los datos de alumnos:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const alumnosConPromedio = alumnos.map(alumno => {
        const practicas = alumno.practicas || {};
        const calificaciones = Object.values(practicas).map(val => Number(val));
        const promedio = calificaciones.length > 0
            ? calificaciones.reduce((acc, val) => acc + val, 0) / calificaciones.length
            : 0;
        
        return {
            id: alumno.id,
            cuenta: alumno.cuenta,
            nombre: alumno.nombre,
            promedio: promedio,
            estado: promedio >= 7 ? "Aprobado" : "Reprobado"
        };
    });

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5" style={{ color: '#495057', fontWeight: 'bold', fontSize: '2.8rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Calificaciones del Ing. Alex Ramírez Galindo
            </h2>

            <div className="row">
                {alumnosConPromedio.map((alumno, index) => (
                    <div key={index} className="col-md-6 mb-4">
                        <div className="card shadow-lg" style={{ borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                            <div className="card-body" style={{ padding: '1.5rem' }}>
                                <h5 className="card-title text-muted" style={{ fontSize: '1.1rem', fontWeight: '600', letterSpacing: '0.5px' }}>ID: {alumno.id}</h5>
                                <p><strong>Cuenta:</strong> {alumno.cuenta}</p>
                                <p><strong>Nombre:</strong> {alumno.nombre}</p>
                                
                                <div style={{ height: '200px', marginBottom: '1rem' }}>
                                    <Bar
                                        data={{
                                            labels: ['Promedio'],
                                            datasets: [
                                                {
                                                    label: 'Promedio de Calificaciones',
                                                    data: [alumno.promedio],
                                                    backgroundColor: alumno.promedio >= 7 ? '#28a745' : '#dc3545', // Color coincide con el botón
                                                }
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: { enabled: true },
                                            },
                                            scales: {
                                                y: { beginAtZero: true, max: 10 },
                                            },
                                        }}
                                    />
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#6c757d', marginBottom: '0.5rem' }}>
                                    <strong>Promedio:</strong> {alumno.promedio.toFixed(2)}
                                </div>
                                
                                <button
                                    className={`btn btn-${alumno.estado === "Aprobado" ? "success" : "danger"} w-100`}
                                    style={{
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        padding: '0.75rem',
                                        fontSize: '1rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    {alumno.estado}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaAlumnos;
