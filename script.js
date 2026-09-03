// =====================================================
// PROFILEQR AI — FINAL SCRIPT
// Firebase + QR + Profile + AI Bio
// =====================================================



// =====================================================
// 1. FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyDUQVYqD8ruoksVUBkEd61Kojb2ouMW3nI",
    authDomain: "profileqr-ai.firebaseapp.com",
    databaseURL: "https://profileqr-ai-default-rtdb.firebaseio.com",
    projectId: "profileqr-ai",
    storageBucket: "profileqr-ai.firebasestorage.app",
    messagingSenderId: "978918324164",
    appId: "1:978918324164:web:513508e496731fec961691",
    measurementId: "G-F8PJXP5N7L"
};



// =====================================================
// START FIREBASE
// =====================================================

if (typeof firebase !== "undefined") {

    if (!firebase.apps.length) {

        firebase.initializeApp(
            firebaseConfig
        );

    }

}



// =====================================================
// DATABASE
// =====================================================

const database =
    typeof firebase !== "undefined" &&
    typeof firebase.database === "function"
        ? firebase.database()
        : null;



// =====================================================
// AUTHENTICATION
// =====================================================

const auth =
    typeof firebase !== "undefined" &&
    typeof firebase.auth === "function"
        ? firebase.auth()
        : null;



// =====================================================
// 14. AUTHENTICATION STATE
// =====================================================

if (auth) {

    auth.onAuthStateChanged(function (user) {

        if (user) {

            console.log(
                "User signed in:",
                user.email
            );

            console.log(
                "User ID:",
                user.uid
            );

        } else {

            console.log(
                "No user is currently signed in."
            );

        }

    });

}



// =====================================================
// 16. USER PROFILE DATABASE
// =====================================================

if (auth && database) {

    auth.onAuthStateChanged(function (user) {

        if (!user) {

            console.log(
                "No user logged in."
            );

            return;

        }



        const userRef =
            database.ref(
                "users/" + user.uid
            );



        userRef.once("value")

            .then(function (snapshot) {

                if (!snapshot.exists()) {

                    userRef.set({

                        email:
                            user.email,

                        createdAt:
                            firebase.database
                                .ServerValue
                                .TIMESTAMP

                    });

                    console.log(
                        "New user profile created."
                    );

                } else {

                    console.log(
                        "User profile already exists."
                    );

                }

            })

            .catch(function (error) {

                console.error(
                    "Profile database error:",
                    error
                );

            });

    });

}



// =====================================================
// 2. CREATE PROFILE
// =====================================================

const profileForm =
    document.getElementById(
        "profileForm"
    );



