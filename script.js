// ================================
// GET THE PROFILE FORM
// ================================

const profileForm = document.getElementById("profileForm");


// ================================
// CREATE PROFILE
// ================================

if (profileForm) {

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get profile photo
        const photoInput =
            document.getElementById("profilePhoto");

        const photoFile =
            photoInput.files[0];


        // Get resume PDF
        const resumeInput =
            document.getElementById("resume");

        const resumeFile =
            resumeInput.files[0];


       function saveProfile(photoData, resumeData) {

    const profileData = {

        fullName:
            document.getElementById("fullName").value,

        title:
            document.getElementById("title").value,

        bio:
            document.getElementById("bio").value,

        email:
            document.getElementById("email").value,

        phone:
            document.getElementById("phone").value,

        education:
            document.getElementById("education").value,

        skills:
            document.getElementById("skills").value,

        projects:
            document.getElementById("projects").value,

        achievements:
            document.getElementById("achievements").value,

        linkedin:
            document.getElementById("linkedin").value,

        github:
            document.getElementById("github").value,

        photo: photoData,

        // Do not save large PDF data in localStorage
        resume: ""
    };


    try {

        localStorage.setItem(
            "profileData",
            JSON.stringify(profileData)
        );

        window.location.href = "profile.html";

    } catch (error) {

        alert(
            "Profile could not be saved. Please try using a smaller profile photo."
        );

        console.error(error);

    }
}

  

        // ================================
        // READ PROFILE PHOTO
        // ================================

        function readPhoto(callback) {

            if (photoFile) {

                const reader = new FileReader();

                reader.onload = function (e) {

                    callback(e.target.result);

                };

                reader.readAsDataURL(photoFile);

            } else {

                callback("");

            }
        }


        // ================================
        // READ RESUME PDF
        // ================================

        function readResume(photoData) {

            if (resumeFile) {

                const reader = new FileReader();

                reader.onload = function (e) {

                    saveProfile(
                        photoData,
                        e.target.result
                    );

                };

                reader.readAsDataURL(resumeFile);

            } else {

                saveProfile(
                    photoData,
                    ""
                );

            }
        }


        // Start reading files
        readPhoto(function (photoData) {

            readResume(photoData);

        });

    });

}


// ================================
// DISPLAY PROFILE
// ================================


// ================================
// GET PROFILE DATA
// ================================

// Check if profile data came from QR code
const urlParams = new URLSearchParams(window.location.search);

const qrData = urlParams.get("data");

let savedData = null;

if (qrData) {

    try {

        const decodedProfile =
            JSON.parse(
                decodeURIComponent(qrData)
            );

        savedData =
            JSON.stringify(decodedProfile);

    } catch (error) {

        console.error("Invalid QR profile data");

        savedData =
            localStorage.getItem("profileData");

    }

} else {

    // Normal profile from same device
    savedData =
        localStorage.getItem("profileData");

}


