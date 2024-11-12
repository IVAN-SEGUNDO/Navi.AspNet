import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [sexChartData, setSexChartData] = useState(null);
    const [idChartData, setIdChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                const data = await response.json();
                setDocentes(data);

                if (Array.isArray(data)) {
                    // Configuración de los datos para la gráfica de sexo
                    const maleCount = data.filter(docente => docente.sexo === 'M').length;
                    const femaleCount = data.filter(docente => docente.sexo === 'F').length;

                    setSexChartData({
                        labels: ['Masculino', 'Femenino'],
                        datasets: [
                            {
                                label: 'Distribución por Sexo',
                                data: [maleCount, femaleCount],
                                backgroundColor: ['#36A2EB', '#FF6384'], // Colores diferentes
                            },
                        ],
                    });

                    // Configuración de los datos para la gráfica de IDs
                    const ids = data.map(docente => docente.id);
                    
                    // Genera colores aleatorios para cada barra
                    const colors = ids.map(() => `#${Math.floor(Math.random()*16777215).toString(16)}`);

                    setIdChartData({
                        labels: ids,
                        datasets: [
                            {
                                label: 'IDs de Docentes',
                                data: ids,
                                backgroundColor: colors, // Colores diferentes para cada ID
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="alert alert-primary text-center mb-4">DOCENTES INGENIERÍA INFORMÁTICA TESSFP</h1>
            <div className="row">
                {docentes && docentes.map((docente) => (
                    <div key={docente.id} className="col-md-4 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body alert alert-success">
                                <h5 className="card-title">ID: {docente.id}</h5>
                                <p className="card-text"><strong>Nombre:</strong> {docente.nombre}</p>
                                <p className="card-text"><strong>Sexo:</strong> {docente.sexo}</p>
                                <p className="card-text"><strong>Teléfono:</strong> {docente.telefono}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {/* Gráfica de IDs de docentes */}
            <div className="mt-5">
                <h2 className="text-center">ID de Docentes</h2>
                <div className="d-flex justify-content-center">
                    {idChartData ? (
                        <div style={{ width: '80%' }}>
                            <Bar data={idChartData} options={{ indexAxis: 'x' }} />
                        </div>
                    ) : (
                        <p className="text-center">Cargando gráfica de IDs...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListaDocentes;
