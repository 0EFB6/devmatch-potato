"use client";
import React, { useState } from "react";
import { getWalletAddressByIndex } from "../util_getWalletAddr";


const ApplicationModal = ({ onSubmit, onClose }) => {
  const wallet_address = "0x3D65d01814c6e74633798208e6a7e9a83904Ec2D";
  const to = getWalletAddressByIndex(sessionStorage.getItem("currentWalletIndex"));
  const contract_address = "0x6E005e77520808a72473376f3d11A36B1714DDFA";
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const callback_url = "https://postman-echo.com/post?";

  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    const userAttributes = {
      purpose: purpose,
      amount: amount,
    };
    const attributes = JSON.stringify(userAttributes);
    e.preventDefault();
    const formData = new FormData();
  formData.append('wallet_address', wallet_address); // Assume walletAddress is a variable holding the wallet address
  formData.append('to', to); // Assume toAddress is a variable holding the recipient address
  formData.append('contract_address', contract_address); // Assume contractAddress is a variable holding the contract address
  formData.append('file', file); // Assume fileInput is a reference to an <input type="file" />
  formData.append('attributes', JSON.stringify(attributes)); // Assume attributes is an object or array
  formData.append('name', name); // Assume name is a variable holding the name
  formData.append('description', description); // Assume description is a variable holding the description
  formData.append('callback_url', callback_url); // Assume callbackUrl is a variable holding the callback URL
    onSubmit({ wallet_address, to, contract_address, file, attributes, name, description, callback_url });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">Create Wallet</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Claim Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          
          <div className="mb-4">
            <label htmlFor="purpose" className="block mb-2">
              Claim Purpose
            </label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">
              Claim Amount
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block mb-2">
              Upload Image Proof
            </label>
            <input
              type="file"
              id="image"
              accept="image/*" // Accept only image files
              onChange={(e) => setFile(e.target.files[0])} // Handle file selection
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
