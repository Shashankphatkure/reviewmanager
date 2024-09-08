import React from 'react';

const ShimmerEffect = () => {
  return (
    <div className="animate-pulse min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          
          <div className="space-y-6 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          
          {/* <div className="space-y-4 mb-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div> */}
          
          {/* <div className="h-12 bg-gray-200 rounded mb-8"></div>
          
          <div className="h-px bg-gray-300 mb-8"></div>
          
          <div className="h-12 bg-gray-200 rounded"></div> */}
        </div>
      </div>
    </div>
  );
};

export default ShimmerEffect;