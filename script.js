    document.addEventListener("DOMContentLoaded", () => {

      // TOGGLE KODE
      const dots = document.getElementById("dots");
      const more = document.getElementById("more");
      const btn = document.getElementById("btnCode");
      btn.addEventListener("click", () => {
        const open = dots.classList.contains("hidden");
        dots.classList.toggle("hidden", !open);
        more.classList.toggle("hidden", open);
        btn.textContent = open ? "Baca selengkapnya" : "Tutup";
      });

      // CHART BPM
      const ctx = document.getElementById("lieDetectorChart");
      const bpmStatus = document.getElementById("bpmStatus");

      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({length:10},(_,i)=>`Data ${i+1}`),
          datasets:[{
            label:"Pulse Sensor (BPM)",
            data:Array(10).fill(0),
            borderColor:"#22d3ee",
            backgroundColor:"rgba(34,211,238,0.2)",
            tension:0.4,
            pointRadius:5
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          scales:{
            y:{min:0,max:150,title:{display:true,text:"BPM"}}
          }
        }
      });

      function getStatus(bpm){
        if(bpm===0) return {t:"Menunggu",c:"text-gray-400"};
        if(bpm<90) return {t:"Tenang",c:"text-green-400"};
        if(bpm<=120) return {t:"Tegang",c:"text-yellow-400"};
        return {t:"Bohong",c:"text-red-500"};
      }

      function simulateBPM(type){
        let bpm=0;
        if(type==="tenang") bpm=Math.floor(Math.random()*20)+65;
        if(type==="bohong") bpm=Math.floor(Math.random()*30)+121;

        const d=chart.data.datasets[0].data;
        d.shift();
        d.push(bpm);
        chart.update();

        const s=getStatus(bpm);
        bpmStatus.textContent=`Status: ${s.t} (${bpm} BPM)`;
        bpmStatus.className=`mt-4 text-lg font-semibold ${s.c}`;
      }

      // Tombol Reset
    document.getElementById("resetChart").onclick = () => {
    // Reset semua data chart ke 0
    chart.data.datasets[0].data = Array(10).fill(0);
    chart.update();

    // Reset status BPM
    bpmStatus.textContent = "Status: Menunggu (0 BPM)";
    bpmStatus.className = "mt-4 text-lg font-semibold text-gray-400";
    };


      document.getElementById("simulateTruth").onclick=()=>simulateBPM("tenang");
      document.getElementById("simulateLie").onclick=()=>simulateBPM("bohong");

    });
