"use client";

import React from "react";

// Retrieve values from sessionStorage
const transactionHash = sessionStorage.getItem("signtransactionHash");
const contractAddress = sessionStorage.getItem("signcontractAddress");
const fromWallet = sessionStorage.getItem("signfromWallet");
const toWallet = sessionStorage.getItem("signtoWallet");
const createdAt = sessionStorage.getItem("signcreatedAt");
const applicantName = sessionStorage.getItem("applicantName");
const signStatus = sessionStorage.getItem("signStatus");

const matrix = [
  ["Transaction Hash", transactionHash],
  ["Contract Address", contractAddress],
  ["From Wallet", fromWallet],
  ["To Wallet", toWallet],
  ["Created At", createdAt],
  ["Applicant Name", applicantName],
  ["Sign Status", signStatus]
];

const GetSignModal = ({ onSubmit, onClose }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-156 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Get Certificate List</h2>
        
        {/* Print the matrix here */}
        <div className="mb-8">
          {matrix.map((row, index) => (
            <p key={index}>
              <strong>{row[0]}:</strong> {row[1]}
            </p>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Approve
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GetSignModal;