if (profileForm) {
    // =====================================================
// EDIT PROFILE MODE
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const editProfileId =
    urlParams.get("edit");


if (editProfileId) {

    // Change button text
    const submitButton =
        document.querySelector(
            "#profileForm button[type='submit']"
        );

    if (submitButton) {

        submitButton.textContent =
            "Update My Profile →";

    }


    // Load existing profile
    database
        .ref(
            "profiles/" +
            editProfileId
        )
        .once("value")
        .then(
            function (snapshot) {

                const profileData =
                    snapshot.val();


                if (!profileData) {

                    alert(
                        "Profile not found."
                    );

                    return;

                }


                // SECURITY CHECK
                if (
                    !auth.currentUser ||
                    auth.currentUser.uid !==
                    profileData.ownerUid
                ) {

                    alert(
                        "You are not allowed to edit this profile."
                    );

                    window.location.href =
                        "index.html";

                    return;

                }


                // LOAD FORM DATA

                document.getElementById(
                    "fullName"
                ).value =
                    profileData.fullName || "";


                document.getElementById(
                    "title"
                ).value =
                    profileData.title || "";


                document.getElementById(
                    "bio"
                ).value =
                    profileData.bio || "";


                document.getElementById(
                    "email"
                ).value =
                    profileData.email || "";


                document.getElementById(
                    "phone"
                ).value =
                    profileData.phone || "";


                document.getElementById(
                    "education"
                ).value =
                    profileData.education || "";


                document.getElementById(
                    "skills"
                ).value =
                    Array.isArray(
                        profileData.skills
                    )
                        ? profileData.skills.join(", ")
                        : profileData.skills || "";


                document.getElementById(
                    "projects"
                ).value =
                    profileData.projects || "";


                document.getElementById(
                    "achievements"
                ).value =
                    profileData.achievements || "";


                document.getElementById(
                    "linkedin"
                ).value =
                    profileData.linkedin || "";


                document.getElementById(
                    "github"
                ).value =
                    profileData.github || "";

            }
        )

        .catch(
            function (error) {

                console.error(
                    "Error loading profile:",
                    error
                );

                alert(
                    "Unable to load profile."
                );

            }
        );

}

    profileForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();



            // =================================================
            // GET FORM VALUES
            // =================================================

            const fullName =
                document
                    .getElementById(
                        "fullName"
                    )
                    .value
                    .trim();



            const title =
                document
                    .getElementById(
                        "title"
                    )
                    .value
                    .trim();



            const bio =
                document
                    .getElementById(
                        "bio"
                    )
                    .value
                    .trim();



            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();



            const phone =
                document
                    .getElementById(
                        "phone"
                    )
                    .value
                    .trim();



            const education =
                document
                    .getElementById(
                        "education"
                    )
                    .value
                    .trim();



            const skills =
                document
                    .getElementById(
                        "skills"
                    )
                    .value
                    .trim();



            const projects =
                document
                    .getElementById(
                        "projects"
                    )
                    .value
                    .trim();



            const achievementsElement =
                document.getElementById(
                    "achievements"
                );



            const achievements =
                achievementsElement
                    ? achievementsElement
                        .value
                        .trim()
                    : "";



            const linkedin =
                document
                    .getElementById(
                        "linkedin"
                    )
                    .value
                    .trim();



            const github =
                document
                    .getElementById(
                        "github"
                    )
                    .value
                    .trim();



            // =================================================
            // PROFILE PHOTO
            // =================================================

            const photoInput =
                document.getElementById(
                    "profilePhoto"
                );



            const photoFile =
                photoInput &&
                photoInput.files.length > 0
                    ? photoInput.files[0]
                    : null;
            // Limit profile photo to 500 KB
if (photoFile && photoFile.size > 500 * 1024) {

    alert(
        "Profile photo is too large. Please upload an image smaller than 500 KB."
    );

    return;
}



            // =================================================
            // RESUME
            // =================================================

            const resumeInput =
                document.getElementById(
                    "resume"
                );



            const resumeFile =
                resumeInput &&
                resumeInput.files.length > 0
                    ? resumeInput.files[0]
                    : null;



            // =================================================
            // BASIC VALIDATION
            // =================================================

            if (!fullName) {

                alert(
                    "Please enter your full name."
                );

                return;

            }



            if (!database) {

                alert(
                    "Firebase could not be loaded. Please check your internet connection."
                );

                return;

            }



            // =================================================
            // SHOW SAVING MESSAGE
            // =================================================

            const submitButton =
                profileForm.querySelector(
                    'button[type="submit"]'
                );



            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Saving Profile...";

            }



            try {

                // =============================================
// CHECK CREATE OR EDIT MODE
// =============================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const editProfileId =
    urlParams.get("edit");

let profileReference;
let profileId;

let existingProfileData =
    null;


// =============================================
// EDIT EXISTING PROFILE
// =============================================

if (editProfileId) {

    profileId =
        editProfileId;

    profileReference =
        database.ref(
            "profiles/" +
            profileId
        );


    // Load existing profile data
    const snapshot =
        await profileReference.once(
            "value"
        );

    existingProfileData =
        snapshot.val();


    // Security check
    if (
        !existingProfileData ||
        !auth.currentUser ||
        existingProfileData.ownerUid !==
        auth.currentUser.uid
    ) {

        alert(
            "You are not allowed to edit this profile."
        );

        window.location.href =
            "index.html";

        return;

    }

}


// =============================================
// CREATE NEW PROFILE
// =============================================

else {

    profileReference =
        database
            .ref("profiles")
            .push();

    profileId =
        profileReference.key;

}



// =============================================
// CONVERT PHOTO TO BASE64
// =============================================

// Keep old photo when editing
let photoData =
    existingProfileData &&
    existingProfileData.photo
        ? existingProfileData.photo
        : "";


if (photoFile) {

    photoData =
        await fileToBase64(
            photoFile
        );

}



// =============================================
// CONVERT RESUME TO BASE64
// =============================================

// Keep old resume when editing
let resumeData =
    existingProfileData &&
    existingProfileData.resume
        ? existingProfileData.resume
        : "";


if (resumeFile) {

    if (
        resumeFile.size >
        1 * 1024 * 1024
    ) {

        alert(
            "Resume is too large. Please use a PDF smaller than 1MB."
        );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                editProfileId
                    ? "Update My Profile →"
                    : "Generate My Profile →";

        }

        return;

    }


    resumeData =
        await fileToBase64(
            resumeFile
        );

}

                // =============================================
