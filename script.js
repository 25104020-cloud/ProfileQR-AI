// =====================================================
// PROFILEQR AI — FINAL SCRIPT
// Firebase + QR + Profile + AI Bio
// =====================================================


// =====================================================
// 1. FIREBASE CONFIGURATION
// =====================================================

const firebaseConfig = {
    apiKey: "AIzaSyB10mhI6HjKDqDUezDaV0WMjohwu7P491U",
    authDomain: "profileqr-ai.firebaseapp.com",
    databaseURL: "https://profileqr-ai-default-rtdb.firebaseio.com",
    projectId: "profileqr-ai",
    storageBucket: "profileqr-ai.firebasestorage.app",
    messagingSenderId: "978918324164",
    appId: "1:978918324164:web:513508e496731fec961691",
    measurementId: "G-F8PJXP5N7L"
};


// Start Firebase
if (typeof firebase !== "undefined") {

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

}

const database =
    typeof firebase !== "undefined"
        ? firebase.database()
        : null;


// =====================================================
// 2. CREATE PROFILE
// =====================================================

const profileForm =
    document.getElementById("profileForm");


if (profileForm) {

    profileForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Get form values
        const fullName =
            document.getElementById("fullName").value.trim();

        const title =
            document.getElementById("title").value.trim();

        const bio =
            document.getElementById("bio").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const education =
            document.getElementById("education").value.trim();

        const skills =
            document.getElementById("skills").value.trim();

        const projects =
            document.getElementById("projects").value.trim();

        const achievementsElement =
            document.getElementById("achievements");

        const achievements =
            achievementsElement
                ? achievementsElement.value.trim()
                : "";

        const linkedin =
            document.getElementById("linkedin").value.trim();

        const github =
            document.getElementById("github").value.trim();


        // -------------------------------------------------
        // Profile photo
        // -------------------------------------------------

        const photoInput =
            document.getElementById("profilePhoto");

        const photoFile =
            photoInput && photoInput.files.length > 0
                ? photoInput.files[0]
                : null;


        // -------------------------------------------------
        // Resume
        // -------------------------------------------------

        const resumeInput =
            document.getElementById("resume");

        const resumeFile =
            resumeInput && resumeInput.files.length > 0
                ? resumeInput.files[0]
                : null;


        // -------------------------------------------------
        // Basic validation
        // -------------------------------------------------

        if (!fullName) {

            alert("Please enter your full name.");

            return;
        }


        if (!database) {

            alert(
                "Firebase could not be loaded. Please check your internet connection."
            );

            return;
        }


        // -------------------------------------------------
        // Show saving message
        // -------------------------------------------------

        const submitButton =
            profileForm.querySelector(
                'button[type="submit"]'
            );

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Saving Profile...";
        }


        try {

            // -------------------------------------------------
            // Convert photo to Base64
            // -------------------------------------------------

            let photoData = "";

            if (photoFile) {

                photoData =
                    await fileToBase64(photoFile);
            }


            // -------------------------------------------------
            // Convert resume to Base64
            // -------------------------------------------------

            let resumeData = "";

            if (resumeFile) {

                // Limit resume size
                if (resumeFile.size > 3 * 1024 * 1024) {

                    alert(
                        "Resume is too large. Please use a PDF smaller than 3 MB."
                    );

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.textContent =
                            "Generate My Profile →";
                    }

                    return;
                }

                resumeData =
                    await fileToBase64(resumeFile);
            }


            // -------------------------------------------------
            // Create Firebase unique profile ID
            // -------------------------------------------------

            const profileReference =
                database.ref("profiles").push();

            const profileId =
                profileReference.key;


            // -------------------------------------------------
            // Profile object
            // -------------------------------------------------

            const profileData = {

                fullName: fullName,

                title: title,

                bio: bio,

                email: email,

                phone: phone,

                education: education,

                skills: skills,

                projects: projects,

                achievements: achievements,

                linkedin: linkedin,

                github: github,

                photo: photoData,

                resume: resumeData,

                createdAt:
                    new Date().toISOString()
            };


            // -------------------------------------------------
            // Save profile to Firebase
            // -------------------------------------------------

            await profileReference.set(
                profileData
            );


            // -------------------------------------------------
            // Open profile page
            // -------------------------------------------------

            window.location.href =
                "profile.html?id=" +
                encodeURIComponent(profileId);

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

                submitButton.disabled = false;

                submitButton.textContent =
                    "Generate My Profile →";
            }

        }

    });

}


// =====================================================
// 3. FILE → BASE64
// =====================================================

function fileToBase64(file) {

    return new Promise(function (resolve, reject) {

        const reader =
            new FileReader();

        reader.onload = function () {

            resolve(
                reader.result
            );

        };

        reader.onerror = function () {

            reject(
                new Error(
                    "Could not read the selected file."
                )
            );

        };

        reader.readAsDataURL(file);

    });

}


// =====================================================
// 4. LOAD PROFILE
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const profileId =
    urlParams.get("id");


if (
    profileId &&
    document.getElementById("displayName") &&
    database
) {

    loadProfile(profileId);

    // Record profile view
    database
        .ref("analytics/" + profileId + "/profileViews")
        .transaction(function (currentValue) {

            return (currentValue || 0) + 1;

        });

    // Record last viewed time
    database
        .ref("analytics/" + profileId + "/lastViewed")
        .set(new Date().toISOString());

}


