import React from "react";
import EnableMfa from "../_components/EnableMfa";
import Sessions from "../_components/Sessions";

const Home = () => {
  return (
    <div>
      <div className="flex max-w-3xl flex-col gap-2 mx-auto w-full md:max-w-5xl px-6 py-8">
        <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-[#000509e3] dark:text-inherit font-extrabold">
          Setup security and sessions
        </h1>
        <p className="text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Follow the steps to activate using the MERN-2FA.
        </p>
      </div>
      
      <div className="relative max-w-3xl py-0 mx-auto w-full px-6 md:max-w-5xl">
        {/* Vertical connecting line */}
        <div className="absolute left-[26px] top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="flex flex-col gap-10">
          {/* MFA Section */}
          <div className="relative pl-10 transition duration-200 ease-in-out">
            <div className="absolute -left-[17px] top-0 z-10 flex h-10 w-10 items-center justify-center">
              <div className="bg-white dark:bg-background h-5 w-5 rounded-full border-4 border-white dark:border-background">
                <div className="h-3 w-3 rounded-full border-2 border-primary"></div>
              </div>
            </div>
            <div>
              <EnableMfa />
            </div>
          </div>

          {/* Sessions Section */}
          <div className="relative pl-10 transition duration-200 ease-in-out">
            <div className="absolute -left-[17px] top-0 z-10 flex h-10 w-10 items-center justify-center">
              <div className="bg-white dark:bg-background h-5 w-5 rounded-full border-4 border-white dark:border-background">
                <div className="h-3 w-3 rounded-full border-2 border-primary"></div>
              </div>
            </div>
            <div>
              <Sessions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;