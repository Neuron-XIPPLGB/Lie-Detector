document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Chart.js
    const ctx = document.getElementById('lieDetectorChart').getContext('2d');
    const lieDetectorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 10}, (_, i) => `Data ${i+1}`),
            datasets: [{
                label: 'GSR (Galvanic Skin Response)',
                data: [100, 105, 102, 107, 103, 108, 105, 104, 106, 109],
                borderColor: '#00ffcc',
                backgroundColor: 'rgba(0, 255, 204, 0.2)',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Nilai Sensor'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#f0f4f8'
                    }
                }
            }
        }
    });

    // Fungsi untuk mensimulasikan data
    function simulateData(isLie) {
        const newData = lieDetectorChart.data.datasets[0].data;
        const lastValue = newData[newData.length - 1];
        
        // Geser data lama
        newData.shift();

        // Tambahkan data baru
        if (isLie) {
            // Data 'berbohong' akan lebih fluktuatif
            const fluctuation = Math.random() * 50 + 20; // Fluktuasi besar
            const newValue = lastValue + (Math.random() > 0.5 ? fluctuation : -fluctuation);
            newData.push(Math.max(100, newValue)); // Pastikan tidak terlalu rendah
        } else {
            // Data 'jujur' lebih stabil
            const fluctuation = Math.random() * 5 - 2.5; // Fluktuasi kecil
            const newValue = lastValue + fluctuation;
            newData.push(newValue);
        }
        
        // Update label
        const newLabel = `Data ${lieDetectorChart.data.labels.length + 1}`;
        lieDetectorChart.data.labels.shift();
        lieDetectorChart.data.labels.push(newLabel);

        lieDetectorChart.update();
    }

    // Event listener untuk tombol simulasi
    document.getElementById('simulateTruth').addEventListener('click', () => {
        simulateData(false);
    });

    document.getElementById('simulateLie').addEventListener('click', () => {
        simulateData(true);
    });

    // Jalankan simulasi otomatis setiap 2 detik
    setInterval(() => {
        simulateData(false);
    }, 2000);
});