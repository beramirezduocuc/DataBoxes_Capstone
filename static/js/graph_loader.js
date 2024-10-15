document.querySelectorAll('.loadChart').forEach(button => {
    button.addEventListener('click', function() {
        const chartURL = this.getAttribute('data-url');
        fetch(chartURL)
        .then(response => response.text())
        .then(data => {
            const container = document.getElementById('chartContainer');
            container.innerHTML += data; 
        })
        .catch(error => console.error('Error:', error));
    });
});