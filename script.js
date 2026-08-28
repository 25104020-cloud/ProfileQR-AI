// ========================================
// PROFILEQR AI - FINAL SCRIPT
// ========================================


// ========================================
// CREATE PROFILE
// ========================================

const profileForm = document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const photoInput =
            document.getElementById("profilePhoto");

        const photoFile =
            photoInput ? photoInput.files[0] : null;


        // Save profile
        function saveProfile(photoData) {

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
                    document.getElementById("achievements")
                        ? document.getElementById("achievements").value
                        : "",

                linkedin:
                    document.getElementById("linkedin").value,

                github:
                    document.getElementById("github").value,

                photo: photoData,

                // Resume is intentionally not stored in localStorage
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
                    "Profile could not be saved. Please use a smaller profile photo."
                );

                console.error(error);
            }
        }


        // Read profile photo
        if (photoFile) {

            const reader = new FileReader();

            reader.onload = function (e) {

                saveProfile(e.target.result);
            };

            reader.readAsDataURL(photoFile);

        } else {

            saveProfile("");
        }

    });

}


// ========================================
// GET PROFILE DATA
// ========================================

const urlParams = new URLSearchParams(
    window.location.search
);

const qrData = urlParams.get("data");

let savedData = null;


// First try QR data
if (qrData) {

    try {

        const decodedProfile =
            JSON.parse(qrData);

        savedData =
            JSON.stringify(decodedProfile);

    } catch (error) {

        console.error("Invalid QR profile data");

    }
}


// If no QR data, use browser storage
if (!savedData) {

    savedData =
        localStorage.getItem("profileData");
}


// ========================================
// DISPLAY PROFILE
// ========================================

if (
    savedData &&
    window.location.pathname.includes("profile.html")
) {

    const profileData =
        JSON.parse(savedData);


    // NAME
    const displayName =
        document.getElementById("displayName");

    if (displayName) {

        displayName.textContent =
            profileData.fullName || "Your Name";
    }


    // TITLE
    const displayTitle =
        document.getElementById("displayTitle");

    if (displayTitle) {

        displayTitle.textContent =
            profileData.title || "Professional";
    }


    // BIO
    const displayBio =
        document.getElementById("displayBio");

    if (displayBio) {

        displayBio.textContent =
            profileData.bio || "No bio added yet.";
    }


    // EDUCATION
    const displayEducation =
        document.getElementById("displayEducation");

    if (displayEducation) {

        displayEducation.textContent =
            profileData.education ||
            "No education information added.";
    }


    // PROJECTS
    const displayProjects =
        document.getElementById("displayProjects");

    if (displayProjects) {

        displayProjects.textContent =
            profileData.projects ||
            "No projects added.";
    }


    // ACHIEVEMENTS
    const displayAchievements =
        document.getElementById("displayAchievements");

    if (displayAchievements) {

        displayAchievements.textContent =
            profileData.achievements ||
            "No achievements or certificates added yet.";
    }


    // EMAIL
    const displayEmail =
        document.getElementById("displayEmail");

    if (displayEmail) {

        displayEmail.textContent =
            profileData.email || "";
    }


    // PHONE
    const displayPhone =
        document.getElementById("displayPhone");

    if (displayPhone) {

        displayPhone.textContent =
            profileData.phone || "";
    }


    // ========================================
    // PROFILE PHOTO
    // ========================================

    if (profileData.photo) {

        const avatar =
            document.getElementById("profileAvatar");

        if (avatar) {

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

    }


    // ========================================
    // SKILLS
    // ========================================

    const skillsContainer =
        document.getElementById("displaySkills");

    if (
        skillsContainer &&
        profileData.skills
    ) {

        skillsContainer.innerHTML = "";

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


    // ========================================
    // LINKEDIN
    // ========================================

    const linkedinLink =
        document.getElementById("linkedinLink");

    if (
        linkedinLink &&
        profileData.linkedin
    ) {

        linkedinLink.href =
            profileData.linkedin;
    }


    // ========================================
    // GITHUB
    // ========================================

    const githubLink =
        document.getElementById("githubLink");

    if (
        githubLink &&
        profileData.github
    ) {

        githubLink.href =
            profileData.github;
    }


    // ========================================
    // GENERATE SHAREABLE PROFILE QR
    // ========================================

    const qrContainer =
        document.getElementById("qrcode");

    if (
        qrContainer &&
        typeof QRCode !== "undefined"
    ) {

        const shareData = {

            fullName:
                profileData.fullName || "",

            title:
                profileData.title || "",

            bio:
                profileData.bio || "",

            email:
                profileData.email || "",

            phone:
                profileData.phone || "",

            education:
                profileData.education || "",

            skills:
                profileData.skills || "",

            projects:
                profileData.projects || "",

            achievements:
                profileData.achievements || "",

            linkedin:
                profileData.linkedin || "",

            github:
                profileData.github || ""
        };


        const encodedData =
            encodeURIComponent(
                JSON.stringify(shareData)
            );


        const shareURL =
            "https://25104020-cloud.github.io/ProfileQR-AI/profile.html?data="
            + encodedData;


        qrContainer.innerHTML = "";


        new QRCode(qrContainer, {

            text: shareURL,

            width: 180,

            height: 180

        });

    }

}


// ========================================
// DOWNLOAD PROFILE QR
// ========================================

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

            } else {

                alert(
                    "QR code is not ready yet."
                );
            }

        }
    );

}


// ========================================
// AI BIO GENERATOR
// ========================================

function testBio() {

    const bioInput =
        document.getElementById("bio");

    if (!bioInput) return;


    const userText =
        bioInput.value.trim();

    const fullNameInput =
        document.getElementById("fullName");

    const titleInput =
        document.getElementById("title");

    const skillsInput =
        document.getElementById("skills");


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


// ========================================
// HOMEPAGE DEMO QR CODE
// ========================================

const homeQR =
    document.getElementById("homeQRCode");

if (
    homeQR &&
    typeof QRCode !== "undefined"
) {

    homeQR.innerHTML = "";

    new QRCode(homeQR, {

        text:
            "https://25104020-cloud.github.io/ProfileQR-AI/",

        width: 160,

        height: 160

    });

}
