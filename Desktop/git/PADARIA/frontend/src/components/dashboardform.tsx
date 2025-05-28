"use client"

import Header from "./header";

export default function dashboardform() {
  return (
    <div className="w-[1920px] h-[1080px] relative bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
      <div className="w-[1920px] h-[1080px] left-0 top-0 absolute bg-indigo-500/50" />
      <div className="w-[1325px] h-[1080px] left-[648px] top-0 absolute bg-white rounded-[50px]" />

      <div className="left-[1042px] top-[150px] absolute justify-start text-black text-3xl font-extrabold font-['Telegraf'] leading-10 tracking-widest">
        Welcome to your Dashboard
      </div>

      <div className="left-[1042px] top-[250px] absolute justify-start text-neutral-600 text-lg font-['Telegraf']">
        {/* Aqui você pode listar as seções do dashboard 
        <ul className="space-y-6">
          <li className="cursor-pointer hover:text-indigo-500">📊 Overview</li>
          <li className="cursor-pointer hover:text-indigo-500">💼 Projects</li>
          <li className="cursor-pointer hover:text-indigo-500">⚙️ Settings</li>
        </ul>
        */}
        <Header />
      </div>

      <div className="w-[575px] h-14 left-[1042px] top-[700px] absolute bg-indigo-500 rounded-lg">
        <button
          className="w-full h-full text-white text-base font-extrabold font-['Telegraf'] tracking-wider"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
