import React, { useState } from "react";
import './ReportPage.css';

const ReportPage = () => {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const generateReport = async () => {
    if (!file) return;

    setLoading(true);
    setReport(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('https://brestok-ocr-backend.hf.space/api/ocr/parse', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data && data.data && data.data.text) {
        setReport(data.data.text);
      } else {
        setReport("Error while getting data.");
      }
    } catch (error) {
      console.error("Error in response:", error);
      setReport("Error in file processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Medical Report Generation</h1>

      <div className="input-section">
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={generateReport} className="generate-btn">
          Generate Report
        </button>
      </div>

      <div className="report-section">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: report ? markdownToHtml(report) : "Upload file and press on generate button",
            }}
          />
        )}
      </div>
    </div>
  );
};

const markdownToHtml = (markdown) => {
  const converter = new window.markdownit();
  return converter.render(markdown);
};

export default ReportPage;