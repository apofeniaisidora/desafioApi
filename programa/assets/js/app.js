const formulario = document.querySelector("#formulario");
const monto = document.querySelector("#monto"); 
const moneda = document.querySelector("#moneda"); 
const resultado = document.querySelector("#resultado");
const cargando = document.querySelector("#cargando");

resultado.innerHTML = "Resultado";

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const montoUsuario = monto.value;
  const monedaUsuario = moneda.value;

  try {
    cargando.innerHTML = "cargando...";
    const respuesta = await fetch("https://mindicador.cl/api/");


    if (!respuesta.ok) throw "error al consumir la api";

    const data = await respuesta.json();

    console.log(monedaUsuario);

    renderGrafica(monedaUsuario);  
    
     if (monedaUsuario === "dolar") {
       return (resultado.innerHTML = montoUsuario * data.dolar.valor);
     }
     if (monedaUsuario === "uf") {
       return (resultado.innerHTML = montoUsuario * data.uf.valor);
     }
     if (monedaUsuario === "euro") {
       return (resultado.innerHTML = montoUsuario * data.euro.valor);
     }
  } catch (error) {
    alert("Error");
  } finally {
    console.log("finally");
    cargando.innerHTML = "";
  }
});


let renderGrafica = async (eleccionMoneda) => {

  
    const data = await getAndCreateDataToChart(eleccionMoneda);

    console.log(data);

    if (data!=undefined) {

      const config = {
        type: "line",
        data
      };
  
      const myChart = document.getElementById("myChart");
      myChart.style.backgroundColor = "#fff";

      if (window.grafica) {
        window.grafica.clear();
        window.grafica.destroy();
      }


      window.grafica = new Chart(myChart, config);  
    }    
}


let getAndCreateDataToChart = async (ruta) => {
    
  
    try {
        const url= 'https://mindicador.cl/api/' + ruta; 
        const res = await fetch(url);
        const moneys = await res.json();

        const tipoCambio = [];

        moneys.serie.forEach(myMoney => {
            tipoCambio.push(myMoney);
        });

        const monedas = tipoCambio.reverse();
       
        const labels=monedas.slice((monedas.length -1) -10, monedas.length).map((money) => {
            return money.fecha.slice(0, 10).split("-").reverse().join("-");
        });
               
        const data = monedas.slice((monedas.length -1) -10, monedas.length).map((money) => {
           const precio = money.valor;
           return Number(precio);
        });

        let newLabel = creaEtiqueta(ruta); 
            
        const datasets = [
          {
            label: newLabel,
            borderColor: 'red',
            data,
            tension: 0.1,
            fill: false
          }
         ];

         console.log(newLabel);

         
       
     
         return { labels, datasets };

    } catch (e) {
      console.log(e.message);
    
    }
  };


  let creaEtiqueta= miPath =>{

    if(miPath=='uf'){
      return 'Historial de la UF - Últimos 10 dias';
    }
    else if(miPath=='dolar'){
      return 'Historial del DÓLAR - Últimos 10 dias';
    }
    else if(miPath=='euro'){
      return 'Historial del EURO - Últimos 10 dias';
    }     
  }

