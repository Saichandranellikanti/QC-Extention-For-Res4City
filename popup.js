const uploadSteps = [
  "Log in to BoostMySkills Studio",
  "Create new course",
  "Add course title, description",
  "Create sections and subsections",
  "Upload YouTube video (Unlisted)",
  "Upload PDF and embed in iframe",
  "Final review & save"
];

const qcSteps = [
  "Course Title & Code is accurate",
  "Video embedded and accessible",
  "Reading material correctly linked",
  "Content matches syllabus",
  "Final QA completed"
];

document.addEventListener("DOMContentLoaded", function () {
  const uploadTab = document.getElementById("uploadTab");
  const qcTab = document.getElementById("qcTab");
  const uploadSection = document.getElementById("uploadSection");
  const qcSection = document.getElementById("qcSection");

  uploadTab.addEventListener("click", () => {
    uploadTab.classList.add("active");
    qcTab.classList.remove("active");
    uploadSection.classList.add("active");
    qcSection.classList.remove("active");
  });

  qcTab.addEventListener("click", () => {
    qcTab.classList.add("active");
    uploadTab.classList.remove("active");
    qcSection.classList.add("active");
    uploadSection.classList.remove("active");
  });

  const renderSteps = (containerId, steps, type) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    steps.forEach((step, i) => {
      const div = document.createElement("div");
      div.classList.add("form-group");
      div.innerHTML = `
        <label>${step}</label>
        <select id="status-${type}-${i}">
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
          <option value="Correct">Correct</option>
          <option value="Incorrect">Incorrect</option>
        </select>
        <textarea id="note-${type}-${i}" placeholder="Notes (optional)"></textarea>
      `;
      container.appendChild(div);
    });
  };

  renderSteps("uploadStepsContainer", uploadSteps, "Upload");
  renderSteps("qcStepsContainer", qcSteps, "QC");

  const submit = (type) => {
    const courseName = document.getElementById(type === "Upload" ? "courseName" : "qcCourseName").value;
    const courseCode = document.getElementById(type === "Upload" ? "courseCode" : "qcCourseCode").value;
    const reviewer = document.getElementById(type === "Upload" ? "reviewer" : "qcReviewer").value;
    const date = document.getElementById(type === "Upload" ? "date" : "qcDate").value;

    const steps = [];
    const stepList = type === "Upload" ? uploadSteps : qcSteps;

    stepList.forEach((step, i) => {
      const statusElement = document.getElementById(`status-${type}-${i}`);
      const noteElement = document.getElementById(`note-${type}-${i}`);
      const status = statusElement ? statusElement.value : "N/A";
      const note = noteElement ? noteElement.value : "N/A";
      steps.push({ step, status, note });
      console.log(`Step ${i + 1} (${type}): Status = ${status}, Note = ${note}`);
    });

    const payload = {
      type,
      courseName,
      courseCode,
      reviewer,
      date,
      steps
    };

    console.log("Payload submitting:", payload);

    fetch("https://script.google.com/macros/s/AKfycbzmnYok_9_NYFxCgtXxOiU-RL5Mtrs-WiDF0vL9SK00lf4wfON7XTdIU9Gsm28xunG5aA/exec", {
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(res => res.text())
      .then(text => {
        console.log("Server response:", text);
        alert("Submitted successfully!");
      })
      .catch(err => alert("Error: " + err.message));
  };

  document.getElementById("submitUpload").addEventListener("click", () => submit("Upload"));
  document.getElementById("submitQC").addEventListener("click", () => submit("QC"));
});