// PROFILE OBJECT
// =============================================

const profileData = {

    // =============================================
    // KEEP ORIGINAL PROFILE OWNER
    // =============================================

    ownerUid:

        existingProfileData
            ? existingProfileData.ownerUid
            : (
                auth &&
                auth.currentUser

                    ? auth.currentUser.uid

                    : null
            ),


    fullName:
        fullName,


    title:
        title,


    bio:
        bio,


    email:
        email,


    phone:
        phone,


    education:
        education,


    skills:
        skills,


    projects:
        projects,


    achievements:
        achievements,


    linkedin:
        linkedin,


    github:
        github,


    photo:
        photoData,


    resume:
        resumeData,


    // =============================================
    // KEEP ORIGINAL CREATION DATE
    // =============================================

    createdAt:

        existingProfileData &&
        existingProfileData.createdAt

            ? existingProfileData.createdAt

            : new Date()
                .toISOString(),


    // =============================================
    // UPDATE LAST MODIFIED DATE
    // =============================================

    updatedAt:

        new Date()
            .toISOString()

};


                // =============================================
                // SAVE PROFILE
                // =============================================

                await profileReference.set(
                    profileData
                );



                // =============================================
                // OPEN PROFILE PAGE
                // =============================================

                window.location.href =
                    "profile.html?id=" +
                    encodeURIComponent(
                        profileId
                    );

            }

            catch (error) {

                console.error(
                    "Profile saving error:",
                    error
                );



                alert(

                    "Something went wrong while saving your profile.\n\n" +

                    error.message

                );



                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Generate My Profile →";

                }

            }

        }

    );

}



// =====================================================
// 3. FILE → BASE64
// =====================================================

function fileToBase64(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();



            reader.onload =
                function () {

                    resolve(
                        reader.result
                    );

                };



            reader.onerror =
                function () {

                    reject(

                        new Error(

                            "Could not read the selected file."

                        )

                    );

                };



            reader.readAsDataURL(
                file
            );

        }

    );

}



// =====================================================
// PROFILE URL PARAMETERS
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );



const profileId =
    urlParams.get("id");



console.log(
    "PROFILE ID FROM URL:",
    profileId
);



console.log(
    "CURRENT URL:",
    window.location.href
);



console.log(
    "DATABASE:",
    database
);



// =====================================================
// 4. LOAD PROFILE
// =====================================================

if (

    profileId &&

    document.getElementById(
        "displayName"
    ) &&

    database

) {

    console.log(
        "LOADING PROFILE:",
        profileId
    );



    // =============================================
    // LOAD PROFILE
    // =============================================

    loadProfile(
        profileId
    );



    // =============================================
    // RECORD PROFILE VIEW
    // =============================================

    database

        .ref(
            "analytics/" +
            profileId +
            "/profileViews"
        )

        .transaction(
            function (currentValue) {

                return (
                    currentValue || 0
                ) + 1;

            }
        );



    // =============================================
    // RECORD QR SCAN
    // =============================================

    const source =
        urlParams.get(
            "source"
        );



    if (source === "qr") {

        database

            .ref(
                "analytics/" +
                profileId +
                "/qrScans"
            )

            .transaction(
                function (currentValue) {

                    return (
                        currentValue || 0
                    ) + 1;

                }
            );

    }



    // =============================================
    // RECORD LAST VIEWED TIME
    // =============================================

    database

        .ref(
            "analytics/" +
            profileId +
            "/lastViewed"
        )

        .set(
            new Date()
                .toISOString()
        );

}



// =====================================================
// 5. LOAD PROFILE FROM FIREBASE
// =====================================================

async function loadProfile(id) {

    try {

        const snapshot =

            await database

                .ref(
                    "profiles/" +
                    id
                )

                .once(
                    "value"
                );



        // =============================================
        // CHECK IF PROFILE EXISTS
        // =============================================

        if (!snapshot.exists()) {

            showProfileError();

            return;

        }



        // =============================================
        // GET PROFILE DATA
        // =============================================

        const profileData =
            snapshot.val();



        // =============================================
        // DISPLAY PROFILE
        // =============================================

        displayProfile(

            profileData,

            id

        );



        // =============================================
        // LOAD ANALYTICS
        // =============================================

        loadAnalytics(
            id
        );

    }

    catch (error) {

        console.error(

            "Profile loading error:",

            error

        );



        showProfileError();

    }

}



