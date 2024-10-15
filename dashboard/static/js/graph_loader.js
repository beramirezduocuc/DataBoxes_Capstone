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


const getOptionChart = async() => {
    try{
        const response = await fetch("");
    } catch(ex){
        alert(ex);
    }
};

const initChart = async() => {
    const myChart = echarts.init(document.getElementById("chart"));
}

windows.addEventListener("load", async()=>{
    await initChart();
})