if (
    savedData &&
    window.location.pathname.includes("profile.html")
) {

    const profileData =
        JSON.parse(savedData);


    // Display Name
    document.getElementById("displayName").textContent =
        profileData.fullName || "Your Name";


    // Display Title
    document.getElementById("displayTitle").textContent =
        profileData.title || "Professional";


    // Display Bio
    const displayBio =
        document.getElementById("displayBio");

    if (displayBio) {

        displayBio.textContent =
            profileData.bio || "No bio added yet.";

    }


    // Display Education
    document.getElementById("displayEducation").textContent =
        profileData.education ||
        "No education information added.";


    // Display Projects
    document.getElementById("displayProjects").textContent =
        profileData.projects ||
        "No projects added.";


    // Display Achievements
    const displayAchievements =
        document.getElementById("displayAchievements");

    if (displayAchievements) {

        displayAchievements.textContent =
            profileData.achievements ||
            "No achievements or certificates added yet.";

    }


    // Display Email
    document.getElementById("displayEmail").textContent =
        profileData.email || "";


    // Display Phone
    document.getElementById("displayPhone").textContent =
        profileData.phone || "";


    // ================================
    // DISPLAY PROFILE PHOTO
    // ================================

    if (profileData.photo) {

        const avatar =
            document.getElementById("profileAvatar");

        avatar.innerHTML = "";

        const image =
            document.createElement("img");

        image.src =
            profileData.photo;

        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
        image.style.borderRadius = "50%";

        avatar.appendChild(image);

    }


    // ================================
    // DISPLAY SKILLS
    // ================================

    const skillsContainer =
        document.getElementById("displaySkills");


    if (profileData.skills) {

        const skillsArray =
            profileData.skills.split(",");


        skillsArray.forEach(function (skill) {

            const skillTag =
                document.createElement("span");

            skillTag.textContent =
                skill.trim();

            skillTag.classList.add(
                "skill-tag"
            );

            skillsContainer.appendChild(
                skillTag
            );

        });

    }


    // ================================
    // LINKEDIN
    // ================================

    if (profileData.linkedin) {

        document.getElementById(
            "linkedinLink"
        ).href =
            profileData.linkedin;

    }


    // ================================
    // GITHUB
    // ================================

    if (profileData.github) {

        document.getElementById(
            "githubLink"
        ).href =
            profileData.github;

    }


    // ================================
    // RESUME
    // ================================

    if (profileData.resume) {

        const resumeLink =
            document.getElementById("resumeLink");


        const byteString =
            atob(
                profileData.resume.split(",")[1]
            );


        const mimeString =
            profileData.resume
                .split(",")[0]
                .split(":")[1]
                .split(";")[0];


        const arrayBuffer =
            new ArrayBuffer(
                byteString.length
            );


        const uint8Array =
            new Uint8Array(
                arrayBuffer
            );


        for (
            let i = 0;
            i < byteString.length;
            i++
        ) {

            uint8Array[i] =
                byteString.charCodeAt(i);

        }


        const blob =
            new Blob(
                [uint8Array],
                { type: mimeString }
            );


        const resumeURL =
            URL.createObjectURL(blob);


        resumeLink.href =
            resumeURL;


        resumeLink.style.display =
            "block";

    }


    // ================================
    // GENERATE PROFILE QR CODE
    // ================================

    const qrContainer =
        document.getElementById("qrcode");


    if (
        qrContainer &&
        typeof QRCode !== "undefined"
    ) {

        qrContainer.innerHTML = "";

        new QRCode(qrContainer, {

            text: window.location.href,

            width: 180,

            height: 180

        });

    }

}


// ================================
// DOWNLOAD QR CODE
// ================================

const downloadButton =
    document.getElementById("downloadQR");


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function () {

            const qrImage =
                document.querySelector(
                    "#qrcode img"
                );


            if (qrImage) {

                const link =
                    document.createElement("a");

                link.href =
                    qrImage.src;

                link.download =
                    "ProfileQR-AI-QR.png";

                link.click();

            }

        }
    );

}


// ================================
// AI BIO GENERATOR
// ================================

function testBio() {

    const bioInput =
        document.getElementById("bio");


    const userText =
        bioInput.value.trim();


    const fullName =
        document
            .getElementById("fullName")
            .value
            .trim();


    const title =
        document
            .getElementById("title")
            .value
            .trim();


    const skills =
        document
            .getElementById("skills")
            .value
            .trim();


    if (userText === "") {

        alert(
            "Please write a few details about yourself first!"
        );

        return;

    }


    let professionalBio = "";


    if (fullName) {

        professionalBio +=
            fullName + " is ";

    } else {

        professionalBio +=
            "I am ";

    }


    if (title) {

        professionalBio +=
            "a " + title + " ";

    } else {

        professionalBio +=
            "a motivated and enthusiastic individual ";

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
        "Passionate about continuous learning, innovation, and building meaningful solutions.";


    bioInput.value =
        professionalBio;

}


// ================================
// HOMEPAGE DEMO QR CODE
// ================================

const homeQR =
    document.getElementById("homeQRCode");


if (
    homeQR &&
    typeof QRCode !== "undefined"
) {

    homeQR.innerHTML = "";

    new QRCode(homeQR, {

        text: "https://25104020-cloud.github.io/ProfileQR-AI/",

        width: 160,

        height: 160

    });

}
