// Path: js/workout.js
var containerList = [];
var setList = [];

var pushExersiseOptions = ["Bench Press", "Incline Press", "Decline Press", "Chest Flies",
                            "Tricep Pushdowns", "Seated Skull Crushers",
                            "Laterial Raise", "Front Raise", "Shoulder Press", "Arnold Press"];

var pullExersiseOptions = ["Pull Ups", "Assisted Pull Ups", "Chin Ups", "Lat Pulldown", "Single Arm Machine Row", "Cable Row", "Bent Over Row", 
                            "Lat Prayer","Bicep Curl", "Hammer Curl", "Preacher Curl", 
                            "Face Pulls", "Rear Delt", "Shrugs"];

var legsExersiseOptions = ["Hack Squat","Belt Squat","Squats","RDL","Deadlift", "Leg Press", "Leg Extension", "Hanstring Curl", "Calf Raise"];

var shouldersNarmsExersiseOptions = ["Laterial Raise", "Front Raise", "Shoulder Press", "Arnold Press", 
                                    "Tricep Pushdowns", "Seated Skull Crushers", "Bicep Curl",
                                    "Hammer Curl", "Preacher Curl", "Face Pulls", "Rear Delt", "Shrugs"];
                            
var exersiseVariations = ["Dumbell", "Barbell", "Machine", "Cable", "Bodyweight"];
//! need to add variation button
//! need to clean options in Push, Pull and Legs options
//! need to override firebase data

                                    
document.getElementById('info-button').addEventListener('click', function() {
    var popup = document.getElementById('info-popup');
    if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
    } else {
        popup.classList.add('hidden');
    }
});
document.getElementById('add-exersise').addEventListener('click', () => {
    
    if (document.getElementById('day-title').value == "" || document.getElementById('current-date').value == "") {
        alert("Please select a workout group and date before adding an exersise.");
        return;
    }
    const exerciseContainer = document.createElement('div');
    exerciseContainer.className = 'container';

    const exersiseNameContainer = document.createElement('div');
    exersiseNameContainer.className = 'input-group';
    exersiseNameContainer.style.padding = '5px'

    const setContainer = document.createElement('div');
    setContainer.className = 'input-group';

    const addLabel = document.createElement('div');
    addLabel.style.display = 'flex';
    //bottom border
    addLabel.style.borderBottom = '1px solid black';
    addLabel.style.margin = '5px';
    addLabel.innerHTML = '<div class="weight" style="text-align: center">Weight</div><div class="reps" style="text-align: center">Reps</div>';

    const exersiseInput = document.createElement('select');
    if (document.getElementById('day-title').value == "Push") {
        pushExersiseOptions.forEach((option) => {
            var opt = document.createElement('option');
            opt.textContent = option;
            opt.value = option;
            exersiseInput.appendChild(opt);
        });
    } else if (document.getElementById('day-title').value == "Pull") {
        pullExersiseOptions.forEach((option) => {
            var opt = document.createElement('option');
            opt.textContent = option;
            opt.value = option;
            exersiseInput.appendChild(opt);
        });
    } else if (document.getElementById('day-title').value == "Legs") {
        legsExersiseOptions.forEach((option) => {
            var opt = document.createElement('option');
            opt.textContent = option;
            opt.value = option;
            exersiseInput.appendChild(opt);
        });
    } else if (document.getElementById('day-title').value == "ShouldersNarms") {
        shouldersNarmsExersiseOptions.forEach((option) => {
            var opt = document.createElement('option');
            opt.textContent = option;
            opt.value = option;
            exersiseInput.appendChild(opt);
        });
    }
    exersiseInput.className = 'exersise-name';

    const variantInput = document.createElement('select');
    exersiseVariations.forEach((option) => {
        var opt = document.createElement('option');
        opt.textContent = option;
        opt.value = option;
        variantInput.appendChild(opt);
    });
    // variantInput.className = 'exersise-variation';
    variantInput.className = 'exersise-variation';

    const addsetButton = document.createElement('button');
    addsetButton.textContent = 'Add Set';
    addsetButton.className = 'add-set';
    addsetButton.addEventListener('click', function() {
        addsetButton.insertAdjacentElement('beforebegin', createSetInput());
    });

    const removeSetButton = document.createElement('button');
    removeSetButton.textContent = 'Remove Set';
    removeSetButton.className = 'remove-set';
    removeSetButton.addEventListener('click', function() {
        setList = removeSetContainer(setList);
    });

    exerciseContainer.appendChild(exersiseNameContainer);
    exerciseContainer.appendChild(setContainer);
    exersiseNameContainer.appendChild(variantInput);
    exersiseNameContainer.appendChild(exersiseInput);
    setContainer.appendChild(addLabel);
    // add first set input fields

    const setContainerFirst = createSetInput();
    setContainer.appendChild(setContainerFirst);
    setContainer.appendChild(addsetButton);
    // setContainer.appendChild(removeSetButton); //remove set button not working
    // - need a seperate list for each exersise. all in one list. if you remove all sets from list. there is an error on line 220


    document.querySelector('main').appendChild(exerciseContainer);
    containerList.push(exerciseContainer);
});

function createSetInput() {
    const setContainer = document.createElement('div');
    setContainer.className = 'input-rep-weight-group';
    
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.className = 'weight';
    weightInput.value = 0;

    const downWeightButton = document.createElement('button');
    downWeightButton.textContent = '-';
    downWeightButton.tabIndex = -1;
    downWeightButton.addEventListener('click', function() {
        weightInput.value = parseInt(weightInput.value) - 5;
    });
    downWeightButton.className = 'increment-button';
    const upWeightButton = document.createElement('button');
    upWeightButton.textContent = '+';
    upWeightButton.tabIndex = -1;
    upWeightButton.addEventListener('click', function() {
        weightInput.value = parseInt(weightInput.value) + 5;
    });
    upWeightButton.className = 'increment-button';

    const repsInput = document.createElement('input');
    repsInput.type = 'number';
    repsInput.className = 'reps';
    repsInput.value = 0;

    const downRepsButton = document.createElement('button');
    downRepsButton.textContent = '-';
    downRepsButton.tabIndex = -1;
    downRepsButton.addEventListener('click', function() {
        repsInput.value = parseInt(repsInput.value) - 1;
    });
    downRepsButton.className = 'increment-button';
    const upRepsButton = document.createElement('button');
    upRepsButton.textContent = '+';
    upRepsButton.tabIndex = -1;
    upRepsButton.addEventListener('click', function() {
        repsInput.value = parseInt(repsInput.value) + 1;
    });
    upRepsButton.className = 'increment-button';

    setContainer.appendChild(weightInput);
    setContainer.appendChild(downWeightButton);
    setContainer.appendChild(upWeightButton);
    
    const breakLine = document.createElement('br');
    setContainer.appendChild(breakLine);
    
    setContainer.appendChild(repsInput);
    setContainer.appendChild(downRepsButton);
    setContainer.appendChild(upRepsButton);

    setList.push(setContainer);
    weightInput.focus();
    return setContainer;
}

//remove last exersise container
function removeExersiseContainer() {
    if (containerList.length == 0) {
        alert("No exersises to remove");
        return;
    }
    containerList[containerList.length - 1].remove(); // 
    containerList.pop(); //remove last element from array
}

function removeSetContainer(setList) {
    if (setList.length == 0) {
        alert("No exersises to remove");
        return;
    }
    setList[setList.length - 1].remove(); // 
    setList.pop(); //remove last element from array
    return setList;
}