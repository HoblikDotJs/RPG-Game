async function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    const Id = profile.getId();
    if (Id) {
        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": Id
            })
        }
        const response = await fetch("/login", options);
        const _ = await response.json()
        if (_ == "undefined") {
            myName = prompt("What will be your nick? (without spaces)");
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": Id,
                    "name": myName,
                })
            }
            const response = await fetch("/signup", options);
            const result = await response.json()
            if (result == "undefined") {
                console.log("Bad username");
                return
            } else {
                console.log("signUp was ok");
                location.reload();
            }
        } else {
            player = new Player(_);
            await updateTimes("load");
            updateTimesClient("load");
        }
    }
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        location.reload();
    });
}