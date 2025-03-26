document.addEventListener('DOMContentLoaded', function() 
{
    const visualization = document.getElementById('visualization');
    const generateBtn = document.getElementById('generate-btn');
    const sortBtn = document.getElementById('sort-btn');
    const speedControl = document.getElementById('speed');
    const explanation = document.getElementById('explanation');
    const onCheck = document.getElementById("checkbox");
    
    let array = [];
    let delay = 500;
    let arrayAmount = 25;
    const maxValue = 100;
    
    onCheck.addEventListener('change', function() 
    {
        // Wert der Checkbox basierend auf dem Zustand (checked) ändern
        if (this.checked) {
          this.value = "1"; // Wert, wenn Checkbox aktiviert ist
        } else {
          this.value = "0"; // Wert, wenn Checkbox deaktiviert ist
        }
    });

    // Initial array generation
    generateArray();
    
    // Event listeners
    generateBtn.addEventListener('click', generateArray);
    sortBtn.addEventListener('click', startMergeSort);
    speedControl.addEventListener('input', updateSpeed);
    
    function updateSpeed() 
    {
        delay = 1050 - (speedControl.value * 50);
    }
    
    function generateArray() 
    {
        array = [];
        visualization.innerHTML = '';
        explanation.innerHTML = 'Starten sie erstmal.';

        for (let i = 0; i < arrayAmount; i++) {
            array.push(Math.floor(Math.random() * (maxValue - 5 + 1)) + 5);
        }
        
        renderBars(array);
    }
    
    function renderBars(arr, left = null, right = null, merged = false) 
    {
        visualization.innerHTML = '';
        const maxHeight = Math.max(...arr);
        
        arr.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${(value / maxValue) * 100}%`;
            
            const label = document.createElement('div');
            label.className = 'bar-label';
            label.textContent = value;
            bar.appendChild(label);
            
            if (left !== null && index >= left && index <= right) {
                bar.classList.add(merged ? 'sorted' : 'highlight');
            }
            
            visualization.appendChild(bar);
        });
    }
    
    async function startMergeSort() 
    {
        sortBtn.disabled = true;
        //generateBtn.disabled = true;
        
        switch (onCheck.value) 
        {
            case "0": 
                await mergeSort(array, 0, array.length - 1);
                break;
            case "1":
                console.log("case 1");
                await mergeSortReversed(array, 0, array.length - 1);
                break;
            default:
                console.log("default");
        }
        
        explanation.innerHTML = 'Sortierung abgeschlossen.';
        sortBtn.disabled = false;
        //generateBtn.disabled = false;
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

async function mergeReversed(arr, left, mid, right) {
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
});