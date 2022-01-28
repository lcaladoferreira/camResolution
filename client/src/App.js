import React, {useState} from 'react';
import axios from 'axios';
import path from './environment';
import './App.css';

function App() {
  const [data, setData] = useState('');

  const request = (service) => {
    axios.get(service).then((response) => {
      setData(JSON.stringify(response.data, null, 4));
    });
  }

  const getPedido = function captureResults(status) {
    console.log("Stream dimensions for " + tests[r].label + ": " + video.videoWidth + "x" + video.videoHeight);

    if (!scanning)   //exit, se o scan não estiver ativo
        return;

    tests[r].status = status;
    tests[r].streamWidth = video.videoWidth;
    tests[r].streamHeight = video.videoHeight;

    let row = $('table#results')[0].insertRow(-1);
    let browserVer = row.insertCell(0);
    let deviceName = row.insertCell(1);
    let label = row.insertCell(2);
    let ratio = row.insertCell(3);
    let ask = row.insertCell(4);
    let actual = row.insertCell(5);
    let statusCell = row.insertCell(6);
    let deviceIndex = row.insertCell(7);
    let resIndex = row.insertCell(8);

    //não mostrar estes:
    deviceIndex.style.display = "none";
    resIndex.style.display = "none";

    deviceIndex.class = "hidden";
    resIndex.class = "hidden";

    browserVer.innerHTML = adapter.browserDetails.browser + " " + adapter.browserDetails.version;
    deviceName.innerHTML = selectedCamera[camNum].label;
    label.innerHTML = tests[r].label;
    ratio.innerHTML = tests[r].ratio;
    ask.innerHTML = tests[r].width + "x" + tests[r].height;
    actual.innerHTML = tests[r].streamWidth + "x" + tests[r].streamHeight;
    statusCell.innerHTML = tests[r].status;
    deviceIndex.innerHTML = camNum;     //usado para o debugging
    resIndex.innerHTML = r;             //usado para o debugging

    r++;

    //vá para os próximos testes
    if (r < tests.length) {
        gum(tests[r], selectedCamera[camNum]);
    }
    else if (camNum < selectedCamera.length - 1) {     //mudar para a próxima câmera
        camNum++;
        r = 0;
        gum(tests[r], selectedCamera[camNum])
    }
    else { //resultado do scan
        video.removeEventListener("onloadedmetadata", displayVideoDimensions); //turn off the event handler
        $('button').off("click"); //turn the generic button handler  off

        scanning = false;

        $(".pfin").show();
        $('#csvOut').click(function() {
            exportTableToCSV.apply(this, [$('#results'), 'gumResTestExport.csv']);
        });

        //permite clicar em uma linha para testar (só funciona com a Enumeração do dispositivo
        if (devices) {
            clickRows();
        }
    }
}


//permite clicar em uma linha para ver a captura da câmera
//Para fazer: descobrir por que isso não funciona no Firefox{
    request(`${path}/webcam`);
  }
  


  

  return (
    <div className="app">
      <button onClick={getPedido}>Buscar Webcam</button>
      <button onClick={getPedidoBff}>BFF: webcam</button>
      {data && <div className="app-renderer">{data}</div>}
    </div>
  );


export default App;
