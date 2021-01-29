async function onSignIn(googleUser) {
    let profile = googleUser.getBasicProfile();
    const Id = profile.getId();
    if (Id) {
        const _ = await (await fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": Id
            })
        })).json()
        if (_ == "undefined") {
            myName = prompt("What will be your nick? (without spaces)");
            const result = await (await fetch("/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "id": Id,
                    "name": myName,
                })
            })).json();
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