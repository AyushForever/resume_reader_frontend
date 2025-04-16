import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import ResumeDisplay from './ResumeDisplay';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const ResumeParser = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // console.log(acceptedFiles[0]);
      setFile(acceptedFiles[0]);
      setPdfFile(URL.createObjectURL(acceptedFiles[0]));
      setError("");
    },
  });

  const handleSubmit = async () => {
    if (!file) {
      setError("Please upload a file first.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        // "http://localhost:3000/api/parse", // Replace with your backend URL
        "https://resume-reader-kdk5.onrender.com/api/parse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log(response.data);
      if(response.data.spanResume || response.data.spanResume == "⚠️ This resume may be spam or incomplete or Valid resume required"){
        setError(response.data.spanResume || "⚠️ This resume may be spam or incomplete or Valid resume required");
      }else{
        setParsedData(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to parse resume.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Resume Parser</h1>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500 bg-blue-50" : "hover:bg-gray-500"
          }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-green-600">{file.name}</p>
        ) : isDragActive ? (
          <p>Drop your resume here...</p>
        ) : (
          <p>Drag & drop a resume (PDF only), or click to select</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !file}
          className={`px-4 py-2 rounded-md text-white ${isLoading || !file
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isLoading ? "Processing..." : "Parse Resume"}
        </button>
        {file && (
          <button
            onClick={() => {setFile(null);setParsedData(null)}}
            className="px-4 py-2 text-red-600 hover:text-red-800"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {file && 
      <div className="react-tabs__tab-list" >
        <Tabs>
          <TabList className="react-tabs__tab-list" >
            <Tab>PDF</Tab>
            <Tab>Detail's</Tab>
          </TabList>

          <TabPanel>
            {pdfFile && (
              <iframe
                src={pdfFile}
                width="100%"
                height="355px"
                style={{ border: "1px solid black", marginTop: "10px" }}
              />
            )}
          </TabPanel>
          <TabPanel>
            {parsedData && (
              <ResumeDisplay userData={parsedData} />
            )}
          </TabPanel>
        </Tabs>
      </div>
      }
    </div>
  );
};

export default ResumeParser;