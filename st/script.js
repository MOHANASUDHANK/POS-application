const chart = document.getElementById("myChart")

const myData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
  datasets: [{
    label: 'Performance Data',
    data: [770,920,1060,1010,1190,1310],   
    fill : true,   
    borderColor:  'rgba(54, 162, 235, 1)',
    borderWidth:2,

    backgroundColor: 'rgba(54, 162, 235, 0.15)',
    pointBackgroundColor:'rgba(54, 162, 235, 1)',
    tension:0
  }]
};

const myConfig = {
    
  type: 'line', 
  data: myData,
  options: {responsive:true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true
       } 
    },plugins:{
        legend:{
            display:false,
            ticks:{
                stepSize:250
            }
        }
    }
  }
};

new Chart(chart, myConfig);