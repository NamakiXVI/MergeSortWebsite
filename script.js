document.addEventListener('DOMContentLoaded', function() 
{
    //Alle Elemente von der Website (nicht alle nur die die eine funktion haben sollten)
    const visualization = document.getElementById('visualization');
    const arrayBtn = document.getElementById('toogle');

    const generateBtn = document.getElementById('generate-btn');
    const sortedBtn = document.getElementById('sorted-array');
    const sortedBtnReversed = document.getElementById('sorted-array-reversed');
    const sortBtn = document.getElementById('sort-btn');
    const duplicateBtn = document.getElementById("duplicated-array");

    const speedControl = document.getElementById('speed');
    const speedValue = document.getElementById("speedValue");
    const numArray = document.getElementById('listSpeed');
    const numArrayValue = document.getElementById('listValue');

    const explanation = document.getElementById('explanation');
    const onCheck = document.getElementById("reverseCheckbox");
    const onDelay = document.getElementById("noDelayCheckbox");
    
    let array = [];
    let delay = 500;
    const maxValue = 100;

    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    const timer = document.getElementById('timerText');
    
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

    // Initial array generation
    generateArray();
    
    // Event listeners
    //Event listeners für die Array Generation Buttons
    generateBtn.addEventListener('click', generateArray); //zufällig generierte
    sortedBtn.addEventListener('click', generateSortedArray); //sortiert generiert (von klein zu groß)
    sortedBtnReversed.addEventListener('click', generateSortedArrayReversed); //sortiert generiert (von groß zu klein)
    sortBtn.addEventListener('click', startMergeSort);
    duplicateBtn.addEventListener('click', generateDuplicateArray);

    numArray.addEventListener('input', generateArray);
    speedControl.addEventListener('input', updateSpeed);

    
    function updateSpeed() 
    {
        delay = 1050 - (speedControl.value * 50);
        updateSpeedValue(speedControl.value);
    }

    function updateSpeedValue()
    {
        speedValue.textContent = ` ${speedControl.value}`;
    }

    function updateValueValue()
    {
        numArrayValue.textContent = ` ${numArray.value}`;
    }
    
    function generateArray() 
    {
        array = [];
        visualization.innerHTML = '';
        explanation.innerHTML = 'Starten sie erstmal.';

        for (let i = 0; i < numArray.value; i++)
        {
            array.push(Math.floor(Math.random() * maxValue));
        }
        
        updateValueValue();
        renderBars(array);
    }

    function generateSortedArray() 
    {
        // Zufälliges Array erstellen
        array = [];
        for (let i = 0; i < numArray.value; i++) {
            array.push(Math.floor(Math.random() * maxValue));
        }
    
        updateValueValue();
        renderBars(array.sort((a, b) => a - b));
    }

    function generateSortedArrayReversed() 
    {
        array = [];
        for (let i = 0; i < numArray.value; i++) {
            array.push(Math.floor(Math.random() * maxValue));
        }

        updateValueValue();
        renderBars(array.sort((a, b) => b - a));
    }

    function generateDuplicateArray() 
    {
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
        renderBars(array);
    }
  
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

    async function startMergeSort() 
    {
        sortBtn.disabled = true;
        onCheck.disabled = false;
        generateBtn.disabled = true;
        numArray.disabled = true;
        arrayBtn.disabled = true;
        
        resetStopwatch();
        startStopwatch();
        
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
        sortBtn.disabled = false;
        generateBtn.disabled = false;
        onCheck.disabled = false;
        numArray.disabled = false;
        arrayBtn.disabled = false;
    }
    
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

// Absteigender MergeSort (Größte zu Kleinste)
    async function mergeSortReversed(arr, left, right) {
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
    
    function sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    } 

    function formatTime(time) 
    {
        // Formatierung in Stunden:Minuten:Sekunden:Millisekunden
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor(time % 1000 / 10);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    }

    function startStopwatch() 
    {
        if (!timerInterval) 
        {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(() => {
                elapsedTime = Date.now() - startTime;
                timer.innerHTML = formatTime(elapsedTime);
            }, 10);
        }
    }

    function stopStopwatch() 
    {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    function resetStopwatch() 
    {
        clearInterval(timerInterval);
        timerInterval = null;
        elapsedTime = 0;
        timer.textContent = '00:000';
    }
});