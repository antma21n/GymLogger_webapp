//path js/firebase-logger.js

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBd4hXC73f1OTPnZQmTMB8O7wglS2K0VnY",
    authDomain: "gym-logger0.firebaseapp.com",
    projectId: "gym-logger0",
    storageBucket: "gym-logger0.appspot.com",
    messagingSenderId: "201737999555",
    appId: "1:201737999555:web:57b8acc3b579c5db593e76",
    measurementId: "G-CDKVP5NPYS"
    };

    // Initialize Firebase
    const app = firebase.initializeApp(firebaseConfig);
    var provider = new firebase.auth.GoogleAuthProvider();

    window.onload = function() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log("user is signed in");
                console.log(user.displayName);
                document.getElementById('sign-in-button').style.display = 'none';
                document.getElementById('displayName').innerHTML = `Welcome back, ${user.displayName}!`;
            } else {
                console.log("user is not signed in")
                document.getElementById('sign-in-button').style.display = 'inline';
                alert("Feel free to explore the web app. In order to store data, please sign in to submit workout data");
            }
        });
    }

    function SignInWithGoogle() {
        // data is not temporarly stored when redirecting
        console.log("sign in with google");
        firebase.auth()
        .signInWithRedirect(provider)
        .then((result) => {
            console.log(result);
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            
            //print user name
            console.log(user.displayName)

            // IdP data available in result.additionalUserInfo.profile.
        }).catch((error) => {
            console.log("error")
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            var email = error.email;
            var credential = error.credential;
        });
        document.getElementById('displayName').innerHTML = firebase.auth().currentUser.displayName;
    }

    var db = firebase.firestore(app); // Use getFirestore() after initializing the app
    var data = {};
    console.log(db);

    document.getElementById('sign-in-button').addEventListener('click', SignInWithGoogle);

    // Push data to firebase
    document.getElementById('test_confirm').addEventListener('click', () => {

        //check authentication
        if  (firebase.auth().currentUser) {
            console.log("user is signed in");
            console.log(firebase.auth().currentUser.displayName);
        } else {
            console.log("user is not signed in")
            alert("Please sign in to submit workout data");
            return; //exit function
        }
        
        //check if fields are filled out
        if (document.getElementById('day-title').value == "" || document.getElementById('current-date').value == "") {
            alert("Please fill out all fields before submitting");
            return;
        }

        document.getElementById('test_confirm').style.display = 'none';
        document.getElementById('submitReturn').style.display = 'inline';
        data = {
            dayTitle: document.getElementById('day-title').value,
            currentDate: document.getElementById('current-date').value,
            exercises: []
        }
        //loop throough container divs
        for(let i = 0; i < document.getElementsByClassName('container').length; i++) {
            data.exercises[i] = {
                exerciseName: document.getElementsByClassName('container')[i].getElementsByClassName('exersise-name')[0].value,
                variation: document.getElementsByClassName('container')[i].getElementsByClassName('exersise-variation')[0].value,
                numSets: 0,
                weights: [],
                reps: []
            }

            let setElements = document.getElementsByClassName('container')[i].getElementsByClassName('input-group')[1].getElementsByClassName('input-rep-weight-group');

            for(let j = 0; j < setElements.length; j++) {
                data.exercises[i].weights[j] = setElements[j].getElementsByClassName('weight')[0].value;
                data.exercises[i].reps[j] = setElements[j].getElementsByClassName('reps')[0].value;

                //remove undefined values from weight and rep arrays
                data.exercises[i].weights = data.exercises[i].weights.filter(function (el) {
                    return el != null;
                });
                data.exercises[i].reps = data.exercises[i].reps.filter(function (el) {
                    return el != null;
                });
                data.exercises[i].numSets++;
            }
        }
        console.log(data);

        //add data to collection to specific user
        db.collection("users").doc(firebase.auth().currentUser.uid).collection("workouts").add(data)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    });