// =====================================================
// LOAD PROFILE ANALYTICS
// REAL-TIME VERSION
// =====================================================

function loadAnalytics(profileId) {

    if (!database) {

        return;

    }



    // =============================================
    // REAL-TIME ANALYTICS LISTENER
    // =============================================

    database

        .ref(
            "analytics/" +
            profileId
        )

        .on(

            "value",

            function (snapshot) {

                const analytics =

                    snapshot.exists()

                        ? snapshot.val()

                        : {};



                // =========================================
                // PROFILE VIEWS
                // =========================================

                const profileViews =

                    document.getElementById(
                        "profileViews"
                    );



                if (profileViews) {

                    profileViews.textContent =

                        analytics.profileViews || 0;

                }



                // =========================================
                // QR SCANS
                // =========================================

                const qrScans =

                    document.getElementById(
                        "qrScans"
                    );



                if (qrScans) {

                    qrScans.textContent =

                        analytics.qrScans || 0;

                }



                // =========================================
                // RESUME VIEWS
                // =========================================

                const resumeViews =

                    document.getElementById(
                        "resumeViews"
                    );



                if (resumeViews) {

                    resumeViews.textContent =

                        analytics.resumeViews || 0;

                }



                // =========================================
                // LAST VIEWED
                // =========================================

                const lastViewed =

                    document.getElementById(
                        "lastViewed"
                    );



                if (lastViewed) {

                    if (
                        analytics.lastViewed
                    ) {

                        const date =

                            new Date(
                                analytics.lastViewed
                            );



                        lastViewed.textContent =

                            "Last viewed: " +

                            date.toLocaleString();

                    }

                    else {

                        lastViewed.textContent =

                            "Last viewed: —";

                    }

                }

            },



            function (error) {

                console.error(

                    "Analytics loading error:",

                    error

                );

            }

        );

}



// =====================================================
// 6. DISPLAY PROFILE
// =====================================================

