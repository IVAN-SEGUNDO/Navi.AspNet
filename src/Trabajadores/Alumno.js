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
            nombre: alumno.nombre,
            promedio: promedio,
            estado: promedio >= 6 ? "Aprobado" : "Reprobado"
        };
    });

    const data = {
        labels: alumnosConPromedio.map(alumno => alumno.nombre),
        datasets: [
            {
                label: 'Promedio',
                data: alumnosConPromedio.map(alumno => alumno.promedio),
                backgroundColor: alumnosConPromedio.map(alumno => alumno.promedio >= 6 ? '#36A2EB' : '#FF6384'),
            }
        ],
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5" style={{ color: '#343a40', fontWeight: 'bold', fontSize: '2.5rem' }}>
                Promedios de Alumnos
            </h2>

            <div style={{ height: '400px', marginBottom: '50px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', padding: '20px', backgroundColor: '#f8f9fa' }}>
                <Bar
                    data={data}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { display: true },
                            tooltip: { enabled: true },
                        },
                        scales: {
                            y: { beginAtZero: true, max: 10 },
                        },
                    }}
                />
            </div>

            <div className="mt-5">
                <h3 className="mb-4 text text-center" style={{ color: '#343a40', fontWeight: 'bold', fontSize: '1.75rem' }}>
                    Detalles de los Alumnos
                </h3>
                <ul className="list-group">
                    {alumnosConPromedio.map((alumno, index) => (
                        <li
                            key={index}
                            className={`list-group-item d-flex justify-content-between align-items-center ${alumno.estado === "Aprobado" ? "bg-success text-white" : "bg-danger text-white"}`}
                            style={{ marginBottom: '10px', borderRadius: '8px', padding: '15px' }}
                        >
                            <span><strong>Nombre:</strong> {alumno.nombre}</span>
                            <span><strong>Promedio:</strong> {alumno.promedio.toFixed(2)}</span>
                            <span><strong>Estado:</strong> {alumno.estado}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ListaAlumnos;
