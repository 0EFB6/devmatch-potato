"use client"

import React, { useState } from "react";

const ListWalletModal = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    sessionStorage.setItem("listWalletName", name);
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-96 w-3/4">
        <h2 className="text-2xl font-bold mb-8">List Wallet</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-end">
            
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name (as per IC)
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
              Get Wallet List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListWalletModal;