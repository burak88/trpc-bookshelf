export const Spinner = () => {
    return (
      <>
        <div className="absolute top-0 right-0 flex h-screen w-screen justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </>
    );
  };