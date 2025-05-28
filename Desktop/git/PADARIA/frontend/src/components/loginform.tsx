"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({  }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      alert("Credenciais inválidas");
    }
  }
  return (
    <div className="w-[1920px] h-[1080px] relative bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
  <div className="w-[1920px] h-[1080px] left-0 top-0 absolute bg-indigo-500/50" />
  <div className="w-[1325px] h-[1080px] left-[648px] top-0 absolute bg-white rounded-[50px]" />
  <div className="w-[473px] h-60 left-[80px] top-[203px] absolute justify-start"><span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest">Need webdesign <br/>for your business? <br/></span><span className="text-indigo-500 text-5xl font-extrabold font-['Telegraf'] leading-[60px] tracking-widest">Design Spacee</span><span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest"> will help you.  </span></div>
  <div className="left-[1023px] top-[321px] absolute justify-start text-black text-3xl font-extrabold font-['Telegraf'] leading-10 tracking-widest">
    Sign-in
    </div>
  <div className="left-[1179px] top-[719px] absolute justify-start"><span className="text-black text-base font-normal font-['Telegraf'] leading-10 tracking-wider">Don’t have an account? </span><span className="text-indigo-500 text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider"><a href="/register">Signup Here</a></span></div>
    <div className="Email">
      <div className="left-[1023px] top-[473px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
        <label className="email"></label>
        <input
        type="email"
        id="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-[575px] left-[0px] top-[6px] absolute  focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
          />
        </div>
    <div className="w-[575px] h-0 left-[1023px] top-[520px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
  </div>
  <div className="password">
    <div className="left-[1023px] top-[549px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
      <label className="Password"></label>
      <input
        type="password"
        id="Password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-[575px] left-[0px] top-[6px] absolute  focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
        />
      </div>
    <div className="w-[575px] h-0 left-[1023px] top-[596px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
  </div>
  <div className="w-[575px] h-14 left-[1023px] top-[640px] absolute bg-indigo-500 rounded-lg" />
  
    <form onSubmit={handleLogin}>
    <button type="submit" className="w-[575px] h-14 left-[1023px] top-[640px]   absolute justify-start text-white text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider">
    Login
    </button>
  </form>
    
  <div className="left-[201px] top-[1014px] absolute justify-start text-white text-base font-normal font-['Telegraf'] leading-10 tracking-wider">figma.com/@designspacee</div>
  <div className="w-72 h-72 left-[165px] top-[500px] absolute bg-indigo-500 rounded-tr-[120px] rounded-br-[120px]" />
  <div className="w-44 h-72 left-[219px] top-[618px] absolute text-center justify-center text-indigo-300 text-[300px] font-extrabold font-['Telegraf'] leading-10 tracking-[24px]">S</div>
</div>
  );
}
