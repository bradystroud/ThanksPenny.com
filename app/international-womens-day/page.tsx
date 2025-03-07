"use client";

import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function InternationalWomensDay() {
  return (
    <div className="w-full bg-gradient-to-b from-pink-500 to-pink-300 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg p-8 text-center h-100 ">
        <h1 className="text-4xl font-bold text-pink-800 mb-4">
          {"Celebrating Penny Walker on International Women's Day!"}
        </h1>
        <p className="text-xl text-pink-600 mb-8">
          Penny, your dedication and hard work inspire us every day. Thank you
          for being an amazing leader and role model!
        </p>

        {/* Example message */}
        <div className="mb-4 p-4 bg-pink-100 rounded-lg">
          <p className="font-semibold text-pink-700">Brady Stroud</p>
          <p className="text-pink-600">
            {
              "Penny, you're the only woman at SSW Brisbane, I dont know how you put up with us all! 🧁"
            }
          </p>
        </div>

        {/* 
          DEVELOPERS: Add your personal messages here!
          Copy the example below and customize it:

          <div className="mb-4 p-4 bg-pink-100 rounded-lg">
            <p className="font-semibold text-pink-700">[Your Name]</p>
            <p className="text-pink-600">[Your Message]</p>
          </div>
        */}

        <div className="flex justify-center space-x-4 mt-4">
            <Link
            href="/"
            className="bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors duration-200 flex items-center gap-2"
            >
            <FaHome /> Home
            </Link>
        </div>
      </div>
    </div>
  );
}
