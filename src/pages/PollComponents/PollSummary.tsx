const PollSummary = () => {
  const publishDate = '21/06/2025';
  const publishTime = '16:40';
  const notificationMessage = 'A new update is waiting for you in the XYZ company app';

  return (
    <div className="flex justify-center items-center p-4 sm:p-6 lg:p-8 font-sans w-full min-h-[60vh]">
      <div className="w-full max-w-3xl p-4 sm:p-6 lg:p-8 flex flex-col items-center text-center justify-center rounded-xl bg-[#EDEEF7]">

        <div className="mb-6 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Poll is Live!</h2>
          <p className="text-gray-700 text-lg sm:text-xl font-semibold mb-2">
            "Your survey is live and ready for participation!"
          </p>
          <p className="text-gray-600 text-base sm:text-lg">
            Asset will be published on {publishDate} at {publishTime}
          </p>
        </div>

        <div className="w-full">
          <p className="text-gray-700 text-base sm:text-lg mb-3 text-center">
            User will be notified:
          </p>
          <div className="w-full rounded-md p-3 text-sm sm:text-base text-gray-800 inline-block max-w-md mx-auto border border-gray-300">
            {notificationMessage}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PollSummary;
