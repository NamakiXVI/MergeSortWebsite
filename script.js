//wenn website aufgerufen wird dann wird das ausgeführt
document.addEventListener('DOMContentLoaded', function() 
{
    // holt alle elemente von der website die wir brauchen
    const visualization = document.getElementById('visualization');
    const arrayBtn = document.getElementById('toogle');

    //buttons für die generierung der Arrays
    const generateBtn = document.getElementById('generate-btn');
    const sortedBtn = document.getElementById('sorted-array');
    const sortedBtnReversed = document.getElementById('sorted-array-reversed');
    const sortBtn = document.getElementById('sort-btn');
    const duplicateBtn = document.getElementById("duplicated-array");

    // die beiden regeler für speed und listengröße
    const speedControl = document.getElementById('speed');
    const speedValue = document.getElementById("speedValue");
    const numArray = document.getElementById('listSpeed');
    const numArrayValue = document.getElementById('listValue');


    const explanation = document.getElementById('explanation');
    const onCheck = document.getElementById("reverseCheckbox");
    const onDelay = document.getElementById("noDelayCheckbox");
    
    // variablen für das array und die geschwindigkeit
    let array = [];
    let delay = 500;
    const maxValue = 100;

    let startTime;
    let elapsedTime = 0;
    let timerInterval;

    let bestTime = Infinity;  // beste zeit initial sehr hoch
    let worstTime = 0;       // schlechteste zeit initial 0
    let currentTime = 0;
    const bestTimeDiv = document.getElementById("bestTimeText");
    const worstTimeDiv = document.getElementById("worstTimeText");
    const currentTimeDiv = document.getElementById("currentTimeText");
    const timeResetBtn = document.getElementById("resetTime-btn");

    // event listener für den reset knopf
    timeResetBtn.addEventListener("click", resetTimer)
    let arrayMode = 0;

    // event listener für die tests
    const test10 = document.getElementById("test10");
    const test100 = document.getElementById("test100");
    const test1000 = document.getElementById("test1000");

    test10.addEventListener('click', () => runTest(10));
    test100.addEventListener('click', () => runTest(100));
    test1000.addEventListener('click', start1000MergeSort);
    const arrayListText = document.getElementById("arrayList");

    // zeigt das array an
    arrayListText.textContent = array.toString();

    // funktion um tests auszuführen
    async function runTest(arraySize) 
    {
        delay = 0;
        // deaktiviere die buttons während des tests
        [test10, test100, test1000].forEach(el => el.disabled = true);
        // setze die array größe
        numArray.value = arraySize;
        updateValueValue();
        
        // generiere das array basierend auf dem aktuellen modus
        switch(arrayMode)
        {
            case 0:
                generateArray();
                break;
            case 1:
                generateSortedArray();
                break;
            case 2:
                generateSortedArrayReversed();
                break;
            case 3:
                generateDuplicateArray();
                break;
            default:
                generateArray();
                break;
        }

        console.log(array);
        
        // starte den sortiervorgang
        startMergeSort();

        // aktiviere die buttons wieder
        [test10, test100, test1000, sortBtn].forEach(el => el.disabled = false);
    }

    // event listener für die switches (reverse und no delay)
    onCheck.addEventListener('change', function() 
    {
        if (this.checked) 
        {
          this.value = "1";
        } else 
        {
          this.value = "0";
        }
    });

    onDelay.addEventListener('change', function() 
    {
        if (this.checked) 
        {
          this.value = "1";
          speedControl.disabled = true;
          delay = 0;

        } else 
        {
          this.value = "0";
          speedControl.disabled = false;
          delay = 1050 - (speedControl.value * 50);
        }
    });

    // erstes array generieren
    generateArray();
    
    // Event listeners
    // event listener für die buttons
    generateBtn.addEventListener('click', generateArray); //zufällig generierte
    sortedBtn.addEventListener('click', generateSortedArray); //sortiert generiert (von klein zu groß)
    sortedBtnReversed.addEventListener('click', generateSortedArrayReversed); //sortiert generiert (von groß zu klein)
    sortBtn.addEventListener('click', startMergeSort); //startet sortierung
    duplicateBtn.addEventListener('click', generateDuplicateArray); //array mit duplikaten generieren

    // event listener für die eingabe der array größe
    numArray.addEventListener('input', function()
    {
        switch(arrayMode)
        {
            case 0:
                generateArray();
                break;
            case 1:
                generateSortedArray();
                break;
            case 2:
                generateSortedArrayReversed();
                break;
            case 3:
                generateDuplicateArray();
                break;
            default:
                generateArray();
                break;
        }
    });
    speedControl.addEventListener('input', updateSpeed);

    // funktion um die geschwindigkeit zu aktualisieren
    function updateSpeed() 
    {
        delay = 1050 - (speedControl.value * 50);
        updateSpeedValue(speedControl.value);
    }

     // zeigt die aktuelle array größe an
    function updateSpeedValue()
    {
        speedValue.textContent = ` ${speedControl.value}`;
    }

    function updateValueValue()
    {
        numArrayValue.textContent = ` ${numArray.value}`;
    }
    
     // generiert ein zufälliges array
    function generateArray() 
    {
        arrayMode = 0;
        array = [];
        visualization.innerHTML = '';
        explanation.innerHTML = 'Starten sie erstmal.';

        for (let i = 0; i < numArray.value; i++)
        {
            array.push(Math.floor(Math.random() * maxValue));
        }
        
        updateValueValue();
        arrayListText.textContent = array.toString();
        renderBars(array);
    }

    // generiert ein aufsteigend sortiertes array
    function generateSortedArray() 
    {
        arrayMode = 1;
        array = [];
        for (let i = 0; i < numArray.value; i++) {
            array.push(Math.floor(Math.random() * maxValue));
        }
    
        updateValueValue();
        arrayListText.textContent = array.toString();
        renderBars(array.sort((a, b) => a - b));
    }

    // generiert ein absteigend sortiertes array
    function generateSortedArrayReversed() 
    {
        arrayMode = 2;
        array = [];
        for (let i = 0; i < numArray.value; i++) {
            array.push(Math.floor(Math.random() * maxValue));
        }

        updateValueValue();
        arrayListText.textContent = array.toString();
        renderBars(array.sort((a, b) => b - a));
    }

     // generiert ein array mit duplikaten
    function generateDuplicateArray() 
    {
        arrayMode = 3;
        array = [];
        visualization.innerHTML = '';
        explanation.innerHTML = 'Starten sie erstmal.';
          
        for (let i = 0; i < numArray.value / 2; i++)
        {
            randomNum = Math.floor(Math.random() * maxValue);
            array.push(randomNum);
            array.push(randomNum);
        }
        
        updateValueValue();
        arrayListText.textContent = array.toString();
        renderBars(array);
    }
  
    // zeichnet die balken für die visualisierung
    function renderBars(arr, left = null, right = null, merged = false) 
    {
        // Leere die Anzeige zuerst
        let visualization = document.getElementById('visualization');
        visualization.innerHTML = '';
    
        // Gehe jedes Element im Array durch
        for (let i = 0; i < arr.length; i++) {
            var value = arr[i];
            
            // Erstelle einen Balken
            let bar = document.createElement('div');
            bar.className = 'bar';
            
            // Berechne die Höhe
            let heightPercent = (value / maxValue) * 100;
            bar.style.height = heightPercent + '%';
            
            // Füge die Zahl hinzu
            let number = document.createElement('div');
            number.className = 'bar-label';
            number.textContent = value;
            bar.appendChild(number);
    
            // Überprüfe ob der Balken markiert werden soll
            if (left !== null && right !== null) {
                if (i >= left && i <= right) {
                    if (merged === true) {
                        bar.classList.add('sorted');
                    } else {
                        bar.classList.add('highlight');
                    }
                }
            }
    
            // Füge den Balken hinzu
            visualization.appendChild(bar);
        }
    }

    // startet den sortiervorgang
    async function startMergeSort() 
    {
        [sortBtn, generateBtn, onCheck, numArray, arrayBtn].forEach(el => el.disabled = true);
        
        resetStopwatch();
        startStopwatch();
        
        // wählt die richtige sortierfunktion basierend auf der checkbox
        switch (onCheck.value) 
        {
            case "0": 
                await mergeSort(array, 0, array.length - 1);
                break;
            case "1":
                await mergeSortReversed(array, 0, array.length - 1);
                break;
            default:
                console.log("default");
        }
        
        stopStopwatch();
        explanation.innerHTML = 'Sortierung abgeschlossen.';

        [sortBtn, generateBtn, onCheck, numArray, arrayBtn].forEach(el => el.disabled = false);
    }
    
    // mergesort funktion für aufsteigende sortierung
    async function mergeSort(arr, left, right) 
    {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        explanation.innerHTML = `Teile Array von Index ${left} bis ${right} in zwei Hälften (Mitte bei ${mid})`;
        renderBars(arr, left, right);
        await sleep(delay);

        await mergeSort(arr, left, mid);
        await mergeSort(arr, mid + 1, right);
        
        explanation.innerHTML = `Füge sortierte Hälften von Index ${left} bis ${right} zusammen`;
        await merge(arr, left, mid, right);
        
        renderBars(arr, left, right, true);
        await sleep(delay);
    }
    
    async function merge(arr, left, mid, right) 
    {
        let i = left;
        let j = mid + 1;
        let temp = [];
        
        while (i <= mid && j <= right) 
        {
            if (arr[i] <= arr[j]) 
            {
                temp.push(arr[i++]);
            } else 
            {
                temp.push(arr[j++]);
            }
        }
        
        while (i <= mid) temp.push(arr[i++]);
        while (j <= right) temp.push(arr[j++]);
        
        for (let k = 0; k < temp.length; k++) 
        {
            arr[left + k] = temp[k];
            renderBars(arr, left, left + k);
            await sleep(delay/2);
        }
    }

    // mergesort funktion für absteigende sortierung
    async function mergeSortReversed(arr, left, right) 
    {
        if (left >= right) return;
        
        const mid = Math.floor((left + right) / 2);
        
        explanation.innerHTML = `Teile Array von Index ${left} bis ${right} in zwei Hälften (Mitte bei ${mid})`;
        renderBars(arr, left, right);
        await sleep(delay);
        
        await mergeSortReversed(arr, left, mid);
        await mergeSortReversed(arr, mid + 1, right);
        
        explanation.innerHTML = `Füge sortierte Hälften von Index ${left} bis ${right} zusammen (absteigend)`;
        await mergeReversed(arr, left, mid, right);
        
        renderBars(arr, left, right, true);
        await sleep(delay);
    }

    async function mergeReversed(arr, left, mid, right) 
    {
        let i = left;
        let j = mid + 1;
        let temp = [];
        
        while (i <= mid && j <= right) 
            {
            if (arr[i] > arr[j]) {
                temp.push(arr[i++]);
            } else {
                temp.push(arr[j++]);
            }
        }
        
        while (i <= mid) temp.push(arr[i++]);
        while (j <= right) temp.push(arr[j++]);
        
        for (let k = 0; k < temp.length; k++) 
            {
            arr[left + k] = temp[k];
            renderBars(arr, left, left + k);
            await sleep(delay/2);
        }
    }
    
    // funktion um eine pause zu machen
    function sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    // formatiert die zeit für die stoppuhr
    function formatTime(time) 
    {
        // Formatierung in Stunden:Minuten:Sekunden:Millisekunden
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor(time % 1000 / 10);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    }

    // startet die stoppuhr
    function startStopwatch() 
    {
        if (!timerInterval) 
        {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                currentTime = elapsedTime;
            }, 10);
            testCurrentTime = currentTime;
        }

    }

    // stoppt die stoppuhr
    function stopStopwatch() 
    {
        clearInterval(timerInterval);
        timerInterval = null;
        if (currentTime < bestTime) 
        {
            bestTime = currentTime;
            bestTimeDiv.textContent = formatTime(bestTime);
        }
        if (currentTime > worstTime) 
        {
            worstTime = currentTime;
            worstTimeDiv.textContent = formatTime(worstTime);
        }
        
        // Display current time
        currentTimeDiv.textContent = formatTime(currentTime);
    }

    // setzt die stoppuhr zurück
    function resetStopwatch() 
    {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = 0;
    }

    // setzt die zeiten zurück
    function resetTimer()
    {
        bestTime = Infinity;
        worstTime = 0;
        currentTime = 0;
        bestTimeDiv.textContent = "00:00:00:000";
        worstTimeDiv.textContent = "00:00:00:000";
        currentTimeDiv.textContent = "00:00:00:000";
    }

    const explanationItems = document.querySelectorAll('.explanation-item');
  
    // hover effekt für erklärungen
    explanationItems.forEach(item => {
      const targetLines = item.getAttribute('data-target').split(',');
      
      item.addEventListener('mouseenter', function() {
        targetLines.forEach(lineId => {
          const line = document.getElementById(lineId);
          if (line) line.classList.add('highlight');
        });
      });
      
      item.addEventListener('mouseleave', function() {
        targetLines.forEach(lineId => {
          const line = document.getElementById(lineId);
          if (line) line.classList.remove('highlight');
        });
      });
    });

    // startet den mergesort mit 1000 elementen
    async function start1000MergeSort() 
    {
        delay = 0;
        [sortBtn, generateBtn, onCheck, numArray, arrayBtn].forEach(el => el.disabled = true);
        let visualization = document.getElementById("visualization");
        visualization.classList.add('disabledVisualizor');

        array = [];
        visualization.innerHTML = '';
        explanation.innerHTML = 'Starten sie erstmal.';

        for (let i = 0; i < 1000; i++)
        {
            array.push(Math.floor(Math.random() * maxValue));
        }
        
        resetStopwatch();
        startStopwatch();
        
        switch (onCheck.value) 
        {
            case "0": 
                await mergeSort1000(array, 0, array.length - 1);
                break;
            case "1":
                await mergeSortReversed1000(array, 0, array.length - 1);
                break;
            default:
                console.log("default");
        }
        stopStopwatch();

        explanation.innerHTML = 'Sortierung abgeschlossen.';
        visualization.classList.remove('disabledVisualizor');

        [sortBtn, generateBtn, onCheck, numArray, arrayBtn].forEach(el => el.disabled = false);
    }
    