function displayProfile(

    profileData,

    id

) {



    // =================================================
// PROFILE OWNER
// SHOW EDIT BUTTON ONLY TO OWNER
// =================================================

const editProfileButton =
    document.getElementById(
        "editProfileButton"
    );



if (editProfileButton) {

    auth.onAuthStateChanged(
        function (user) {

            if (

                user &&

                profileData.ownerUid &&

                user.uid ===
                profileData.ownerUid

            ) {

                editProfileButton.style.display =
                    "block";


                editProfileButton.href =
    "create-profile.html?edit=" +
    encodeURIComponent(
        id
    );
            }

            else {

                editProfileButton.style.display =
                    "none";

            }

        }
    );

}



    // =================================================
    // NAME
    // =================================================

    const displayName =

        document.getElementById(
            "displayName"
        );



    if (displayName) {

        displayName.textContent =

            profileData.fullName ||

            "Your Name";

    }



    // =================================================
    // TITLE
    // =================================================

    const displayTitle =

        document.getElementById(
            "displayTitle"
        );



    if (displayTitle) {

        displayTitle.textContent =

            profileData.title ||

            "Professional";

    }



    // =================================================
    // BIO
    // =================================================

    const displayBio =

        document.getElementById(
            "displayBio"
        );



    if (displayBio) {

        displayBio.textContent =

            profileData.bio ||

            "No bio added yet.";

    }



    // =================================================
    // EDUCATION
    // =================================================

    const displayEducation =

        document.getElementById(
            "displayEducation"
        );



    if (displayEducation) {

        displayEducation.textContent =

            profileData.education ||

            "No education information added.";

    }



    // =================================================
    // PROJECTS
    // =================================================

    const displayProjects =

        document.getElementById(
            "displayProjects"
        );



    if (displayProjects) {

        displayProjects.textContent =

            profileData.projects ||

            "No projects added.";

    }



    // =================================================
    // ACHIEVEMENTS
    // =================================================

    const displayAchievements =

        document.getElementById(
            "displayAchievements"
        );



    if (displayAchievements) {

        displayAchievements.textContent =

            profileData.achievements ||

            "No achievements or certificates added yet.";

    }



    // =================================================
    // EMAIL
    // =================================================

    const displayEmail =

        document.getElementById(
            "displayEmail"
        );



    if (displayEmail) {

        if (profileData.email) {

            displayEmail.innerHTML =

                '📧 <a href="mailto:' +

                escapeAttribute(
                    profileData.email
                ) +

                '" style="color:#38bdf8;">' +

                escapeHTML(
                    profileData.email
                ) +

                "</a>";

        }

        else {

            displayEmail.textContent =
                "";

        }

    }



    // =================================================
    // PHONE
    // =================================================

    const displayPhone =

        document.getElementById(
            "displayPhone"
        );



    if (displayPhone) {

        if (profileData.phone) {

            displayPhone.innerHTML =

                '📱 <a href="tel:' +

                escapeAttribute(
                    profileData.phone
                ) +

                '" style="color:#38bdf8;">' +

                escapeHTML(
                    profileData.phone
                ) +

                "</a>";

        }

        else {

            displayPhone.textContent =
                "";

        }

    }



    // =================================================
    // PROFILE PHOTO
    // =================================================

    const avatar =

        document.getElementById(
            "profileAvatar"
        );



    if (avatar) {

        if (profileData.photo) {

            avatar.innerHTML =
                "";



            const image =

                document.createElement(
                    "img"
                );



            image.src =
                profileData.photo;



            image.alt =

                profileData.fullName ||

                "Profile Photo";



            image.style.width =
                "100%";



            image.style.height =
                "100%";



            image.style.objectFit =
                "cover";



            image.style.borderRadius =
                "50%";



            avatar.appendChild(
                image
            );

        }

        else {

            avatar.innerHTML =
                "👤";

        }

    }



    // =================================================
    // SKILLS
    // =================================================

    const skillsContainer =

        document.getElementById(
            "displaySkills"
        );



    if (skillsContainer) {

        skillsContainer.innerHTML =
            "";



        if (profileData.skills) {

            const skillsArray =

                profileData.skills
                    .split(",");



            skillsArray.forEach(

                function (skill) {

                    const cleanSkill =

                        skill.trim();



                    if (!cleanSkill) {

                        return;

                    }



                    const skillTag =

                        document.createElement(
                            "span"
                        );



                    skillTag.className =
                        "skill-tag";



                    skillTag.textContent =
                        cleanSkill;



                    skillsContainer.appendChild(
                        skillTag
                    );

                }

            );

        }

    }



    // =================================================
    // LINKEDIN
    // =================================================

    const linkedinLink =

        document.getElementById(
            "linkedinLink"
        );



    if (linkedinLink) {

        if (profileData.linkedin) {

            linkedinLink.href =

                makeSafeURL(
                    profileData.linkedin
                );



            linkedinLink.target =
                "_blank";



            linkedinLink.rel =
                "noopener noreferrer";



            linkedinLink.style.display =
                "block";

        }

        else {

            linkedinLink.style.display =
                "none";

        }

    }



    // =================================================
    // GITHUB
    // =================================================

    const githubLink =

        document.getElementById(
            "githubLink"
        );



    if (githubLink) {

        if (profileData.github) {

            githubLink.href =

                makeSafeURL(
                    profileData.github
                );



            githubLink.target =
                "_blank";



            githubLink.rel =
                "noopener noreferrer";



            githubLink.style.display =
                "block";

        }

        else {

            githubLink.style.display =
                "none";

        }

    }



    // =================================================
// RESUME
// =================================================

const resumeLink =
    document.getElementById(
        "resumeLink"
    );


if (resumeLink) {

    if (profileData.resume) {

        resumeLink.href =
            "#";

        resumeLink.target =
            "_blank";

        resumeLink.rel =
            "noopener noreferrer";

        resumeLink.textContent =
            "📄 View Resume";

        resumeLink.style.display =
            "block";


        // Track resume views and open resume
        resumeLink.onclick =
            async function (event) {

                event.preventDefault();

                try {

                    // =============================================
                    // INCREASE RESUME VIEW COUNT
                    // =============================================

                    if (database) {

                        await database
                            .ref(
                                "analytics/" +
                                id +
                                "/resumeViews"
                            )
                            .transaction(
                                function (currentValue) {

                                    return (
                                        currentValue || 0
                                    ) + 1;

                                }
                            );

                    }


                    // =============================================
                    // CONVERT BASE64 PDF TO BLOB
                    // =============================================

                    const response =
                        await fetch(
                            profileData.resume
                        );

                    const blob =
                        await response.blob();


                    // =============================================
                    // CREATE TEMPORARY URL
                    // =============================================

                    const resumeURL =
                        URL.createObjectURL(
                            blob
                        );


                    // =============================================
                    // OPEN RESUME
                    // =============================================

                    window.open(
                        resumeURL,
                        "_blank"
                    );


                    // =============================================
                    // REFRESH ANALYTICS
                    // =============================================

                    loadAnalytics(id);


                    // Remove temporary URL after 1 minute
                    setTimeout(
                        function () {

                            URL.revokeObjectURL(
                                resumeURL
                            );

                        },
                        60000
                    );

                } catch (error) {

                    console.error(
                        "Resume opening error:",
                        error
                    );

                    alert(
                        "Unable to open the resume. Please try again."
                    );

                }

            };

    }

    else {

        resumeLink.style.display =
            "none";

    }

}



    // =================================================
    // GENERATE PERSONAL QR
    // =================================================

    generateProfileQR(
        id
    );

}



