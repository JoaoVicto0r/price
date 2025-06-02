"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function register() {
  const [form, setForm] = useState({name:'', email:'', password:''});
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    const res = await fetch('https://price-d26o.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(form),
    });



     if (res.ok) {
      setMessage('Usuário registrado com sucesso!');
      setForm({ name: '', email: '', password: '' });
       router.push("/");
    } else {
      const data = await res.json();
      setMessage('Erro: ' + (data.message || 'Falha ao registrar'));
    }
  
  }
  return (
    <div className="w-[1920px] h-[1080px] relative bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
  <div className="w-[1920px] h-[1080px] left-0 top-0 absolute bg-indigo-500/50" />
  <div className="w-[1325px] h-[1080px] left-[648px] top-0 absolute bg-white rounded-[50px]" />
  <div className="left-[1198px] top-[884px] absolute justify-start"><span className="text-black text-base font-normal font-['Telegraf'] leading-10 tracking-wider">Already have an account? </span><span className="text-indigo-500 text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider"><a href="/">Login</a></span></div>
  <div className="left-[1311px] top-[452px] absolute justify-start text-zinc-500 text-3xl font-extrabold font-['Telegraf'] leading-10 tracking-widest">OR</div>
  <div className="left-[1042px] top-[202px] absolute justify-start text-black text-3xl font-extrabold font-['Telegraf'] leading-10 tracking-widest">Create Account</div>
  <div className="w-60 h-14 left-[1042px] top-[313px] absolute bg-white rounded-lg border border-indigo-500" />
  <div className="w-60 h-14 left-[1372px] top-[313px] absolute bg-white rounded-lg border border-indigo-500" />
  <div className="left-[1100px] top-[321px] absolute justify-start text-black text-xs font-normal font-['Telegraf'] leading-10 tracking-wide">Sign up with Google</div>
  <div className="left-[1421px] top-[321px] absolute justify-start text-black text-xs font-normal font-['Telegraf'] leading-10 tracking-wide">Sign up with Facebook</div>
  <div className="w-7 h-[5px] left-[1270px] top-[469px] absolute bg-zinc-500" />
  <div className="w-7 h-[5px] left-[1372px] top-[469px] absolute bg-zinc-500" />
  <div className="register">
    <div className="fullname">
      <div className="left-[1042px] top-[562px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
        <label htmlFor="fullname"></label>
        <input 
          type="Full Name"
          id="Full Name"
          placeholder="Full Name"
          value={form.name}
           onChange={e => setForm({ ...form, name: e.target.value })}
        required
          className="w-[575px] left-[0px] top-[6px] absolute focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
          />
        
        </div>
      <div className="w-[575px] h-0 left-[1042px] top-[609px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
    </div>
    <div className="email">
      <div className="left-[1042px] top-[638px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
        <label htmlFor="email"></label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
          className="w-[575px] letft-[0px] top-[6px] absolute focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
        />
        </div>
      <div className="w-[575px] h-0 left-[1042px] top-[685px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
    </div>
    <div className="password">
      <div className="left-[1042px] top-[714px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
        <label htmlFor="password"></label>
        <input 
          type="password"
          id="password"
          placeholder="Password"
          value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
          className="w-[575px] left-[0px] top-[6px] absolute  focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider "
          />
        </div>
     <div className="w-[575px] h-0 left-[1042px] top-[761px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div> 
    </div>
  </div>
  
  <div className="w-[575px] h-14 left-[1042px] top-[805px] absolute bg-indigo-500 rounded-lg" />
  <div className="button">
    <button onClick={handleSubmit} type="submit" className="w-[575px] h-14 left-[1042px] top-[805px] absolute justify-start text-white text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider" >
   Create Account
    </button>
  </div>
  <div className="left-[201px] top-[1014px] absolute justify-start text-white text-base font-normal font-['Telegraf'] leading-10 tracking-wider">figma.com/@designspacee</div>
  <div className="w-[473px] h-60 left-[79px] top-[163px] absolute justify-start"><span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest">Need webdesign <br/>for your business? <br/></span><span className="text-indigo-500 text-5xl font-extrabold font-['Telegraf'] leading-[60px] tracking-widest">Design Spacee</span><span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest"> will help you.  </span></div>
  <div className="w-72 h-72 left-[165px] top-[500px] absolute bg-indigo-500 rounded-tr-[120px] rounded-br-[120px]" />
  <div className="w-44 h-72 left-[218px] top-[615px] absolute text-center justify-center text-indigo-300 text-[300px] font-extrabold font-['Telegraf'] leading-10 tracking-[24px]">S</div>
</div>
  );
}