// Asynchrone Hauptfunktion für MergeSort
    async function mergeSort1000(arr, left, right) 
    {
        // Basisfall: Wenn der linke Index größer oder gleich dem rechten ist, 
        // ist das (Teil-)Array bereits sortiert (0 oder 1 Element)
        if (left >= right) return;
        
        // Mitte des aktuellen (Teil-)Arrays berechnen
        const mid = Math.floor((left + right) / 2);
        
        // VISUALISIERUNG: Zeige den Teilungsschritt an
        explanation.innerHTML = `Teile Array von  ${left} bis ${right} in zwei Hälften (Mitte bei ${mid})`;
        await sleep(delay); // Kurze Pause für die Visualisierung
        
        // Rekursiver Aufruf für die linke Hälfte (von left bis mid)
        await mergeSort1000(arr, left, mid);
        // Rekursiver Aufruf für die rechte Hälfte (von mid+1 bis right)
        await mergeSort1000(arr, mid + 1, right);
        
        // VISUALISIERUNG: Zeige an, dass jetzt die sortierten Hälften zusammengeführt werden
        explanation.innerHTML = `Füge sortierte Hälften von Index ${left} bis ${right} zusammen`;
        await sleep(delay);
        
        // Die beiden sortierten Hälften zusammenführen
        await merge1000(arr, left, mid, right);
        
        // VISUALISIERUNG: Zeige das Ergebnis nach dem Zusammenführen
        arrayListText.textContent += `\n Ergebnis: [${arr.slice(left, right + 1).join(', ')}]`;
        await sleep(delay);
    }

    // Asynchrone Hilfsfunktion zum Zusammenführen zweier sortierter Teilarrays
    async function merge1000(arr, left, mid, right) 
    {
        let i = left;      // Zeiger für die linke Hälfte (startet bei left)
        let j = mid + 1;   // Zeiger für die rechte Hälfte (startet bei mid+1)
        let temp = [];     // Temporäres Array für das Ergebnis
        
        // Solange beide Hälften noch Elemente enthalten...
        while (i <= mid && j <= right) 
        {
            // Vergleiche die Elemente an den aktuellen Zeigern
            if (arr[i] <= arr[j]) {
                temp.push(arr[i++]); // Füge zu temp hinzu und erhöhe linken Zeiger
            } else {
                temp.push(arr[j++]); // Füge zu temp hinzu und erhöhe rechten Zeiger
            }
            await sleep(delay/2); // Kurze Pause für die Visualisierung
        }
        
        // Falls noch Elemente in der linken Hälfte übrig sind...
        while (i <= mid) 
        {
            temp.push(arr[i++]); // Alle restlichen Elemente hinzufügen
            await sleep(delay/2);
        }
        
        // Falls noch Elemente in der rechten Hälfte übrig sind...
        while (j <= right) 
        {
            temp.push(arr[j++]); // Alle restlichen Elemente hinzufügen
            await sleep(delay/2);
        }
        
        // Das sortierte temp-Array zurück in das ursprüngliche Array kopieren
        for (let k = 0; k < temp.length; k++) 
        {
            arr[left + k] = temp[k];
            await sleep(delay/2);
        }
        
        // VISUALISIERUNG: Zeige den aktuellen Zustand des gesamten Arrays
        arrayListText.textContent = `\n\n akzueller Array: [${arr.join(', ')}]`;
    }

    // Asynchrone Hauptfunktion für absteigenden MergeSort
    async function mergeSortReversed1000(arr, left, right) 
    {
        // Basisfall: Wenn der linke Index größer oder gleich dem rechten ist,
        // ist das (Teil-)Array bereits sortiert (0 oder 1 Element)
        if (left >= right) return;
        
        // Mitte des aktuellen (Teil-)Arrays berechnen
        const mid = Math.floor((left + right) / 2);
        
        // VISUALISIERUNG: Zeige den Teilungsschritt an
        explanation.innerHTML = `Teile Array von Index ${left} bis ${right} in zwei Hälften (Mitte bei ${mid})`;
        await sleep(delay);
        
        // Rekursiver Aufruf für die linke Hälfte (von left bis mid)
        await mergeSortReversed1000(arr, left, mid);
        // Rekursiver Aufruf für die rechte Hälfte (von mid+1 bis right)
        await mergeSortReversed1000(arr, mid + 1, right);
        
        // VISUALISIERUNG: Zeige an, dass jetzt die sortierten Hälften absteigend zusammengeführt werden
        explanation.innerHTML = `Füge sortierte Hälften von Index ${left} bis ${right} zusammen (absteigend)`;
        
        // Die beiden sortierten Hälften absteigend zusammenführen
        await mergeReversed1000(arr, left, mid, right);
        await sleep(delay);
    }

    // Asynchrone Hilfsfunktion zum absteigenden Zusammenführen
    async function mergeReversed1000(arr, left, mid, right) {
        let i = left;      // Zeiger für die linke Hälfte (startet bei left)
        let j = mid + 1;   // Zeiger für die rechte Hälfte (startet bei mid+1)
        let temp = [];     // Temporäres Array für das Ergebnis
        
        // Solange beide Hälften noch Elemente enthalten...
        while (i <= mid && j <= right) {
            // VERÄNDERTE LOGIK: Größeres Element zuerst (absteigende Sortierung)
            if (arr[i] > arr[j]) {
                // Element aus der linken Hälfte ist größer -> kommt zuerst
                temp.push(arr[i++]);
            } else {
                // Element aus der rechten Hälfte ist größer oder gleich -> kommt zuerst
                temp.push(arr[j++]);
            }
            await sleep(delay/2);
        }
        
        // Restliche Elemente der linken Hälfte hinzufügen
        while (i <= mid) 
        {
            temp.push(arr[i++]);
            await sleep(delay/2);
        }
        
        // Restliche Elemente der rechten Hälfte hinzufügen
        while (j <= right) 
            {
            temp.push(arr[j++]);
            await sleep(delay/2);
        }
        
        // Das sortierte temp-Array zurück in das ursprüngliche Array kopieren
        for (let k = 0; k < temp.length; k++) 
        {
            arr[left + k] = temp[k];
            await sleep(delay/2);
        }
        
        // zeigt den aktuellen Zustand des gesamten Arrays
        arrayListText.textContent += `\n\nAktueller Array (absteigend): [${arr.join(', ')}]`;
    }
});