// =====================================================
// 7. GENERATE PROFILE QR
// =====================================================

function generateProfileQR(id) {

    const qrContainer =

        document.getElementById(
            "qrcode"
        );



    if (

        !qrContainer ||

        typeof QRCode === "undefined"

    ) {

        return;

    }



    // =================================================
    // GET CURRENT WEBSITE URL
    // =================================================

    const currentURL =

        window.location.href

            .split("?")[0];



    // =================================================
    // CREATE QR PROFILE URL
    // =================================================

    const profileURL =

        currentURL +

        "?id=" +

        encodeURIComponent(id) +

        "&source=qr";



    // =================================================
    // CLEAR PREVIOUS QR
    // =================================================

    qrContainer.innerHTML =
        "";



    // =================================================
    // GENERATE QR
    // =================================================

    new QRCode(

        qrContainer,

        {

            text:
                profileURL,



            width:
                300,



            height:
                300,



            correctLevel:
                QRCode.CorrectLevel.M

        }

    );



    // =================================================
    // QR DESCRIPTION
    // =================================================

    const qrDescription =

        document.querySelector(
            ".qr-section p"
        );



    if (qrDescription) {

        qrDescription.textContent =

            "Scan this QR code with your phone to open this profile.";

    }



    // =================================================
    // DOWNLOAD BUTTON
    // =================================================

    setupQRDownload();

}



// =====================================================
// 8. DOWNLOAD QR
// =====================================================

function setupQRDownload() {

    const downloadButton =

        document.getElementById(
            "downloadQR"
        );



    if (!downloadButton) {

        return;

    }



    downloadButton.onclick =
        function () {



            const qrCanvas =

                document.querySelector(
                    "#qrcode canvas"
                );



            const qrImage =

                document.querySelector(
                    "#qrcode img"
                );



            let imageURL =
                "";



            if (qrCanvas) {

                imageURL =

                    qrCanvas.toDataURL(
                        "image/png"
                    );

            }

            else if (qrImage) {

                imageURL =
                    qrImage.src;

            }



            if (!imageURL) {

                alert(
                    "QR code is not ready yet."
                );

                return;

            }



            const link =

                document.createElement(
                    "a"
                );



            link.href =
                imageURL;



            link.download =
                "ProfileQR-AI-QR.png";



            document.body.appendChild(
                link
            );



            link.click();



            document.body.removeChild(
                link
            );

        };

}



// =====================================================
// 9. AI BIO GENERATOR
// =====================================================

function testBio() {

    const bioInput =

        document.getElementById(
            "bio"
        );



    if (!bioInput) {

        return;

    }



    const fullNameInput =

        document.getElementById(
            "fullName"
        );



    const titleInput =

        document.getElementById(
            "title"
        );



    const skillsInput =

        document.getElementById(
            "skills"
        );



    const fullName =

        fullNameInput

            ? fullNameInput.value.trim()

            : "";



    const title =

        titleInput

            ? titleInput.value.trim()

            : "";



    const skills =

        skillsInput

            ? skillsInput.value.trim()

            : "";



    // =================================================
    // USER DESCRIPTION
    // =================================================

    const userText =

        bioInput.value.trim();



    if (!userText) {

        alert(

            "Please write a few details about yourself first."

        );



        bioInput.focus();

        return;

    }



    let professionalBio =
        "";



    if (fullName) {

        professionalBio +=

            fullName +

            " is ";

    }

    else {

        professionalBio +=
            "I am ";

    }



    if (title) {

        professionalBio +=

            "a " +

            title +

            " ";

    }

    else {

        professionalBio +=

            "a motivated and enthusiastic professional ";

    }



    professionalBio +=

        "with a strong interest in " +

        userText +

        ". ";



    if (skills) {

        professionalBio +=

            "Skilled in " +

            skills +

            ". ";

    }



    professionalBio +=

        "Passionate about continuous learning, innovation, problem-solving, and building meaningful digital solutions.";



    bioInput.value =
        professionalBio;

}