// =====================================================
// 5. LOAD PROFILE FROM FIREBASE
// =====================================================

async function loadProfile(id) {

    try {

        const snapshot =
            await database
                .ref("profiles/" + id)
                .once("value");


        if (!snapshot.exists()) {

            showProfileError();

            return;
        }


        const profileData =
            snapshot.val();


        displayProfile(
            profileData,
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
// 6. DISPLAY PROFILE
// =====================================================

function displayProfile(
    profileData,
    id
) {


    // -------------------------------------------------
    // Name
    // -------------------------------------------------

    const displayName =
        document.getElementById(
            "displayName"
        );

    if (displayName) {

        displayName.textContent =
            profileData.fullName ||
            "Your Name";
    }


    // -------------------------------------------------
    // Title
    // -------------------------------------------------

    const displayTitle =
        document.getElementById(
            "displayTitle"
        );

    if (displayTitle) {

        displayTitle.textContent =
            profileData.title ||
            "Professional";
    }


    // -------------------------------------------------
    // Bio
    // -------------------------------------------------

    const displayBio =
        document.getElementById(
            "displayBio"
        );

    if (displayBio) {

        displayBio.textContent =
            profileData.bio ||
            "No bio added yet.";
    }


    // -------------------------------------------------
    // Education
    // -------------------------------------------------

    const displayEducation =
        document.getElementById(
            "displayEducation"
        );

    if (displayEducation) {

        displayEducation.textContent =
            profileData.education ||
            "No education information added.";
    }


    // -------------------------------------------------
    // Projects
    // -------------------------------------------------

    const displayProjects =
        document.getElementById(
            "displayProjects"
        );

    if (displayProjects) {

        displayProjects.textContent =
            profileData.projects ||
            "No projects added.";
    }


    // -------------------------------------------------
    // Achievements
    // -------------------------------------------------

    const displayAchievements =
        document.getElementById(
            "displayAchievements"
        );

    if (displayAchievements) {

        displayAchievements.textContent =
            profileData.achievements ||
            "No achievements or certificates added yet.";
    }


    // -------------------------------------------------
    // Email
    // -------------------------------------------------

    const displayEmail =
        document.getElementById(
            "displayEmail"
        );

    if (displayEmail) {

        if (profileData.email) {

            displayEmail.innerHTML =
                "📧 <a href=\"mailto:" +
                escapeAttribute(profileData.email) +
                "\" style=\"color:#38bdf8;\">" +
                escapeHTML(profileData.email) +
                "</a>";

        } else {

            displayEmail.textContent =
                "";
        }

    }


    // -------------------------------------------------
    // Phone
    // -------------------------------------------------

    const displayPhone =
        document.getElementById(
            "displayPhone"
        );

    if (displayPhone) {

        if (profileData.phone) {

            displayPhone.innerHTML =
                "📱 <a href=\"tel:" +
                escapeAttribute(profileData.phone) +
                "\" style=\"color:#38bdf8;\">" +
                escapeHTML(profileData.phone) +
                "</a>";

        } else {

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

            avatar.innerHTML = "";

            const image =
                document.createElement("img");

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

        } else {

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

        skillsContainer.innerHTML = "";


        if (profileData.skills) {

            const skillsArray =
                profileData.skills
                    .split(",");


            skillsArray.forEach(
                function (skill) {

                    const cleanSkill =
                        skill.trim();


                    if (!cleanSkill) return;


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

        } else {

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

        } else {

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
                profileData.resume;

            resumeLink.target =
                "_blank";

            resumeLink.rel =
                "noopener noreferrer";

            resumeLink.textContent =
                "📄 View Resume";

            resumeLink.style.display =
                "block";

        } else {

            resumeLink.style.display =
                "none";
        }

    }


    // =================================================
    // GENERATE PERSONAL QR
    // =================================================

    generateProfileQR(id);

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


    // Get current website URL
    const currentURL =
        window.location.href
            .split("?")[0];


    // Create short profile URL
    const profileURL =
        currentURL +
        "?id=" +
        encodeURIComponent(id);


    // Clear previous QR
    qrContainer.innerHTML =
        "";


    // Generate QR
    new QRCode(
        qrContainer,
        {

            text: profileURL,

            width: 300,

            height: 300,

            correctLevel:
                QRCode.CorrectLevel.M

        }
    );


    // Display URL for testing
    const qrDescription =
        document.querySelector(
            ".qr-section p"
        );


    if (qrDescription) {

        qrDescription.textContent =
            "Scan this QR code with your phone to open this profile.";

    }


    // Download button
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


    if (!downloadButton) return;


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


    if (!bioInput) return;


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


    // The user's description
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
            fullName + " is ";

    } else {

        professionalBio +=
            "I am ";
    }


    if (title) {

        professionalBio +=
            "a " +
            title +
            " ";

    } else {

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


    // Homepage URL
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

    return String(value || "")
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
            parsedURL.protocol === "http:" ||
            parsedURL.protocol === "https:"
        ) {

            return parsedURL.href;
        }


    } catch (error) {

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
