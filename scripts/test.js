// Function to get user from the db and display in the homepage
var userMatches = [];

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {

        db.collection("users").doc(user.uid).onSnapshot(function (snap) {
            var activity1 = snap.data().activity1;

            //look for users that have the same interest
            var interestQuery = db.collection("users").where("activity1", "==", activity1);

            interestQuery
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        //add each user with the same interest to the userMatches array
                        userMatches.push(doc.id);
                    });

                    var firstUser;
                    //Make sure the profile displayed isn't the user's own profile
                    if (user.uid != userMatches[0]) {
                        firstUser = userMatches[0];
                    } else {
                        firstUser = userMatches[1];
                    }

                    db.collection("users")
                        .where("uid", "==", firstUser)
                        .get()
                        .then(function (snap) {
                            snap.forEach(function (doc) {
                                console.log("likes: ", doc.data().name);
                                document.getElementById("UserName").innerText = doc.data().name;
                                document.getElementById("Age").innerText = getAge(doc.data().DOB);
                                document.getElementById("Gender").innerText = doc.data().gender;
                                document.getElementById("City").innerText = doc.data().city;
                                document.getElementById("activity1").innerText = doc.data().activity1;
                                document.getElementById("skill1").innerText = doc.data().skill1;
                                var picUrl = doc.data().photo;
                                // CHANGED SO THAT THE IMAGE IS PUT INSIDE OF THE CARD , BEFORE THE OVERLAY ID
                                $("#overlay").before("<img src='" + picUrl + "' class='card-img-top'>")
                                //$(".card-img-top").replaceWith($("#overlay").before("<img src='" + picUrl + "' class='card-img-top'>"))
                                //$("#profilepic").append("<img src='" + picUrl + "'>")
                            })

                        })
                    db.collection("users").doc(user.uid).update({
                        viewed: firebase.firestore.FieldValue.arrayUnion(document.getElementById("UserName").innerText)
                    })
                })

        });


    }
})


/* var index = 1;
var nextUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById("skip").onclick = function () {
            // Make the index is correct for getting the next user in the array
            if (user.uid == userMatches[0]) {
                index++;
                nextUser = userMatches[index];
                index++;
            } else if (user.uid == userMatches[1]) {
                index++;
                nextUser = userMatches[index];
                index++;
            } else {
                nextUser = userMatches[index];
                index++;
            }
            
            console.log(index);
            console.log(userMatches);
            db.collection("users")
                .where("uid", "==", nextUser)
                .get()
                .then(function (snap) {
                    snap.forEach(function (doc) {
                        console.log("likes: ", doc.data().name);
                        document.getElementById("UserName").innerText = doc.data().name;
                        document.getElementById("Age").innerText = getAge(doc.data().DOB);
                        document.getElementById("Gender").innerText = doc.data().gender;
                        document.getElementById("City").innerText = doc.data().city;
                        document.getElementById("activity1").innerText = doc.data().activity1;
                        document.getElementById("skill1").innerText = doc.data().skill1;
                        var picUrl = doc.data().photo;
                        // CHANGED SO THAT THE IMAGE IS PUT INSIDE OF THE CARD , BEFORE THE OVERLAY ID
                        $(".card-img-top").replaceWith($("<img src='" + picUrl + "' class='card-img-top'>"))
                        //$(".card-img-top").replaceWith($("#overlay").before("<img src='" + picUrl + "' class='card-img-top'>"))
                        //$("#profilepic").append("<img src='" + picUrl + "'>")

                        //toggle the heart icon to empty if it's filled
                        if ($("#heart").hasClass('fa-heart')) {
                            $(".heart.fa").toggleClass("fa-heart-o fa-heart");
                        }
                    })

                })
            db.collection("users").doc(user.uid).update({
                viewed: firebase.firestore.FieldValue.arrayUnion(document.getElementById("UserName").innerText)
            })

        }
    }
}) */


// Function to get User's age
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}