// =====================================================
// 10. HOMEPAGE QR
// =====================================================

const homeQR =

    document.getElementById(
        "homeQRCode"
    );



if (

    homeQR &&

    typeof QRCode !== "undefined"

) {

    homeQR.innerHTML =
        "";



    // =================================================
    // HOMEPAGE URL
    // =================================================

    const homeURL =

        window.location.origin +

        window.location.pathname

            .replace(

                "index.html",

                ""

            );



    new QRCode(

        homeQR,

        {

            text:
                homeURL,



            width:
                180,



            height:
                180,



            correctLevel:
                QRCode.CorrectLevel.M

        }

    );

}



// =====================================================
// 11. SECURITY HELPERS
// =====================================================

function escapeHTML(value) {

    const div =

        document.createElement(
            "div"
        );



    div.textContent =
        value || "";



    return div.innerHTML;

}



function escapeAttribute(value) {

    return String(
        value || ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        );

}



function makeSafeURL(url) {

    try {

        const parsedURL =

            new URL(

                url,

                window.location.origin

            );



        if (

            parsedURL.protocol ===
                "http:" ||

            parsedURL.protocol ===
                "https:"

        ) {

            return parsedURL.href;

        }

    }

    catch (error) {

        console.error(

            "Invalid URL:",

            error

        );

    }



    return "#";

}



// =====================================================
// 12. PROFILE ERROR
// =====================================================

function showProfileError() {

    const name =

        document.getElementById(
            "displayName"
        );



    if (name) {

        name.textContent =
            "Profile Not Found";

    }



    const title =

        document.getElementById(
            "displayTitle"
        );



    if (title) {

        title.textContent =

            "This profile may have been removed or the QR code is invalid.";

    }

}



// =====================================================
// TEST FIREBASE AUTHENTICATION
// =====================================================

if (auth) {

    auth.onAuthStateChanged(
        function (user) {

            if (user) {

                console.log(

                    "Firebase Authentication working:",

                    user.email

                );

            }

            else {

                console.log(

                    "No user is currently signed in."

                );

            }

        }
    );

}



// =====================================================
// 13. LOGIN
// =====================================================

const loginButton =

    document.getElementById(
        "loginButton"
    );



console.log(
    "LOGIN SECTION LOADED"
);



console.log(
    "loginButton:",
    loginButton
);



console.log(
    "auth:",
    auth
);



if (loginButton && auth) {

    loginButton.addEventListener(

        "click",

        async function () {

            console.log(
                "LOGIN BUTTON CLICKED"
            );



            const emailInput =

                document.getElementById(
                    "loginEmail"
                );



            const passwordInput =

                document.getElementById(
                    "loginPassword"
                );



            const message =

                document.getElementById(
                    "loginMessage"
                );



            const email =

                emailInput.value.trim();



            const password =

                passwordInput.value;



            if (!email || !password) {

                message.textContent =

                    "Please enter email and password.";

                return;

            }



            try {

                message.textContent =
                    "Logging in...";



                await auth.signInWithEmailAndPassword(

                    email,

                    password

                );



                message.textContent =
                    "Login successful!";



                window.location.href =
    "create-profile.html";

            }

            catch (error) {

                console.error(

                    "Login error:",

                    error

                );



                message.textContent =

                    "Login failed: " +

                    error.message;

            }

        }

    );

}

else {

    console.error(

        "LOGIN SETUP FAILED",

        loginButton,

        auth

    );

}
// =====================================================
// CREATE PROFILE BUTTON LOGIN CHECK
// =====================================================
function handleCreateProfile() {

    console.log(
        "CREATE PROFILE BUTTON CLICKED"
    );


    if (!auth) {

        alert(
            "Authentication system not loaded."
        );

        return;

    }


    if (auth.currentUser) {

        console.log(
            "User logged in:",
            auth.currentUser.email
        );


        window.location.href =
            "create-profile.html";

    }

    else {

        console.log(
            "User not logged in. Redirecting to login."
        );


        window.location.href =
            "login.html";

    }

}


