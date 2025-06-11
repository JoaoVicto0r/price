"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error: authError, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
        return;
      }
    } finally {
      setPassword("");
    }
  };

  return (
    <div className="w-[1920px] h-[1080px] relative bg-white outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-hidden">
      {/* Fundo e elementos decorativos */}
      <div className="w-[1920px] h-[1080px] left-0 top-0 absolute bg-indigo-500/50" />
      <div className="w-[1325px] h-[1080px] left-[648px] top-0 absolute bg-white rounded-[50px]" />

      {/* Texto de apresentação */}
      <div className="w-[473px] h-60 left-[80px] top-[203px] absolute justify-start">
        <span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest">
          Need webdesign <br />
          for your business? <br />
        </span>
        <span className="text-indigo-500 text-5xl font-extrabold font-['Telegraf'] leading-[60px] tracking-widest">
          Design Spacee
        </span>
        <span className="text-white text-5xl font-normal font-['Telegraf'] leading-[60px] tracking-widest">
          {" "}
          will help you.{" "}
        </span>
      </div>

      {/* Título do formulário */}
      <div className="left-[1023px] top-[321px] absolute justify-start text-black text-3xl font-extrabold font-['Telegraf'] leading-10 tracking-widest">
        Sign-in
      </div>

      {/* Link para registro */}
      <div className="left-[1179px] top-[719px] absolute justify-start">
        <span className="text-black text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
          Don't have an account?{" "}
        </span>
        <span className="text-indigo-500 text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider">
          <a href="/register">Signup Here</a>
        </span>
      </div>

      {/* Formulário de login */}
      <form onSubmit={handleLogin} className="w-full">
        {/* Campo de Email */}
        <div className="Email">
          <div className="left-[1023px] top-[473px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[575px] left-[0px] top-[6px] absolute focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
              disabled={loading}
              required
              autoComplete="username"
            />
          </div>
          <div className="w-[575px] h-0 left-[1023px] top-[520px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
        </div>

        {/* Campo de Senha */}
        <div className="password">
          <div className="left-[1023px] top-[549px] absolute justify-start text-neutral-400 text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[575px] left-[0px] top-[6px] absolute focus:outline-none placeholder:text-neutral-400 font-normal font-['Telegraf'] leading-10 tracking-wider"
              disabled={loading}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="w-[575px] h-0 left-[1023px] top-[596px] absolute outline outline-1 outline-offset-[-0.50px] outline-neutral-400"></div>
        </div>

        {/* Mensagem de erro */}
        {authError && (
          <div className="left-[1023px] top-[660px] absolute w-[575px] p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            <p className="font-medium">{authError}</p>
          </div>
        )}

        {/* Botão de submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-[575px] h-14 left-[1023px] top-[640px] absolute flex items-center justify-center text-white text-base font-extrabold font-['Telegraf'] leading-10 tracking-wider rounded-lg transition ${
            loading ? "bg-indigo-400" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>

      {/* Rodapé e elementos decorativos */}
      <div className="left-[201px] top-[1014px] absolute justify-start text-white text-base font-normal font-['Telegraf'] leading-10 tracking-wider">
        figma.com/@designspacee
      </div>
      <div className="w-72 h-72 left-[165px] top-[500px] absolute bg-indigo-500 rounded-tr-[120px] rounded-br-[120px]" />
      <div className="w-44 h-72 left-[219px] top-[618px] absolute text-center justify-center text-indigo-300 text-[300px] font-extrabold font-['Telegraf'] leading-10 tracking-[24px]">
        S
      </div>
    </div>
  );
}