// Navigation button
const createProfileNav =
    document.getElementById(
        "createProfileNav"
    );


if (createProfileNav) {

    createProfileNav.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            handleCreateProfile();

        }
    );

}


// Hero button
const createProfileHero =
    document.getElementById(
        "createProfileHero"
    );


if (createProfileHero) {

    createProfileHero.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            handleCreateProfile();

        }
    );

}
// =====================================================
// 14. REGISTER NEW USER
// =====================================================

const registerButton =
    document.getElementById(
        "registerButton"
    );


if (registerButton && auth) {

    registerButton.addEventListener(

        "click",

        async function () {

            const emailInput =
                document.getElementById(
                    "loginEmail"
                );


            const passwordInput =
                document.getElementById(
                    "loginPassword"
                );


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const email =
                emailInput.value.trim();


            const password =
                passwordInput.value;


            // Check empty fields

            if (!email || !password) {

                message.textContent =
                    "Please enter email and password.";

                return;

            }


            // Password validation

            if (password.length < 6) {

                message.textContent =
                    "Password must be at least 6 characters.";

                return;

            }


            try {

                message.textContent =
                    "Creating your account...";


                await auth
                    .createUserWithEmailAndPassword(

                        email,

                        password

                    );


                message.textContent =
                    "Account created successfully!";


                // Firebase automatically logs
                // the new user in

                setTimeout(

                    function () {

                        window.location.href =
                            "create-profile.html";

                    },

                    1000

                );

            }

            catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                message.textContent =
                    "Registration failed: " +
                    error.message;

            }

        }

    );

}
// =====================================================
// MY PROFILE + LOGOUT
// =====================================================

const myProfileButton =
    document.getElementById(
        "myProfileButton"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


// Check login status

if (auth) {

    auth.onAuthStateChanged(
        async function (user) {

            // USER LOGGED IN

            if (user) {

                // Show buttons

                if (myProfileButton) {

                    myProfileButton.style.display =
                        "inline-block";

                }


                if (logoutButton) {

                    logoutButton.style.display =
                        "inline-block";

                }


                // Find user's profile

                if (
                    database &&
                    myProfileButton
                ) {

                    const snapshot =

                        await database

                            .ref("profiles")

                            .orderByChild(
                                "ownerUid"
                            )

                            .equalTo(
                                user.uid
                            )

                            .once(
                                "value"
                            );


                    const profiles =
                        snapshot.val();


                    if (profiles) {

    const profileId =
        Object.keys(profiles)[0];

    myProfileButton.href =
        "profile.html?id=" +
        encodeURIComponent(profileId);

} else {

    // User has no profile yet
    myProfileButton.href =
        "create-profile.html";

}

                }

            }


            // USER LOGGED OUT

            else {

                if (myProfileButton) {

                    myProfileButton.style.display =
                        "none";

                }


                if (logoutButton) {

                    logoutButton.style.display =
                        "none";

                }

            }

        }
    );

}


// =====================================================
// LOGOUT BUTTON
// =====================================================

if (logoutButton && auth) {

    logoutButton.addEventListener(

        "click",

        async function (event) {

            event.preventDefault();


            try {

                await auth.signOut();


                alert(
                    "Logged out successfully!"
                );


                window.location.href =
                    "index.html";

            }

            catch (error) {

                console.error(
                    "Logout error:",
                    error
                );


                alert(
                    "Logout failed: " +
                    error.message
                );

            }

        }

    );

}
// =====================================================
// CREATE PROFILE BUTTON - DIRECT TEST
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const heroButton =
            document.getElementById(
                "createProfileHero"
            );

        const navButton =
            document.getElementById(
                "createProfileNav"
            );


        if (heroButton) {

            heroButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    console.log(
                        "HERO BUTTON CLICKED"
                    );


                    if (
                        auth &&
                        auth.currentUser
                    ) {

                        window.location.href =
                            "create-profile.html";

                    }

                    else {

                        window.location.href =
                            "login.html";

                    }

                }
            );

        }


        if (navButton) {

            navButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    console.log(
                        "NAV BUTTON CLICKED"
                    );


                    if (
                        auth &&
                        auth.currentUser
                    ) {

                        window.location.href =
                            "create-profile.html";

                    }

                    else {

                        window.location.href =
                            "login.html";

                    }

                }
            );

        }

    }
);
